import "../home/home.css" // Sharing home as a base CSS but will define features here
import { Link } from "react-router-dom";

const Feature = () => {
    return (
        <div className="home-root">
             <div className="header-new">
                <div className="container">
                    <h1>हाम्रो सुविधाहरू (Features)</h1>
                    <p>Powerful tools for the Nepali language</p>
                </div>
            </div>

            <nav className="main-nav">
                <div className="container">
                    <ul>
                        <div className="nav-left">
                            <li><Link to="/home"><i className="fas fa-home"></i> Home</Link></li>
                        </div>
                        <div className="nav-right">
                            <li><Link to="/feature" className="active-nav"><i className="fas fa-cogs"></i> Features</Link></li>
                            <li><Link to="/about"><i className="fas fa-info-circle"></i> About Us</Link></li>
                        </div>
                    </ul>
                </div>
            </nav>

            <div className="container">
                <div className="features-section" style={{background: 'white', padding: '2rem', borderRadius: '12px', border: '1px solid #e2e8f0'}}>
                    <h2 style={{textAlign: 'center', marginBottom: '2rem'}}>Main Features</h2>
                    <div className="features-grid" style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem'}}>
                        <div className="feature-item" style={{textAlign: 'center', padding: '1.5rem', border: '1px solid #f1f5f9', borderRadius: '12px'}}>
                            <div style={{fontSize: '2rem', marginBottom: '1rem', color: '#3b82f6'}}>🎙️</div>
                            <h3>Speech-to-Text</h3>
                            <p>Real-time speech recognition for the Nepali language.</p>
                        </div>
                        <div className="feature-item" style={{textAlign: 'center', padding: '1.5rem', border: '1px solid #f1f5f9', borderRadius: '12px'}}>
                            <div style={{fontSize: '2rem', marginBottom: '1rem', color: '#3b82f6'}}>📋</div>
                            <h3>Summarizer</h3>
                            <p>Advance summarization techniques based on extractive and abstractive models.</p>
                        </div>
                        <div className="feature-item" style={{textAlign: 'center', padding: '1.5rem', border: '1px solid #f1f5f9', borderRadius: '12px'}}>
                            <div style={{fontSize: '2rem', marginBottom: '1rem', color: '#3b82f6'}}>📁</div>
                            <h3>File Processing</h3>
                            <p>Quickly process .txt and document files for summaries.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Feature;
