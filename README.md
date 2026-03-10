# 🚀 Lead Management CRM - Gharpayy Assignment

A **Lead Management CRM MVP** built using the **MERN Stack** to capture leads, manage sales pipelines, assign ownership, schedule visits, and visualize lead progress through a dashboard.

This project was built as part of the **Gharpayy technical assignment** to demonstrate system design, product thinking, and full-stack development skills.

---

## 📌 Features

### 🧾 Lead Capture

- Create new leads with details like:
  - Name
  - Phone
  - Email
  - Property interest
  - Source

### 👤 Lead Assignment

- Assign leads to agents
- Track ownership of each lead

### 📊 Pipeline Management

Manage leads across different stages:

- New Lead
- Contacted
- Visit Scheduled
- Negotiation
- Closed

### 📅 Visit Scheduling

- Schedule property visits
- Track upcoming visits for leads

### 📈 Dashboard

Simple analytics dashboard showing:

- Total Leads
- Leads in Pipeline
- Scheduled Visits
- Closed Deals

---

## 🛠 Tech Stack

### 💻 Frontend

- ⚛️ React.js
- 🎨 CSS
- 📦 Axios

### 🖥 Backend

- 🟢 Node.js
- 🚂 Express.js

### 🗄 Database

- 🍃 MongoDB
- Mongoose ODM

### 🔧 Tools

- Git
- GitHub
- REST APIs
- Postman

---

## 🏗 System Architecture

```

Frontend (React)
↓
REST API (Node.js + Express)
↓
MongoDB Database

```

The frontend communicates with the backend through REST APIs which handle business logic and store data in MongoDB.

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/Asmaul360/gharPayy-CRM-.git
cd repository-name
```

---

### 2️⃣ Install Dependencies

Backend

```bash
cd backend
npm install
```

Frontend

```bash
cd frontend
npm install
```

---

### 3️⃣ Environment Variables

Create a `.env` file in the backend folder.

Example:

```
MONGO_URI=your_mongodb_connection
PORT=5000
JWT_SECRET=your_secret_key
```

---

### 4️⃣ Run the Application

Start backend

```bash
npm run dev
```

Start frontend

```bash
npm start
```

---

## 📂 Project Structure

```

project
│
├── backend
│   ├── controllers
│   ├── models
│   ├── routes
│   └── server.js
│
├── frontend
│   ├── components
│   ├── pages
│   └── App.js
│
└── README.md

```

---

## 📷 Screens

- Dashboard
- Lead Creation
- Pipeline Tracking
- Visit Scheduling

---

## 🎯 Assignment Objective

The goal of this project was to build a **Minimum Viable Product (MVP) CRM system** capable of:

- Capturing leads
- Assigning ownership
- Managing sales pipelines
- Scheduling visits
- Viewing insights through a dashboard

This demonstrates the ability to design a **scalable real-world CRM product**.

---

## 👨‍💻 Author

**Asmaul Mallick**

Third Year Engineering Student
Node.js Backend Developer

GitHub: [https://github.com/Asmaul360]

---

⭐ If you like this project, feel free to star the repository!

```


```
