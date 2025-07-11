# Blockchain‑AI/ML: Secure, Explainable, & Decentralized Commerce

**[GitHub Repository](https://github.com/Pintuknwr/Blockchain-Ai)**

An end-to-end, production-grade secure e-commerce platform that brings together cutting-edge technologies:

- Multi-Factor Authentication (MFA)
- Email Verification
- Stripe Payment Integration
- Fraud Detection using ML (XGBoost)
- Explainability with SHAP
- Federated Learning
- Smart Contracts on Blockchain

---

## ! Problems Addressed

- Rising e-commerce frauds
- Lack of AI transparency in fraud detection
- Weak email and identity verification
- Centralized and tamperable transaction records
- Poor user recovery options

---

## Mission & Objectives

Our project was designed to solve real-world e-commerce vulnerabilities with a future-proof, secure, intelligent platform by combining:

- Zero-trust architecture using MFA and Email Validation
- Fraud detection through machine learning
- Blockchain immutability for logging and verification
- Transparency via Explainable AI (SHAP)
- Federated learning to simulate privacy-preserving intelligence

We achieved **integration** across all these fronts—bringing together diverse technologies into one cohesive system.

---

## What We Built & Why It Matters

| Problem                | Our Approach                                    | Outcome                                          |
| ---------------------- | ----------------------------------------------- | ------------------------------------------------ |
| Weak login systems     | **JWT + MFA (Google Authenticator)**            | Zero‑Trust grade security                        |
| Fake email sign ups    | **EmailValidation.io - email verification**     | Reliable user identity                           |
| Payment fraud          | **Stripe + XGBoost ML service**                 | Real‑time fraud blocking                         |
| Lack of trust in AI    | **SHAP explainability**                         | Admin transparency & trust                       |
| Privacy concerns in ML | **Federated learning with 3 simulated clients** | Distributed learning, no raw data centralization |
| Centralized logs       | **Smart contract using blockchain**             | Immutable records of all transactions            |

---

## Key Features

- **Secure Auth:** MFA with Google Authenticator, password encryption, JWT tokens
- **Verified Emails:** Domain & ownership check via EmailValidation.io
- **Stripe Integration:** Payment gateway for secure transactions
- **Fraud Detection:** XGBoost ML model with real-time predictions
- **Explainable AI:** SHAP values for every prediction, shown to admins
- **Blockchain Logging:** Immutable, on-chain transaction record deployed locally
- **Federated Learning:** Model trained on distributed clients and aggregated centrally
- **Admin Dashboard:** Logs, fraud scores, SHAP values, user/IP metadata
- **PDF Receipt:** Post-payment invoice generated
- **PWA:** Progressive Web Application Support

---

## Tech Stack & Architecture

### Client (React + Vite)

- **Core Packages:**
  - `react`, `react-dom`, `react-router-dom`: App UI & routing
  - `axios`: REST API handling
  - `@stripe/react-stripe-js`, `@stripe/stripe-js`: Stripe integration
  - `lucide-react`: UI icons
  - `react-toastify`: Toast notifications
- **Styling & Build Tools:**
  - `tailwindcss`, `postcss`, `autoprefixer`
  - `vite`: Lightning-fast frontend bundler
  - `eslint`: Linting for clean code

### Server (Node.js + Express)

- **Security & Auth:**
  - `bcryptjs`, `jsonwebtoken`, `cookie-parser`, `cors`, `dotenv`
  - `speakeasy`: MFA secret generation
  - `qrcode`: Render QR codes for MFA setup
- **Backend Logic & Utils:**
  - `mongoose`: MongoDB ODM(Object Data Modelling)
  - `axios`, `node-fetch`: HTTP requests
  - `nodemailer`: Email verification and recovery
  - `stripe`: Payment processing
  - `validator`: Email validation
  - `pdfkit`: PDF invoice generation
  - `ethers`: Blockchain contract integration
  - `express-async-handler`, `morgan`: Logging and async handling
- **Dev Tools:**
  - `nodemon`: Auto server reload

### ML Model (Python + FastAPI)

- **Core Packages:**
  - `fastapi`, `uvicorn`: API server
  - `xgboost`, `shap`, `joblib`, `pandas`, `scikit-learn`, `numpy`
- **Features:**
  - Fraud detection API
  - SHAP-based explainability
  - Simulated federated learning (3 local clients)
  - Weekly model aggregation pipeline

### Blockchain (Local via Hardhat)

- **Smart Contract (Solidity):**
  - Logs each transaction with fraud flag, IP, and metadata
- **Hardhat Stack:**
  - `hardhat`, `@nomicfoundation/hardhat-toolbox`
  - `ethers`: Used by both server and deploy scripts

---

## Transaction Lifecycle – Step-by-Step Flow

| Step                               | Description                                                                              |
| ---------------------------------- | ---------------------------------------------------------------------------------------- |
| **1. Add to Cart**                 | User selects a product and adds it to the cart.                                          |
| **2. Proceed to Checkout**         | User initiates the checkout process.                                                     |
| **3. Send Transaction to Backend** | Frontend sends transaction details to the backend API.                                   |
| **4. Fraud Detection (ML Model)**  | The backend calls the fraud detection ML API to analyze the transaction.                 |
| **5A. If Not Fraudulent**          | Transaction is considered safe.                                                          |
| → **Log to Blockchain**            | A record of the transaction is written to the local blockchain (via Hardhat + Solidity). |
| **6. Payment Gateway (Stripe)**    | Transaction proceeds to Stripe for payment processing.                                   |
| **7A. If Payment Successful**      |                                                                                          |
| → **Store in MongoDB Atlas**       | Successful transaction is saved in the database.                                         |
| → **Generate PDF Invoice**         | Invoice is generated using PDFKit.                                                       |
| → **Show Confirmation**            | User sees a confirmation screen.                                                         |
| **7B. If Payment Failed**          |                                                                                          |
| → **Notify User**                  | Payment failure message is shown to the user.                                            |
| **5B. If Fraudulent**              |                                                                                          |
| → **Reject & Notify**              | Transaction is rejected and the user is informed of suspected fraud.                     |

---

## 🚀 Getting Started

```bash
git clone https://github.com/Pintuknwr/Blockchain-Ai.git
cd Blockchain-Ai
```

### Environment Setup

Create `.env` in each directory (`client/`, `server/`, `ml-model/`):

**server/.env**

```env
MONGO_URI=
JWT_SECRET=
EMAIL_USER=
EMAIL_PASS=
EMAILVALIDATION_API_KEY=
STRIPE_SECRET_KEY=
```

**ml-model/.env**

```env
MODEL_PATH=model.joblib
```

---

## 🛠️ Installation & Dev

### ML Model

```bash
cd ../ml-model
pip install -r requirements.txt
uvicorn main:app --reload
```

### Blockchain (Local)

```bash
cd ../blockchain
npx hardhat compile
npx hardhat node
npx hardhat run scripts/deploy.js --network localhost
```

### Server

```bash
cd ../server
npm install
npm run dev
```

### Client

```bash
cd client
npm install
npm run dev
```

---

## Validations & Testing

- Use Swagger UI at `/docs` to test ML fraud detection
- Use Postman to test MFA, Stripe, Blockchain logging
- Admin dashboard displays SHAP values + metadata
- blockchain compiled and deployed locally

---

## Achievements

- End-to-end production-grade integration
- All security layers enforced
- Transparent AI decisions for admins
- Fully modular & extensible codebase
- Real-world use case potential

---

## Contributors

- **Pintu Kumar**
- **Kaushikee Kashyap**

---
