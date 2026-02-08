import React from "react";
import { featuresStyles } from "../assets/dummyStyles";

const FeatureCard = ({ title, desc, icon, delay = 0 }) => {
  return (
    <div
      className={featuresStyles.featureCard}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className={featuresStyles.featureCardGradient}></div>
      <div className={featuresStyles.featureCardBorder}></div>

      <div className={featuresStyles.featureCardContent}>
        <div className={featuresStyles.featureCardIconContainer}>
          {icon}
        </div>

        <div className={featuresStyles.featureCardTextContainer}>
          <h4 className={featuresStyles.featureCardTitle}>{title}</h4>
          <p className={featuresStyles.featureCardDescription}>{desc}</p>

          <div className={featuresStyles.featureCardCta}>
            <span className={featuresStyles.featureCardCtaText}>
              Learn more
            </span>
            <svg
              className={featuresStyles.featureCardCtaIcon}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

const Features = () => {
  const features = [
    {
      title: "AI Invoice Parsing",
      desc: "Paste freeform text and let AI extract client details and line items automatically.",
      icon: "🤖",
    },
    {
      title: "Smart Email Reminders",
      desc: "Generate professional reminder emails with AI.",
      icon: "📧",
    },
    {
      title: "Professional PDF Export",
      desc: "Export clean, branded PDF invoices instantly.",
      icon: "📄",
    },
  ];

  return (
    <section id="features" className={featuresStyles.section}>
      <div className={featuresStyles.container}>
        <div className={featuresStyles.headerContainer}>
          <div className={featuresStyles.badge}>
            <span className={featuresStyles.badgeDot}></span>
            <span className={featuresStyles.badgeText}>
              Powerful Features
            </span>
          </div>

          <h2 className={featuresStyles.title}>
            Built for{" "}
            <span className={featuresStyles.titleGradient}>
              Speed & Clarity
            </span>
          </h2>

          <p className={featuresStyles.subtitle}>
            Create, send, and track invoices effortlessly.
          </p>
        </div>

        {/* GRID */}
        <div className={featuresStyles.featuresGrid}>
          {features.map((feature, index) => (
            <FeatureCard
              key={feature.title}
              title={feature.title}
              desc={feature.desc}
              icon={feature.icon}
              delay={index * 100}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
