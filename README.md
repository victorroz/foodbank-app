# 🍎 FoodBank LocalLink (Frontend)

> **URHacks 2025 – Theme: Living Local**

A mobile app built with **Expo (React Native)** that streamlines registration and verification for local food bank users.  
Residents can register, verify identity, and connect with nearby food-bank services through a clean, multi-step onboarding flow.

---

## 🧭 Overview

**Goal:** Strengthen local community access to food resources through verified, location-based registration.

This app covers the **recipient registration journey**:

1. Account creation
2. OTP verification
3. ID + Selfie upload
4. Address validation (city eligibility check)
5. Consent & privacy confirmation
6. Review + submit for admin approval

The backend (developed separately by the API team) handles verification, city-only constraints, and scheduling.

---

## ⚙️ Tech Stack

| Layer              | Technology                                                            |
| ------------------ | --------------------------------------------------------------------- |
| Framework          | [Expo SDK 52](https://docs.expo.dev/) + React Native                  |
| Navigation         | `@react-navigation/native`                                            |
| State Management   | [Zustand](https://docs.pmnd.rs/zustand)                               |
| Forms & Validation | [Formik](https://formik.org/) + [Yup](https://github.com/jquense/yup) |
| HTTP Client        | [Axios](https://axios-http.com/)                                      |
| File Uploads       | Expo Image Picker                                                     |
| Mock Backend       | Local mocks (matched to `FoodBank_LocalLink_Schema_v1.pdf`)           |

---

## 🗂 Folder Structure

foodbank-app/
├── assets/ # Icons, splash images
├── src/
│ ├── components/ # Shared UI (Button, Input, Toast, etc.)
│ ├── navigation/ # AppNavigator.js
│ ├── screens/
│ │ ├── WelcomeScreen.js
│ │ ├── DashboardScreen.js
│ │ └── register/ # Multi-step registration screens
│ ├── store/ # Zustand global store
│ ├── utils/ # API mocks, contracts, validation
│ └── theme.js # Colors, typography, spacing
├── App.js # Root app entry
├── app.json # Expo config + permissions
├── package.json
└── README.md
