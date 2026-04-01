# 🤝 Negotiation Game

A real-time, AI-driven negotiation platform where users can engage in strategic bargaining, track their performance on a global leaderboard, and refine their negotiation skills.

---

## 🔗 Demo Link
[Live Project Demo](https://negotiation-game.onrender.com)

---

## 🚀 Features

- **🤖 AI-Driven Negotiation**: Powered by **LangChain**, **Google Gemini**, and **Mistral AI** to provide realistic and challenging negotiation scenarios.
- **⚡ Real-Time Interaction**: Seamless communication using **Socket.io** for instant updates and collaborative features.
- **🏆 Global Leaderboard**: Track your negotiation successes and compete with others for the top spot.
- **🔐 Secure Authentication**: Integrated **JWT-based** authentication with **Bcrypt** encryption for secure user data and sessions.
- **📄 Document Processing**: Ability to parse and analyze negotiation-related documents using **pdf-parse**.
- **🖼️ Image Management**: Integrated with **ImageKit** for optimized image storage and processing.
- **📧 Automated Notifications**: Email alerts and updates via **Resend** and **Nodemailer**.
- **🏎️ High Performance**: Optimized with **Redis** for caching and state management.

---

## 🛠️ Technology Stack

### Frontend
- **Framework**: [React 19](https://react.dev/) (Vite-powered)
- **State Management**: [Redux Toolkit](https://redux-toolkit.js.org/)
- **Styling**: [Tailwind CSS 4.0](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Routing**: [React Router 7](https://reactrouter.com/)

### Backend
- **Runtime**: [Node.js](https://nodejs.org/) with [Express 5](https://expressjs.com/)
- **Database**: [MongoDB](https://www.mongodb.com/) using [Mongoose](https://mongoosejs.com/)
- **AI/LLM**: [LangChain](https://js.langchain.com/), [Google GenAI](https://ai.google.dev/), [Mistral AI](https://mistral.ai/)
- **Real-Time**: [Socket.io](https://socket.io/)
- **Caching**: [Redis (ioredis)](https://redis.io/)
- **Validation**: [Express Validator](https://express-validator.github.io/docs/)

---

## 📂 Project Structure

The project follows a clean and modular architecture, separating concerns between the **Frontend** and **Backend**.

### 🏗️ Root Directory
```text
.
├── Backend/        # Node.js Express server
└── Frontend/       # Vite-powered React application
```

### 💻 Frontend Structure (`/Frontend/src`)
The frontend uses a **Feature-Based Architecture**, making it highly scalable and maintainable.
- `/App`: Root application setup, global providers, and core logic.
- `/Features`: Each directory here contains all logic related to a specific domain:
  - `Auth/`: Login, Register, and Session management.
  - `Chat/`: Real-time negotiation interface and AI interactions.
  - `Home/`: Landing page and dashboard.
  - `Leaderboard/`: Ranking and performance metrics.
- `index.css`: Global styles and Tailwind configuration.
- `main.jsx`: Application entry point.

### ⚙️ Backend Structure (`/Backend/src`)
The backend follows a **Service-Oriented MVC Architecture**.
- `app.js`: Express application configuration.
- `/config`: Database connections, 3rd party API setups (ImageKit, Redis, Gemini).
- `/controllers`: Request handlers that manage business flow.
- `/middlewares`: Authentication, error handling, and file upload (Multer).
- `/models`: Mongoose schemas for Users, Negotiations, Games, etc.
- `/routes`: API endpoints mapping to controllers.
- `/services`: Core business logic, LangChain integrations, and external API calls.
- `/validator`: Request body and parameter validation rules.

---

## 🚥 Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB
- Redis Server
- API Keys for Google Gemini / ImageKit (if using AI/Images)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/RitamHaldar/Negotiation-Game.git
   cd Negotiation-Game
   ```

2. **Setup Backend:**
   ```bash
   cd Backend
   npm install
   # Create a .env file based on the environment variables needed
   npm run dev
   ```

3. **Setup Frontend:**
   ```bash
   cd ../Frontend
   npm install
   npm run dev
   ```

---
