import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const Detail = () => {
  const { name } = useParams();
  const navigate = useNavigate(); // Use navigate hook for programmatic navigation
  const [city, setCity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCity = async () => {
      try {
        const response = await fetch(`http://localhost:8081/cities/${name}`);
        if (!response.ok) { throw new Error("Failed to fetch city data."); }
        const data = await response.json();
        setCity(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCity();
  }, [name]);

  const handleEditClick = () => {
    navigate(`/modify/${name}`); // Navigate to the edit page for the city
  };

  if (loading) { return <div>Loading City...</div>; }
  if (error) { return <div>{error}</div>; }
  if (!city) { return <div>City Not Found</div>; }

  return (
    <div className="card" style={{
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
      transition: "transform 0.3s ease-in-out",
      padding: '20px',
      maxWidth: '600px',
      margin: 'auto',
      position: 'relative', // Ensure the button stays at the bottom-right
    }}>
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

        <div>
          <strong>City (ASCII):</strong> {city.city_ascii} <br />
          <strong>Latitude:</strong> {city.lat} <br />
          <strong>Longitude:</strong> {city.lng} <br />
          <strong>Country:</strong> {city.country} <br />
          <strong>ISO2 Code:</strong> {city.iso2} <br />
          <strong>ISO3 Code:</strong> {city.iso3} <br />
          <strong>Administrative Name:</strong> {city.admin_name} <br />
          <strong>Capital:</strong> {city.capital} <br />
          <strong>Population:</strong> {city.population.toLocaleString()} <br />
          <strong>About:</strong> <p>{city.about}</p>
        </div>
      </div>

      {/* Edit button at the bottom right */}
      <div style={{
        position: 'absolute',
        bottom: '20px',
        right: '20px',
      }}>
        <button
          onClick={handleEditClick}
          style={{
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            padding: "10px 20px", // Adjust padding for consistency
            borderRadius: "4px", // Match the rounded corners
            cursor: "pointer",
            fontSize: '1rem', // Make sure text size is consistent
            display: 'inline-block', // Ensures the button size adjusts based on content
            textAlign: 'center', // Ensures the text is centered
          }}
        >
          Edit
        </button>
      </div>
    </div>
  );
};

export default Detail;
