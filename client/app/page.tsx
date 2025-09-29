'use client';

import Navbar from "@/components/bars/LandingNavbar";
import React from "react";

type Feature = {
  icon: string;
  title: string;
  description: string;
};

type Step = {
  number: string;
  title: string;
  description: string;
  icon: string;
};

type Testimonial = {
  name: string;
  role: string;
  company: string;
  quote: string;
  rating: number;
};

type PricingPlan = {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  popular?: boolean;
};

const LandingPage: React.FC = () => {
  const features: Feature[] = [
    { icon: "🤖", title: "AI-Powered Analysis", description: "Extracts meaning, context, and answers your questions with accuracy." },
    { icon: "⚡", title: "Lightning Fast", description: "Instant responses from documents of any size — no manual searching." },
    { icon: "📊", title: "Data Extraction", description: "Automatically extract tables, charts, and structured data with precision." },
  ];

  const steps: Step[] = [
    { number: "01", title: "Upload Your PDF", description: "Drag and drop your file, up to 100MB with OCR support.", icon: "📄" },
    { number: "02", title: "Ask Anything", description: "Query your document in natural language and get clear answers.", icon: "💬" },
    { number: "03", title: "Get Insights", description: "Receive summaries, page references, and actionable insights instantly.", icon: "✨" },
  ];

  const testimonials: Testimonial[] = [
    { name: "Sarah Chen", role: "Research Director", company: "TechCorp Inc.", quote: "PDF Lens has transformed how our team processes research papers. Hours saved every week.", rating: 5 },
    { name: "Michael Rodriguez", role: "Legal Counsel", company: "Martinez & Associates", quote: "Incredible for contract analysis. Finds clauses and key terms instantly.", rating: 5 },
  ];

  const pricingPlans: PricingPlan[] = [
    { name: "Starter", price: "$29", period: "/month", description: "Perfect for individuals", features: ["10 PDF uploads", "Basic AI analysis", "Standard support"] },
    { name: "Professional", price: "$99", period: "/month", description: "For teams and businesses", features: ["Unlimited uploads", "Advanced AI analysis", "Priority support", "Collaboration tools"], popular: true },
  ];

  return (
    <>
    <Navbar />
      {/* Hero */}
      <section className="min-h-screen flex flex-col justify-center items-center text-center px-6 bg-gradient-to-r from-primary to-accent text-primary-foreground">
        <h1 className="text-5xl md:text-7xl font-bold mb-6">
          Unlock Your PDFs with AI
        </h1>
        <p className="text-lg md:text-xl mb-8 max-w-2xl text-muted-foreground">
          Transform PDFs into searchable, intelligent knowledge bases. Ask
          questions, extract data, and get instant insights.
        </p>
        <div className="flex gap-4">
          <button className="px-6 py-3 rounded-lg font-semibold bg-background text-primary hover:shadow-md border border-border">
            Start Free Trial
          </button>
          <button className="px-6 py-3 rounded-lg font-semibold border border-border bg-transparent text-background hover:bg-background hover:text-primary">
            Watch Demo →
          </button>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-6 bg-muted">
        <div className="max-w-6xl mx-auto text-center mb-12">
          <h2 className="text-4xl font-bold text-foreground">Powerful Features</h2>
          <p className="text-muted-foreground mt-2">
            Everything you need to make your PDFs intelligent
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="p-6 rounded-xl bg-background border border-border shadow hover:shadow-lg transition"
            >
              <div className="text-3xl mb-3">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2 text-foreground">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Steps */}
      <section id="step" className="py-20 px-6 bg-background text-foreground">
        <div className="max-w-6xl mx-auto text-center mb-12">
          <h2 className="text-4xl font-bold">How It Works</h2>
        </div>
        <div className="space-y-12 max-w-4xl mx-auto">
          {steps.map((step, idx) => (
            <div key={idx} className="flex flex-col md:flex-row items-center gap-6">
              <div className="text-5xl">{step.icon}</div>
              <div>
                <h3 className="text-2xl font-semibold mb-2">
                  {step.number}. {step.title}
                </h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-6 bg-muted">
        <div className="max-w-6xl mx-auto text-center mb-12">
          <h2 className="text-4xl font-bold text-foreground">What Our Users Say</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {testimonials.map((t, idx) => (
            <div key={idx} className="p-6 rounded-xl bg-background border border-border shadow">
              <p className="italic mb-4 text-muted-foreground">{t.quote}</p>
              <div className="font-semibold text-foreground">
                {t.name} - {t.role}, {t.company}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-6 bg-background">
        <div className="max-w-6xl mx-auto text-center mb-12">
          <h2 className="text-4xl font-bold text-foreground">Simple Pricing</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {pricingPlans.map((plan, idx) => (
            <div
              key={idx}
              className={`p-8 rounded-xl border shadow hover:shadow-lg transition ${plan.popular ? "border-primary" : "border-border"
                } bg-background`}
            >
              {plan.popular && (
                <span className="text-sm px-3 py-1 bg-primary text-primary-foreground rounded-full">
                  Most Popular
                </span>
              )}
              <h3 className="text-2xl font-bold mt-2">{plan.name}</h3>
              <div className="text-4xl font-bold text-primary my-4">
                {plan.price}
                <span className="text-lg font-normal text-muted-foreground">{plan.period}</span>
              </div>
              <p className="mb-6 text-muted-foreground">{plan.description}</p>
              <ul className="space-y-2 mb-6 text-foreground">
                {plan.features.map((f, i) => (
                  <li key={i}>✓ {f}</li>
                ))}
              </ul>
              <button className="w-full py-3 rounded-lg font-semibold bg-primary text-primary-foreground hover:shadow-md">
                {plan.name === "Enterprise" ? "Contact Sales" : "Get Started"}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 bg-muted text-center text-muted-foreground border-t border-border">
        © {new Date().getFullYear()} PDF Lens. All rights reserved.
      </footer>
    </>
  );
};

export default LandingPage;