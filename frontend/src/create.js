import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "bootstrap/dist/css/bootstrap.min.css";

const Create = () => {
    const navigate = useNavigate();
    const [city, setCity] = useState('');
    const [cityAscii, setCityAscii] = useState('');
    const [lat, setLat] = useState('');
    const [lng, setLng] = useState('');
    const [country, setCountry] = useState('');
    const [iso2, setIso2] = useState('');
    const [iso3, setIso3] = useState('');
    const [adminName, setAdminName] = useState('');
    const [capital, setCapital] = useState('');
    const [population, setPopulation] = useState('');
    const [image, setImage] = useState(null);
    const [about, setAbout] = useState('');
    const [preview, setPreview] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');

    const handleImageChange = (e) => {
        const file = e.target.files[0];

        if (file && file instanceof Blob) {
            setImage(file);
            setPreview(URL.createObjectURL(file));
        } else {
            setImage(null);
            setPreview(null);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await addOneCity();
            navigate(`/detail/${city}`);
            setCity('');
            setCityAscii('');
            setLat('');
            setLng('');
            setCountry('');
            setIso2('');
            setIso3('');
            setAdminName('');
            setCapital('');
            setPopulation('');
            setAbout('');
            setErrorMessage('');
        } catch (error) {
            setErrorMessage(error.message || "An unexpected error occurred.");
            setImage(null);
            setPreview(null);
            document.getElementById('imageInput').value = ''; 
        }
    };

    const addOneCity = async () => {
        try {
            if (!city || !country) {
                throw new Error("City and Country are required.");
            }

            const formData = new FormData();
            formData.append("city", city);
            formData.append("city_ascii", cityAscii);
            formData.append("lat", lat);
            formData.append("lng", lng);
            formData.append("country", country);
            formData.append("iso2", iso2);
            formData.append("iso3", iso3);
            formData.append("admin_name", adminName);
            formData.append("capital", capital);
            formData.append("population", population);
            formData.append("about", about);
            if (image) {
                formData.append("image", image);
            }

            const response = await fetch("http://localhost:8081/cities", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to create city");
            }

            const successMessage = await response.text();
            alert(successMessage);
        } catch (err) {
            throw new Error(err.message);
        }
    };

    return (
        <div className="container mt-4">
            <h2 className="text-center" style={{ fontStyle: 'italic' }}> New City </h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label">City Name</label>
                    <input type="text" className="form-control" value={city} onChange={(e) => setCity(e.target.value)} required />
                </div>
                <div className="mb-3">
                    <label className="form-label">City ASCII</label>
                    <input type="text" className="form-control" value={cityAscii} onChange={(e) => setCityAscii(e.target.value)} />
                </div>
                <div className="mb-3">
                    <label className="form-label">Latitude</label>
                    <input type="number" className="form-control" value={lat} onChange={(e) => setLat(e.target.value)} />
                </div>
                <div className="mb-3">
                    <label className="form-label">Longitude</label>
                    <input type="number" className="form-control" value={lng} onChange={(e) => setLng(e.target.value)} />
                </div>
                <div className="mb-3">
                    <label className="form-label">Country</label>
                    <input type="text" className="form-control" value={country} onChange={(e) => setCountry(e.target.value)} required />
                </div>
                <div className="mb-3">
                    <label className="form-label">ISO2</label>
                    <input type="text" className="form-control" value={iso2} onChange={(e) => setIso2(e.target.value)} />
                </div>
                <div className="mb-3">
                    <label className="form-label">ISO3</label>
                    <input type="text" className="form-control" value={iso3} onChange={(e) => setIso3(e.target.value)} />
                </div>
                <div className="mb-3">
                    <label className="form-label">Admin Name</label>
                    <input type="text" className="form-control" value={adminName} onChange={(e) => setAdminName(e.target.value)} />
                </div>
                <div className="mb-3">
                    <label className="form-label">Capital</label>
                    <input type="text" className="form-control" value={capital} onChange={(e) => setCapital(e.target.value)} />
                </div>
                <div className="mb-3">
                    <label className="form-label">Population</label>
                    <input type="number" className="form-control" value={population} onChange={(e) => setPopulation(e.target.value)} />
                </div>
                <div className="mb-3">
                    <label className="form-label">About</label>
                    <textarea className="form-control" value={about} onChange={(e) => setAbout(e.target.value)}></textarea>
                </div>
                <div className="mb-3">
                    <label className="form-label">City Image</label>
                    <input type="file" className="form-control" id="imageInput" onChange={handleImageChange} />
                    {preview && (<img src={preview} alt="Preview" className="mt-3" style={{ width: '100px', height: '100px', objectFit: 'cover' }} />)}
                </div>
                <button type="submit" className="btn btn-primary">
                    Add City
                </button>
            </form>
            {errorMessage && (
                <div className="alert alert-danger mt-3">
                    {errorMessage}
                </div>
            )}
        </div>
    );
};

export default Create;
