# AXIOM - Digitalization of Land Records (SIH PS26018)

This repository contains the functional prototype for the **AI-powered Digital Land Record Management and Land Dispute Reduction System**.

## Project Structure

The project has been architected into three separate services for scalability and separation of concerns:

### 1. `/frontend` (Next.js 16)
The stunning, modern web application built with React 19, Tailwind CSS v4, and Shadcn UI.
- Contains the citizen-facing UI (Digitize Record, Report Dispute, Track Status).
- Contains the Official Dashboard (Stats, Cases, Approvals).
- **Run Instructions:**
  ```bash
  cd frontend
  npm install
  npm run dev
  ```
 

### 2. `/backend` (Node.js + Express)
The core REST API and Database service. It uses **Prisma ORM** with a local SQLite database (`dev.db`).
- Manages Land Records and Validation.
- Manages Land Disputes and Complaint Statuses.
- **Run Instructions:**
  ```bash
  cd backend
  npm install
  npx prisma db push
  npm run start
  ```
 

### 3. `/ml` (Python FastAPI)
The Microservice dedicated to AI and OCR workloads.
- `POST /api/ml/ocr`: Processes images/PDFs and extracts structured text.
- `POST /api/ml/analyze`: Analyzes unstructured citizen complaints to recommend risk levels and officer actions.
- **Run Instructions:**
  ```bash
  cd ml
  pip install -r requirements.txt
  uvicorn main:app --host 0.0.0.0 --port 8000
  ```
 

## Key Features Implemented

- **Working OCR Module:** Citizens can upload a land record and the system extracts structured fields (Owner Name, Khasra, Area). Includes a *Demo Mode* for rapid hackathon testing without wait times.
- **Land Record Validation Engine:** Detects conflicts like area mismatches or duplicate Khasra ownerships and flags them before saving to the central database.
- **Dispute Reporting & AI Analysis:** Citizens can submit complaints which are pre-analyzed by the system for severity (e.g. Fraud detection vs Boundary dispute) and instantly routed.
- **Officer Dashboard:** A complete administrative view for managing verified records and updating complaint timelines.
- **Tracking System:** Visual status timeline for citizens using their unique Complaint ID (e.g. `LRD-2026-000001`).

## UI / UX Note
The beautiful, original styling of the landing page has been fully preserved and carefully extended across all the new functional pages (Dashboard, Tracking, Disputing).
