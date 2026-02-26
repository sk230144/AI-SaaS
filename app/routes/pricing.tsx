import Navbar from "components/Navbar";
import { ArrowRight, Check, ChevronDown, ChevronUp, CreditCard, X, Lock } from "lucide-react";
import { useState } from "react";

const plans = [
    {
        name: "Free",
        price: "$0",
        period: "forever",
        description: "Perfect for trying out Roomify and personal projects.",
        cta: "Get Started",
        ctaVariant: "outline" as const,
        features: [
            "5 renders per month",
            "Basic AI rendering",
            "Standard resolution exports",
            "Community gallery access",
            "Email support",
        ],
    },
    {
        name: "Pro",
        price: "$19",
        period: "/month",
        description: "For professionals who need unlimited creative power.",
        cta: "Upgrade to Pro",
        ctaVariant: "primary" as const,
        popular: true,
        features: [
            "Unlimited renders",
            "Priority AI processing",
            "High-resolution exports",
            "Before & After compare view",
            "Project sharing & collaboration",
            "Priority email support",
        ],
    },
    {
        name: "Enterprise",
        price: "Custom",
        period: "",
        description: "Tailored solutions for teams and organizations.",
        cta: "Contact Sales",
        ctaVariant: "outline" as const,
        features: [
            "Everything in Pro",
            "Dedicated infrastructure",
            "API access & integrations",
            "SSO & team management",
            "Custom model fine-tuning",
            "Dedicated account manager",
            "99.9% uptime SLA",
        ],
    },
];

const faqs = [
    {
        question: "Can I switch plans at any time?",
        answer: "Yes! You can upgrade or downgrade your plan at any time. Changes take effect at the start of your next billing cycle.",
    },
    {
        question: "What happens when I hit my free render limit?",
        answer: "You'll be notified when you've used all 5 free renders for the month. You can upgrade to Pro for unlimited renders, or wait until the next month when your limit resets.",
    },
    {
        question: "Is there a free trial for Pro?",
        answer: "Yes, every new account gets a 7-day Pro trial with full access to unlimited renders and all Pro features.",
    },
    {
        question: "What payment methods do you accept?",
        answer: "We accept all major credit cards, debit cards, and PayPal. Enterprise customers can also pay via invoice.",
    },
    {
        question: "Can I cancel my subscription?",
        answer: "Absolutely. You can cancel anytime from your account settings. You'll continue to have access until the end of your current billing period.",
    },
];

export default function Pricing() {
    const [openFaq, setOpenFaq] = useState<number | null>(null);
    const [showPayment, setShowPayment] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState<string>("");

    const handlePlanClick = (planName: string) => {
        setSelectedPlan(planName);
        setShowPayment(true);
    };

    return (
        <div className="pricing-page">
            <Navbar />

            <section className="pricing-hero">
                <p className="label">Pricing</p>
                <h1>Simple, transparent pricing</h1>
                <p className="pricing-subtitle">
                    Start free. Upgrade when you're ready. No hidden fees.
                </p>
            </section>

            <section className="plans-section">
                <div className="plans-grid">
                    {plans.map((plan) => (
                        <div
                            key={plan.name}
                            className={`plan-card ${plan.popular ? "is-popular" : ""}`}
                        >
                            {plan.popular && (
                                <div className="popular-badge">Most Popular</div>
                            )}

                            <div className="plan-header">
                                <h3>{plan.name}</h3>
                                <div className="plan-price">
                                    <span className="amount">{plan.price}</span>
                                    {plan.period && <span className="period">{plan.period}</span>}
                                </div>
                                <p className="plan-desc">{plan.description}</p>
                            </div>

                            <ul className="plan-features">
                                {plan.features.map((feature) => (
                                    <li key={feature}>
                                        <Check className="check-icon" />
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            <button
                                className={`plan-cta ${plan.ctaVariant}`}
                                onClick={() => handlePlanClick(plan.name)}
                            >
                                {plan.cta}
                                <ArrowRight className="cta-icon" />
                            </button>
                        </div>
                    ))}
                </div>
            </section>

            <section className="faq-section">
                <div className="faq-inner">
                    <div className="faq-head">
                        <p className="label">FAQ</p>
                        <h2>Frequently asked questions</h2>
                    </div>

                    <div className="faq-list">
                        {faqs.map((faq, index) => (
                            <div
                                key={index}
                                className={`faq-item ${openFaq === index ? "is-open" : ""}`}
                            >
                                <button
                                    className="faq-question"
                                    onClick={() =>
                                        setOpenFaq(openFaq === index ? null : index)
                                    }
                                >
                                    <span>{faq.question}</span>
                                    {openFaq === index ? (
                                        <ChevronUp className="faq-chevron" />
                                    ) : (
                                        <ChevronDown className="faq-chevron" />
                                    )}
                                </button>
                                {openFaq === index && (
                                    <div className="faq-answer">
                                        <p>{faq.answer}</p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Payment Modal */}
            {showPayment && (
                <div className="payment-overlay" onClick={() => setShowPayment(false)}>
                    <div className="payment-modal" onClick={(e) => e.stopPropagation()}>
                        {/* Coming Soon Banner */}
                        <div className="coming-soon-banner">
                            <span>🚀 Coming Soon</span>
                        </div>

                        {/* Close button */}
                        <button className="modal-close" onClick={() => setShowPayment(false)}>
                            <X size={18} />
                        </button>

                        {/* Modal Header */}
                        <div className="modal-header">
                            <div className="modal-icon">
                                <CreditCard size={22} />
                            </div>
                            <h3>Payment Details</h3>
                            <p>Subscribe to {selectedPlan} plan</p>
                        </div>

                        {/* Card Form (visual only) */}
                        <div className="payment-form">
                            <div className="form-group">
                                <label>Card Number</label>
                                <div className="input-wrapper">
                                    <CreditCard size={16} className="input-icon" />
                                    <input
                                        type="text"
                                        placeholder="1234  5678  9012  3456"
                                        disabled
                                    />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Expiry Date</label>
                                    <input type="text" placeholder="MM / YY" disabled />
                                </div>
                                <div className="form-group">
                                    <label>CVC</label>
                                    <input type="text" placeholder="123" disabled />
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Cardholder Name</label>
                                <input type="text" placeholder="John Doe" disabled />
                            </div>

                            <button className="pay-btn" disabled>
                                <Lock size={14} />
                                Pay Now
                            </button>

                            <p className="secure-text">
                                <Lock size={12} />
                                Payments are secured with 256-bit encryption
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
