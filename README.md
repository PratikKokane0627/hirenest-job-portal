# HireNest Job Portal

A responsive MERN stack recruitment portal for students, HR teams, and admins. It supports job browsing, applications, profile management, HR job posting, candidate review, interview scheduling, offer-letter handling, messaging, notifications, and admin moderation.

## Tech Stack

Frontend: React, Vite, Bootstrap, Lucide React, Axios, Socket.IO Client, Toastr  
Backend: Node.js, Express.js, Socket.IO  
Database: MongoDB with Mongoose  
Authentication: JWT  
File Uploads: Multer and Cloudinary  
Deployment: Vercel frontend and Render backend

Advanced or future features such as AI resume screening, automated proctoring, payment processing, video interviews, external ATS integrations, and ML-based candidate ranking are intentionally not included in this version.

## Project Structure

```text
Client/   React + Vite + Bootstrap frontend
Server/   Express + MongoDB REST API
```

## Setup

Install frontend dependencies:

```bash
cd Client
npm install
```

Install backend dependencies:

```bash
cd Server
npm install
```

Environment files are included for local development. If you want to recreate them from examples:

```bash
copy Server\.env.example Server\.env
copy Client\.env.example Client\.env
```

Update `Server/.env`:

```env
PORT=8000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
CLIENT_URL=http://localhost:6027
ADMIN_EMAIL=your_admin_email
ADMIN_PASSWORD=your_admin_password
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

Update `Client/.env`:

```env
VITE_API_URL=http://localhost:8000/api
```

Start MongoDB locally or use a MongoDB Atlas connection string.

Seed the admin account:

```bash
npm run seed:admin --prefix Server
```

Seed sample jobs:

```bash
npm run seed:jobs --prefix Server
```

Admin login:

```text
your_admin_email
your_admin_password
```

Run the backend:

```bash
npm run dev --prefix Server
```

Run the frontend:

```bash
npm run dev --prefix Client
```

Frontend: `http://localhost:6027`  
Backend: `http://localhost:8000/api`  
Health check: `http://localhost:8000/api/health`

## Core Features

User registration and JWT login  
Role-based dashboards for students, HR, and admins  
Responsive mobile-friendly UI  
Student profile and resume upload  
Job search with filters  
Job saving/bookmarking  
Student job applications  
Application status tracking  
HR job posting and job management  
Candidate search and review  
Interview scheduling  
Offer letter generation and sending  
In-app messaging  
Real-time notifications with Socket.IO  
Admin HR approval management  
Admin user, job, and application moderation

## Deployment Notes

Frontend is configured for Vercel SPA routing with `vercel.json`.

Backend is designed for Render. Required Render environment variables:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
CLIENT_URL=https://your-vercel-domain.vercel.app
ADMIN_EMAIL=your_admin_email
ADMIN_PASSWORD=your_admin_password
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

The backend creates or updates the admin user on startup when `ADMIN_EMAIL` and `ADMIN_PASSWORD` are available.
