'use client';

import LandingNavbar from "@/components/LandingNavbar";
import Sidebar from "@/components/Sidebar";
import { useUser } from "@clerk/nextjs";
import React, { useState, useEffect } from "react";

const LandingPage = () => {
  const [isVisible, setIsVisible] = useState({});

  const user = useUser()

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(prev => ({
              ...prev,
              [entry.target.id]: true
            }));
          }
        });
      },
      { threshold: 0.1 }
    );

    const sections = document.querySelectorAll('[id]');
    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  const features = [
    {
      icon: "🤖",
      title: "AI-Powered Analysis",
      description: "Advanced AI understands context, extracts meaning, and provides intelligent responses to your queries."
    },
    {
      icon: "⚡",
      title: "Lightning Fast",
      description: "Get instant answers from documents of any size. No more manual searching through hundreds of pages."
    },
    {
      icon: "🔍",
      title: "Smart Search",
      description: "Semantic search that understands what you're looking for, even if the exact words aren't in the document."
    },
    {
      icon: "📊",
      title: "Data Extraction",
      description: "Automatically extract tables, charts, and structured data from your PDFs with perfect accuracy."
    },
    {
      icon: "📋",
      title: "Intelligent Summaries",
      description: "Generate executive summaries, key points, and actionable insights from lengthy documents."
    },
    {
      icon: "🔗",
      title: "Multi-Document",
      description: "Work with multiple PDFs simultaneously and find connections between different documents."
    }
  ];

  const steps = [
    {
      number: "01",
      title: "Upload Your PDF",
      description: "Simply drag and drop your PDF or browse to select. Supports files up to 100MB with OCR for scanned documents.",
      icon: "📄"
    },
    {
      number: "02",
      title: "AI Processing",
      description: "Our advanced AI analyzes your document structure, content, and context to understand everything inside.",
      icon: "🧠"
    },
    {
      number: "03",
      title: "Ask Anything",
      description: "Query your document in natural language. Ask questions, request summaries, or extract specific data.",
      icon: "💬"
    },
    {
      number: "04",
      title: "Get Insights",
      description: "Receive intelligent answers with page references, relevant excerpts, and actionable insights.",
      icon: "✨"
    }
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Research Director",
      company: "TechCorp Inc.",
      quote: "PDF Lens has revolutionized how our team processes research papers. What used to take hours now takes minutes.",
      rating: 5
    },
    {
      name: "Michael Rodriguez",
      role: "Legal Counsel",
      company: "Martinez & Associates",
      quote: "Incredible tool for contract analysis. It finds clauses and extracts key terms faster than any paralegal.",
      rating: 5
    },
    {
      name: "Dr. Emily Watson",
      role: "Academic Researcher",
      company: "Stanford University",
      quote: "The AI understands context better than I expected. It's like having a research assistant that never sleeps.",
      rating: 5
    }
  ];

  const pricingPlans = [
    {
      name: "Starter",
      price: "$29",
      period: "/month",
      description: "Perfect for individuals and small teams",
      features: [
        "10 PDF uploads per month",
        "Basic AI analysis",
        "Standard support",
        "Web dashboard access"
      ],
      popular: false
    },
    {
      name: "Professional",
      price: "$99",
      period: "/month",
      description: "Best for growing businesses and teams",
      features: [
        "Unlimited PDF uploads",
        "Advanced AI analysis",
        "Priority support",
        "API access",
        "Team collaboration",
        "Custom integrations"
      ],
      popular: true
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "",
      description: "Tailored solutions for large organizations",
      features: [
        "Everything in Professional",
        "On-premise deployment",
        "Custom AI training",
        "Dedicated support",
        "SLA guarantees",
        "Advanced security"
      ],
      popular: false
    }
  ];

  return (
    <div className="relative overflow-x-hidden mt-10">
      {/* Navbar */}
      <LandingNavbar />

      {user? <Sidebar/> : ""}

      {/* Hero Section */}
      <section
        id="hero"
        className="min-h-screen flex flex-col justify-center items-center text-center px-4 relative"
        style={{
          background: "linear-gradient(135deg, var(--primary, #3b82f6) 0%, var(--secondary, #8b5cf6) 100%)"
        }}
      >
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div
            className="absolute top-20 left-10 w-20 h-20 rounded-full opacity-20 animate-pulse"
            style={{ backgroundColor: "var(--surface, white)" }}
          ></div>
          <div
            className="absolute top-40 right-20 w-16 h-16 rounded-full opacity-20 animate-bounce"
            style={{ backgroundColor: "var(--surface, white)" }}
          ></div>
          <div
            className="absolute bottom-40 left-20 w-24 h-24 rounded-full opacity-20"
            style={{
              backgroundColor: "var(--surface, white)",
              animation: "float 6s ease-in-out infinite"
            }}
          ></div>
        </div>

        <div className="relative z-10 max-w-5xl mx-auto">
          <div className="mb-6">
            <span
              className="inline-block px-4 py-2 rounded-full text-sm font-medium"
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.2)",
                color: "var(--surface, white)"
              }}
            >
              🚀 Now with Advanced AI Analysis
            </span>
          </div>

          <h1
            className="text-6xl md:text-8xl font-bold mb-8 leading-tight"
            style={{ color: "var(--surface, white)" }}
          >
            Unlock Your PDFs with <span style={{ color: "var(--accent, #fbbf24)" }}>AI</span>
          </h1>

          <p
            className="text-xl md:text-2xl mb-12 max-w-3xl mx-auto leading-relaxed"
            style={{ color: "rgba(255, 255, 255, 0.9)" }}
          >
            Transform any PDF into an intelligent, searchable knowledge base. Ask questions, extract insights, and get instant answers powered by cutting-edge AI.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <button
              className="font-semibold px-8 py-4 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl text-lg"
              style={{
                backgroundColor: "var(--surface, white)",
                color: "var(--primary, #3b82f6)",
                boxShadow: "0 10px 30px rgba(0, 0, 0, 0.2)"
              }}
            >
              Start Free Trial
            </button>
            <button
              className="font-semibold px-8 py-4 rounded-xl transition-all duration-300 hover:scale-105 text-lg"
              style={{
                border: "2px solid rgba(255, 255, 255, 0.5)",
                color: "var(--surface, white)",
                backgroundColor: "rgba(255, 255, 255, 0.1)"
              }}
            >
              Watch Demo →
            </button>
          </div>

          <div className="mt-16 flex flex-wrap justify-center gap-8 text-center">
            <div>
              <div
                className="text-3xl font-bold"
                style={{ color: "var(--surface, white)" }}
              >
                50K+
              </div>
              <div
                className="text-sm"
                style={{ color: "rgba(255, 255, 255, 0.8)" }}
              >
                Documents Processed
              </div>
            </div>
            <div>
              <div
                className="text-3xl font-bold"
                style={{ color: "var(--surface, white)" }}
              >
                99.9%
              </div>
              <div
                className="text-sm"
                style={{ color: "rgba(255, 255, 255, 0.8)" }}
              >
                Accuracy Rate
              </div>
            </div>
            <div>
              <div
                className="text-3xl font-bold"
                style={{ color: "var(--surface, white)" }}
              >
                10K+
              </div>
              <div
                className="text-sm"
                style={{ color: "rgba(255, 255, 255, 0.8)" }}
              >
                Happy Users
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        id="features"
        className={`py-24 px-8 transition-all duration-1000 ${isVisible.features ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
        style={{ backgroundColor: "var(--background, #f9fafb)" }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2
              className="text-5xl md:text-6xl font-bold mb-6"
              style={{ color: "var(--text, #111827)" }}
            >
              Powerful Features
            </h2>
            <p
              className="text-xl max-w-3xl mx-auto"
              style={{ color: "var(--text-secondary, #6b7280)" }}
            >
              Everything you need to transform your PDFs into intelligent, searchable knowledge bases
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group p-8 rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                style={{
                  backgroundColor: "var(--surface, white)",
                  border: "1px solid var(--border, #e5e7eb)"
                }}
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3
                  className="text-2xl font-bold mb-4"
                  style={{ color: "var(--text, #111827)" }}
                >
                  {feature.title}
                </h3>
                <p
                  className="text-lg leading-relaxed"
                  style={{ color: "var(--text-secondary, #6b7280)" }}
                >
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section
        id="how-it-works"
        className={`py-24 px-8 transition-all duration-1000 ${isVisible['how-it-works'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
        style={{ backgroundColor: "var(--surface, white)" }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2
              className="text-5xl md:text-6xl font-bold mb-6"
              style={{ color: "var(--text, #111827)" }}
            >
              How It Works
            </h2>
            <p
              className="text-xl max-w-3xl mx-auto"
              style={{ color: "var(--text-secondary, #6b7280)" }}
            >
              Get started in minutes with our simple, powerful workflow
            </p>
          </div>

          <div className="space-y-16">
            {steps.map((step, index) => (
              <div
                key={index}
                className={`flex flex-col lg:flex-row items-center gap-12 ${index % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}
              >
                <div className="flex-1 text-center lg:text-left">
                  <div
                    className="text-6xl font-bold mb-4 opacity-20"
                    style={{ color: "var(--primary, #3b82f6)" }}
                  >
                    {step.number}
                  </div>
                  <h3
                    className="text-3xl font-bold mb-4"
                    style={{ color: "var(--text, #111827)" }}
                  >
                    {step.title}
                  </h3>
                  <p
                    className="text-lg leading-relaxed"
                    style={{ color: "var(--text-secondary, #6b7280)" }}
                  >
                    {step.description}
                  </p>
                </div>
                <div
                  className="flex-1 flex justify-center items-center text-8xl p-12 rounded-3xl"
                  style={{ backgroundColor: "var(--background, #f9fafb)" }}
                >
                  {step.icon}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section
        id="testimonials"
        className={`py-24 px-8 transition-all duration-1000 ${isVisible.testimonials ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
        style={{ backgroundColor: "var(--background, #f9fafb)" }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2
              className="text-5xl md:text-6xl font-bold mb-6"
              style={{ color: "var(--text, #111827)" }}
            >
              What Our Users Say
            </h2>
            <p
              className="text-xl max-w-3xl mx-auto"
              style={{ color: "var(--text-secondary, #6b7280)" }}
            >
              Join thousands of professionals who trust PDF Lens for their document analysis
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="p-8 rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-xl"
                style={{
                  backgroundColor: "var(--surface, white)",
                  border: "1px solid var(--border, #e5e7eb)"
                }}
              >
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i} className="text-2xl" style={{ color: "var(--accent, #fbbf24)" }}>★</span>
                  ))}
                </div>
                <p
                  className="text-lg mb-6 leading-relaxed italic"
                  style={{ color: "var(--text-secondary, #6b7280)" }}
                >
                  "{testimonial.quote}"
                </p>
                <div>
                  <div
                    className="font-bold text-lg"
                    style={{ color: "var(--text, #111827)" }}
                  >
                    {testimonial.name}
                  </div>
                  <div
                    className="text-sm"
                    style={{ color: "var(--text-secondary, #6b7280)" }}
                  >
                    {testimonial.role}, {testimonial.company}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section
        id="pricing"
        className={`py-24 px-8 transition-all duration-1000 ${isVisible.pricing ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
        style={{ backgroundColor: "var(--surface, white)" }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2
              className="text-5xl md:text-6xl font-bold mb-6"
              style={{ color: "var(--text, #111827)" }}
            >
              Simple Pricing
            </h2>
            <p
              className="text-xl max-w-3xl mx-auto"
              style={{ color: "var(--text-secondary, #6b7280)" }}
            >
              Choose the plan that fits your needs. Upgrade or downgrade at any time.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <div
                key={index}
                className={`relative p-8 rounded-2xl transition-all duration-300 hover:scale-105 ${plan.popular ? 'ring-4' : ''
                  }`}
                style={{
                  backgroundColor: "var(--surface, white)",
                  border: `2px solid ${plan.popular ? 'var(--primary, #3b82f6)' : 'var(--border, #e5e7eb)'}`,
                  ringColor: plan.popular ? 'var(--primary, #3b82f6)' : 'transparent'
                }}
              >
                {plan.popular && (
                  <div
                    className="absolute -top-4 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded-full text-sm font-bold"
                    style={{
                      backgroundColor: "var(--primary, #3b82f6)",
                      color: "var(--surface, white)"
                    }}
                  >
                    Most Popular
                  </div>
                )}

                <div className="text-center">
                  <h3
                    className="text-2xl font-bold mb-4"
                    style={{ color: "var(--text, #111827)" }}
                  >
                    {plan.name}
                  </h3>
                  <div className="mb-6">
                    <span
                      className="text-5xl font-bold"
                      style={{ color: "var(--primary, #3b82f6)" }}
                    >
                      {plan.price}
                    </span>
                    <span
                      className="text-lg"
                      style={{ color: "var(--text-secondary, #6b7280)" }}
                    >
                      {plan.period}
                    </span>
                  </div>
                  <p
                    className="text-lg mb-8"
                    style={{ color: "var(--text-secondary, #6b7280)" }}
                  >
                    {plan.description}
                  </p>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center gap-3">
                      <span
                        className="w-5 h-5 rounded-full flex items-center justify-center text-white text-sm"
                        style={{ backgroundColor: "var(--primary, #3b82f6)" }}
                      >
                        ✓
                      </span>
                      <span style={{ color: "var(--text-secondary, #6b7280)" }}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                <button
                  className={`w-full py-4 rounded-xl font-semibold transition-all duration-300 hover:scale-105 ${plan.popular ? 'hover:shadow-xl' : ''
                    }`}
                  style={{
                    backgroundColor: plan.popular ? "var(--primary, #3b82f6)" : "transparent",
                    color: plan.popular ? "var(--surface, white)" : "var(--primary, #3b82f6)",
                    border: `2px solid var(--primary, #3b82f6)`
                  }}
                >
                  {plan.name === 'Enterprise' ? 'Contact Sales' : 'Get Started'}
                </button>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <p style={{ color: "var(--text-secondary, #6b7280)" }}>
              All plans include 30-day money-back guarantee • No setup fees • Cancel anytime
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section
        id="contact"
        className={`py-24 px-8 text-center transition-all duration-1000 ${isVisible.contact ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
        style={{ backgroundColor: "var(--background, #f9fafb)" }}
      >
        <div className="max-w-4xl mx-auto">
          <h2
            className="text-5xl md:text-6xl font-bold mb-8"
            style={{ color: "var(--text, #111827)" }}
          >
            Ready to Get Started?
          </h2>
          <p
            className="text-xl mb-12"
            style={{ color: "var(--text-secondary, #6b7280)" }}
          >
            Join thousands of professionals who are already transforming their document workflows with AI.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12">
            <button
              className="font-semibold px-8 py-4 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-xl text-lg"
              style={{
                backgroundColor: "var(--primary, #3b82f6)",
                color: "var(--surface, white)"
              }}
            >
              Start Your Free Trial
            </button>
            <button
              className="font-semibold px-8 py-4 rounded-xl transition-all duration-300 hover:scale-105 text-lg"
              style={{
                border: `2px solid var(--primary, #3b82f6)`,
                color: "var(--primary, #3b82f6)",
                backgroundColor: "transparent"
              }}
            >
              Schedule a Demo
            </button>
          </div>

          <div
            className="text-lg"
            style={{ color: "var(--text-secondary, #6b7280)" }}
          >
            Questions? Email us at{" "}
            <a
              href="mailto:support@pdflens.com"
              className="transition-colors hover:underline"
              style={{ color: "var(--primary, #3b82f6)" }}
            >
              support@pdflens.com
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        className="py-12 px-8"
        style={{
          backgroundColor: "var(--surface, white)",
          borderTop: "1px solid var(--border, #e5e7eb)"
        }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div
                className="text-2xl font-bold mb-4"
                style={{ color: "var(--primary, #3b82f6)" }}
              >
                PDF Lens
              </div>
              <p style={{ color: "var(--text-secondary, #6b7280)" }}>
                Transform your PDFs with AI-powered analysis and instant insights.
              </p>
            </div>
            <div>
              <h4
                className="font-semibold mb-4"
                style={{ color: "var(--text, #111827)" }}
              >
                Product
              </h4>
              <ul className="space-y-2">
                <li><a href="#features" style={{ color: "var(--text-secondary, #6b7280)" }}>Features</a></li>
                <li><a href="#pricing" style={{ color: "var(--text-secondary, #6b7280)" }}>Pricing</a></li>
                <li><a href="#" style={{ color: "var(--text-secondary, #6b7280)" }}>API</a></li>
                <li><a href="#" style={{ color: "var(--text-secondary, #6b7280)" }}>Integrations</a></li>
              </ul>
            </div>
            <div>
              <h4
                className="font-semibold mb-4"
                style={{ color: "var(--text, #111827)" }}
              >
                Company
              </h4>
              <ul className="space-y-2">
                <li><a href="#" style={{ color: "var(--text-secondary, #6b7280)" }}>About</a></li>
                <li><a href="#" style={{ color: "var(--text-secondary, #6b7280)" }}>Blog</a></li>
                <li><a href="#" style={{ color: "var(--text-secondary, #6b7280)" }}>Careers</a></li>
                <li><a href="#contact" style={{ color: "var(--text-secondary, #6b7280)" }}>Contact</a></li>
              </ul>
            </div>
            <div>
              <h4
                className="font-semibold mb-4"
                style={{ color: "var(--text, #111827)" }}
              >
                Support
              </h4>
              <ul className="space-y-2">
                <li><a href="#" style={{ color: "var(--text-secondary, #6b7280)" }}>Help Center</a></li>
                <li><a href="#" style={{ color: "var(--text-secondary, #6b7280)" }}>Privacy Policy</a></li>
                <li><a href="#" style={{ color: "var(--text-secondary, #6b7280)" }}>Terms of Service</a></li>
                <li><a href="#" style={{ color: "var(--text-secondary, #6b7280)" }}>Status</a></li>
              </ul>
            </div>
          </div>
          <div
            className="text-center pt-8 border-t"
            style={{
              borderColor: "var(--border, #e5e7eb)",
              color: "var(--text-secondary, #6b7280)"
            }}
          >
            © 2025 PDF Lens. All rights reserved.
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
      `}</style>
    </div>
  );
};

export default LandingPage;