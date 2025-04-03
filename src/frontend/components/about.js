import React from 'react';
import './About.css';
import aboutImage from './assets/about1.jpg';

const About = () => {
    return (
        <section className="about-section">
            <div className="about-container">
                <div className="about-header">
                    <h2 className="about-title">Discover a Smarter Way to Travel</h2>
                    <p className="about-subtitle">AI-Powered Travel Companion for Safer Journeys</p>
                </div>

                <div className="about-content">
                    <div className="about-text">
                        <p>
                            Traveling should be <strong>safe, convenient, and stress-free</strong>. Our intelligent AI-powered platform
                            helps you plan your trips with confidence, ensuring you always take the best route possible.
                        </p>
                        <p>
                            Our system offers <strong>real-time route safety analysis</strong>, AI-generated <strong>shortest and safest paths</strong>,
                            and a <strong>virtual assistant</strong> to guide you through every journey. Whether you're commuting to work,
                            traveling at night, or exploring new places, our advanced technology ensures a smoother experience.
                        </p>
                        <p>
                            We analyze multiple factors such as   road conditions, accident history, lighting levels,   and   traffic patterns
                            to provide   dynamic travel recommendations   and   safety alerts  .
                        </p>
                    </div>

                    <div className="about-image">
                        <img src={aboutImage} alt="Smart Travel" />
                    </div>
                </div>

                <div className="about-features">
                    <div className="feature-card">
                        <h3>🛣️ Smart & Safe Routes</h3>
                        <p>AI-powered suggestions for the shortest and safest routes, considering real-time traffic and safety data.</p>
                    </div>
                    <div className="feature-card">
                        <h3>📊 Real-Time Data Visualization</h3>
                        <p>View accident hotspots, lighting conditions, and road quality using interactive maps and insights.</p>
                    </div>
                    <div className="feature-card">
                        <h3>🤖 AI Travel Assistant</h3>
                        <p>Ask our AI-driven assistant for travel tips, road conditions, and alternate route recommendations instantly.</p>
                    </div>
                    <div className="feature-card">
                        <h3>🚗 Shortest Route Optimization</h3>
                        <p>Get optimized routes to save time and fuel, ensuring efficient and eco-friendly travel experiences.</p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default About;
