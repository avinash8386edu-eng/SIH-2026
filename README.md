<div align="center">
  <img src="https://upload.wikimedia.org/wikipedia/en/thumb/f/fa/Smart_India_Hackathon_logo.png/220px-Smart_India_Hackathon_logo.png" alt="SIH Logo" width="150" />
  <h1>POLARIS (Heem Setu) ❄️📡</h1>
  <p><strong>Next-Gen Indian Antarctic Expedition Management System</strong></p>
  <p><em>Smart India Hackathon (SIH) 2026 Submission</em></p>
</div>

---

## 🏔️ The Problem
Managing research expeditions at **Maitri** and **Bharati** stations in Antarctica presents extreme challenges. Temperatures drop below -60°C, internet connectivity is severely intermittent, battery life on mobile devices drains rapidly, and tracking critical scientific cargo or field scientists is a logistical nightmare. 

## 💡 Our Solution: POLARIS
POLARIS (Heem Setu) is an **Offline-First, Battery-Optimized, Role-Based Management Ecosystem** designed specifically for the extreme conditions of Antarctica. It provides Command Center dashboards for Station Commanders and a progressive web app (PWA) for field scientists.

### 🌟 Key Features (As Pitched)
1. **🔋 Expedition Mode (Battery Optimized):** 
   - A strict Pure OLED Black (`#000000`) GUI with zero CSS animations and no heavy frontend frameworks (Built with pure Vanilla HTML5/CSS/JS). Saves up to **40% battery life** in sub-zero environments where lithium-ion batteries degrade quickly.
2. **📶 Offline-First SOS Protocol:** 
   - Uses **Service Workers (PWA)** and **IndexedDB**. If a scientist is caught in a blizzard with no network, pressing SOS queues the distress signal locally. The exact millisecond their device catches an intermittent satellite signal, the system auto-syncs and broadcasts a WebSocket alarm to the Command Center.
3. **📦 Dynamic QR Cargo Tracking:** 
   - Built-in HTML5 camera scanner. Instantly tracks high-value assets (e.g., Ice Core drills, Seismometers) as they move from *Vessel* -> *Port* -> *Station*.
4. **🔐 Enterprise Role-Based Access Control (RBAC):** 
   - Strict JWT-based security on the Spring Boot backend. A `SCIENTIST` cannot override cargo statuses—only a `COMMANDER` or `LOGISTICS` officer can.
5. **🛡️ 100% Crash-Proof API:** 
   - Global Exception Handling guarantees the API never returns ugly stack traces, ensuring the system remains rock-solid during critical operations.

---

## 🛠️ Technology Stack
* **Frontend:** Vanilla HTML5, CSS3, JavaScript (No heavy frameworks, true PWA implementation)
* **Backend:** Java 17, Spring Boot 3, Spring Security 6 (JWT)
* **Database:** MySQL 8.0
* **Maps:** Leaflet.js with CartoDB Dark Matter (OLED optimized)
* **DevOps:** Docker & Docker Compose (1-Click Deployment)

---

## 🚀 How to Run Locally (1-Click Deployment)

We have containerized the entire ecosystem for seamless testing by SIH Judges. You do **not** need Java or MySQL installed on your local machine.

### Prerequisites
* [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running.

### Execution
1. Clone the repository:
   ```bash
   git clone https://github.com/avinash8386edu-eng/SIH-2026.git
   cd SIH-2026
   ```
2. Spin up the Database and Backend Server:
   ```bash
   docker-compose up --build
   ```
   *(This will automatically pull MySQL, build the Spring Boot JAR, and start the API on `http://localhost:8080`)*

3. Run the Frontend:
   - Use the **Live Server** extension in VS Code to serve the `polaris-frontend` folder on `http://localhost:5500`.

---

## 🧪 Demo Credentials (Auto-Seeded)
The system automatically detects an empty database and injects these realistic demo users on startup:

| Role | Email | Password | Capabilities |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@polaris.com` | `admin123` | Full System Override |
| **Commander** | `commander@polaris.com` | `commander123` | View Dashboards, Resolve SOS |
| **Scientist** | `scientist1@polaris.com` | `sci123` | Offline SOS, Check-ins |

---

## 📸 System Previews

* **Command Center Dashboard:** Real-time WebSocket syncing for active personnel, cargo, and critical emergencies.
* **Radar Map:** Live plotting of field scientists on traverse missions.
* **QR Scanner:** Terminal-style UI for verifying critical cargo assets.

<br/>
<div align="center">
  <i>"Bridging the Gap to the Icy Frontier"</i><br/>
  <b>Made with ❤️ for Smart India Hackathon 2026</b>
</div>
