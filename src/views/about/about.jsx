import "../home/home.css"
import { Link } from "react-router-dom";

const About = () => {
    return (
        <div className="home-root">
            <div className="header-new">
                <div className="container">
                    <h1>हाम्रो बारेमा (About Us)</h1>
                    <p>Meet the team behind Nepali Text Summarizer</p>
                </div>
            </div>

            <nav className="main-nav">
                <div className="container">
                    <ul>
                        <div className="nav-left">
                            <li><Link to="/home"><i className="fas fa-home"></i> Home</Link></li>
                        </div>
                        <div className="nav-right">
                            <li><Link to="/feature"><i className="fas fa-cogs"></i> Features</Link></li>
                            <li><Link to="/about" className="active-nav"><i className="fas fa-info-circle"></i> About Us</Link></li>
                        </div>
                    </ul>
                </div>
            </nav>

            <div className="container">
                <div className="card" style={{ marginBottom: '48px' }}>
                    <div className="card-header">
                        <h2 className="card-title">About the Toolkit</h2>
                    </div>
                    <div className="card-content">
                        <p style={{ marginBottom: '20px' }}>
                            The Nepali Speech Recognition and Text Summarizer is an innovative web application designed to bridge the gap between spoken Nepali language and digital text. Leveraging advanced speech-to-text technology and intelligent summarization algorithms, this tool allows users to effortlessly convert Nepali audio into written transcripts and generate concise summaries.
                        </p>
                        <p style={{ marginBottom: '20px' }}>
                            Our goal is to provide a flexible and efficient solution for anyone needing to process Nepali speech, whether for educational purposes, professional documentation, or personal use.
                        </p>
                    </div>
                </div>

                <div className="features-section">
                    <h2 className="features-title">Meet Our Team</h2>
                    <div className="team-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', textAlign: 'center' }}>
                        <div className="team-member-card">
                            <h3 className="member-name">Muskan Jonchhe</h3>
                            <p className="member-roll-no">KCE078BCT026</p>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default About;
