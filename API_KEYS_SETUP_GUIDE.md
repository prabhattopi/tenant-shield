# 🔑 TenantShield — Complete API Keys & Environment Setup Guide

Here is the step-by-step guide to get all free developer keys and add them to your `backend/.env` file.

> **Good News:** TenantShield is engineered with **Zero-Setup Resilient Fallback**. If you haven't added any of these keys yet, the system still runs smoothly in resilient development mode. Adding these keys connects you to live cloud infrastructure!

---

## 1. 🤖 Google Gemini API Key (Free, 30 Seconds)
* **What it does:** Powers the statutory lease clause analysis, illegal clause detection, and 1-click legal demand letter generation.
* **Cost:** 100% Free tier (up to 15 RPM / 1M TPM).
* **Steps to get it:**
  1. Go to [Google AI Studio](https://aistudio.google.com/).
  2. Sign in with your Google account.
  3. Click the blue button **"Get API key"** (top left).
  4. Click **"Create API key in new project"**.
  5. Copy the key (starts with `AIzaSy...`).
* **Where to paste in `backend/.env`:**
  ```env
  GEMINI_API_KEY=AIzaSyYourGeneratedGeminiKeyHere
  LLM_PROVIDER=gemini
  ```

---

## 2. 🐘 Neon Serverless PostgreSQL (Free, 1 Minute)
* **What it does:** Stores users, double-entry credit ledger, Stripe subscriptions, and audit job status with relational ACID guarantees.
* **Cost:** 100% Free tier (0.5 GB storage, serverless autoscaling).
* **Steps to get it:**
  1. Go to [Neon.tech](https://neon.tech/) and sign up with GitHub/Google.
  2. Click **"Create a project"** (e.g., name it `tenantshield-db`).
  3. Under **Connection Details**, select **Node.js** or **Direct connection**.
  4. Copy the connection string (looks like `postgresql://neondb_owner:***@ep-sweet-sample-123456.us-east-2.aws.neon.tech/neondb?sslmode=require`).
* **Where to paste in `backend/.env`:**
  ```env
  POSTGRES_URL=postgresql://neondb_owner:YOUR_PASSWORD@ep-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require
  ```

---

## 3. 🍃 MongoDB Atlas (Free M0 Cluster, 2 Minutes)
* **What it does:** Document Lake storing raw polymorphic lease ASTs, extracted clauses, photo evidence hashes, and demand notices.
* **Cost:** 100% Free M0 Sandbox (512 MB).
* **Steps to get it:**
  1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and sign in.
  2. Click **"Create a Database"** and pick the **M0 Free** shared cluster.
  3. In **Database Access**, create a user (e.g., `tenantuser` and a password).
  4. In **Network Access**, click **"Add IP Address"** -> select **"Allow Access from Anywhere"** (`0.0.0.0/0`) for dev.
  5. Click **"Connect"** -> **"Drivers"** (Node.js) and copy the connection string.
* **Where to paste in `backend/.env`:**
  ```env
  MONGODB_URI=mongodb+srv://tenantuser:YOUR_PASSWORD@cluster0.xxx.mongodb.net/tenantshield?retryWrites=true&w=majority
  ```

---

## 4. 💳 Stripe Developer Test Mode (Free, 2 Minutes)
* **What it does:** Handles the $9 pay-per-audit and $4.99/mo Pro subscription checkout flows.
* **Cost:** Free sandbox / test mode.
* **Steps to get it:**
  1. Go to [Stripe Dashboard](https://dashboard.stripe.com/) and register or sign in.
  2. Make sure the toggle on the top right is set to **"Test Mode"** (Orange banner).
  3. Go to **Developers** -> **API keys**.
  4. Copy the **Secret key** (starts with `sk_test_...`).
  5. *(Optional for webhooks)* Go to **Developers** -> **Webhooks**, click **"Add endpoint"** or use Stripe CLI to test `stripe listen --forward-to localhost:5000/api/billing/webhook`.
* **Where to paste in `backend/.env`:**
  ```env
  STRIPE_SECRET_KEY=sk_test_51...your_test_key
  STRIPE_WEBHOOK_SECRET=whsec_...your_webhook_signing_secret
  ```

---

## 📋 Full `backend/.env` Summary Template
```env
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

# Live Cloud Databases
POSTGRES_URL=
MONGODB_URI=

# Authentication Secret
JWT_SECRET=super-secure-tenantshield-jwt-secret-key-change-in-prod-2026
JWT_EXPIRES_IN=7d

# LLM Engine
LLM_PROVIDER=gemini
GEMINI_API_KEY=
OLLAMA_BASE_URL=http://localhost:11434

# Stripe Developer / Test Mode
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_PRICE_ID_AUDIT=price_one_off_audit_9usd
STRIPE_PRICE_ID_PRO=price_pro_monthly_5usd
```
