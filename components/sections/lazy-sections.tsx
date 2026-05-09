"use client";

import React from "react";

export const LazyHeaderSection = React.lazy(() =>
  import("./HeaderSection").then((m) => ({ default: m.HeaderSection })),
);
export const LazyHeroSection = React.lazy(() =>
  import("./HeroSection").then((m) => ({ default: m.HeroSection })),
);
export const LazyServicesSection = React.lazy(() =>
  import("./ServicesSection").then((m) => ({ default: m.ServicesSection })),
);
export const LazyFeaturesSection = React.lazy(() =>
  import("./FeaturesSection").then((m) => ({ default: m.FeaturesSection })),
);
export const LazyCTASection = React.lazy(() =>
  import("./CTASection").then((m) => ({ default: m.CTASection })),
);
export const LazyFAQSection = React.lazy(() =>
  import("./FAQSection").then((m) => ({ default: m.FAQSection })),
);
export const LazyFooterSection = React.lazy(() =>
  import("./FooterSection").then((m) => ({ default: m.FooterSection })),
);
export const LazyTextSection = React.lazy(() =>
  import("./TextSection").then((m) => ({ default: m.TextSection })),
);
export const LazyContactSection = React.lazy(() =>
  import("./ContactSection").then((m) => ({ default: m.ContactSection })),
);
export const LazyGallerySection = React.lazy(() =>
  import("./GallerySection").then((m) => ({ default: m.GallerySection })),
);
export const LazyTestimonialsSection = React.lazy(() =>
  import("./TestimonialsSection").then((m) => ({ default: m.TestimonialsSection })),
);
