import Navbar from "components/Navbar";
import {
    ArrowLeft,
    Download,
    Layers,
    UploadIcon,
    Sparkles,
    ImageIcon,
    Eye,
} from "lucide-react";
import { Link } from "react-router";

const SAMPLE_IMAGES = [
    { id: 1, src: "/1st.jpg", label: "Modern Villa" },
    { id: 2, src: "/2nd.jpg", label: "Cozy Apartment" },
    { id: 3, src: "/3rd.jpg", label: "Urban Loft" },
];

const handleDownload = (src: string, label: string) => {
    const link = document.createElement("a");
    link.href = src;
    link.download = `${label.toLowerCase().replace(/\s+/g, "-")}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

export default function Demo() {
    return (
        <div className="demo-page">
            <Navbar />

            {/* Back Button */}
            <div className="demo-back">
                <Link to="/" className="back-link">
                    <ArrowLeft size={16} />
                    <span>Back to Home</span>
                </Link>
            </div>

            {/* Hero Section */}
            <section className="demo-hero">
                <div className="hero-badge">
                    <Eye className="badge-icon" />
                    <span>Interactive Demo</span>
                </div>

                <h1>See Roomify in Action</h1>
                <p className="hero-subtitle">
                    Download a sample image, upload it using the tool on the home page,
                    and watch as our AI transforms it into stunning 3D visualizations.
                </p>
            </section>

            {/* Steps indicator */}
            <section className="demo-steps">
                <div className="steps-track">
                    <div className="step-item active">
                        <div className="step-dot">
                            <span>1</span>
                        </div>
                        <p>Download Sample</p>
                    </div>
                    <div className="step-line" />
                    <div className="step-item active">
                        <div className="step-dot">
                            <span>2</span>
                        </div>
                        <p>Upload Image</p>
                    </div>
                    <div className="step-line" />
                    <div className="step-item active">
                        <div className="step-dot">
                            <span>3</span>
                        </div>
                        <p>View 3D Result</p>
                    </div>
                </div>
            </section>

            <div className="demo-content">
                {/* Step 1 — Sample Images Download */}
                <section className="sample-section">
                    <div className="section-label">
                        <Download className="label-icon" size={14} />
                        <span>Step 1 — Download a Sample Image</span>
                    </div>

                    <div className="samples-grid">
                        {SAMPLE_IMAGES.map((img) => (
                            <div key={img.id} className="sample-card group">
                                <div className="sample-preview">
                                    <img src={img.src} alt={img.label} />
                                    <div className="sample-overlay">
                                        <button
                                            className="overlay-btn"
                                            onClick={() => handleDownload(img.src, img.label)}
                                        >
                                            <Download size={16} />
                                            Download
                                        </button>
                                    </div>
                                </div>
                                <div className="sample-info">
                                    <h3>{img.label}</h3>
                                    <p>Sample #{img.id}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Step 2 — Upload (static visual only) */}
                <section className="upload-section">
                    <div className="section-label">
                        <UploadIcon className="label-icon" size={14} />
                        <span>Step 2 — Upload Your Image</span>
                    </div>

                    <div className="upload-area-wrapper">
                        <div className="upload-grid-bg" />
                        <div className="upload-card-demo">
                            <div className="upload-head">
                                <div className="upload-icon">
                                    <Layers className="icon" />
                                </div>
                                <h3>Upload your floor plan</h3>
                                <p>Go to the home page and drag & drop your downloaded sample into the upload area</p>
                            </div>

                            <div className="dropzone-demo">
                                <div className="drop-content">
                                    <div className="drop-icon">
                                        <UploadIcon size={20} />
                                    </div>
                                    <p>Drag & drop on the home page upload area</p>
                                    <p className="help">Supports JPG, PNG, WEBP up to 10MB</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Step 3 — 3D Result Preview (static showcase) */}
                <section className="result-section">
                    <div className="section-label">
                        <Sparkles className="label-icon" size={14} />
                        <span>Step 3 — Get Your 3D Designs</span>
                    </div>

                    <div className="result-showcase">
                        <div className="showcase-header">
                            <h3>
                                <Sparkles size={18} className="result-sparkle" />
                                AI-Generated 3D Visualizations
                            </h3>
                            <p>After uploading, our AI generates multiple 3D design variants from your floor plan</p>
                        </div>

                        <div className="showcase-grid">
                            <div className="showcase-card single">
                                <div className="showcase-label">
                                    <ImageIcon size={12} />
                                    <span>3D Visualization</span>
                                </div>
                                <div className="showcase-image">
                                    <img src="/3d des 1.png" alt="3D Design Visualization" />
                                </div>
                                <div className="showcase-info">
                                    <h4>AI-Rendered 3D Design</h4>
                                    <p>Generated from your floor plan</p>
                                </div>
                            </div>
                        </div>

                        <div className="showcase-cta">
                            <p>Ready to try it yourself?</p>
                            <Link to="/#upload" className="cta-link">
                                Start Building Now →
                            </Link>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
