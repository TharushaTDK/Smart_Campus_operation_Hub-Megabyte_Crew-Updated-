# Smart Campus Operations Hub

A full-stack web application for managing campus operations, built by Y3S2-WE-196. It provides role-based dashboards for Admins, Lecturers, Maintenance Staff, and Students to handle facilities, study sessions, attendance, maintenance, ticketing, and notifications.

---

## Tech Stack

| Layer     | Technology                                                                 |
|-----------|----------------------------------------------------------------------------|
| Backend   | Java 21, Spring Boot 3.3.2, Spring Security, OAuth2 (Google), Maven       |
| Database  | MongoDB Atlas                                                              |
| Frontend  | React 19, Vite, Tailwind CSS 4, React Router DOM 7, Axios                 |
| Storage   | Cloudinary (image hosting)                                                 |
| Email     | Gmail SMTP                                                                 |
| Auth      | Session-based + Google OAuth2                                              |

---

## Project Structure

```
Smart_Campus_operation_Hub/
├── backend/                  # Spring Boot application
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/smartcampus/
│   │   │   │   ├── config/       # Security, MongoDB, exception handling
│   │   │   │   ├── controllers/  # REST API controllers
│   │   │   │   ├── dto/          # Request/response DTOs
│   │   │   │   ├── models/       # MongoDB document models
│   │   │   │   ├── repositories/ # Spring Data MongoDB repositories
│   │   │   │   └── services/     # Business logic
│   │   │   └── resources/
│   │   │       └── application.properties
│   │   └── test/
│   └── pom.xml
└── frontend/                 # React + Vite application
    ├── src/
    │   ├── components/       # Shared UI components (Navbar, Footer)
    │   ├── pages/            # Page components by role
    │   └── App.jsx           # Root app with routing and auth context
    ├── public/
    ├── package.json
    └── vite.config.js
```

---

## Prerequisites

- Java 21 or higher
- Maven 3.8+ (or use the included `mvnw` wrapper)
- Node.js 18+ and npm
- A MongoDB Atlas cluster (or local MongoDB instance)
- A Google Cloud project with OAuth2 credentials (for Google login)
- A Cloudinary account (for image uploads)
- A Gmail account with an App Password (for email notifications)

---

## Setup

### 1. Clone the repository

```bash
git clone https://github.com/TharushaTDK/Smart_Campus_operation_Hub-Megabyte_Crew-Updated-.git
cd Smart_Campus_operation_Hub-Megabyte_Crew-Updated-
```

### 2. Configure the backend

Open `backend/src/main/resources/application.properties` and replace the placeholder values with your own credentials:

```properties
# MongoDB Atlas
spring.data.mongodb.uri=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/<dbname>?retryWrites=true&w=majority
spring.data.mongodb.database=Smart_campus

# Google OAuth2
spring.security.oauth2.client.registration.google.client-id=YOUR_GOOGLE_CLIENT_ID
spring.security.oauth2.client.registration.google.client-secret=YOUR_GOOGLE_CLIENT_SECRET
spring.security.oauth2.client.registration.google.redirect-uri=http://localhost:5173/login/oauth2/code/google

# Cloudinary
cloudinary.cloud-name=YOUR_CLOUD_NAME
cloudinary.api-key=YOUR_API_KEY
cloudinary.api-secret=YOUR_API_SECRET

# Gmail SMTP (use an App Password, not your account password)
spring.mail.username=your-email@gmail.com
spring.mail.password=your-app-password
app.mail.from=SmartCampus <your-email@gmail.com>
```

> Google OAuth2 setup: In Google Cloud Console, add `http://localhost:5173/login/oauth2/code/google` as an authorized redirect URI.

### 3. Run the backend

```bash
cd backend
./mvnw spring-boot:run
```

The API will start on http://localhost:8081.

### 4. Configure the frontend

The frontend uses a Vite dev proxy to route API calls to the backend. No additional configuration is needed for local development — it picks up the backend at `localhost:8081` automatically.

### 5. Run the frontend

```bash
cd frontend
npm install
npm run dev
```

The app will be available at http://localhost:5173.

---

## User Roles

| Role             | Access                                                                  |
|------------------|-------------------------------------------------------------------------|
| `ADMIN`          | Full access: users, facilities, maintenance, sessions, tickets          |
| `TEACHER`        | Manage own study sessions, scan QR attendance                           |
| `MAINTAIN_STAFF` | View and update maintenance requests                                    |
| `STUDENT`        | Browse sessions, show QR code, submit tickets, view notifications       |

---

## Key Features

- Authentication — Email/password registration and login, Google OAuth2 single sign-on
- Facility Management — Admins create and manage campus facilities
- Study Sessions — Lecturers schedule sessions; students browse and join
- QR Attendance — Students display a QR code; lecturers scan it to record attendance
- Maintenance Requests — Staff receive and resolve campus maintenance tickets
- Support Tickets — Students raise issues; admins respond via a threaded message system
- Notifications — Real-time server-sent events (SSE) for in-app alerts
- User Management — Admins add, edit, and assign roles to campus users
- Profile & Avatar — Users update personal info and upload profile images via Cloudinary

---

## Available Scripts

### Backend

| Command                  | Description                        |
|--------------------------|------------------------------------|
| `./mvnw spring-boot:run` | Start the development server       |
| `./mvnw test`            | Run unit and integration tests     |
| `./mvnw package`         | Build a production JAR             |

### Frontend

| Command         | Description                          |
|-----------------|--------------------------------------|
| `npm run dev`   | Start the Vite development server    |
| `npm run build` | Build for production (outputs `dist/`)|
| `npm run lint`  | Run ESLint                           |
| `npm run preview` | Preview the production build       |
