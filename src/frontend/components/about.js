import React, { useEffect, useRef } from 'react';
import './About.css';
import aboutImage from './assets/about1.jpg';

const About = () => {
    const statsRef = useRef([]);
    
    useEffect(() => {
        // Intersection Observer for animations
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.style.animationPlayState = 'running';
                    }
                });
            },
            { threshold: 0.1 }
        );

        // Observe feature cards
        const featureCards = document.querySelectorAll('.feature-card');
        featureCards.forEach((card) => observer.observe(card));

        // Animate stats numbers
        const animateStats = () => {
            statsRef.current.forEach((stat, index) => {
                if (stat) {
                    const finalValue = [5000, 99.5, 24, 150][index];
                    const suffix = ['', '%', '/7', '+'][index];
                    let currentValue = 0;
                    const increment = finalValue / 100;
                    
                    const timer = setInterval(() => {
                        currentValue += increment;
                        if (currentValue >= finalValue) {
                            currentValue = finalValue;
                            clearInterval(timer);
                        }
                        
                        const displayValue = index === 1 
                            ? currentValue.toFixed(1) 
                            : Math.floor(currentValue).toLocaleString();
                        stat.textContent = displayValue + suffix;
                    }, 40);
                }
            });
        };

        // Trigger stats animation when stats section is visible
        const statsSection = document.querySelector('.about-stats');
        if (statsSection) {
            const statsObserver = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting) {
                            animateStats();
                            statsObserver.unobserve(entry.target);
                        }
                    });
                },
                { threshold: 0.5 }
            );
            statsObserver.observe(statsSection);
        }

        return () => {
            observer.disconnect();
        };
    }, []);

    return (
        <section className="about-section" id="about">
            <div className="about-container">
                <div className="about-header">
                    <h2 className="about-title">Discover a Smarter Way to Travel</h2>
                    <p className="about-subtitle">
                        AI-Powered Travel Companion for Safer, Smarter, and More Efficient Journeys
                    </p>
                </div>

                <div className="about-content">
                    <div className="about-text">
                        <p>
                            Traveling should be <strong>safe, convenient, and stress-free</strong>. Our intelligent 
                            AI-powered platform revolutionizes how you plan and execute your journeys, ensuring 
                            you always take the most optimal route possible.
                        </p>
                        <p>
                            Our cutting-edge system provides <strong>real-time route safety analysis</strong>, 
                            AI-generated <strong>shortest and safest paths</strong>, and a sophisticated 
                            <strong>virtual assistant</strong> that guides you through every step of your journey. 
                            Whether you're commuting daily, traveling at night, or exploring uncharted territories, 
                            our advanced technology guarantees a seamless experience.
                        </p>
                        <p>
                            We analyze comprehensive data including <strong>road conditions</strong>, 
                            <strong>accident history</strong>, <strong>lighting levels</strong>, 
                            <strong>traffic patterns</strong>, and <strong>weather conditions</strong> to provide 
                            dynamic travel recommendations and proactive safety alerts.
                        </p>
                    </div>

                    <div className="about-image">
                        <img src={aboutImage} alt="Smart Travel Technology" />
                    </div>
                </div>

                {/* Stats Section */}
                <div className="about-stats">
                    <div className="stat-item">
                        <span 
                            className="stat-number" 
                            ref={el => statsRef.current[0] = el}
                        >
                            0
                        </span>
                        <div className="stat-label">Users Protected</div>
                    </div>
                    <div className="stat-item">
                        <span 
                            className="stat-number" 
                            ref={el => statsRef.current[1] = el}
                        >
                            0%
                        </span>
                        <div className="stat-label">Safety Rate</div>
                    </div>
                    <div className="stat-item">
                        <span 
                            className="stat-number" 
                            ref={el => statsRef.current[2] = el}
                        >
                            0/7
                        </span>
                        <div className="stat-label">Support Available</div>
                    </div>
                    <div className="stat-item">
                        <span 
                            className="stat-number" 
                            ref={el => statsRef.current[3] = el}
                        >
                            0+
                        </span>
                        <div className="stat-label">Cities Covered</div>
                    </div>
                </div>

                <div className="about-features">
                    <div className="feature-card">
                        <h3>
                            <span>🛣️</span>
                            Smart & Safe Routes
                        </h3>
                        <p>
                            Advanced AI algorithms analyze millions of data points to suggest the shortest 
                            and safest routes, considering real-time traffic, weather conditions, and 
                            historical safety data.
                        </p>
                    </div>
                    
                    <div className="feature-card">
                        <h3>
                            <span>📊</span>
                            Real-Time Data Visualization
                        </h3>
                        <p>
                            Interactive maps display accident hotspots, lighting conditions, road quality, 
                            and live traffic updates with stunning visualizations and actionable insights.
                        </p>
                    </div>
                    
                    <div className="feature-card">
                        <h3>
                            <span>🤖</span>
                            AI Travel Assistant
                        </h3>
                        <p>
                            Intelligent virtual assistant provides instant travel tips, real-time road 
                            conditions, alternative route recommendations, and emergency assistance when needed.
                        </p>
                    </div>
                    
                    <div className="feature-card">
                        <h3>
                            <span>⚡</span>
                            Route Optimization
                        </h3>
                        <p>
                            Machine learning algorithms continuously optimize routes to save time and fuel, 
                            ensuring efficient, eco-friendly, and cost-effective travel experiences.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default About;