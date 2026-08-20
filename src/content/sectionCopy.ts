import { defineContent } from "./contentStore";

/**
 * Section headings, straplines and calls to action.
 * Everything here is editable in the browser at /edit.
 */
export const copy = defineContent("sections", {
  meta: {
    title: "Integrated Surveillance & Security Modernization | EY",
    description:
      "EY advisory for power generation companies: perimeter security, plant surveillance, command-centre design, DPR/RFP support and implementation governance.",
  },
  hero: {
    badge: "ADVISORY PERSPECTIVE FOR POWER GENERATION COMPANIES",
    headline: "Integrated Security Architecture for Power Generation Assets",
    strapline:
      "Helping power generation companies strengthen perimeter security, plant surveillance, operational visibility, and incident response through a structured advisory-led approach.",
    cta: "Explore the framework",
    focusLabel: "Focus",
  },
  whyNow: {
    eyebrow: "Section 02",
    heading: "Why plant security architecture must change now",
    lead: "Exposure is widening, plant risk remains uneven, and security performance is becoming measurable.",
  },
  segments: {
    eyebrow: "Section 03 — Starting position",
    heading: "One sector. Two modernisation starting points.",
    lead: "The modernisation pathway is determined by the maturity, scale and integration of the existing security estate.",
  },
  plantBlocks: {
    eyebrow: "Section 04",
    heading: "Security Zones & Critical Plant Assets",
    lead: "Select a plant type and asset to examine its risk exposure and mapped security controls.",
  },
  asIs: {
    eyebrow: "Section 05",
    heading: "As-Is Physical Security Assessment",
    lead: "EY would assess the plant's physical, technological and operational security posture — on site and on record.",
  },
  toBe: {
    eyebrow: "Section 06",
    heading: "To-Be Integrated Security Architecture",
    lead: "Read bottom-up: distributed sensing becomes transported data, then correlated intelligence, then coordinated human decision, then governed operational resilience — with cyber security and enterprise integration spanning every layer. Select any layer for the technical detail.",
  },
  useCases: {
    eyebrow: "Section 07",
    heading: "Power-plant security scenarios",
    lead: "See how detection, correlation and control-room response work as one operational chain.",
  },
  offerings: {
    eyebrow: "SECTION 08",
    heading: "One advisory lifecycle—from diagnosis to sustained operations",
    lead: "Each phase ends with a defined programme output, with vendor neutrality and governance running through the full lifecycle.",
  },
  whyEy: {
    eyebrow: "SECTION 09",
    heading: "EY brings the four capabilities that turn architecture into delivery",
    lead: "Domain context, converged security design, procurement engineering and programme governance operate as one delivery system—not four disconnected workstreams.",
    cta: "View evidence base",
  },
  closing: {
    eyebrow: "Section 11",
    heading: "Start with one pilot plant - or one operating cluster.",
    lead: "A structured assessment will establish the current state, define the target architecture, prioritise investment and produce an executable modernisation roadmap.",
    cta: "Book an assessment discussion",
    ctaHref: "mailto:akshya.singhal@in.ey.com",
    signoff: "Start focused. Scale on evidence.",
  },
  footer: {
    left: "Integrated Surveillance and Security Modernization for Power Generation Assets",
    right:
      "Illustrative advisory perspective. Client-specific facts, costs and timelines are placeholders pending assessment.",
  },
});
