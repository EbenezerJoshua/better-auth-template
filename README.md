# 🚀 Premium Better Auth Template

A sophisticated, production-ready authentication foundation for Next.js applications, powered by [Better Auth](https://better-auth.com/). This template provides a sleek, modern UI with a focus on security, user experience, and developer productivity.

---

## ✨ Features

### 🔐 Core Authentication
- **Multi-Provider Support**: Seamless sign-in with Google, GitHub, and Discord.
- **Email & Password**: Secure credential-based authentication.
- **Magic Links / One Tap**: Frictionless login experience with Google One Tap.
- **Email Verification**: Mandatory verification flow to ensure high-quality user data.

### 👤 Advanced Profile Management
- **Centralized Dashboard**: A clean overview of your account status.
- **Profile Customization**: Update your name and profile picture effortlessly.
- **Security Hub**:
  - **Change Password**: Securely update your credentials.
  - **Two-Factor Authentication (2FA)**: Add an extra layer of protection using TOTP (Authenticator apps).
  - **Passkeys (WebAuthn)**: Go passwordless with modern biometric or hardware keys.
- **Session Control**: View and manage all active sessions; revoke access to any device remotely.
- **Linked Accounts**: Connect multiple social providers to a single account for ultimate flexibility.
- **Danger Zone**: Secure account deletion process with email-based verification.

### 📧 Intelligent Communication
- **Personalized Welcome**: Automatic welcome emails sent upon registration.
- **Security Alerts**: Real-time notifications for account-critical actions.
- **Smart Sign-up**: Detects existing accounts and notifies users gracefully.
- **Transaction-Ready**: Fully styled, responsive email templates for all auth flows.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Authentication**: [Better Auth](https://better-auth.com/)
- **Database**: [PostgreSQL](https://www.postgresql.org/) with [Drizzle ORM](https://orm.drizzle.team/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/) & [Shadcn/UI](https://ui.shadcn.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Email**: [Nodemailer](https://nodemailer.com/) (Optimized for Mailtrap/SMTP)

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js (v18 or higher)
- A PostgreSQL database instance

### 2. Installation
Clone the repository and install dependencies:

```bash
git clone <repository-url>
cd better-auth
npm install
```

### 3. Environment Configuration
Copy `.env.example` to `.env` and fill in your credentials:

```bash
cp .env.example .env
```

#### Key Variables:
- **`DATABASE_URL`**: Your PostgreSQL connection string.
- **`BETTER_AUTH_SECRET`**: A cryptographically random string (min 32 chars).
- **`BETTER_AUTH_URL`**: Your app's base URL (e.g., `http://localhost:3000`).
- **`MAILTRAP_*`**: Your SMTP credentials for email delivery.
- **`*_CLIENT_ID` / `*_CLIENT_SECRET`**: OAuth credentials from Google, GitHub, and Discord.

### 4. Database Setup
Initialize your database schema and Better Auth tables:

```bash
npm run db:push
npm run auth:generate
```

### 5. Start Developing
Run the development server:

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to explore your new authentication system!

---

## 🛡️ Security & Best Practices

This template follows strict security guidelines:
- **CSRF Protection**: Built-in protection for all authentication routes.
- **Secure Sessions**: HTTP-only, secure cookies for session management.
- **Input Validation**: Robust validation using Zod for all forms and API endpoints.
- **Rate Limiting**: Prepared for production-scale traffic.

---

## 🤝 Contributing

Contributions are welcome! Feel free to open issues or submit pull requests to improve this template.

## 📄 License

This project is licensed under the MIT License.
