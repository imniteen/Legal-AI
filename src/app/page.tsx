"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Scale,
  Upload,
  ArrowRight,
  CheckCircle,
  Shield,
  Zap,
  FileText,
  Users,
  BarChart3,
  Lock,
  Globe,
  Clock,
  ChevronDown,
  ChevronUp,
  Mail,
  Star,
  Sparkles,
  Brain,
  Target,
  BookOpen,
} from "lucide-react";

export default function LandingPage() {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubscribed(true);
      setEmail("");
    }
  };

  const features = [
    {
      icon: Scale,
      title: "Dual-Lens Analysis",
      description:
        "Evaluate cases from both prosecution and defense perspectives simultaneously. Get comprehensive insights that cover all angles of your legal strategy.",
      color: "from-blue-500 to-indigo-600",
    },
    {
      icon: FileText,
      title: "Citation Compliance",
      description:
        "Every claim is backed by specific page citations from your documents. Trust in evidence-based analysis with complete traceability.",
      color: "from-emerald-500 to-teal-600",
    },
    {
      icon: Brain,
      title: "Zero Hallucination AI",
      description:
        "Our AI only references facts present in your documents. Nothing invented, nothing assumed. Pure, reliable legal analysis.",
      color: "from-purple-500 to-pink-600",
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description:
        "Analyze complex case files in minutes, not hours. Our optimized AI engine processes documents with exceptional speed.",
      color: "from-amber-500 to-orange-600",
    },
    {
      icon: Lock,
      title: "Bank-Level Security",
      description:
        "Your documents are encrypted at rest and in transit. We never store or train on your sensitive legal data.",
      color: "from-red-500 to-rose-600",
    },
    {
      icon: Target,
      title: "Precision Insights",
      description:
        "Get actionable recommendations and identify key strengths, weaknesses, and strategic opportunities in every case.",
      color: "from-cyan-500 to-blue-600",
    },
  ];

  const pricingPlans = [
    {
      name: "Starter",
      price: "49",
      period: "month",
      description: "Perfect for solo practitioners and small cases",
      features: [
        "10 case analyses per month",
        "Up to 100 pages per document",
        "Basic prosecution & defense views",
        "Email support",
        "7-day document retention",
      ],
      cta: "Start Free Trial",
      popular: false,
    },
    {
      name: "Professional",
      price: "149",
      period: "month",
      description: "Ideal for growing law firms and legal teams",
      features: [
        "50 case analyses per month",
        "Up to 500 pages per document",
        "Advanced dual-lens analysis",
        "Priority support",
        "30-day document retention",
        "Team collaboration (5 users)",
        "Custom report templates",
        "API access",
      ],
      cta: "Start Free Trial",
      popular: true,
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "",
      description: "For large firms and organizations with custom needs",
      features: [
        "Unlimited case analyses",
        "Unlimited document pages",
        "White-label solutions",
        "Dedicated account manager",
        "Custom integrations",
        "On-premise deployment option",
        "SLA guarantee",
        "Custom AI training",
      ],
      cta: "Contact Sales",
      popular: false,
    },
  ];

  const faqs = [
    {
      question: "How does JurisAI ensure accuracy in legal analysis?",
      answer:
        "JurisAI uses advanced AI models specifically trained for legal document analysis. Every insight is directly tied to citations from your uploaded documents, ensuring zero hallucinations. Our dual-lens approach provides both prosecution and defense perspectives, giving you a comprehensive view of any case.",
    },
    {
      question: "Is my legal data secure with JurisAI?",
      answer:
        "Absolutely. We employ bank-level encryption for all data at rest and in transit. Your documents are never used to train our AI models, and you maintain full ownership of your data. We're SOC 2 Type II compliant and regularly undergo third-party security audits.",
    },
    {
      question: "What types of legal documents can JurisAI analyze?",
      answer:
        "JurisAI can analyze a wide range of legal documents including case files, contracts, depositions, court filings, legal briefs, and more. We support PDF, DOCX, and plain text formats. Our AI is optimized for litigation, corporate law, and regulatory compliance documents.",
    },
    {
      question: "Can I integrate JurisAI with my existing legal software?",
      answer:
        "Yes! Our Professional and Enterprise plans include API access that allows integration with popular legal practice management systems, document management platforms, and other legal tech tools. We also offer custom integration support for Enterprise customers.",
    },
    {
      question: "How long does it take to analyze a case?",
      answer:
        "Most case analyses are completed within 2-5 minutes, depending on document complexity and length. Our optimized AI engine processes documents efficiently while maintaining accuracy. You'll receive real-time progress updates during analysis.",
    },
    {
      question: "Do you offer a free trial?",
      answer:
        "Yes! All plans come with a 14-day free trial with no credit card required. You can analyze up to 5 cases during the trial period to experience the full power of JurisAI's dual-lens analysis capabilities.",
    },
  ];

  const stats = [
    { value: "50K+", label: "Cases Analyzed" },
    { value: "2,000+", label: "Law Firms" },
    { value: "99.7%", label: "Accuracy Rate" },
    { value: "4.9/5", label: "User Rating" },
  ];

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-slate-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--primary)] to-[var(--primary-dark)] shadow-lg shadow-blue-500/25">
                <Scale className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-[var(--primary)] to-[var(--primary-dark)] bg-clip-text text-transparent">
                JurisAI
              </span>
            </Link>

            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-slate-600 hover:text-slate-900 transition-colors text-sm font-medium">
                Features
              </a>
              <a href="#pricing" className="text-slate-600 hover:text-slate-900 transition-colors text-sm font-medium">
                Pricing
              </a>
              <a href="#faq" className="text-slate-600 hover:text-slate-900 transition-colors text-sm font-medium">
                FAQ
              </a>
            </div>

            <div className="flex items-center gap-4">
              <Link
                href="/dashboard"
                className="hidden sm:flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
              >
                Dashboard
              </Link>
              <Link
                href="/dashboard"
                className="flex items-center gap-2 bg-gradient-to-r from-[var(--primary)] to-[var(--primary-dark)] text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:shadow-lg hover:shadow-blue-500/25 transition-all hover:-translate-y-0.5"
              >
                Get Started
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50/50 to-indigo-50/30" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-gradient-to-tl from-emerald-400/10 to-cyan-400/10 rounded-full blur-3xl" />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-full px-4 py-2 mb-8 shadow-sm">
              <Sparkles className="h-4 w-4 text-amber-500" />
              <span className="text-sm font-medium text-slate-700">AI-Powered Legal Intelligence</span>
            </div>

            {/* Headline */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-slate-900 mb-6 leading-tight">
              Legal Analysis
              <span className="block bg-gradient-to-r from-[var(--primary)] via-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Reimagined with AI
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
              Analyze cases from both prosecution and defense perspectives in minutes.
              Get citation-backed insights with zero hallucinations.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
              <Link
                href="/dashboard"
                className="group flex items-center gap-3 bg-gradient-to-r from-[var(--primary)] to-[var(--primary-dark)] text-white px-8 py-4 rounded-full text-lg font-semibold hover:shadow-xl hover:shadow-blue-500/25 transition-all hover:-translate-y-1"
              >
                <Upload className="h-5 w-5" />
                Start Analyzing Free
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <a
                href="#features"
                className="flex items-center gap-2 text-slate-600 hover:text-slate-900 px-6 py-4 text-lg font-medium transition-colors"
              >
                <BookOpen className="h-5 w-5" />
                Learn More
              </a>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-[var(--primary)] to-indigo-600 bg-clip-text text-transparent mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-slate-500">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Hero Image / Demo */}
          <div className="mt-20 max-w-5xl mx-auto">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-slate-900/10 border border-slate-200 bg-white">
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/5 via-transparent to-purple-500/5" />
              <div className="p-8">
                {/* Mock Dashboard Preview */}
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-400" />
                    <div className="w-3 h-3 rounded-full bg-amber-400" />
                    <div className="w-3 h-3 rounded-full bg-emerald-400" />
                  </div>
                  <div className="flex-1 h-8 bg-slate-100 rounded-lg" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Prosecution Side */}
                  <div className="p-6 rounded-xl bg-gradient-to-br from-red-50 to-rose-50 border border-red-100">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-8 h-8 rounded-lg bg-red-500 flex items-center justify-center">
                        <Target className="h-4 w-4 text-white" />
                      </div>
                      <span className="font-semibold text-red-900">Prosecution Analysis</span>
                    </div>
                    <div className="space-y-2">
                      <div className="h-3 bg-red-200/50 rounded w-full" />
                      <div className="h-3 bg-red-200/50 rounded w-4/5" />
                      <div className="h-3 bg-red-200/50 rounded w-3/4" />
                    </div>
                    <div className="flex gap-2 mt-4">
                      <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-md font-medium">pg. 12</span>
                      <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-md font-medium">pg. 45</span>
                    </div>
                  </div>

                  {/* Defense Side */}
                  <div className="p-6 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center">
                        <Shield className="h-4 w-4 text-white" />
                      </div>
                      <span className="font-semibold text-blue-900">Defense Analysis</span>
                    </div>
                    <div className="space-y-2">
                      <div className="h-3 bg-blue-200/50 rounded w-full" />
                      <div className="h-3 bg-blue-200/50 rounded w-5/6" />
                      <div className="h-3 bg-blue-200/50 rounded w-2/3" />
                    </div>
                    <div className="flex gap-2 mt-4">
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-md font-medium">pg. 23</span>
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-md font-medium">pg. 67</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trusted By Section */}
      <section className="py-16 border-y border-slate-100 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-slate-500 mb-8 font-medium">TRUSTED BY LEADING LAW FIRMS</p>
          <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-8 opacity-50">
            {["Baker & Partners", "LegalTech Corp", "Justice Associates", "Summit Law Group", "Pinnacle Legal"].map((name, i) => (
              <div key={i} className="text-xl font-semibold text-slate-400">
                {name}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-full px-4 py-2 mb-6">
              <Zap className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-700">Powerful Features</span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-6">
              Everything You Need for
              <span className="block text-[var(--primary)]">Legal Excellence</span>
            </h2>
            <p className="text-xl text-slate-600">
              Our AI-powered platform provides comprehensive tools to analyze, understand,
              and strategize for any legal case.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group p-8 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 hover:shadow-xl transition-all duration-300"
              >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  <feature.icon className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 bg-gradient-to-b from-slate-50 to-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-6">
              How It Works
            </h2>
            <p className="text-xl text-slate-600">
              Get comprehensive legal insights in three simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                step: "01",
                title: "Upload Your Case",
                description: "Simply drag and drop your legal documents. We support PDF, DOCX, and more.",
                icon: Upload,
              },
              {
                step: "02",
                title: "AI Analysis",
                description: "Our advanced AI analyzes your case from both prosecution and defense angles.",
                icon: Brain,
              },
              {
                step: "03",
                title: "Get Insights",
                description: "Receive detailed, citation-backed analysis with actionable recommendations.",
                icon: BarChart3,
              },
            ].map((item, index) => (
              <div key={index} className="relative text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-[var(--primary)] to-indigo-600 text-white text-2xl font-bold mb-6 shadow-lg shadow-blue-500/25">
                  {item.step}
                </div>
                {index < 2 && (
                  <div className="hidden md:block absolute top-10 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-[var(--primary)]/20 to-indigo-600/20" />
                )}
                <h3 className="text-xl font-bold text-slate-900 mb-3">{item.title}</h3>
                <p className="text-slate-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-100 rounded-full px-4 py-2 mb-6">
              <Star className="h-4 w-4 text-emerald-600" />
              <span className="text-sm font-medium text-emerald-700">Simple Pricing</span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-6">
              Plans for Every Practice
            </h2>
            <p className="text-xl text-slate-600">
              Start free, scale as you grow. No hidden fees, cancel anytime.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <div
                key={index}
                className={`relative p-8 rounded-2xl border-2 transition-all duration-300 ${
                  plan.popular
                    ? "border-[var(--primary)] bg-gradient-to-b from-blue-50/50 to-white shadow-xl scale-105"
                    : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-lg"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[var(--primary)] to-indigo-600 text-white text-sm font-semibold px-4 py-1 rounded-full">
                    Most Popular
                  </div>
                )}

                <div className="text-center mb-8">
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{plan.name}</h3>
                  <p className="text-slate-500 text-sm mb-4">{plan.description}</p>
                  <div className="flex items-baseline justify-center gap-1">
                    {plan.price !== "Custom" && <span className="text-2xl text-slate-500">$</span>}
                    <span className="text-5xl font-bold text-slate-900">{plan.price}</span>
                    {plan.period && <span className="text-slate-500">/{plan.period}</span>}
                  </div>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                      <span className="text-slate-600">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  className={`w-full py-3 px-6 rounded-xl font-semibold transition-all ${
                    plan.popular
                      ? "bg-gradient-to-r from-[var(--primary)] to-[var(--primary-dark)] text-white hover:shadow-lg hover:shadow-blue-500/25"
                      : "bg-slate-100 text-slate-900 hover:bg-slate-200"
                  }`}
                >
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-gradient-to-b from-slate-50 to-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-6">
              Loved by Legal Professionals
            </h2>
            <p className="text-xl text-slate-600">
              See what attorneys and legal teams are saying about JurisAI
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                quote: "JurisAI has transformed how we approach case preparation. The dual-lens analysis gives us insights we would have missed otherwise.",
                author: "Sarah Mitchell",
                role: "Senior Partner, Mitchell & Associates",
              },
              {
                quote: "The citation compliance feature is a game-changer. Every claim is backed by evidence, which gives us confidence in our strategy.",
                author: "David Chen",
                role: "Criminal Defense Attorney",
              },
              {
                quote: "We've cut our case analysis time by 70%. The AI is incredibly accurate and the interface is intuitive.",
                author: "Amanda Rodriguez",
                role: "Legal Operations Director",
              },
            ].map((testimonial, index) => (
              <div key={index} className="p-8 rounded-2xl bg-white border border-slate-200 shadow-sm">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-slate-600 mb-6 leading-relaxed">&ldquo;{testimonial.quote}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center">
                    <Users className="h-6 w-6 text-slate-500" />
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900">{testimonial.author}</div>
                    <div className="text-sm text-slate-500">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 bg-purple-50 border border-purple-100 rounded-full px-4 py-2 mb-6">
              <Globe className="h-4 w-4 text-purple-600" />
              <span className="text-sm font-medium text-purple-700">FAQ</span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-6">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-slate-600">
              Everything you need to know about JurisAI
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            {faqs.map((faq, index) => (
              <div key={index} className="border-b border-slate-200 last:border-0">
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full py-6 flex items-center justify-between text-left"
                >
                  <span className="text-lg font-semibold text-slate-900 pr-8">{faq.question}</span>
                  {openFaq === index ? (
                    <ChevronUp className="h-5 w-5 text-slate-500 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-slate-500 flex-shrink-0" />
                  )}
                </button>
                {openFaq === index && (
                  <div className="pb-6 text-slate-600 leading-relaxed">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-24 bg-gradient-to-br from-[var(--primary)] via-blue-700 to-indigo-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-6">
              <Mail className="h-4 w-4 text-white" />
              <span className="text-sm font-medium text-white">Stay Updated</span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
              Join Our Newsletter
            </h2>
            <p className="text-xl text-blue-100 mb-10">
              Get the latest updates on AI in legal tech, product features, and exclusive insights
              delivered to your inbox.
            </p>

            {isSubscribed ? (
              <div className="flex items-center justify-center gap-3 bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                <CheckCircle className="h-8 w-8 text-emerald-400" />
                <span className="text-xl font-semibold text-white">Thanks for subscribing!</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto">
                <div className="relative flex-1">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    className="w-full pl-12 pr-4 py-4 rounded-xl bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-white/25 transition-all"
                  />
                </div>
                <button
                  type="submit"
                  className="flex items-center justify-center gap-2 bg-white text-[var(--primary)] px-8 py-4 rounded-xl font-semibold hover:bg-blue-50 transition-colors"
                >
                  Subscribe
                  <ArrowRight className="h-5 w-5" />
                </button>
              </form>
            )}

            <p className="mt-4 text-sm text-blue-200">
              No spam, unsubscribe at any time. We respect your privacy.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 bg-slate-900 text-slate-400">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div className="col-span-2 md:col-span-1">
              <Link href="/" className="flex items-center gap-3 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--primary)] to-indigo-600">
                  <Scale className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold text-white">JurisAI</span>
              </Link>
              <p className="text-sm leading-relaxed">
                AI-powered legal analysis platform providing dual-lens prosecution and defense insights.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Product</h4>
              <ul className="space-y-3 text-sm">
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#pricing" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Integrations</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-3 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Legal</h4>
              <ul className="space-y-3 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Cookies</a></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm">&copy; 2024 JurisAI. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <a href="#" className="hover:text-white transition-colors">
                <Clock className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-white transition-colors">
                <Globe className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-white transition-colors">
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
