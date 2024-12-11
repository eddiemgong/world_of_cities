import React, { useEffect, useState, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css"; // Make sure to import the Leaflet CSS

const Map = () => {
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState(null);
  const mapContainer = useRef(null);

  // Fetch city data from backend
  useEffect(() => {
    async function fetchCities() {
      try {
        const response = await fetch('http://localhost:8081/cities');
        if (!response.ok) {
          throw new Error('Failed to fetch cities');
        }
        const data = await response.json();
        console.log(data); // Log data to check its structure

        // Extract only city name, lat, and lng (adjusted for the correct name property)
        const citiesData = data.map(city => ({
          name: city.city, // Accessing name from city.city
          lat: city.lat,
          lng: city.lng
        }));

        setCities(citiesData);
      } catch (error) {
        console.error("Error fetching cities:", error);
      }
    }

    fetchCities();
  }, []);

  // Handle city selection from dropdown
  const handleCityChange = (event) => {
    const cityName = event.target.value;
    const city = cities.find(c => c.name === cityName);
    setSelectedCity(city);
  };

  useEffect(() => {
    // Initialize the map only once when the component is first loaded
    const map = L.map(mapContainer.current, {
      center: [51.505, -0.09], // Default center if no city is selected
      zoom: 2, // Default zoom
      maxBounds: [
        [-90, -180], // South-West corner
        [90, 180], // North-East corner
      ], // Adding boundary lines
      maxZoom: 18,
      minZoom: 2,
    });

    // Tile layer from OpenStreetMap
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    // Define a custom marker icon (if the default one is not showing)
    const customIcon = new L.Icon({
      iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png", // Default marker icon
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
      shadowSize: [41, 41],
    });

    // Function to add marker for the selected city
    const addMarker = (city) => {
      if (city) {
        const { lat, lng, name } = city;

        // Center the map on the selected city's coordinates and add a marker
        map.setView([lat, lng], 8); // Zoom out when focusing on city
        L.marker([lat, lng], { icon: customIcon })
          .addTo(map)
          .bindPopup(`<b>${name}</b><br>Lat: ${lat}, Lng: ${lng}`);
      }
    };

    // Add marker for the selected city
    if (selectedCity) {
      addMarker(selectedCity);
    }

    // Clean up the map instance on component unmount
    return () => {
      map.remove();
    };
  }, [selectedCity, cities]); // Re-run the effect when selectedCity changes

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", flexDirection: "column" }}>
      <h2 style={{ fontStyle: "italic", marginBottom: "10px" }}>Locate a City on Map</h2>
      <select onChange={handleCityChange} style={{ marginBottom: "20px", padding: "10px" }}>
        <option value="">Select a City</option>
        {cities.map((city) => (
          <option key={city.name} value={city.name}>
            {city.name}
          </option>
        ))}
      </select>

      <div ref={mapContainer} style={{ height: "600px", width: "80%" }}></div> {/* Narrow width, expanded height */}
    </div>
  );
};

export default Map;
