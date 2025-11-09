# ☀️ SolarMind - AI-Powered Solar Energy Advisor

[![Live Demo](https://img.shields.io/badge/🚀%20Live%20Demo-Visit%20Site-blue?style=for-the-badge)](https://lovable.dev/projects/71f810b7-7114-4b34-91f4-8c65d4f47335)
[![Built with Lovable](https://img.shields.io/badge/Built%20with-Lovable-ff69b4?style=for-the-badge)](https://lovable.dev)
[![AI Powered](https://img.shields.io/badge/AI-Powered-green?style=for-the-badge)](https://ai.gateway.lovable.dev)

**Team O(no)**: Jakov Szavits-Nossan & Marko Zelenović | Zagreb, Croatia

---

## 🎯 Problem & Solution

**The Challenge**: Solar power remains critically underutilized despite being one of our most effective tools against climate change. Homeowners struggle to understand:
- Whether solar panels are profitable for their specific location
- Real return on investment (ROI) calculations
- Environmental impact and carbon footprint reduction
- How system specifications affect long-term savings

**Our Solution**: SolarMind is an **AI-powered solar energy advisor** that democratizes solar knowledge. Using advanced machine learning and real-time weather data, we provide personalized, location-specific insights that transform complex solar calculations into clear, actionable recommendations.

**Measurable Impact**:
- ⚡ **Instant Analysis**: Reduces research time from hours to seconds
- 🌍 **Climate Education**: Visualizes CO₂ savings with relatable analogies (cars removed, trees planted)
- 💰 **Financial Clarity**: Accurate 7-day energy forecasts with ROI projections
- 🤝 **Accessible**: No prior solar knowledge required - AI explains everything in plain language

---

## 🚀 Key Features

### 1. **AI-Powered Conversational Advisor**
- Integrated conversational AI chatbot using **Google Gemini 2.5 Flash** via Lovable AI Gateway
- Natural language explanations of complex solar concepts
- Personalized recommendations based on user's specific parameters
- Interactive Q&A for instant solar education

### 2. **Intelligent Solar Forecasting**
- Real-time 7-day energy production forecasts using **OpenWeather Solar Radiation API**
- Location-specific calculations accounting for:
  - Geographic coordinates and solar irradiance
  - Roof area and panel efficiency
  - System specifications (kW capacity, installation costs)
- Validated input system with smart defaults based on realistic scenarios

### 3. **AI-Generated Personalized Summaries**
- Automated daily insights using **OpenAI GPT-5 Mini**
- Conversational tone tailored for homeowners
- Contextual analysis of weather patterns and energy production
- Actionable recommendations for maximizing solar benefits

### 4. **Visual Impact Analytics**
- Interactive charts showing:
  - Daily energy production trends (kWh)
  - Cost savings projections (€)
  - CO₂ emissions reduction over time
- Relatable analogies (e.g., "powers a refrigerator for 45 days", "equivalent to 12 trees planted")

### 5. **Comprehensive Educational Resources**
- FAQ section covering common solar questions
- System specifications breakdown
- Savings calculator with adjustable electricity rates
- ROI timeline visualization

---

## 🧠 Technical Implementation

### **AI Integration - Central to Solution**
Our application leverages **three distinct AI models** to solve user pain points:

1. **Google Gemini 2.5 Flash** (Lovable AI Gateway)
   - Powers the interactive chat advisor
   - Handles complex solar queries with natural language understanding
   - Provides context-aware responses based on user's location and system specs

2. **OpenAI GPT-5 Mini** (Edge Function)
   - Generates personalized daily summaries
   - Analyzes forecast data to create actionable insights
   - Adapts communication style for non-technical audiences

3. **Location Intelligence** (OpenWeather Geocoding API)
   - Autocomplete city search with debounced API calls
   - Coordinates-based solar radiation data retrieval
   - Ensures accurate location-specific calculations

### **Architecture Overview**

```
┌─────────────────┐
│   React Frontend │
│   (TypeScript)   │
└────────┬─────────┘
         │
         ├──────────────────────────────────────┐
         │                                      │
┌────────▼─────────┐                   ┌───────▼────────┐
│  Lovable Cloud   │                   │  OpenWeather   │
│  (Supabase)      │                   │     APIs       │
│                  │                   │                │
│  Edge Functions: │                   │ • Solar Rad.   │
│  • solar-chat    │                   │ • Geocoding    │
│  • ai-summary    │                   └────────────────┘
│  • solar-forecast│
│  • geocoding     │
└────────┬─────────┘
         │
         ├─────────────────┬─────────────────┐
         │                 │                 │
┌────────▼─────┐  ┌────────▼─────┐  ┌───────▼────────┐
│ Lovable AI   │  │   OpenAI     │  │  OpenWeather   │
│   Gateway    │  │   API        │  │  Solar API     │
│              │  │              │  │                │
│ Gemini 2.5   │  │  GPT-5 Mini  │  │ Radiation Data │
│   Flash      │  │              │  │                │
└──────────────┘  └──────────────┘  └────────────────┘
```

### **Tech Stack**
- **Frontend**: React 18, TypeScript, Vite
- **UI Framework**: Tailwind CSS, shadcn/ui components
- **Backend**: Lovable Cloud (Supabase Edge Functions)
- **AI Models**: 
  - Lovable AI Gateway (Google Gemini 2.5 Flash)
  - OpenAI GPT-5 Mini
- **Data APIs**: 
  - OpenWeather Solar Radiation API
  - OpenWeather Geocoding API
- **Data Visualization**: Recharts
- **State Management**: React Query (TanStack)

### **Security & Best Practices**
- All API keys stored as secure Supabase secrets (never exposed client-side)
- Environment variables managed through Lovable Cloud
- Input validation with Zod schemas
- Debounced API calls to optimize rate limits
- CORS-enabled edge functions for cross-origin security

---

## 🎨 Innovation & Creativity

### **Novel Approach**
Unlike generic solar calculators that provide static estimates, SolarMind combines:
- **Real-time weather forecasting** with **AI-powered education**
- **Dynamic 7-day predictions** instead of annual averages
- **Conversational AI** that explains the "why" behind the numbers
- **Relatable analogies** that make abstract energy concepts tangible

### **Unique Features**
✨ **AI Chat Advisor**: First solar tool with integrated conversational AI for personalized guidance  
🌤️ **Live Forecasts**: Real-time solar radiation data, not historical averages  
🧮 **Instant ROI Calculator**: Adjustable parameters with immediate recalculation  
📊 **Educational Visualizations**: Charts + AI summaries for comprehensive understanding  

---

## 📹 Demo & Resources

### **Video Demo**
🎥 [Watch 3-Minute Demo Video](#) *(Link to your demo)*

### **Live Application**
🌐 **[Try SolarMind Live](https://lovable.dev/projects/71f810b7-7114-4b34-91f4-8c65d4f47335)**

### **Public Repository**
💻 **[GitHub - Full Source Code](https://github.com/YOUR_USERNAME/YOUR_REPO)**

---

## 🏃 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Lovable Cloud account (for backend)

### Installation

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git
cd YOUR_REPO

# Install dependencies
npm install

# Start development server
npm run dev
```

### Environment Setup
This project uses **Lovable Cloud** for backend services. API keys are managed securely:
- `OPENAI_API_KEY`: Stored as Supabase secret (edge functions only)
- `OPENWEATHER_API_KEY`: Stored as Supabase secret (edge functions only)
- `LOVABLE_API_KEY`: Auto-provisioned by Lovable Cloud
- `VITE_SUPABASE_URL` & `VITE_SUPABASE_PUBLISHABLE_KEY`: Public keys (safe for frontend)

**For judges**: The live demo is fully functional. All sensitive API keys are secured server-side.

---

## 🎯 Future Enhancements

- **Multi-language support** for global accessibility
- **Historical data tracking** for existing solar panel owners
- **Battery storage calculations** and recommendations
- **Government incentive database** integration
- **Mobile app** (iOS/Android) for on-the-go consultations
- **Community features** to share real-world solar experiences

---

## 📄 License

This project is open-source and available under the MIT License.

---

## 🙏 Acknowledgments

Built for **hAIckathon** using:
- [Lovable](https://lovable.dev) - Full-stack development platform
- [Lovable AI Gateway](https://ai.gateway.lovable.dev) - AI model integration
- [OpenWeather API](https://openweathermap.org/api) - Solar radiation data
- [OpenAI](https://openai.com) - GPT-5 Mini for summaries

---

**Team O(no)** | Empowering sustainable energy decisions through AI 🌱⚡
