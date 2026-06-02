# StarCV

StarCV is a premium, high-fidelity portfolio and resume compiler tailored for the Indian film industry. By executing concurrent search agents across Wikipedia, YouTube, and Tavily, StarCV aggregates biographical details, social presence metrics, and film credits in parallel, then synthesizes them using **Groq (Llama 3.3 70B)** into a print-ready, single-page A4 CV.

The application features a sleek, editorial aesthetic, supporting persistent **Light & Dark Themes** and high-resolution **A4 PDF Exporting**.

---

## 🌟 Key Features

* **Concurrently Aggregated Profiles**: Queries Wikipedia, YouTube channels, and Tavily Search APIs simultaneously, building complete CV aggregates in **under 5 seconds**.
* **Llama-Powered Schema Synthesis**: Uses Groq Llama 3.3 70B to parse raw data, cleaning out corporate resume jargon in favor of industry-appropriate terms (*Artist Profile*, *Selected Filmography*, *Special Skills*, *Awards & Accolades*).
* **Double-Theme Premium Design**:
  * **Dark Mode**: A luxurious, warm Obsidian and Matte Gold carbon design with glassmorphic elements.
  * **Light Mode**: A clean, print-perfect Ivory and Matte Bronze layout ideal for physical casting submissions.
* **Seeded Autocomplete**: A curated autocomplete search bar matching popular actors across Indian film industries for instant lookup.
* **Interactive Profile Photo Toggle**: Instantly hide profile pictures to dynamically expand the CV layout to a full-width text column on the fly.
* **Tainted-Canvas Safe PDF Export**: Configured with canvas cross-origin fallbacks to download crisp, high-resolution A4 PDFs without security breaks.

---

## 🛠️ Tech Stack

* **Frontend**: React.js, Vite
* **Styling**: Pure CSS3 Custom Theme System (Warm Obsidian/Gold & Ivory/Bronze)
* **Backend Integration**: 
  * Wikipedia Open API
  * YouTube Data API v3
  * Tavily Search API
* **LLM Engine**: Groq Cloud API (`llama-3.3-70b-versatile`)
* **PDF Engine**: `html2canvas` & `jspdf`

---

## 🚀 Local Quick Start

### 1. Configure Environment Keys
Create a `.env` file in the root directory (based on `.env.example` or your local settings) and supply your API keys:

```env
# Groq API Key (https://console.groq.com)
VITE_GROQ_API_KEY=your_groq_api_key_here

# Tavily API Key (https://tavily.com)
VITE_TAVILY_API_KEY=your_tavily_api_key_here

# YouTube Data API v3 Key (https://console.cloud.google.com)
VITE_YOUTUBE_API_KEY=your_youtube_api_key_here
```

> ⚠️ **Security Warning**: The `.env` file is excluded from git tracking in `.gitignore` to prevent credentials from being leaked to public repositories.

### 2. Install Dependencies
```bash
npm install
```

### 3. Launch Development Server
```bash
npm run dev
```
Open [http://localhost:5173/](http://localhost:5173/) in your web browser.

---

## 📂 Project Architecture

```
StarCV/
├── src/
│   ├── agents/
│   │   ├── orchestrator.js      # Concurrently executes agents and builds payload
│   │   ├── wikipediaAgent.js    # Extracts bio data and primary image
│   │   ├── youtubeAgent.js      # Gathers channel details and subscriber stats
│   │   └── tavilyAgent.js       # Resolves social media urls
│   ├── components/
│   │   ├── Resume.jsx           # Stitched A4 template sheet
│   │   ├── SearchBar.jsx        # Autocomplete search bar
│   │   ├── PhotoBlock.jsx       # Canvas-safe profile photos
│   │   ├── SocialBlock.jsx      # Social metrics grid (custom brand SVGs)
│   │   └── SourcesBar.jsx       # Footnote source list and timing logger
│   ├── constants/
│   │   ├── prompt.js            # Refined LLM resume generation schema
│   │   └── actors.js            # Seeded popular Indian actors suggestions database
│   ├── utils/
│   │   ├── groqFormatter.js     # Groq API client with 8-second timeout abort
│   │   ├── pdfExporter.js       # Canvas capture A4 PDF exporter
│   │   └── fallbacks.js         # Names initials and values formatters
│   ├── index.css                # Premium double-theme design system
│   └── main.jsx                 # Entry point
├── vite.config.js               # Dev server CORS proxy configuration
└── package.json
```

---

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).
