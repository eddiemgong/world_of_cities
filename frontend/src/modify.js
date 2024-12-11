import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const Modify = () => {
  const { name } = useParams();
  const navigate = useNavigate();
  const [city, setCity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editedCity, setEditedCity] = useState({
    population: '',
    about: ''
  });

  useEffect(() => {
    const fetchCity = async () => {
      try {
        const response = await fetch(`http://localhost:8081/cities/${name}`);
        if (!response.ok) { throw new Error("Failed to fetch city data."); }
        const data = await response.json();
        setCity(data);
        setEditedCity({
          population: data.population,
          about: data.about
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCity();
  }, [name]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedCity((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      const formData = new FormData();
      formData.append("population", editedCity.population);
      formData.append("about", editedCity.about);

      const response = await fetch(`http://localhost:8081/cities/${name}`, {
        method: 'PUT',
        body: formData,
      });

      if (!response.ok) { throw new Error("Failed to save city data."); }

      const responseText = await response.text();
      if (responseText.includes("Updated Successfully")) {
        alert(responseText);
        navigate('/overview');
      } else {
        alert(`Error: ${responseText}`);
      }

      setCity(prevCity => ({
        ...prevCity,
        population: editedCity.population,
        about: editedCity.about,
      }));

    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`http://localhost:8081/cities/${name}`, {
        method: 'DELETE',
      });

      if (!response.ok) { throw new Error("Failed to delete city data."); }

      const responseText = await response.text();
      alert(responseText);
      navigate('/overview');

    } catch (err) {
      setError(err.message);
    }
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
      position: 'relative',
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
        <div className="d-flex justify-content-between">
          <p><strong>Country:</strong> {city.country}</p>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="population" style={{ fontWeight: 'bold' }}>Population:</label>
          <input
            id="population"
            type="number"
            name="population"
            value={editedCity.population}
            onChange={handleInputChange}
            className="form-control"
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="about" style={{ fontWeight: 'bold' }}>About:</label>
          <textarea
            id="about"
            name="about"
            value={editedCity.about}
            onChange={handleInputChange}
            className="form-control"
            rows="4"
          />
        </div>

        <div style={{ paddingBottom: '80px' }}></div>

        <div style={{
          position: 'absolute',
          bottom: '20px',
          right: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
        }}>
          <button
            onClick={handleSave}
            style={{
              backgroundColor: "#28a745",
              color: "white",
              border: "none",
              padding: "10px 20px",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: '1rem',
            }}
          >
            Update
          </button>

          <button
            onClick={handleDelete}
            style={{
              backgroundColor: "#dc3545",
              color: "white",
              border: "none",
              padding: "10px 20px",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: '1rem',
            }}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modify;
