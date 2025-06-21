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
    const [darkMode, setDarkMode] = useState(false);

    // Scroll to top when component is loaded
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    // Load theme preference and listen for theme changes
    useEffect(() => {
        const savedTheme = localStorage.getItem("theme");
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        
        if (savedTheme) {
            setDarkMode(savedTheme === "dark");
        } else if (prefersDark) {
            setDarkMode(true);
        } else {
            setDarkMode(false);
        }

        // Listen for theme changes from navbar
        const handleThemeChange = (event) => {
            setDarkMode(event.detail.theme === 'dark');
        };

        window.addEventListener('themeChanged', handleThemeChange);

        return () => {
            window.removeEventListener('themeChanged', handleThemeChange);
        };
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

    // Dynamic chart styling based on theme
    const getChartOptions = () => {
        const textColor = darkMode ? '#f1f5f9' : '#1f2937';
        const gridColor = darkMode ? '#374151' : '#e5e7eb';
        
        return {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: {
                        color: textColor,
                        font: {
                            size: 12,
                            weight: '500'
                        }
                    }
                },
                tooltip: {
                    backgroundColor: darkMode ? '#1f2937' : '#ffffff',
                    titleColor: textColor,
                    bodyColor: textColor,
                    borderColor: darkMode ? '#4b5563' : '#d1d5db',
                    borderWidth: 1
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: textColor,
                        font: {
                            size: 11
                        }
                    },
                    grid: {
                        color: gridColor
                    }
                },
                y: {
                    ticks: {
                        color: textColor,
                        font: {
                            size: 11
                        }
                    },
                    grid: {
                        color: gridColor
                    }
                }
            }
        };
    };

    // Custom styles for React Select based on theme
    const getSelectStyles = () => ({
        control: (provided, state) => ({
            ...provided,
            backgroundColor: darkMode ? '#374151' : '#ffffff',
            borderColor: state.isFocused 
                ? (darkMode ? '#60a5fa' : '#3b82f6')
                : (darkMode ? '#4b5563' : '#d1d5db'),
            color: darkMode ? '#f1f5f9' : '#1f2937',
            boxShadow: state.isFocused 
                ? `0 0 0 3px ${darkMode ? 'rgba(96, 165, 250, 0.1)' : 'rgba(59, 130, 246, 0.1)'}`
                : 'none',
            '&:hover': {
                borderColor: darkMode ? '#60a5fa' : '#3b82f6'
            }
        }),
        singleValue: (provided) => ({
            ...provided,
            color: darkMode ? '#f1f5f9' : '#1f2937'
        }),
        input: (provided) => ({
            ...provided,
            color: darkMode ? '#f1f5f9' : '#1f2937'
        }),
        placeholder: (provided) => ({
            ...provided,
            color: darkMode ? '#9ca3af' : '#6b7280'
        }),
        menu: (provided) => ({
            ...provided,
            backgroundColor: darkMode ? '#374151' : '#ffffff',
            border: `1px solid ${darkMode ? '#4b5563' : '#d1d5db'}`
        }),
        option: (provided, state) => ({
            ...provided,
            backgroundColor: state.isSelected 
                ? (darkMode ? '#3b82f6' : '#3b82f6')
                : state.isFocused 
                    ? (darkMode ? '#4b5563' : '#f3f4f6')
                    : 'transparent',
            color: state.isSelected 
                ? '#ffffff'
                : (darkMode ? '#f1f5f9' : '#1f2937'),
            '&:hover': {
                backgroundColor: state.isSelected 
                    ? (darkMode ? '#3b82f6' : '#3b82f6')
                    : (darkMode ? '#4b5563' : '#f3f4f6')
            }
        })
    });

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
                borderColor: darkMode ? '#60a5fa' : '#FF5733',
                backgroundColor: darkMode ? 'rgba(96, 165, 250, 0.2)' : 'rgba(255, 87, 51, 0.2)',
                tension: 0.4,
                fill: true,
                pointBackgroundColor: darkMode ? '#60a5fa' : '#FF5733',
                pointBorderColor: darkMode ? '#1e40af' : '#cc4125',
                pointBorderWidth: 2,
                pointRadius: 4
            }
        ]
    };

    const crimeChartData = {
        labels: filteredData.map(entry => entry["Crime Description"]),
        datasets: [
            {
                label: 'Crime Count',
                data: filteredData.map(entry => entry["Police Deployed"]),
                backgroundColor: darkMode ? 'rgba(34, 197, 94, 0.6)' : 'rgba(54, 162, 235, 0.6)',
                borderColor: darkMode ? 'rgba(34, 197, 94, 1)' : 'rgba(54, 162, 235, 1)',
                borderWidth: 2,
                borderRadius: 4,
                borderSkipped: false,
            }
        ]
    };

    if (loading) return <div className={`loading-message ${darkMode ? 'dark-mode' : 'light-mode'}`}>Loading data...</div>;
    if (error) return <div className={`error-message ${darkMode ? 'dark-mode' : 'light-mode'}`}>Error: {error}</div>;

    return (
        <section className={`safety-insights-container ${darkMode ? 'dark-mode' : 'light-mode'}`}>
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
                        styles={getSelectStyles()}
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
                                styles={getSelectStyles()}
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
                                styles={getSelectStyles()}
                            />
                        </>
                    )}
                </aside>
                <div className="insights-data">
                    <h2>Safety Insights for {selectedState?.label || selectedCity?.label || 'Select a Location'}</h2>
                    <div className="data-visualization">
                        {dataType === 'accidents' ? (
                            <Line data={accidentChartData} options={getChartOptions()} />
                        ) : (
                            <Bar data={crimeChartData} options={getChartOptions()} />
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default SafetyInsights;