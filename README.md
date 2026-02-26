# Nia Studio App 🚀

**Live. Work. Grow.**

Nia Studio is a modern web application designed for blue-collar migrant workers in India. It connects them to affordable housing, job opportunities, and a community-driven points ecosystem.

## 🌟 Features

- **The Nia Store**: Browse services across Studio (Living), Flow (Jobs), and Tribe (Community) pillars.
- **Points Ecosystem**: Earn points for hygiene, attendance, and community participation.
- **Manual Ledger**: Specialized interface for EAEs (Staff) to transition from manual spreadsheets to digital logging.
- **Community Leaderboard**: Real-time rankings for residents to drive engagement and social proof.
- **Mobile-First Design**: Optimized for the workforce with a premium, high-performance UI.

## 🛠️ Tech Stack

- **Frontend**: React, Vite, Tailwind CSS
- **State Management**: Context API
- **Icons/UI**: Custom SVG & Premium Design Tokens

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- npm or yarn

### 🚀 Dual-Hosting Strategy

To balance premium UI for residents and rapid tool development for staff, this project is designed for two platforms:

#### 1. Resident Frontend (Vercel)
The high-fidelity React Single Page Application.
- **URL**: [nia-studio-app.vercel.app](https://nia-studio-app.vercel.app)
- **Tech**: React + Vite + Tailwind CSS
- **Features**: Nia Store, Points Banner, Leaderboard.
- **Deployment**: Automatic via GitHub push to `main`.

#### 2. Staff Backend (Streamlit Cloud)
The management ledger and internal staff tools.
- **URL**: [nia-staff.streamlit.app](https://nia-staff.streamlit.app)
- **Tech**: Python + Streamlit
- **Features**: Manual Ledger, Daily Logging, Analytics, Resident Onboarding.
- **Main file**: `app.py`

## 🏗️ Phased Roadmap

- **Phase 0 (Manual Pilot)**: Digital Proxy for spreadsheet-based point tracking. [DONE]
- **Phase 1 (Storefront)**: Launch of the digital Nia Store and Resident Home view. [DONE]
- **Phase 2 (Points Flow)**: Unlocking the "Earn" tasks and "Redeem" rewards catalog. [UPCOMING]
- **Phase 3 (Staff Tools)**: Advanced JCO approvals and analytics dashboards. [UPCOMING]
- **Phase 4 (Backend Migration)**: Full persistence with PostgreSQL & Firebase Auth. [UPCOMING]

## 👥 Roles for Testing (Pilot)

| Role | Employee ID | PIN |
|---|---|---|
| **Resident** | `NIA001` | `1234` |
| **EAE (Staff)** | `EAE001` | `0000` |
| **JCO (Manager)** | `JCO001` | `0000` |

---
© 2026 Nia One Ecosystem. All rights reserved.
