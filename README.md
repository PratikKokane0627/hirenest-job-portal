# 🚀 HireNest Job Portal

> A modern and responsive **MERN Stack Recruitment Platform** connecting **Students, HR Teams, and Admins** in one seamless hiring ecosystem.

✨ Built with scalability, clean UI, real-time communication, and role-based management in mind.

---

# 🌐 Live Demo

- 💻 Frontend: `https://hirenestjobs.vercel.app`
- ⚡ Backend API: `https://hirenest-job-portal-pbh8.onrender.com/api`

---

# ✨ Features

## 👨‍🎓 Student Features
- 🔐 JWT Authentication
- 👤 Profile Management
- 📄 Resume Upload
- 🔍 Smart Job Search & Filters
- ❤️ Save/Bookmark Jobs
- 📨 Apply for Jobs
- 📊 Track Application Status
- 💬 In-app Messaging
- 🔔 Real-time Notifications

---

## 🧑‍💼 HR / Recruiter Features
- 📝 Post New Jobs
- ✏️ Edit & Manage Jobs
- 👀 Review Candidates
- 📅 Schedule Interviews
- 📨 Send Offer Letters
- 🔎 Candidate Search
- 💬 HR Messaging System

---

## 🛡️ Admin Features
- ✅ HR Approval Management
- 👥 User Moderation
- 📋 Job Moderation
- 📊 Application Monitoring
- ⚙️ Platform Management Dashboard

---

# 🛠️ Tech Stack

| Category | Technologies |
|---|---|
| 🎨 Frontend | React, Vite, Bootstrap, Axios, Lucide React |
| ⚙️ Backend | Node.js, Express.js |
| 🗄️ Database | MongoDB + Mongoose |
| 🔐 Authentication | JWT |
| ☁️ File Uploads | Multer + Cloudinary |
| 🔔 Real-time | Socket.IO |
| 🚀 Deployment | Vercel + Render |

---

# 📂 Project Structure

```bash
HireNest/
│
├── Client/        # React + Vite Frontend
│
├── Server/        # Express + MongoDB Backend
│
└── README.md
```

---

# ⚡ Installation & Setup

## 1️⃣ Clone Repository

```bash
git clone https://github.com/your-username/hirenest-job-portal.git
cd hirenest-job-portal
```

---

## 2️⃣ Install Frontend Dependencies

```bash
cd Client
npm install
```

---

## 3️⃣ Install Backend Dependencies

```bash
cd ../Server
npm install
```

---

# 🔑 Environment Variables

## 📌 Server `.env`

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

---

## 📌 Client `.env`

```env
VITE_API_URL=http://localhost:8000/api
```

---

# 🌱 Database Seeding

## 👨‍💼 Seed Admin Account

```bash
npm run seed:admin --prefix Server
```

## 💼 Seed Sample Jobs

```bash
npm run seed:jobs --prefix Server
```

---

# 🔐 Admin Login

```bash
Email: your_admin_email
Password: your_admin_password
```

---

# ▶️ Run Application

## 🚀 Start Backend

```bash
npm run dev --prefix Server
```

## 💻 Start Frontend

```bash
npm run dev --prefix Client
```

---

# 🌍 Local URLs

| Service | URL |
|---|---|
| 💻 Frontend | http://localhost:6027 |
| ⚡ Backend API | http://localhost:8000/api |
| ❤️ Health Check | http://localhost:8000/api/health |

---

# ☁️ Deployment

## 🚀 Frontend Deployment (Vercel)

Configured with:
- ✅ SPA Routing
- ✅ `vercel.json`
- ✅ Production Build Optimization

---

## ⚡ Backend Deployment (Render)

### Required Environment Variables

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

---

# 🔥 Current Included Features

✅ Authentication System  
✅ Role-based Access  
✅ Resume Upload  
✅ Job Applications  
✅ Real-time Notifications  
✅ Interview Scheduling  
✅ Offer Letter System  
✅ Admin Moderation  
✅ Responsive UI  

---

# 🚀 Additional / Future Features

- 🔔 **Real-Time Notifications**: WebSockets for instant updates.
- 💬 **Messaging System**: In-app messaging between employers and students.
- 🤖 **Resume Parsing & Matching**: AI-based recommendations for job seekers.
- 🔖 **Job Bookmarking**: Students can save jobs for later applications.
- 📊 **Reports & Analytics**: Dashboard insights on job applications, user engagement, and hiring trends.

---

# 📱 Responsive Design

HireNest is fully optimized for:

- 💻 Desktop
- 📱 Mobile
- 📲 Tablets

---

# 🤝 Contributing

Contributions, issues, and feature requests are welcome!

```bash
Fork 🍴 → Clone 📥 → Commit ✅ → Push 🚀 → Pull Request 🔥
```

---

# ⭐ Support

If you like this project:

🌟 Star the repository  
🍴 Fork the project  
📢 Share with others  

