# 🚀 BizMatch – Business Partner Matching Platform

**BizMatch** is a business partner matching platform designed to help aspiring entrepreneurs find like-minded people to start and grow a business together.

Many people have business ideas but struggle to find the right partner with compatible interests, investment capacity, business goals, and location. BizMatch aims to make this process easier by bringing potential business partners together on a single platform.

## ✨ Features

- **User Authentication** – Secure user registration and login with JWT-based authentication.
- **User Profiles** – Create and update personal profiles.
- **Business Partner Discovery** – Designed to help users connect with potential business partners based on their business interests and preferences.
- **Invite Friends** – Send invitations and manage connection requests.
- **Request Management** – Accept or manage incoming invitations.
- **Messaging System** – Communicate with connected users.
- **Notifications** – Receive updates about requests and messages.
- **Responsive UI** – User-friendly interface for different screen sizes.
- **Protected Routes** – Restrict access to authenticated users.
- **RESTful APIs** – Backend APIs for authentication, profiles, messaging, and other application features.

## 🛠️ Tech Stack

**Frontend**
- React.js
- JavaScript
- Ant Design
- CSS
- React Router

**Backend**
- Node.js
- Express.js
- REST APIs
- JWT Authentication
- bcrypt

**Database**
- MongoDB
- Mongoose

**Tools**
- Git
- GitHub
- VS Code

## 🏗️ Architecture

BizMatch follows a client-server architecture.

1. **Frontend:** React provides the user interface and handles client-side navigation.
2. **Backend:** Node.js and Express.js process requests and implement application logic.
3. **Database:** MongoDB stores user profiles and application data.
4. **Authentication:** JWT-based authentication and protected routes help secure access to user-specific features.

## 📂 Project Structure

```text
BusinessPartner_AI_Application/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── ...
│   └── package.json
│
├── backend/
│   ├── Controller/
│   ├── Middleware/
│   ├── Routes/
│   ├── Models/
│   ├── Main.js
│   └── package.json
│
├── .gitignore
└── README.md
```

*Note: Adjust the folder names above to match your actual repository structure.*

## ⚙️ Getting Started

### Prerequisites

Make sure you have installed:

- Node.js and npm
- MongoDB
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/Chandugowdak/BusinessPartner_AI_Application.git
cd BusinessPartner_AI_Application
```

### 2. Set Up the Backend

```bash
cd backend
npm install
```

Create a `.env` file inside the `backend` directory:

```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/business_partner_ai
JWT_SECRET=your_secure_secret
```

Add any other environment variables required by your application.

Start the backend:

```bash
npm run dev
```

Ensure that your `package.json` contains the appropriate development script.

Email automation schedules are stored in the database and run daily using the selected time zone. Configure the `MAIL_*` SMTP values shown in `backend/.env.example`; the backend and database must remain available for scheduled delivery. Each scheduled attempt is recorded with manual sends in Email History.

### Create the first administrator account

If no administrator account exists, the first administrator can be created
from the frontend registration form by selecting **Administrator**. If an
administrator already exists, public admin registration is disabled and only
an existing administrator can create another from **Roles & permissions**.

The backend setup script is also available for initial administrator
bootstrapping. Set a unique administrator email and a strong password (at least
12 characters) in `backend/.env`, then run:

```bash
cd backend
npm run create:admin
```

After signing in, use **Create administrator** in **Roles & permissions** to
add additional administrators. Public registration creates standard users;
standard users start with no feature access. Admins can grant or revoke feature
access per user, enforced by both the interface and protected API routes.

### 3. Set Up the Frontend

Open a new terminal:

```bash
cd frontend
npm install
npm run dev
```

Use the local URL displayed by your frontend development server to open the application.

## 🔐 Security

- JWT-based authentication.
- Password hashing using bcrypt.
- Protected backend routes.
- Environment variables for sensitive configuration.
- Git ignore rules to help prevent accidental commits of secrets.

**Important:** Never commit your `.env` file, database credentials, JWT secrets, or API keys to GitHub.

## 🎯 Project Goals

- Help aspiring entrepreneurs find compatible business partners.
- Simplify communication between potential partners.
- Build a maintainable and scalable full-stack application.
- Strengthen practical knowledge of REST APIs, authentication, database integration, and full-stack development.
- Explore future enhancements such as intelligent partner recommendations and AI-assisted matching.

## 🚧 Future Enhancements

- AI-powered business partner recommendations.
- Matching based on business interests, investment range, and location.
- Advanced search and filtering.
- Real-time messaging and notifications.
- Image uploads and profile customization.
- Deployment with CI/CD automation.
- Improved scalability, monitoring, and security.

## 👨‍💻 Author

**Chandu Gowda**

Software Developer | Full-Stack Developer

- GitHub: [@Chandugowdak](https://github.com/Chandugowdak)

---

⭐ If you find this project interesting, consider giving the repository a star!
