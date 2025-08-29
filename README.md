# 🎓 Learnly - Learn by Building

A modern, full-stack e-learning platform that offers bite-size lessons with career-size impact. Built with React, Firebase, and modern web technologies.

**🌐 Live Demo:** [https://learnly-auth.web.app/](https://learnly-auth.web.app/)

## ✨ Features

### 🎯 Core Learning Features

- **Bite-size Lessons**: Concise, focused content designed for maximum retention
- **Interactive Quizzes**: Practice with engaging assessments to reinforce learning
- **Progress Tracking**: Real-time progress monitoring and achievement tracking
- **Course Management**: Comprehensive course creation and management tools

### 👥 Multi-Role System

- **Students**: Browse courses, track progress, and continue learning
- **Instructors**: Create and manage courses, view student progress
- **Administrators**: Manage users, courses, and platform content

### 🚀 User Experience

- **Responsive Design**: Modern, mobile-first interface built with Tailwind CSS
- **Smooth Animations**: Engaging interactions powered by Framer Motion
- **Lottie Animations**: Beautiful animated illustrations for enhanced UX
- **Authentication**: Secure Firebase-based authentication system

## 🛠️ Tech Stack

### Frontend

- **React 19** - Modern React with latest features
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **DaisyUI** - Component library built on Tailwind
- **React Router** - Client-side routing
- **Framer Motion** - Animation library
- **Lottie React** - Animated illustrations

### Backend

- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Firebase Admin** - Backend Firebase services

### Authentication & Hosting

- **Firebase Authentication** - User management and security
- **Vercel** - Backend deployment
- **Firebase Hosting** - Frontend hosting

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- MongoDB database
- Firebase project

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/Akhlakur07/learnly.git
   cd learnly
   ```

2. **Install client dependencies**

   ```bash
   cd client
   npm install
   ```

3. **Install server dependencies**

   ```bash
   cd ../server
   npm install
   ```

4. **Environment Setup**

   Create `.env` file in the server directory:

   ```env
   MONGODB_URI=your_mongodb_connection_string
   FIREBASE_PROJECT_ID=your_firebase_project_id
   FIREBASE_PRIVATE_KEY=your_firebase_private_key
   FIREBASE_CLIENT_EMAIL=your_firebase_client_email
   ```

5. **Firebase Configuration**

   Update `client/src/firebase/firebase.init.js` with your Firebase config:

   ```javascript
   const firebaseConfig = {
     apiKey: "your_api_key",
     authDomain: "your_project.firebaseapp.com",
     projectId: "your_project_id",
     storageBucket: "your_project.appspot.com",
     messagingSenderId: "your_sender_id",
     appId: "your_app_id",
   };
   ```

### Running the Application

1. **Start the backend server**

   ```bash
   cd server
   npm start
   ```

2. **Start the frontend development server**

   ```bash
   cd client
   npm run dev
   ```

3. **Build for production**
   ```bash
   cd client
   npm run build
   ```

## 📁 Project Structure

```
learnly/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── context/       # React context providers
│   │   ├── firebase/      # Firebase configuration
│   │   ├── pages/         # Application pages
│   │   │   ├── Admin/     # Admin-specific pages
│   │   │   ├── Authentication/ # Login/Register pages
│   │   │   ├── General/   # Public pages
│   │   │   ├── Instructor/ # Instructor-specific pages
│   │   │   ├── Profile/   # User profile pages
│   │   │   └── Student/   # Student-specific pages
│   │   └── routes/        # Application routing
│   └── public/            # Static assets
├── server/                # Backend Node.js application
│   ├── index.js          # Server entry point
│   └── package.json      # Backend dependencies
└── README.md             # This file
```

## 🔐 Authentication & Authorization

The application implements a role-based access control system:

- **Public Routes**: Home, Courses, FAQ, Login, Register
- **Student Routes**: Course details, Continue course, Student profile
- **Instructor Routes**: Add courses, Manage created courses, Instructor profile
- **Admin Routes**: Manage users, Manage courses, Post FAQs, Admin profile

## 🎨 Key Components

- **Navbar**: Responsive navigation with role-based menu items
- **Footer**: Site information and links
- **PrivateRoute**: Route protection for authenticated users
- **AuthContext**: Global authentication state management
- **Course Cards**: Interactive course display components
- **Progress Tracking**: Visual progress indicators and statistics

## 🚀 Deployment

### Frontend (Firebase Hosting)

```bash
cd client
npm run build
firebase deploy
```

### Backend (Vercel)

```bash
cd server
vercel --prod
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License.

## 🙏 Acknowledgments

- Built with modern web technologies
- Inspired by the need for accessible, bite-size learning
- Special thanks to the open-source community

---

**Ready to start learning?** Visit [https://learnly-auth.web.app/](https://learnly-auth.web.app/) and begin your learning journey! 🚀
