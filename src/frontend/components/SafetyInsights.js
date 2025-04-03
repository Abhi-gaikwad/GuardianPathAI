import React, { useState, useEffect } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, BarElement, LineElement, Filler, Tooltip, Legend } from 'chart.js';
import Select from 'react-select';
import './SafetyInsights.css';

ChartJS.register(CategoryScale, LinearScale, PointElement, BarElement, LineElement, Filler, Tooltip, Legend);

const SafetyInsights = () => {
    const [dataType, setDataType] = useState('accidents');
    const [accidentData, setAccidentData] = useState([]);
    const [crimeData, setCrimeData] = useState([]);
    const [selectedState, setSelectedState] = useState(null);
    const [selectedCity, setSelectedCity] = useState(null);
    const [filteredData, setFilteredData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Scroll to top when component is loaded
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    useEffect(() => {
        setLoading(true);
    
        Promise.all([
            fetch('/data/accidents_2019.json')
                .then(response => {
                    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
                    return response.json();
                }),
            fetch('/data/crimedata.json')
                .then(response => {
                    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
                    return response.json();
                })
        ])
        .then(([accidentData, crimeData]) => {
            setAccidentData(accidentData);
            setCrimeData(crimeData);
            setLoading(false);
        })
        .catch(error => {
            console.error("Error fetching data:", error);
            setError(error.message);
            setLoading(false);
        });
    }, []);
    

    useEffect(() => {
        if (dataType === 'accidents' && accidentData.length > 0 && selectedState) {
            setFilteredData(accidentData.filter(entry => entry["States/UTs"] === selectedState.value));
        } else if (dataType === 'crime' && crimeData.length > 0 && selectedCity) {
            setFilteredData(crimeData.filter(entry => entry.City === selectedCity.value));
        }
    }, [selectedState, selectedCity, dataType, accidentData, crimeData]);

    const accidentChartData = {
        labels: ['Three-Way Intersection', 'Y-Shaped Intersection', 'Circular Intersection', 'Miscellaneous Intersections', 'Total Accidents'],
        datasets: [
            {
                label: 'Number of Accidents',
                data: filteredData.length > 0 ? [
                    filteredData[0]?.["T-Junction - Total number of Accidents - Numbers"] || 0,
                    filteredData[0]?.["Y-Junction - Total number of Accidents"] || 0,
                    filteredData[0]?.["Round about Junction - Total number of Accidents"] || 0,
                    filteredData[0]?.["Others - Total number of Accidents"] || 0,
                    filteredData[0]?.["Total - Total number of Accidents"] || 0
                ] : [],
                borderColor: '#FF5733',
                backgroundColor: 'rgba(255, 87, 51, 0.2)',
                tension: 0.4,
                fill: true,
            }
        ]
    };

    const crimeChartData = {
        labels: filteredData.map(entry => entry["Crime Description"]),
        datasets: [
            {
                label: 'Crime Count',
                data: filteredData.map(entry => entry["Police Deployed"]),
                backgroundColor: 'rgba(54, 162, 235, 0.6)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1,
            }
        ]
    };

    if (loading) return <p className="loading-message">Loading data...</p>;
    if (error) return <p className="error-message">Error: {error}</p>;

    return (
        <section className="safety-insights-container">
            <div className="safety-insights-section">
                <aside className="insights-sidebar">
                    <h3>Filter Options</h3>
                    <label>Data Type:</label>
                    <Select
                        options={[
                            { value: 'accidents', label: 'Accident Data' },
                            { value: 'crime', label: 'Crime Data' }
                        ]}
                        onChange={option => setDataType(option.value)}
                        value={{ value: dataType, label: dataType === 'accidents' ? 'Accident Data' : 'Crime Data' }}
                        isSearchable={false}
                    />
                    {dataType === 'accidents' ? (
                        <>
                            <label>State:</label>
                            <Select
                                options={accidentData.map(entry => ({ value: entry["States/UTs"], label: entry["States/UTs"] }))}
                                onChange={setSelectedState}
                                value={selectedState}
                                placeholder="Select a State..."
                                isSearchable
                            />
                        </>
                    ) : (
                        <>
                            <label>City:</label>
                            <Select
                                options={[...new Set(crimeData.map(entry => entry.City))].map(city => ({ value: city, label: city }))}
                                onChange={setSelectedCity}
                                value={selectedCity}
                                placeholder="Select a City..."
                                isSearchable
                            />
                        </>
                    )}
                </aside>
                <div className="insights-data">
                    <h2>Safety Insights for {selectedState?.label || selectedCity?.label || 'Select a Location'}</h2>
                    <div className="data-visualization">
                        {dataType === 'accidents' ? (
                            <Line data={accidentChartData} options={{ responsive: true, maintainAspectRatio: false }} />
                        ) : (
                            <Bar data={crimeChartData} options={{ responsive: true, maintainAspectRatio: false }} />
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default SafetyInsights;
