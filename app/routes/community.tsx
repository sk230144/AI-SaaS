import Navbar from "components/Navbar";
import { ArrowRight, Eye, Heart, Share2, Users } from "lucide-react";
import { Link } from "react-router";

const stats = [
    { label: "Active Users", value: "12,400+", icon: Users },
    { label: "Renders Created", value: "98,000+", icon: Eye },
    { label: "Projects Shared", value: "24,500+", icon: Share2 },
    { label: "Community Loves", value: "156,000+", icon: Heart },
];

const showcaseProjects = [
    {
        id: 1,
        title: "Minimalist Studio Apartment",
        author: "Sarah Chen",
        image: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=600&q=80",
        likes: 342,
    },
    {
        id: 2,
        title: "Luxury Penthouse Living",
        author: "James Rodriguez",
        image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&q=80",
        likes: 521,
    },
    {
        id: 3,
        title: "Scandinavian Bedroom",
        author: "Emma Larsson",
        image: "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=600&q=80",
        likes: 289,
    },
    {
        id: 4,
        title: "Industrial Loft Kitchen",
        author: "Marco Bianchi",
        image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&q=80",
        likes: 417,
    },
    {
        id: 5,
        title: "Coastal Beach House",
        author: "Olivia Park",
        image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=80",
        likes: 198,
    },
    {
        id: 6,
        title: "Modern Open-Plan Office",
        author: "Arun Patel",
        image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&q=80",
        likes: 375,
    },
];

export default function Community() {
    return (
        <div className="community-page">
            <Navbar />

            <section className="community-hero">
                <p className="label">Community</p>
                <h1>Built by designers, for designers</h1>
                <p className="community-subtitle">
                    Explore what the Roomify community is creating, share your own work, and get inspired by
                    thousands of architects and designers worldwide.
                </p>
            </section>

            <section className="stats-section">
                <div className="stats-grid">
                    {stats.map((stat) => (
                        <div key={stat.label} className="stat-card">
                            <div className="stat-icon-wrap">
                                <stat.icon className="stat-icon" />
                            </div>
                            <span className="stat-value">{stat.value}</span>
                            <span className="stat-label">{stat.label}</span>
                        </div>
                    ))}
                </div>
            </section>

            <section className="showcase-section">
                <div className="showcase-inner">
                    <div className="showcase-head">
                        <div className="copy">
                            <p className="label">Showcase</p>
                            <h2>Community highlights</h2>
                        </div>
                    </div>

                    <div className="showcase-grid">
                        {showcaseProjects.map((project) => (
                            <div key={project.id} className="showcase-card group">
                                <div className="showcase-preview">
                                    <img src={project.image} alt={project.title} />
                                    <div className="showcase-overlay">
                                        <div className="likes">
                                            <Heart className="heart-icon" />
                                            <span>{project.likes}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="showcase-body">
                                    <h3>{project.title}</h3>
                                    <span className="author">by {project.author}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="community-cta-section">
                <div className="cta-inner">
                    <h2>Join the Roomify community</h2>
                    <p>Start creating, sharing, and collaborating with designers around the world.</p>
                    <Link to="/" className="cta-btn">
                        Get Started Free <ArrowRight className="cta-icon" />
                    </Link>
                </div>
            </section>
        </div>
    );
}
