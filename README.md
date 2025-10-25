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

- **`foodbank-app/`**
  - **`assets/`** — Icons, logos, splash images, and static assets
  - **`src/`**
    - **`components/`** — Reusable UI components (e.g., `Button`, `Input`, `Toast`)
    - **`navigation/`** — Navigation stack and routing setup (`AppNavigator.js`)
    - **`screens/`**
      - **`WelcomeScreen.js`** — Entry screen with app intro and “Get Started”
      - **`DashboardScreen.js`** — Post-registration landing screen
      - **`register/`** — Multi-step registration flow
        - `AccountInfoScreen.js`
        - `VerifyContactScreen.js`
        - `GovIdScreen.js`
        - `SelfieScreen.js`
        - `AddressScreen.js`
        - `ConsentScreen.js`
        - `ReviewSubmitScreen.js`
    - **`store/`** — Zustand global state store (for registration data)
    - **`utils/`** — Utility functions, API mocks, and validation logic
    - **`theme.js`** — Centralized styling tokens (colors, fonts, spacing)
  - **`App.js`** — Root application entry
  - **`app.json`** — Expo configuration & permissions
  - **`package.json`** — NPM dependencies and scripts
  - **`README.md`** — Project documentation
