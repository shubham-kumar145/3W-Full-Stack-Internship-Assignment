# 🌐 SocialApp — Mini Social Post Application

A full-stack MERN social media app with real-time features.

---

## 🛠 Tech Stack

**Frontend:** React.js · React Router · Axios · Material UI  
**Backend:** Node.js · Express.js · MongoDB · Mongoose · JWT  
**Storage:** Cloudinary · Multer  

---

## 📁 Project Structure
```
social-app/
├── backend/
│   ├── controllers/        # Auth & Post logic
│   ├── middleware/         # JWT auth & file upload
│   ├── models/             # User & Post schemas
│   ├── routes/             # API route definitions
│   ├── .env.example
│   ├── package.json
│   └── server.js
└── frontend/
    ├── public/
    ├── src/
    │   ├── components/     # Navbar, PostCard, CreatePost, etc.
    │   ├── context/        # AuthContext
    │   ├── pages/          # Login, Signup, Home
    │   └── services/       # API & auth service helpers
    ├── .env.example
    └── package.json
```

---

## ⚙️ Setup

### Backend
```bash
cd backend
npm install
cp .env.example .env   # fill in your values
npm run dev
```

### Frontend
```bash
cd frontend
npm install
cp .env.example .env   # set REACT_APP_API_URL
npm start
```

---

## 🔑 Environment Variables

**Backend `.env`**
```env
PORT=5000
MONGO_URI=your_mongodb_atlas_uri
JWT_SECRET=your_secret_key
CLOUDINARY_CLOUD_NAME=xxx
CLOUDINARY_API_KEY=xxx
CLOUDINARY_API_SECRET=xxx
CLIENT_URL=http://localhost:3000
```

**Frontend `.env`**
```env
REACT_APP_API_URL=http://localhost:5000/api
```

---

## 🚀 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | Register user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/posts` | Get all posts |
| POST | `/api/posts` | Create post |
| PUT | `/api/posts/:id/like` | Like / unlike |
| POST | `/api/posts/:id/comment` | Add comment |

---

## ✨ Features

- 🔐 JWT Authentication
- 📝 Create text / image / text+image posts
- ❤️ Like & comment on posts
- 📸 Image upload via Cloudinary
- 📱 Responsive design
- 🔒 Protected routes

---

## ☁️ Deployment

| Service | Platform |
|---------|----------|
| Frontend | Vercel / Netlify |
| Backend | Render |
| Database | MongoDB Atlas |
| Media | Cloudinary |
