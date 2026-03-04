## Better Auth
A beginner-friendly Next.js authentication system built with [Better Auth](https://better-auth.com/). This project provides a secure, fully-featured authentication flow perfectly suited for new developers looking to integrate authentication into their applications quickly without the complexity.

### Features

This project includes fully functional authentication pages and flows:

- **Sign Up / Sign In:** Secure user registration and login.
- **Email Verification:** Ensures users provide valid email addresses before fully accessing the application.
- **Forgot / Reset Password:** Allows users to easily recover their accounts.
- **OAuth Providers:** Out-of-the-box support for signing in with Google, GitHub, and Discord.
- **Session Management:** Handles active user sessions securely.

---

### Configuration & Setup

To get started, clone the repository and install the dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

Then, set up your `.env` file using the configuration options below. You can find a complete `.env.example` file in the root of the project. Simply copy `.env.example`, rename it to `.env`, and fill in the values. Here is what your `.env` file should look like:

```env
# Database URL
DATABASE_URL=postgresql://postgres:123456@localhost:5432/better-auth

# Better Auth Config
BETTER_AUTH_SECRET=
BETTER_AUTH_URL=http://localhost:3000 # Base URL of your app

# Social Providers
DISCORD_CLIENT_ID=
DISCORD_CLIENT_SECRET=

GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# MailTrap Credentials
MAILTRAP_USER=
MAILTRAP_PASS=
MAILTRAP_HOST=sandbox.smtp.mailtrap.io
MAILTRAP_PORT=2525
MAILTRAP_FROM_EMAIL=no-reply@better-auth-localhost3000.com
```

### 1. Setting Up the Database

This project uses Drizzle ORM and PostgreSQL. Make sure you have a valid Postgres connection string in your `.env` file under `DATABASE_URL`.

```env
DATABASE_URL=postgresql://user:password@host:port/dbname
```

### 2. Setting Up Email Delivery (Mailtrap & Nodemailer)

By default, the application is configured to send emails (Verification and Password Resets) using [Mailtrap](https://mailtrap.io/), a tool designed to trap emails in a virtual inbox so you can safely test during development.

**Option A: Using Mailtrap Email Testing (For Local Development Only)**

1. Create a free account at [Mailtrap](https://mailtrap.io/).
2. Navigate to **Email Testing** > **Inboxes** and select your inbox.
3. Click "Show Credentials" and copy your host, port, username, and password into your `.env`:

```env
# Mailtrap Sandbox configuration
MAILTRAP_HOST=sandbox.smtp.mailtrap.io
MAILTRAP_PORT=2525
MAILTRAP_USER=your_sandbox_username
MAILTRAP_PASS=your_sandbox_password

# A dummy "Send From" email for testing purposes
MAILTRAP_FROM_EMAIL=no-reply@better-auth-localhost3000.com
```

**Option B: Sending Real Emails using Mailtrap (Requires a Custom Domain)**

If you own a custom domain (e.g., `my-app.com`) and want to send real emails to your users:

1. In Mailtrap, go to **Email Sending** > **Domains**.
2. Add and verify your custom domain (Mailtrap will provide DNS records for you to add to your registrar).
3. Once verified, replace your sandbox `.env` credentials with the live ones:

```env
# Change from sandbox to live host
MAILTRAP_HOST=live.smtp.mailtrap.io
MAILTRAP_PORT=587

# Use the LIVE user/pass Mailtrap gives you
MAILTRAP_USER=your_live_mailtrap_username
MAILTRAP_PASS=your_live_mailtrap_password

# Must exactly match the domain you verified!
MAILTRAP_FROM_EMAIL=no-reply@your-real-domain.com
```

**Option C: Sending Real Emails using your Personal Gmail (Best for Beginners without a Custom Domain)**

If you don't own a custom domain but want to prove your app can send real emails, you can route them through your Gmail account securely using Nodemailer:

1. Ensure your Google Account has **2-Step Verification** turned on.
2. Go to your Google Account "Security" settings and search for **App Passwords**.
3. Create a new App Password named "NextJS App". Google will give you a 16-character string.
4. Update your `.env` like this:

```env
# Point to Google's Mail server
MAILTRAP_HOST=smtp.gmail.com
MAILTRAP_PORT=587

# Your real Google credentials
MAILTRAP_USER=your.actual.email@gmail.com
MAILTRAP_PASS=your_16_character_app_password

# Emails will be sent from your personal email
MAILTRAP_FROM_EMAIL=your.actual.email@gmail.com
```

### 3. Setting Up OAuth Providers (Google, GitHub, Discord)

To enable users to sign in via third-party services, you need to create developer applications for each provider.

**For Google:**
1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Create a new project. Look for "APIs & Services" > "Credentials".
3. Configure the OAuth consent screen.
4. Create new "OAuth client ID" credentials. Select "Web Application".
5. Set the Authorized Redirect URI to: `http://localhost:3000/api/auth/callback/google`.

```env
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

**For GitHub:**
1. Go to your [GitHub Settings > Developer settings > OAuth Apps](https://github.com/settings/developers).
2. Click "New OAuth App".
3. Set the Authorization callback URL to: `http://localhost:3000/api/auth/callback/github`.

```env
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
```

**For Discord:**
1. Go to the [Discord Developer Portal](https://discord.com/developers/applications).
2. Click "New Application".
3. Go to the "OAuth2" tab, add a new redirect under "Redirects".
4. Set the Redirect URI to: `http://localhost:3000/api/auth/callback/discord`.

```env
DISCORD_CLIENT_ID=your_discord_client_id
DISCORD_CLIENT_SECRET=your_discord_client_secret
```

### 4. Running the Development Server

Once your `.env` is fully set up, you can boot up the application!

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result and start testing the authentication flows!
