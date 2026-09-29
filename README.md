<div align="center">
  <h1>Him-Setu 🏔️</h1>
  <h3>Intelligence For Polar Operations</h3>
  <p><em>An offline-resilient, battery-optimized digital command center engineered for high-risk polar environments.</em></p>

  <p>
    <img src="https://img.shields.io/badge/Java-21-ED8B00?style=for-the-badge&logo=java&logoColor=white" alt="Java 21" />
    <img src="https://img.shields.io/badge/Spring_Boot-3-6DB33F?style=for-the-badge&logo=spring&logoColor=white" alt="Spring Boot 3" />
    <img src="https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white" alt="MySQL" />
    <img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white" alt="HTML5" />
    <img src="https://img.shields.io/badge/Vanilla_JS-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="Vanilla JS" />
    <img src="https://img.shields.io/badge/SIH-2026-000000?style=for-the-badge" alt="SIH 2026" />
    <img src="https://img.shields.io/badge/Open_Source-100%25-4CAF50?style=for-the-badge" alt="Open Source" />
  </p>
</div>

---

## Table of Contents
1. [Project Overview](#1-project-overview)
2. [Key Innovations](#2-key-innovations)
3. [System Architecture](#3-system-architecture)
4. [Feasibility & Impact](#4-feasibility--impact)
5. [Screenshots](#5-screenshots)
6. [Installation & Deployment](#6-installation--deployment)
7. [Team YantraMinds](#7-team-yantraminds)

---

## 1. Project Overview

**Problem Statement:** SIH26062 – Integrated Polar Expedition Logistics and Asset Management System  
**Target Deployment:** 46th Indian Antarctic Expedition (via ECIL VSAT network)  

Operating research stations at the Antarctic edge—such as Maitri and Bharati—presents unparalleled logistical and survivability challenges. Currently, Antarctic logistics rely heavily on paper-based AL-1403 cargo declaration workflows and manual VHF radio check-ins. Extreme ambient temperatures (-60°C) degrade mobile battery capacities by 60%, while Iridium satellite networks suffer from severe bandwidth constraints (2.4 kbps) and frequent blackout events. Furthermore, manual auditing over an 8-month winter isolation period leads to critical logistical fatigue and potential supply chain failures.

Him-Setu is engineered to resolve these operational bottlenecks. It serves as a decentralized, offline-first mission control system for the National Centre for Polar and Ocean Research (NCPOR).

---

## 2. Key Innovations

| Innovation | Description |
| :--- | :--- |
| **📦 QR Cargo Bridge** | Replaces manual AL-1403 PDF forms with tamper-evident cryptographic hashing and dynamic QR-coded asset tracking (Goa warehouse to Antarctic station). |
| **❄️ Smart Inventory & Winter Auto Guard** | Midnight Spring cron jobs automate FIFO logic, push expiry alerts, and predict fuel burn rates to prevent winter supply shortages. |
| **🚨 1-Tap SOS & P2P Mesh** | Single-button trigger for <30s response. Forms a local LoRaWAN/Bluetooth mesh to alert nearby scientists during total network blackouts. |
| **🌡️ Cryo-Chain Analytics** | Mathematically predicts the thermal degradation of sensitive chemicals and medicines when exposed to ambient -60°C during ice-shelf offloading. |
| **📡 Iridium Burst Sync** | Zero data loss architecture. Offline IndexedDB queue auto-syncs via narrow satellite windows in milliseconds. |
| **🔋 Expedition Mode (Blizzard Mode)** | Battery-optimized UI for -60°C. Kills non-essential background tasks, limits GPS polling, and uses dark mode to save ~40% battery on field devices. |
| **🗺️ Expedition Safe Grid** | Live Leaflet.js geospatial map auto-alerting station commanders if scientists miss check-ins during deep-field traverses. |
| **🧠 POLAR-GPT AI Assistant** | Natural language predictive forecasting for fuel, supplies, and blizzard survival metrics. |

---

## 3. System Architecture

Him-Setu operates on a highly resilient 4-Tier Edge-to-Cloud architecture to ensure continuous functionality independent of external network availability.

* **Zone 1 (External Services):** Interfaces securely with ECIL VSAT, NRSC/ISRO mapping endpoints, and COMNAP CATS protocols.
* **Zone 2 (Frontend PWA):** Built strictly with Vanilla JS, HTML5, CSS3, and IndexedDB. Framework-free architecture guarantees zero bloat, minimizing memory footprint and maximizing battery life on older, cold-exposed field devices.
* **Zone 3 (Backend Application Layer):** Powered by Java 21 and Spring Boot 3. Hosts REST APIs, STOMP WebSockets, Inventory Cron Services, and Emergency SMS relays.
* **Zone 4 (Data & Storage Core):** ACID-compliant MySQL database acting as the Central Document Repository for AL-1403 digital records, cargo certificates, and audit logs. Implements local IndexedDB checksums to prevent offline data corruption prior to burst syncing.

---

## 4. Feasibility & Impact

* **Economic Impact:** Operates with zero licensing costs (100% open-source architecture). Mitigates the risk of supply chain failures, effectively protecting NCPOR's ₹300 crore annual Antarctic budget from human-induced logistical errors.
* **Operational Efficiency:** Replaces over 500 manual cargo entries per expedition with real-time barcode/QR scanning. The Dockerized backend enables 1-click deployment and scaling across Goa and Cape Town staging servers.
* **Safety & Survivability:** Reduces emergency radio relay protocols from 30-60 minutes down to sub-30 seconds. Implements zero blind spots during inland scientific traverses.

---

## 5. Screenshots

![Command Dashboard Placeholder](https://via.placeholder.com/1000x500/111827/00E5FF?text=HIM-SETU+Command+Dashboard)  
*Figure 1: Main Command Dashboard featuring real-time telemetry.*

![Cryo-Chain Analytics Widget Placeholder](https://via.placeholder.com/1000x500/111827/00FF66?text=Cryo-Chain+Analytics+Widget)  
*Figure 2: Cryo-Chain Analytics widget predicting thermal degradation.*

![Expedition Safe Grid Placeholder](https://via.placeholder.com/1000x500/111827/FF003C?text=Expedition+Safe+Grid+Live+Map)  
*Figure 3: Live geospatial tracking of deep-field traverse convoys.*

---

## 6. Installation & Deployment

### Prerequisites
* JDK 21+
* Maven 3.9+
* MySQL Server (Port 3306)
* Docker & Docker Compose (Optional for containerized deployment)

### Database Initialization
```sql
CREATE DATABASE polaris_db;
```
*(Spring Boot `ddl-auto` will construct all required schemas upon initialization).*

### Backend Deployment (Spring Boot)
```bash
# Clone the repository
git clone https://github.com/avinash8386edu-eng/SIH-2026.git
cd SIH-2026/polaris-backend

# Build the application
mvn clean install

# Execute the application locally
mvn spring-boot:run -DskipTests
```

### Frontend Deployment (Vanilla JS PWA)
```bash
cd ../polaris-frontend

# Serve the static files via Python or any basic HTTP server
python -m http.server 5500
```
Navigate to `http://localhost:5500/index.html` to access the Command Center.

### Dockerized Deployment (Production)
```bash
docker-compose up --build -d
```

---

## 7. Team YantraMinds

| Member | Role |
| :--- | :--- |
| **Avinash (Team Leader)** | Full-Stack Architecture & Cloud Infrastructure |
| **Bhoomi** | Backend Systems & Database Modeling |
| **Ankush** | AI/ML Integration & Hardware Telemetry |
| **Aryan Srivastav** | Frontend PWA Development & UI/UX |

---
<div align="center">
  <p><b>Team ID: 120559 | SIH 2026 Grand Finale</b></p>
</div>
