import React, { useState } from "react";
import { pricingStyles, pricingCardStyles } from "../assets/dummyStyles";
import { useAuth, useClerk, SignedIn, SignedOut } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";

const PricingCard = ({
  title,
  price,
  period,
  description,
  features = [],
  isPopular = false,
  isAnnual = false,
  delay = 0,
  onCtaClick,
}) => (
  <div
    className={`${pricingCardStyles.card} ${
      isPopular
        ? pricingCardStyles.cardPopular
        : pricingCardStyles.cardRegular
    }`}
    style={{ transitionDelay: `${delay}ms` }}
  >
    {isPopular && (
      <div className={pricingCardStyles.popularBadge}>
        <div className={pricingCardStyles.popularBadgeContent}>
          Most Popular
        </div>
      </div>
    )}

    <div className={pricingCardStyles.content}>
      <div className={pricingCardStyles.header}>
        <h3
          className={`${pricingCardStyles.title} ${
            isPopular
              ? pricingCardStyles.titlePopular
              : pricingCardStyles.titleRegular
          }`}
        >
          {title}
        </h3>
        <p className={pricingCardStyles.description}>{description}</p>
      </div>

      <div className={pricingCardStyles.priceContainer}>
        <div className={pricingCardStyles.priceWrapper}>
          <span
            className={`${pricingCardStyles.price} ${
              isPopular
                ? pricingCardStyles.pricePopular
                : pricingCardStyles.priceRegular
            }`}
          >
            {price}
          </span>
          {period && (
            <span className={pricingCardStyles.period}>/{period}</span>
          )}
        </div>

        {isAnnual && (
          <span className={pricingCardStyles.annualBadge}>
            Save 20% annually
          </span>
        )}
      </div>

      <ul className={pricingCardStyles.featuresList}>
        {features.map((feature, index) => (
          <li key={index} className={pricingCardStyles.featureItem}>
            <div
              className={`${pricingCardStyles.featureIcon} ${
                isPopular
                  ? pricingCardStyles.featureIconPopular
                  : pricingCardStyles.featureIconRegular
              }`}
            >
              ✓
            </div>
            <span className={pricingCardStyles.featureText}>
              {feature}
            </span>
          </li>
        ))}
      </ul>

      {/* CTA */}
      <div style={{ marginTop: 12 }}>
        <SignedIn>
          <button
            onClick={() => onCtaClick({ title })}
            className={`${pricingCardStyles.ctaButton} ${
              isPopular
                ? pricingCardStyles.ctaButtonPopular
                : pricingCardStyles.ctaButtonRegular
            }`}
          >
            {isPopular ? "Get Started" : "Choose Plan"}
          </button>
        </SignedIn>

        <SignedOut>
          <button
            onClick={() => onCtaClick({ title }, { openSignInFallback: true })}
            className={`${pricingCardStyles.ctaButton} ${pricingCardStyles.ctaButtonRegular}`}
          >
            Sign in to get started
          </button>
        </SignedOut>
      </div>
    </div>
  </div>
);

const Pricing = () => {
  const [billingPeriod, setBillingPeriod] = useState("monthly");
  const clerk = useClerk();
  const { isSignedIn } = useAuth();
  const navigate = useNavigate();

  const plans = {
    monthly: [
      {
        title: "Starter",
        price: "₹0",
        period: "month",
        description: "Perfect for freelancers",
        features: ["5 invoices", "Basic AI parsing", "PDF export"],
      },
      {
        title: "Professional",
        price: "₹499",
        period: "month",
        description: "Best for businesses",
        features: [
          "Unlimited invoices",
          "Advanced AI parsing",
          "Analytics",
        ],
        isPopular: true,
      },
      {
        title: "Enterprise",
        price: "₹1499",
        period: "month",
        description: "For large teams",
        features: ["Everything included", "Priority support"],
      },
    ],
    annual: [
      {
        title: "Starter",
        price: "₹0",
        period: "month",
        description: "Perfect for freelancers",
        features: ["5 invoices", "Basic AI parsing", "PDF export"],
      },
      {
        title: "Professional",
        price: "₹399",
        period: "month",
        description: "Best for businesses",
        features: [
          "Unlimited invoices",
          "Advanced AI parsing",
          "Analytics",
        ],
        isPopular: true,
        isAnnual: true,
      },
      {
        title: "Enterprise",
        price: "₹1199",
        period: "month",
        description: "For large teams",
        features: ["Everything included", "Priority support"],
        isAnnual: true,
      },
    ],
  };

  const currentPlans = plans[billingPeriod];

  function handleCtaClick(planMeta, flags = {}) {
    if (flags.openSignInFallback || !isSignedIn) {
      clerk.openSignIn({ redirectUrl: "/app/create-invoice" });
      return;
    }

    navigate("/app/create-invoice");
  }

  return (
    <section id="pricing" className={pricingStyles.section}>
      <div className={pricingStyles.container}>
        <div className={pricingStyles.headerContainer}>
          <h2 className={pricingStyles.title}>
            Simple <span className={pricingStyles.titleGradient}>Pricing</span>
          </h2>

          {/* BILLING TOGGLE */}
          <div className={pricingStyles.billingToggle}>
            <button
              onClick={() => setBillingPeriod("monthly")}
              className={`${pricingStyles.billingButton} ${
                billingPeriod === "monthly"
                  ? pricingStyles.billingButtonActive
                  : pricingStyles.billingButtonInactive
              }`}
            >
              Monthly
            </button>

            <button
              onClick={() => setBillingPeriod("annual")}
              className={`${pricingStyles.billingButton} ${
                billingPeriod === "annual"
                  ? pricingStyles.billingButtonActive
                  : pricingStyles.billingButtonInactive
              }`}
            >
              Annual
              <span className={pricingStyles.billingBadge}>
                Save 20%
              </span>
            </button>
          </div>
        </div>

        {/* PRICING GRID */}
        <div className={pricingStyles.grid}>
          {currentPlans.map((plan, index) => (
            <PricingCard
              key={plan.title}
              {...plan}
              delay={index * 100}
              onCtaClick={handleCtaClick}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
