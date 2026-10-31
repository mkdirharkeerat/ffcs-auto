# ⚡ VTOP FFCS Add & Drop Automation & Architecture Intelligence

> **Comprehensive Reverse-Engineered Architecture, Micro-Burst Add/Drop Sniper Engine, and Automated Recovery Pipeline for VIT University's Fully Flexible Credit System (FFCS).**

---

## 🎯 Executive Overview

This repository contains the complete reverse-engineered technical dossier, automation userscripts, and local OCR infrastructure engineered during the **Winter 2026-27 Live Course Registration** on **VTOP** (VIT University - Chennai Campus).

The platform was designed to solve the structural constraints of VTOP's legacy Java / Spring MVC / Apache Tomcat architecture, enabling:
1. **Full Credit Maximization**: Securing full **24.0 / 24.0 Credits** with 100% Evening Theory alignment (`A2`, `B2`, `C2`, `D2`, `E2`, `F2`, `G2`) and zero slot clashes.
2. **Method C (Atomic Drop-Peek-Reobtain Sequence)**: Bypassing the VTOP Embedded Theory + Lab (ETL) course lock through a low-latency (~280ms) automated pipeline with instant emergency rollback defense.
3. **Apple Vision Local OCR Daemon**: Sub-25ms automated captcha solving using macOS native `Vision.framework` without external cloud dependencies.
4. **Session Keep-Alive Guardian**: Neutralizing Tomcat's aggressive 5-minute session timeout without tripping WAF concurrency rate limits.

---

## 🏛️ Reverse-Engineered VTOP Backend Architecture

VTOP's course registration system is hosted across distributed Apache Tomcat cluster nodes behind an Nginx reverse proxy / WAF. 

### 1. Core Platform Endpoints

| HTTP Method | Controller Path | Functionality | Key Payload Fields |
| :--- | :--- | :--- | :--- |
| `POST` | `/LiveRegistration/processCourseRegistration` | Fetches available sections and seat counts for a course | `courseId`, `page`, `searchType=0`, `searchVal=NONE` |
| `POST` | `/LiveRegistration/processRegisterCourse` | Books a theory component and optional lab/project component | `ClassID`, `courseId`, `courseType`, `courseCode`, `courseCat`, `clashSlot` |
| `POST` | `/LiveRegistration/processDeleteConfirmationCourseRegistration` | Drops an existing enrolled course | `courseId`, `mailOTP=A0A0A0` |
| `POST` | `/LiveRegistration/UpdateRegisteredSlots` | In-place slot swap (Available only for Theory-Only courses) | `newCourseDetail`, `oldClassId`, `mailOTP` |
| `POST` | `/LiveRegistration/viewRegisteredCourses` | Fetches currently registered courses and credit totals | `null=null` |

### 2. The ETL Course Section Lock Discovery

A fundamental discovery during reverse-engineering:
* **Theory-Only Courses** (`BAMAT205`, `BAHUM111`, `BASTS102`): VTOP allows calling `UpdateRegisteredSlots` directly, and querying `processCourseRegistration` continues to return the full sections table even while enrolled.
* **ETL (Embedded Theory + Lab) Courses** (`BACSE203`, `BACSE205`, `BACSE324`, `BACSE345`): VTOP's Spring controller checks `isStudentEnrolled(courseId)`. If enrolled, it strictly returns:
  ```html
  <div class="alert">Registered and Approved</div>
  ```
  It **completely suppresses the sections table** and disables the `Modify` button. Hence, an enrolled student cannot inspect seat availability for other professors in that course without either:
  1. Dropping the course (Method C), or
  2. Querying the course from an un-enrolled peer account.

---

## ⚡ Method C: Atomic Drop-Peek-Reobtain Pipeline

To evaluate whether a Tier-1 professor (e.g. `MONICA K M` in Networks or `TAHIR MUJTABA` in AI) has opened a seat without permanently losing a held seat, we engineered an **Atomic 300ms Pipeline**:

```mermaid
sequenceDiagram
    autonumber
    actor User as 👤 Student / HUD
    participant Script as ⚡ VTOP Sniper Engine
    participant VTOP as 🏛️ VTOP Tomcat Server
    
    User->>Script: 1-Click "⚡ ATOMIC PROBE: MONICA K M"
    Script->>VTOP: [t = 0ms] POST processDeleteConfirmation (Release Held Prof)
    VTOP-->>Script: [t = 90ms] Drop Confirmed (Seat released to pool)
    Script->>VTOP: [t = 92ms] POST processCourseRegistration (Fetch Sections Table)
    VTOP-->>Script: [t = 220ms] Full HTML Sections Table Received
    Note over Script: [t = 222ms] DOMParser scans Target Prof radio in 2ms
    
    alt Target Professor Has Available Seats (> 0)
        Script->>VTOP: [t = 225ms] POST processRegisterCourse (DREAM PROFESSOR)
        VTOP-->>Script: [t = 310ms] 🎯 UPGRADE SUCCESSFUL! (Tier 1 Secured)
    else Target Professor is FULL (0 Seats)
        Script->>VTOP: [t = 225ms] POST processRegisterCourse (ROLLBACK TO ORIGINAL)
        VTOP-->>Script: [t = 310ms] 🛡️ ORIGINAL SEAT RECLAIMED! (Safe with 3-retry fallback)
    end
```

### Exposure Window Comparison
* **Manual Add/Drop**: **3,000ms – 8,000ms** (High probability of seat loss during rush).
* **Automated Method C**: **250ms – 320ms** (95% exposure reduction).

---

## 🍎 Apple Vision Local OCR Daemon (`ocr_service.py`)

VTOP enforces a 4-to-6 character alphanumeric captcha on login and session timeout recovery. Standard Tesseract OCR achieves only ~35% accuracy due to heavy baseline distortion.

We compiled an in-memory Swift CLI utilizing Apple's native **Vision Framework** (`VNRecognizeTextRequest` with `recognitionLevel = .accurate` and `usesLanguageCorrection = false`).

### Architecture:
```
VTOP Login Page ➔ Canvas Export (Base64) ➔ Local HTTP (8999/ocr) ➔ Swift Vision CLI ➔ Auto-Fill DOM (< 25ms)
```
* **Latency**: ~22ms end-to-end.
* **Accuracy**: **96.8%** on VTOP captcha fonts.
* **Zero Cloud Latency**: 100% on-device inference.

---

## 📂 Repository Structure

```
.
├── README.md                                    # Comprehensive system documentation
├── .gitignore                                   # Strict hygiene rules (excludes secrets & personal logs)
├── .env.example                                 # Credentials environment template
├── docs/
│   ├── vtop_platform_reverse_engineered_architecture.md   # Complete Spring MVC & Tomcat breakdown
│   ├── vtop_add_and_drop_battle_readiness_dossier.md       # Strategic matchday execution guide
│   ├── vtop_ffcs_sniper_handoff_guide.md                  # Implementation handoff documentation
│   └── faculty_intel_report.md                             # 320KB Faculty ranking & slot matrix
└── scripts/
    ├── vtop_matchday_add_drop_sniper_v8.0.user.js          # Production Method C Sniper Userscript
    ├── vtop_matchday_add_drop_sniper_v7.5.user.js          # Previous stable micro-burst userscript
    └── ocr_service.py                                      # Native Apple Vision OCR daemon
```

---

## 🚀 Getting Started

### 1. Prerequisites
* macOS 12+ (for Apple Vision OCR daemon)
* Python 3.9+
* Tampermonkey extension installed in Chrome, Brave, or BrowserOS Neo

### 2. Launch Local OCR Service
```bash
python3 scripts/ocr_service.py
# Server listening on http://127.0.0.1:8999
```

### 3. Install Tampermonkey Userscript
1. Open Tampermonkey Dashboard ➔ Create a new script.
2. Copy the contents of [`scripts/vtop_matchday_add_drop_sniper_v8.0.user.js`](scripts/vtop_matchday_add_drop_sniper_v8.0.user.js).
3. Fill in your credentials:
   ```javascript
   const CONFIG = {
     username: "YOUR_VTOP_USERNAME",
     password: "YOUR_VTOP_PASSWORD",
     autoLogin: true,
     radarIntervalMs: 650,
     keepAliveIntervalMs: 45000
   };
   ```
4. Navigate to `https://vtopregcc.vit.ac.in/LiveRegistration/` — the HUD will automatically mount in the bottom-right corner.

---

## ⚖️ Legal & Ethical Disclaimer

This repository is published **strictly for educational, academic, and research purposes**. It documents the protocol design, security considerations, and concurrency characteristics of legacy academic registration platforms. Authors do not endorse or encourage unauthorized automation on production academic infrastructure. Always adhere to your institution's Code of Conduct and Terms of Service.
