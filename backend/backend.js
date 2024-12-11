const cors = require("cors");

const bodyParser = require("body-parser");
const express = require("express");

const multer = require("multer");
const path = require("path");

// Server Config
const app = express();

app.use(cors());

app.use(bodyParser.json());
app.use(express.json());

app.use(express.static("public"));
app.use("/images", express.static("images"));

// MySQL Config
const mysql = require("mysql2");
const db = mysql.createConnection({
    host: "127.0.0.1",
    user: "fallstudent",
    password: "fallstudent",
    database: "secoms3190",
});

db.connect((err) => {
    if (err) { console.error("MySQL Connection Failed, Error:", err); return; }
    console.log("MySQL Connection Established.");
});

module.exports = db;

const port = "8081";
const host = "localhost";
app.listen(port, () => { console.log("App Listening at http://%s:%s", host, port); });

// Multer Config(Images)
const storage = multer.diskStorage({
    destination: (_req, _file, cb) => { cb(null, "images/"); },
    filename: (_req, file, cb) => { cb(null, Date.now() + path.extname(file.originalname)); }
});

const upload = multer({ storage: storage });

const fs = require("fs");
if (!fs.existsSync("images")) { fs.mkdirSync("images"); }

// Fetch all Cities in Database
app.get("/cities", async (_req, res) => {
    try {
        const [result] = await db.promise().query("SELECT * FROM cities");
        return res.status(200).send(result);

    } catch (err) {
        console.error("Error in GET /cities:", err);
        return res.status(500).send({ error: "Unexpected Error Occurred in GET: " + err.message });

    }
});

// Given City Name, Fetch the City from Database.
app.get("/cities/:name", async (req, res) => {
    try {
        const city = req.params.name;

        const [result] = await db.promise().query("SELECT * FROM cities WHERE city = ?", [city]);

        if (result.length === 0) { return res.status(404).send({ err: `Error Fetching City: ${city} Not Found.` });}
        return res.status(200).send(result[0]);

    } catch (err) {
        console.error("Error in GET /cities/:name:", err);
        return res.status(500).send({ error: `Unexpected Error while Fetching City: ${err.message}` });
    }
});

// Given Specs, Create a City in Database.
app.post("/cities", upload.single("image"), async (req, res) => {
    try {
        if (!req.file) { return res.status(400).send({ error: `Image File Required.` }); }

        const { city, city_ascii, lat, lng, country, iso2, iso3, admin_name, capital, population, about } = req.body;
        const imageUrl = `/images/${req.file.filename}`;

        const query1 = `SELECT * FROM cities WHERE city = ?`;
        const [result1] = await db.promise().query(query1, [city]);

        if (result1.length > 0) { return res.status(409).send({ error: `Error: City ${city} Already Exists.` });}

        const query2 = `INSERT INTO cities 
            (city, city_ascii, lat, lng, country, iso2, iso3, admin_name, capital, population, image, about)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        
        const [result2] = await db.promise().query(query2, [city, city_ascii, lat, lng, country, iso2, iso3, admin_name, capital, population, imageUrl, about]);
        return res.status(201).send({ message: `${city} Created Successfully.`, cityId: result2.insertId });

    } catch (err) {
        console.log(`Error in POST /cities: ${err}`);
        return res.status(500).send({ error: `Unexpected Error while Creating City: ${err.message}` });

    }
});

// Given City Name, Update the City Population and About in Database.
app.put("/cities/:name", upload.single(), async (req, res) => {
    try {
        const { population, about } = req.body;
        const city = req.params.name;

        if (!population && !about) { return res.status(400).json({ error: "Population and About Required." });}

        const query = `UPDATE cities SET population = ?, about = ? WHERE city = ?`;

        const [result] = await db.promise().query(query, [population, about, city]);

        if (result.affectedRows === 0) { return res.status(404).send({ err: `Error Updating City: ${city} Not Found.` });}
        return res.status(200).send(`${city} Updated Successfully.`);
        
    } catch (err) {
        console.log(`Error in PUT /cities/:name: ${err}`);
        return res.status(500).send({ error: `Unexpected Error while Updating City: ${err.message}` });

    }
});

// Given City Name, Remove the City from Database.
app.delete("/cities/:name", async (req, res) => {
    try {
        const city = req.params.name;
        const query = `DELETE FROM cities WHERE city = ?`;

        const [result] = await db.promise().query(query, [city]);

        if (result.affectedRows === 0) { return res.status(404).send({ err: `Error Deleting City: ${city} Not Found.` });}
        return res.status(200).send(`${city} Removed Successfully.`);

    } catch (err) {
        console.log(`Error in DELETE /cities/{name}: ${err}`);
        return res.status(500).send({ error: `Unexpected Error while Deleting City: ${err.message}` });

    }
});
