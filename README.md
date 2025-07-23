# AI Traveller

AI Traveller is a full-stack travel planning web application built with [Next.js](https://nextjs.org/) and [React 19](https://react.dev/). It provides AI-powered itinerary generation, interactive trip mapping, payment integration, and user management, leveraging a modern TypeScript codebase and cloud APIs.

---

## 🏗️ Architecture & Key Modules

### Trip Generation (AI)

- Uses [Google Generative AI (Gemini)](https://ai.google.dev/) via [`service/AIModel.ts`](service/AIModel.ts:1) to generate detailed itineraries, hotel options, and daily plans.
- The AI model is configured for high-output, context-rich responses, and is used in trip creation flows.

### Place Search & Mapping

- Place details are fetched from the [Google Places API](https://developers.google.com/maps/documentation/places/web-service/overview) via [`app/api/place-details/route.ts`](app/api/place-details/route.ts:1).
- Interactive maps are rendered using the [Google Maps JavaScript API](https://developers.google.com/maps/documentation/javascript/overview) in [`components/trip/TripMap.tsx`](components/trip/TripMap.tsx:1), with geocoding, marker clustering, and info windows for each itinerary stop.

### Payments & Plans

- Payments are handled exclusively via [Razorpay](https://razorpay.com/), not Stripe.
- The endpoint [`app/api/stripe/route.ts`](app/api/stripe/route.ts:1) creates Razorpay orders for plan upgrades, using plan metadata from [`lib/stripe`](lib/stripe-client.ts:1) and server-side Razorpay integration.
- User plans and credits are managed in Firestore.

### User Management & Credits

- User data (name, email, picture, credits, plan) is stored in [Firebase Firestore](https://firebase.google.com/docs/firestore) via [`service/UserService.ts`](service/UserService.ts:1) and [`service/FirebaseConfig.ts`](service/FirebaseConfig.ts:1).
- Credits are required for trip creation and are updated after successful payment.

### Local Info & UI

- Local guidelines, emergency info, and cultural tips are provided as part of the trip experience.
- The UI is built with [Tailwind CSS](https://tailwindcss.com/), [Radix UI](https://www.radix-ui.com/), [Lucide React](https://lucide.dev/), and custom components for dialogs, toasts, and forms.

### Analytics & Auth

- [PostHog](https://posthog.com/) is used for analytics via a custom provider.
- Google OAuth is used for authentication and user onboarding.

---

## 📁 Directory Overview

- [`app/`](app/) — Next.js app directory: routes, API endpoints, static assets, and page components.
- [`components/`](components/) — UI and feature components (trip, shared-trip, dialogs, etc.).
- [`service/`](service/) — Service classes for AI, user, and API integration.
- [`lib/`](lib/) — Utility libraries (Razorpay, Firestore, etc.).
- [`types/`](types/) — TypeScript type definitions (including Razorpay).
- [`public/`](public/) — Static assets (images, icons, manifest).
- [`constants/`](constants/) — Shared constants and options.
- [`hooks/`](hooks/) — Custom React hooks.

---

## ✨ Core Features

- **AI-powered trip planning:** Generate multi-day itineraries, hotel lists, and daily plans using Gemini.
- **Interactive maps:** Visualize trip stops and routes with Google Maps, geocoding, and custom markers.
- **Razorpay payments:** Upgrade plans and purchase credits securely.
- **User credits & plans:** Track usage and access levels in Firestore.
- **Local info:** Display emergency contacts, guidelines, and cultural tips for destinations.
- **Google OAuth:** Seamless sign-in and onboarding.
- **Analytics:** Track usage with PostHog.
- **Responsive, accessible UI:** Built with Tailwind CSS and Radix UI.

---

## ⚙️ Setup & Development

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Configure environment variables:**

   - Copy `.env.example` to `.env` and fill in required values (Firebase, Razorpay, Google APIs, Gemini, PostHog, etc.).

3. **Run the development server:**

   ```bash
   npm run dev
   ```

4. **Build for production:**
   ```bash
   npm run build
   npm start
   ```

---

## 📝 Notes

- `.env` is git-ignored for security.
- Payments require valid Razorpay credentials.
- Google Maps/Places, Firebase, Gemini, and PostHog require API keys.
- For customization, edit components in [`components/`](components/) and pages/routes in [`app/`](app/).

---

## 🪪 License

MIT
