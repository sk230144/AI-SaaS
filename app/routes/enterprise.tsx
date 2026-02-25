import Navbar from "components/Navbar";
import { ArrowRight, Building2, Code2, HeadphonesIcon, Lock, Server, Shield, Users, Zap } from "lucide-react";
import { Link } from "react-router";

const capabilities = [
    {
        icon: Server,
        title: "Dedicated Infrastructure",
        description: "Private, isolated compute with guaranteed resources. No noisy neighbors, no cold starts.",
    },
    {
        icon: Code2,
        title: "API Access & Integrations",
        description: "Full REST API access to integrate Roomify's rendering engine directly into your existing tools and workflows.",
    },
    {
        icon: Lock,
        title: "SSO & Team Management",
        description: "Enterprise SSO with SAML 2.0, role-based access control, and centralized team administration.",
    },
    {
        icon: HeadphonesIcon,
        title: "Priority Support",
        description: "Dedicated account manager, priority ticket queue, and guaranteed response times with SLA.",
    },
    {
        icon: Shield,
        title: "Security & Compliance",
        description: "SOC 2 Type II certified. End-to-end encryption, data residency options, and audit logging.",
    },
    {
        icon: Zap,
        title: "Custom Model Fine-Tuning",
        description: "Train custom AI models on your brand's design language for consistent, on-brand renders every time.",
    },
];

const trustedBy = [
    { name: "Archaus", icon: Building2 },
    { name: "DesignCraft", icon: Building2 },
    { name: "UrbanScale", icon: Building2 },
    { name: "NovaBuild", icon: Building2 },
    { name: "MetroStudio", icon: Building2 },
];

export default function Enterprise() {
    return (
        <div className="enterprise-page">
            <Navbar />

            <section className="enterprise-hero">
                <p className="label">Enterprise</p>
                <h1>Roomify for teams that build at scale</h1>
                <p className="enterprise-subtitle">
                    Dedicated infrastructure, custom integrations, and enterprise-grade security — purpose-built for
                    architecture firms, real estate companies, and design studios.
                </p>

                <div className="hero-actions">
                    <Link to="/pricing" className="hero-cta">
                        Contact Sales <ArrowRight className="cta-icon" />
                    </Link>
                    <Link to="/product" className="hero-secondary">
                        Learn More
                    </Link>
                </div>
            </section>

            <section className="capabilities-section">
                <div className="capabilities-inner">
                    <div className="capabilities-head">
                        <p className="label">Capabilities</p>
                        <h2>Enterprise-grade features for serious teams</h2>
                    </div>

                    <div className="capabilities-grid">
                        {capabilities.map((cap) => (
                            <div key={cap.title} className="capability-card">
                                <div className="cap-icon-wrap">
                                    <cap.icon className="cap-icon" />
                                </div>
                                <h3>{cap.title}</h3>
                                <p>{cap.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="trusted-section">
                <div className="trusted-inner">
                    <p className="trusted-label">Trusted by industry leaders</p>
                    <div className="trusted-logos">
                        {trustedBy.map((brand) => (
                            <div key={brand.name} className="trusted-item">
                                <brand.icon className="trusted-icon" />
                                <span>{brand.name}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="enterprise-cta-section">
                <div className="cta-card">
                    <div className="cta-content">
                        <div className="cta-icon-wrap">
                            <Users className="cta-icon-lg" />
                        </div>
                        <h2>Ready to scale your design workflow?</h2>
                        <p>
                            Talk to our sales team to discover how Roomify Enterprise can
                            transform your organization's design process.
                        </p>
                        <div className="cta-actions">
                            <a href="mailto:sales@roomify.ai" className="cta-btn">
                                Schedule a Demo <ArrowRight className="cta-icon" />
                            </a>
                            <Link to="/pricing" className="cta-secondary">
                                View Pricing
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
