import React, { useState, useEffect } from 'react';
import { Carousel } from 'react-bootstrap';

const Default = () => {
    const [cities, setCities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCities = async () => {
            try {
                const response = await fetch('http://localhost:8081/cities');
                if (!response.ok) { throw new Error('Unable to Fetch Cities.'); }

                const data = await response.json();
                setCities(data);
                setLoading(false);

            } catch (error) {
                setError('Unable to Fetch Cities.');
                setLoading(false);
            }
        };
        fetchCities();
    }, []);

    if (loading) { return <div>Loading Cities...</div>; }
    if (error) { return <div>{error}</div>; }

    return (
        <div className="text-center">
            <h2 style={{ fontStyle: 'italic', marginBottom: '30px' }}> Hello World, a Collection of Cities </h2>

            {/* City Card Display */}
            <Carousel interval={5000} controls={false} indicators={false}>
                {cities.map((city) => {
                    const query = `${city.city}, ${city.admin_name}`;
                    const searchURL = `https://www.google.com/search?q=${encodeURIComponent(query)}`;

                    return (
                        <Carousel.Item key={city.id}>
                            <div className="d-flex justify-content-center">
                                <a href={searchURL} target="_blank" style={{ textDecoration: 'none', color: 'inherit' }}>
                                    <div
                                        className="card mb-4"
                                        style={{
                                            maxWidth: '500px',
                                            textAlign: 'center',
                                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                                            transition: 'transform 0.3s ease-in-out'
                                        }}
                                        >
                                        <img
                                            src={`http://localhost:8081${city.image}`}
                                            className="card-img-top"
                                            alt={city.city}
                                            style={{
                                                width: '100%',
                                                height: 'auto'
                                            }}
                                        />
                                        <div className="card-body">
                                            <h5 className="card-title" style={{ fontWeight: 'bold', fontSize: '1.5rem' }}>
                                                {city.city}, {city.admin_name}
                                            </h5>

                                            <div className="d-flex justify-content-center">
                                                <p style={{ margin: '0 10px' }}><strong>Country:</strong> {city.country}</p>
                                                <p style={{ margin: '0 10px' }}><strong>Population:</strong> {city.population.toLocaleString()}</p>
                                            </div>

                                            <p style={{ textAlign: 'left' }}>
                                                <strong>About:</strong> {city.about}
                                            </p>
                                        </div>
                                    </div>
                                </a>
                            </div>
                        </Carousel.Item>
                    );
                })}
            </Carousel>
        </div>
    );
};

export default Default;
