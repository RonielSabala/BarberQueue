# BarberQueue

BarberQueue is a web application designed to improve the waiting experience at barbershops in the Dominican Republic. It provides real-time queue visualization, group handling, barber preference management, and basic administration tools so customers and businesses can better manage time, reduce uncertainty, and improve satisfaction.

---

## Table of Contents

- [Motivation](#motivation)
- [Solution](#solution)
- [Out of Scope](#out-of-scope)
- [Installation](#installation)
  - [Requirements](#requirements)
  - [Virtual Environment Setup](#virtual-environment-setup)
  - [Install Dependencies](#install-dependencies)
  - [`.env` Configuration](#env-configuration)
  - [Database Setup](#database-setup)
- [Run Locally](#run-locally)
- [Run Tests](#run-tests)
- [Email Notifications](#email-notifications)
- [Roles \& Permissions](#roles--permissions)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [Authors](#authors)
- [License](#license)

---

## Motivation

Barbershops are face-to-face businesses where clients must be physically present. A simple "one-in, one-out" model is impractical: barbershops expect a steady flow of clients and frequently multiple clients are present at once. This generates queues that create uncertainty, frustration and lost time for customers when they cannot know how long they will wait or what position they are in the queue.

Current challenges this project addresses:

- Clients cannot easily know how many people are ahead of them unless they are physically in the location.
- Groups (families or friends) arriving together increase queue length and complicate ordering.
- Client preferences for specific barbers alter queue behavior and increase uncertainty for those who arrive later.

## Solution

BarberQueue gives customers and barbershops tools to manage queues in real time, allowing:

- Clients to see live queue length and their position.
- Group handling so family members can join and move together.
- Barber preference selection (choose a favorite barber or accept the next available).
- Administrative views and basic management for barbershop staff.

---

## Out of Scope

The following items are explicitly out of scope for the current project:

- Management of multiple branches per barber business.
- Payment gateway integration (subscriptions & promotions).
- Push notifications and complex trigger-based notification system.

---

## Installation

### Requirements

- PHP>=8.4.7
- Python>=3.13.9
- Composer=>2.8.9
- MySQL>=8.0.42

---

### Virtual Environment Setup

Before installation, you'll need to execute this command in **PowerShell**:

```powershell
Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned -Force
```

> It allows running unsigned local scripts.

From the repository root:

```bash
# Create virtual environment
python -m venv .venv

# Activate (Windows)
.venv\Scripts\Activate.ps1

# Activate (macOS/Linux)
source .venv/bin/activate
```

---

### Install Dependencies

#### Python

```bash
python -m pip install --upgrade pip setuptools wheel
python -m pip install -e ".[dev]"
```

If you later modify dependencies:

```bash
python -m pip install -e . --upgrade
```

#### PHP

Use system terminal (recommended):

```bash
cd src
composer require google/apiclient vlucas/phpdotenv phpmailer/phpmailer
```

---

### `.env` Configuration

Create a `.env` under `src/config/.env` containing all keys shown below. Optional values may be left empty, but the keys should exist.

```env
# Database (required)
HOST='YOUR_DB_HOST'
USER='YOUR_DB_USER'
PASS='YOUR_DB_PASSWORD'

# Email (optional)
MAIL_USER='YOUR_GOOGLE_EMAIL'
MAIL_PASS='YOUR_APP_PASSWORD'

# Google OAuth (optional)
GOOGLE_CLIENT_ID='YOUR_GOOGLE_CLIENT_ID'
GOOGLE_CLIENT_SECRET='YOUR_GOOGLE_CLIENT_SECRET'
```

#### Email Setup (Optional)

1. Enable 2-Step Verification for `MAIL_USER` at [https://myaccount.google.com/security](https://myaccount.google.com/security).
2. Generate an App Password at [https://myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords) and paste it into `MAIL_PASS`.

#### Google Setup (Optional)

1. Create or select a project in [Google Cloud Console](https://console.cloud.google.com/).
2. Go to **APIs & Services** > **Credentials** and create **OAuth client ID**.
3. Choose **Web application** as the Application type and add the authorized redirect URI:

    ```md
    http://localhost:3000/auth/GoogleController.php
    ```

4. Copy **Client ID** and **Client secret** into `.env`.

---

### Database Setup

Run the DB install script:

```bash
php src/db/install.php
```

---

## Run Locally

Start the built-in PHP server:

```bash
php -S localhost:3000 -t src/public
```

Open your browser at: `http://localhost:3000`

---

## Run Tests

```bash
# From the repository root
pytest
```

A folder named `tests/results/` will be generated (if it does not already exist) where the screenshots and an HTML report of the executed tests will be saved.

---

## Email Notifications

- Password reset uses an email verification code flow.
- Ensure `MAIL_USER` and `MAIL_PASS` are set in `.env` for email functionality.

---

## Roles & Permissions

Four main roles exist in the system:

### `client` <!-- omit in toc -->

- Browse available barbershops and view their live queue.
- Join/leave a queue as an individual or as a group.
- Choose a preferred barber or opt for the next available barber.
- View personal turn details and, if in a group, view other group members' turns and group wait estimate.
- Leave reviews to barbers and barbershops.

### `barber` <!-- omit in toc -->

- Sign in/out for service shifts and mark breaks.
- View their personal queue with detailed information on assigned turns.
- Start/finish service for a client.
- Access personal statistics and historical performance metrics.

### `assistant` <!-- omit in toc -->

- Enqueue clients and groups on behalf of customers.
- Provide a staff-facing view of the live queue to support front-desk operations.
- Perform limited actions to support barbers (e.g., mark client as present, mark client as away).

### `admin` <!-- omit in toc -->

Full management of one or more barbershops they administer:

- CRUD operations for employees (barbers & assistants).
- Manage rules & settings: barbershop visibility, open/close times, maximum number of concurrent clients, allowed absence timeout, group policies, and queue assignment strategies.
- Upload and manage barbershop photos and content.
- View business-level dashboards, metrics and historical data.
- Moderate client reviews.

---

## Troubleshooting

- **Database connection error:** Verify `HOST`, `USER`, `PASS` in `src/config/.env` and ensure MySQL is running and accepting connections.
- **SQL script errors:** Confirm the DB user has the required privileges to create tables and insert data.
- **OAuth redirect issues:** Confirm the Google redirect URI in the provider console match exactly.
- **Emails not sent:** Verify that `MAIL_USER` and `MAIL_PASS` are correct and that the account's security settings allow SMTP or app-password usage.
- **Composer problems in VS Code terminal:** Use the system terminal (`cmd.exe`, Terminal.app, or your preferred shell).

---

## Contributing

Contributions are welcome. Suggested workflow:

1. Fork the repository.
2. Create a feature branch: `feat/my-change`
3. Commit, push, and open a pull request describing the change and reason.

> Please, ensure your code follows the existing style and includes appropriate documentation.

---

## Authors

| Name | ID | Contact |
| --- | ---: | --- |
| Roniel Antonio Sabala Germán | 20240212 | [ronielsabala@gmail.com](ronielsabala@gmail.com) |
| Yerelin Vanessa Rosario Taveras | 20231751 | [yerelinrosario26@gmail.com](yerelinrosario26@gmail.com) |
| Idelka Regina Rodríguez Jáquez | 20240255 | [rodriguezidelka17@gmail.com](rodriguezidelka17@gmail.com) |
| Jheinel Jesús Brown Curbata | 20240017 | [jheinelbrown@gmail.com](jheinelbrown@gmail.com) |

---

## License

This project is available under the **MIT License**.
