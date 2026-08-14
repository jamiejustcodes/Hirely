# Hirely — AI Resume Optimizer & ATS Scanner 🚀

> **Reverse-engineer recruiter screening bots and optimize your CV with Google Gemini 2.5 Flash.**

Hirely is a modern, real-time ATS (Applicant Tracking System) simulation and optimization suite built with **Next.js 14**, **TypeScript**, **Tailwind CSS**, and **Google Gemini 2.5 Flash**.

---

## ✨ Features

- 🎯 **ATS Candidate Match Scoring**: 5-vector evaluation (Keyword Alignment, Hard Skills, Soft Skills, Single-Column Parsability, and STAR Metrics).
- 🔍 **Real-Time Keyword Gap Matrix**: Identifies missing technical proficiencies and leadership traits vs. target job descriptions.
- ⚡ **STAR Method Bullet Rewriter**: Transforms passive bullet points into quantified achievements using Google's XYZ formula (*Accomplished [X], as measured by [Y], by doing [Z]*).
- 📄 **GPTZero-Style Diagnostic Studio (`/scan`)**: Split-pane workspace with color-coded sentence highlighting (weak bullets in red/rose, strong metrics in green) and 1-click live improvements.
- 🛡️ **100% Single-Column Parsability**: Validates layouts across Workday, Taleo, Greenhouse, Lever, and Ashby.
- 🆓 **100% Free Engine**: Runs with built-in high-fidelity simulation and supports your personal free Google AI Studio API key.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS & Custom Design System
- **Motion & Animations**: Framer Motion
- **AI Engine**: Google Gemini 2.5 Flash (`@google/generative-ai`)
- **Document Parsing**: `pdf-parse`

---

## 🚀 Getting Started

### 1. Clone & Install
```bash
git clone https://github.com/jamiejustcodes/Hirely.git
cd Hirely
npm install
```

### 2. Configure Environment (Optional)
Create a `.env` file in the root directory:
```env
GEMINI_API_KEY=your_free_google_ai_studio_api_key
```
*(If no key is provided, Hirely will automatically use the built-in intelligent candidate simulation mode)*

### 3. Run Locally
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📄 License

MIT License. Built by [jamiejustcodes](https://github.com/jamiejustcodes).
