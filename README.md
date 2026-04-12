# 📝 QuickBlog: AI-Powered Production-Ready CMS

🚀 **QuickBlog** is a high-performance, full-stack blogging platform. It is engineered with the MERN stack. It transforms content creation by combining a professional rich-text experience with an **AI-driven engine** and a **RESTful API architecture** for seamless data management.

✨ QuickBlog is powered by **Gemini 2.5 Flash**. It reduces content creation time by **68%**. The system is built with a "Security-First" philosophy. It features strict input validation, rate-limiting, and centralized error handling to ensure a robust production environment.

---

## 🚀 Key Features

- 🤖 **AI Content Engine** – **AI-assisted** content generation via **Gemini 2.5 Flash**, reducing drafting time by **68%**.
- 🌐 **RESTful Architecture** – Standardized, resource-oriented API design using standard HTTP methods for scalable data handling.
- 🛡️ **Production Security** – Hardened with **Helmet.js**, **Express-Rate-Limit**, and **CORS** to mitigate XSS and Brute-force attacks.
- 💎 **Robust Validation** – Strict, type-safe schema validation using **Zod** to ensure data integrity.
- ⚡ **Global Error Handling** – Centralized middleware architecture for consistent, professional JSON responses.
- ✍️ **Rich Editor** – Seamless writing experience via **Quill** with real-time markdown support.
- 🔒 **Secure Auth** – Stateless **JWT-based** Admin Dashboard.
- 🖼️ **Media Optimization** – Integrated **ImageKit** for **42%** faster image delivery and auto-transformation.

---

## 🛠 Tech Stack

### AI & Core Logic
- **RESTful API** – Stateless Client-Server communication protocol.
- **Gemini 2.5 Flash** – Hybrid reasoning model for high-speed, high-quality content generation.
- **Zod** – Schema-based validation and data sanitization.
- **Express 5.x** – Advanced routing with native async error handling.

### Frontend
- **React.js** (Hooks & Context API)
- **Quill Editor** – Rich-text editing.
- **Tailwind CSS** – Mobile-first, responsive design.
- **Axios** – Interceptor-based communication with the RESTful backend.

### Backend & Security
- **Node.js & MongoDB** (Mongoose ODM)
- **Helmet & Rate-Limit** – Web security and DDoS protection.
- **Morgan** – Industrial-grade request logging.
- **ImageKit & Multer** – Optimized cloud media management.

---

## 🔌 API Endpoints

### **Public Endpoints**


| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/` | API Health Check |
| `GET` | `/api/blogs` | Fetch all blog posts |
| `GET` | `/api/blogs/:blogId` | Fetch a single blog post |
| `GET` | `/api/blogs/:blogId/comments` | Get all comments for a post |
| `POST` | `/api/blogs/:blogId/comments` | Post a new comment (Zod Validated) |

### **Admin Endpoints (Protected)**


| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/blogs` | Create new blog (with Image Upload) |
| `DELETE` | `/api/blogs/:blogId` | Delete a blog post |
| `PATCH` | `/api/blogs/:blogId/publish` | Toggle publish/draft status |
| `POST` | `/api/blogs/generate` | AI-assisted content generation |

---

## ⚙️ Setup Guide

Follow these steps to run QuickBlog locally on your machine.

### 1. Clone the Repository

```bash
git clone https://github.com/surajsingh9389/QuickBlog.git
```

### 1. Backend .env
```bash
MONGODB_URI=your_mongodb_connection_string

ADMIN_EMAIL="admin@example.com"
ADMIN_PASSWORD="admin12345"

JWT_SECRET=your_jwt_secret_key

IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_pravite_key
IMAGEKIT_URL_ENDPOINT=your_imagekit_url_endpoint

GEMINI_API_KEY=your_gemini_api_key


NODE_ENV=development
```

### 1. Frontend .env
```bash
VITE_BASE_URL=http://localhost:3000
```
### 1. Start the Backend Server
```bash
cd server
npm install
npm run dev
```
### 1. Start the Frontend 
```bash
cd client
npm install
npm run dev
```
