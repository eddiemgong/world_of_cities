import React, { useEffect, useState } from 'react';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

const Stats = () => {
    const [cities, setCities] = useState([]);
    const [error, setError] = useState(null);
    const [selectedOption, setSelectedOption] = useState('population');
    const [cityChart, setCityChart] = useState(null);

    useEffect(() => {
        async function fetchCities() {
            try {
                const response = await fetch('http://localhost:8081/cities');
                if (!response.ok) {
                    throw new Error('Failed to fetch cities');
                }
                const data = await response.json();
                setCities(data);
                updateGraph(data, 'population');
            } catch (error) {
                setError(error.message);
            }
        }

        fetchCities();
    }, []);

    const updateGraph = (data, selectedOption) => {
        const ctx = document.getElementById('cityChart').getContext('2d');

        if (cityChart) { cityChart.destroy(); }

        const sortedData = data.sort((a, b) => a[selectedOption] - b[selectedOption]);

        const labels = sortedData.map(city => city.city);
        const values = sortedData.map(city => city[selectedOption]);

        const newChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: selectedOption.charAt(0).toUpperCase() + selectedOption.slice(1),
                    data: values,
                    backgroundColor: 'rgba(75, 192, 192, 0.6)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });

        setCityChart(newChart);
    };

    const handleSelectChange = (e) => {
        const option = e.target.value;
        setSelectedOption(option);
        updateGraph(cities, option);
    };

    return (
        <div className="container mt-4">
            <h2 className="text-center" style={{ fontStyle: 'italic' }}>City Statistics</h2>

            {error && <div className="alert alert-danger">{error}</div>}

            <div className="mb-3">
                <label className="form-label">Select Data to Graph</label>
                <select
                    className="form-control"
                    id="dataSelect"
                    value={selectedOption}
                    onChange={handleSelectChange}
                >
                    <option value="lat">Latitude (Lat)</option>
                    <option value="lng">Longitude (Lng)</option>
                    <option value="population">Population</option>
                </select>
            </div>

            <canvas id="cityChart"></canvas>
        </div>
    );
};

export default Stats;
