# 🎙️ Vioneer | AI Voice Automation Agency Platform

> **"Stop Losing High-Ticket Clients to Voicemail."**

Vioneer is a high-converting, Next.js-powered agency platform designed to demonstrate and deploy 24/7 AI Voice Agents for local businesses. The platform features a dynamic Lead Leakage Audit funnel and real-time browser-based AI voice demos tailored to specific industry niches.

## 🚀 Overview

Traditional agency websites rely on static contact forms. Vioneer uses an interactive "Show, Don't Tell" architecture. It guides prospects through a financial pain-point calculator (The Quiz Funnel) and immediately offers the cure: a live, interactive phone call with a custom AI agent directly in their browser.

## ✨ Key Features

* **Interactive Lead Leakage Audit:** A Framer Motion-powered quiz funnel that calculates a business's exact lost monthly revenue based on their specific missed call volume and average customer lifetime value (LTV).
* **Dynamic Niche Routing:** Utilizes Next.js dynamic routes (`/demo/[niche]`) to seamlessly switch the AI's "Brain" (System Prompt and Persona) based on the target industry.
* **5 Pre-Configured AI Personas:**
  * 🦷 **Dental/Medical:** Empathetic triage and appointment booking.
  * 💼 **Consulting:** High-ticket BANT (Budget, Authority, Need, Timeline) lead qualification.
  * 🔧 **Home Services:** High-urgency emergency dispatching.
  * 🏡 **Real Estate:** Buyer pipeline qualification.
  * 🌐 **General Business:** Adaptive discovery and roleplay.
* **Sub-500ms Voice Latency:** Integrated with the Vapi Web SDK for ultra-fast, conversational AI interactions with built-in interruption handling and phonetic realism.
* **Dark Mode UI:** A premium "Deep Slate" aesthetic built with Tailwind CSS.

## 🛠️ Tech Stack

* **Framework:** [Next.js 14](https://nextjs.org/) (App Router)
* **UI Library:** [React](https://react.dev/)
* **Styling:** [Tailwind CSS](https://tailwindcss.com/)
* **Animations:** [Framer Motion](https://www.framer.com/motion/)
* **Icons:** [Lucide React](https://lucide.dev/)
* **Voice AI Engine:** [Vapi Web SDK](https://vapi.ai/)

## 🧠 System Architecture: The Configuration Map

To maintain the DRY (Don't Repeat Yourself) principle, the platform uses a centralized dictionary to map URL parameters to specific Vapi Assistant IDs. This allows a single `<VoiceDemoButton />` component to serve multiple industries without duplicating code.

```typescript
// Example Architecture
export const vapiConfig = {
  publicKey: process.env.NEXT_PUBLIC_VAPI_KEY,
  assistants: {
    dental: "assistant_id_1",
    consulting: "assistant_id_2",
    // ...
  }
};