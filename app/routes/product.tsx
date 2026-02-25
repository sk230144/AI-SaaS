import Navbar from "components/Navbar";
import { ArrowRight, Box, Camera, Download, Eye, Layers, Sparkles, Upload, Zap } from "lucide-react";
import { Link } from "react-router";

const features = [
    {
        icon: Sparkles,
        title: "AI-Powered Rendering",
        description: "Transform flat floor plans into photorealistic 3D visualizations in seconds using cutting-edge AI models.",
    },
    {
        icon: Eye,
        title: "Room Visualization",
        description: "See your designs come to life with accurate lighting, materials, and spatial awareness.",
    },
    {
        icon: Download,
        title: "Instant Export",
        description: "Download high-resolution renders instantly. Ready for presentations, portfolios, or client meetings.",
    },
    {
        icon: Layers,
        title: "Before & After Compare",
        description: "Drag-to-compare slider lets you showcase the transformation from sketch to photorealistic render.",
    },
];

const steps = [
    {
        number: "01",
        icon: Upload,
        title: "Upload Your Plan",
        description: "Drop in any floor plan, sketch, or room photo. We support JPG, PNG up to 10MB.",
    },
    {
        number: "02",
        icon: Zap,
        title: "AI Processes It",
        description: "Our AI engine analyzes your input and generates a photorealistic 3D visualization in seconds.",
    },
    {
        number: "03",
        icon: Camera,
        title: "Review & Export",
        description: "Compare before and after, fine-tune the result, then export or share with your team.",
    },
];

export default function Product() {
    return (
        <div className="product-page">
            <Navbar />

            <section className="product-hero">
                <div className="hero-badge">
                    <Box className="badge-icon" />
                    <span>Product</span>
                </div>

                <h1>The AI design tool built for architects & designers</h1>

                <p className="hero-subtitle">
                    Roomify turns your floor plans into stunning photorealistic renders in seconds —
                    no 3D modeling experience required.
                </p>

                <div className="hero-actions">
                    <Link to="/" className="hero-cta">
                        Try It Free <ArrowRight className="cta-icon" />
                    </Link>
                </div>
            </section>

            <section className="features-section">
                <div className="features-inner">
                    <div className="features-head">
                        <p className="label">Capabilities</p>
                        <h2>Everything you need to visualize spaces</h2>
                    </div>

                    <div className="features-grid">
                        {features.map((feature) => (
                            <div key={feature.title} className="feature-card">
                                <div className="feature-icon-wrap">
                                    <feature.icon className="feature-icon" />
                                </div>
                                <h3>{feature.title}</h3>
                                <p>{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="how-section">
                <div className="how-inner">
                    <div className="how-head">
                        <p className="label">How It Works</p>
                        <h2>From sketch to render in 3 steps</h2>
                    </div>

                    <div className="steps-grid">
                        {steps.map((step) => (
                            <div key={step.number} className="step-card">
                                <span className="step-number">{step.number}</span>
                                <div className="step-icon-wrap">
                                    <step.icon className="step-icon" />
                                </div>
                                <h3>{step.title}</h3>
                                <p>{step.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="product-cta-section">
                <div className="cta-inner">
                    <h2>Ready to transform your designs?</h2>
                    <p>Join thousands of architects and designers already using Roomify.</p>
                    <Link to="/" className="cta-btn">
                        Start Building — It's Free <ArrowRight className="cta-icon" />
                    </Link>
                </div>
            </section>
        </div>
    );
}
