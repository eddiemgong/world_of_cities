import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';

const Overview = () => {
    const [cities, setCities] = useState([]);
    const [filteredCities, setFilteredCities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCities = async () => {
            try {
                const response = await fetch("http://localhost:8081/cities");
                if (!response.ok) { throw new Error("Unable to Fetch Cities."); }

                const data = await response.json();
                setCities(data);
                setFilteredCities(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchCities();
    }, []);

    useEffect(() => {
        const results = cities.filter(city => {
            return (
                city.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
                city.about.toLowerCase().includes(searchTerm.toLowerCase())
            );
        });
        setFilteredCities(results);
    }, [searchTerm, cities]);

    const handleDetail = (cityName) => { navigate(`/detail/${cityName}`); };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    if (loading) { return <div>Loading Cities...</div>; }
    if (error) { return <div>{error}</div>; }

    return (
        <div>
            <div style={{ marginBottom: "20px", textAlign: "center" }}>
            <h2 style={{ fontStyle: 'italic', marginBottom: "15px" }}>Catalog of Cities</h2>
                <input
                    type="text"
                    placeholder="Search by City Name or Description..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    style={{
                        width: "80%",
                        padding: "10px",
                        fontSize: "1rem",
                        borderRadius: "4px",
                        border: "1px solid #ccc",
                    }}
                />
            </div>

            <div
                className="city-catalog"
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                    gap: "20px",
                    marginTop: "20px",
                }}
            >
                {filteredCities.length === 0 ? (
                    <div>No cities found</div>
                ) : (
                    filteredCities.map((city) => (
                        <div
                            key={city.id}
                            className="card"
                            style={{
                                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                                transition: "transform 0.3s ease-in-out",
                                padding: "10px",
                                display: "flex",
                                flexDirection: "column",
                                height: "100%",
                            }}
                        >
                            <a
                                href={city.searchURL}
                                target="_blank"
                                style={{ textDecoration: "none", color: "inherit" }}
                            >
                                <img
                                    src={`http://localhost:8081${city.image}`}
                                    className="card-img-top"
                                    alt={city.city}
                                    style={{
                                        width: "100%",
                                        height: "auto",
                                    }}
                                />
                                <div className="card-body" style={{ flex: "1" }}>
                                    <h5
                                        className="card-title"
                                        style={{ fontWeight: "bold", fontSize: "1.2rem", marginBottom: "10px" }}
                                    >
                                        {city.city}, {city.admin_name}
                                    </h5>
                                    <div className="d-flex justify-content-between">
                                        <p style={{ margin: "0" }}>
                                            <strong>Country:</strong> {city.country}
                                        </p>
                                        <p style={{ margin: "0" }}>
                                            <strong>Population:</strong> {city.population.toLocaleString()}
                                        </p>
                                    </div>
                                    <p style={{ textAlign: "left", marginTop: "10px" }}>
                                        <strong>About:</strong> {city.about}
                                    </p>
                                </div>
                            </a>

                            <div
                                style={{
                                    marginTop: "auto",
                                    alignSelf: "flex-end",
                                    marginBottom: "10px",
                                }}
                            >
                                <button
                                    onClick={() => handleDetail(city.city)}
                                    style={{
                                        backgroundColor: "#007bff",
                                        color: "white",
                                        border: "none",
                                        padding: "5px 10px",
                                        borderRadius: "4px",
                                        cursor: "pointer",
                                    }}
                                >
                                    Details
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Overview;
