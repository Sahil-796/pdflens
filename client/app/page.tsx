'use client';

import React, { useEffect, useState } from "react";
import Navbar from '@/components/bars/LandingNavbar'
import { motion, useScroll, useTransform } from "framer-motion";
import {
  Sparkles,
  Zap,
  Database,
  Upload,
  MessageSquare,
  Lightbulb,
  ArrowRight,
  Check,
  ChevronRight
} from "lucide-react";
import Link from "next/link";

const LandingPage = () => {
  const [, setIsScrolled] = useState(false);
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const features = [
    {
      icon: Sparkles,
      title: "AI-Powered Generation",
      description: "Create professional documents in seconds with advanced AI that understands context and formatting."
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Instant processing and generation. No waiting, no delays - your documents ready when you are."
    },
    {
      icon: Database,
      title: "Smart Data Extraction",
      description: "Automatically extract and structure data from any document with precision and accuracy."
    },
  ];

  const steps = [
    {
      icon: Upload,
      title: "Upload or Create",
      description: "Start from scratch or upload reference documents for better context and accuracy."
    },
    {
      icon: MessageSquare,
      title: "Describe Your Needs",
      description: "Use natural language to tell AI exactly what you want. Be specific or keep it simple."
    },
    {
      icon: Lightbulb,
      title: "Get Results Instantly",
      description: "Receive professionally formatted documents with all the details, ready to use or edit."
    },
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Research Director",
      company: "TechCorp Inc.",
      quote: "Zendra has transformed how our team processes research papers. We're saving hours every single week.",
      rating: 5,
      avatar: "SC"
    },
    {
      name: "Michael Rodriguez",
      role: "Legal Counsel",
      company: "Martinez & Associates",
      quote: "Incredible for contract analysis. It finds clauses and key terms instantly. A game-changer for legal work.",
      rating: 5,
      avatar: "MR"
    },
    {
      name: "Emily Watson",
      role: "Product Manager",
      company: "StartupHub",
      quote: "The AI understands exactly what we need. Creating proposals and reports is now effortless.",
      rating: 5,
      avatar: "EW"
    },
  ];

  const plans = [
    {
      name: "Starter",
      price: "29",
      description: "Perfect for individuals getting started",
      features: [
        "10 PDF uploads per month",
        "Basic AI analysis",
        "Standard support",
        "Document templates"
      ]
    },
    {
      name: "Professional",
      price: "99",
      description: "For teams and growing businesses",
      features: [
        "Unlimited PDF uploads",
        "Advanced AI analysis",
        "Priority support",
        "Collaboration tools",
        "Custom templates",
        "API access"
      ],
      popular: true
    },
  ];

  return (
    <div className="bg-background">

      <Navbar />

      {/* Hero Section */}
    </div>
  );
};

export default LandingPage;
