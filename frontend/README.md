# 📦 Parcel Delivery Management System

A **secure, scalable, and role-based Parcel Delivery System** built with **React.js**, **Redux Toolkit**, and **RTK Query**, inspired by real-world courier services like **Pathao Courier** and **Sundarban**.  
This application enables **Senders**, **Receivers**, and **Admins** to manage, track, and control parcel deliveries seamlessly.

---

## 🚀 Features Overview

### 🌍 Public Landing Pages

- **Home Page** – Introduces the service with a modern, responsive layout
- **About Page** – Highlights mission, vision, and team
- **Contact Page** – Simple inquiry form (with simulated submission)

---

## 🔐 Authentication & Authorization

- **JWT-based Authentication**
- **User Registration** (Sender or Receiver)
- **Login & Logout**
- **Role-Based Redirection** after login
- **Persistent Login State** (Remains logged in after page refresh)
- **Secure Password Hashing** with bcrypt (on backend)

---

## 🧭 Role-Based Dashboards

### 👤 Sender Dashboard

- Create new parcel delivery requests
- Cancel parcels (if not yet dispatched)
- View all created parcels with real-time status logs

### 📥 Receiver Dashboard

- View incoming parcels assigned to you
- Confirm parcel delivery upon receipt
- Review delivery history with timestamps

### 🛠️ Admin Dashboard

- Manage all users (block/unblock)
- Manage all parcels (update, block/unblock, assign delivery personnel)
- Monitor and update parcel delivery statuses

---

## 🔍 Parcel Tracking

- Every parcel has a **unique tracking ID**
- Public users can **search parcels** by tracking ID
- View **status timeline** with:
  - Current status
  - Timestamp
  - Updated by
  - Notes/comments

---

## 📊 Data Visualization & Analytics

- **Overview Cards:** Total Parcels, Delivered, In Transit, Pending, Cancelled
- **Charts:** Parcel trends & status distribution using Bar/Pie charts
- **Paginated Parcel Tables:** Search, filter, and sort parcels
- **Status Timeline:** Visual tracking of each parcel's journey
- **Role-Specific Views:** Different interfaces for Senders, Receivers, and Admins

---

## 🧩 Core Technologies

### ⚛️ Frontend

- **React.js** with **TypeScript**
- **React Router DOM** (for routing)
- **Redux Toolkit + RTK Query** (state management & API integration)
- **Tailwind CSS** (modern responsive UI)
- **React Icons / Recharts / Toastify** (for icons, charts, and notifications)

### ⚙️ Backend

- **Node.js** + **Express.js** (RESTful API)
- **MongoDB** + **Mongoose** (database & schema modeling)
- **JWT** for authentication
- **bcrypt** for password encryption

---

## 💡 Key Functionalities

- Role-Based Access Control (RBAC)
- Parcel Creation, Update, Cancellation, and Confirmation
- Global Loading Indicators and Error Handling
- Form Validation (required, numeric, positive checks)
- Pagination and Advanced Filtering
- Toast Notifications (success/error)
- Responsive and Accessible UI/UX

---

## 📱 Responsive Design

- Fully optimized for **mobile**, **tablet**, and **desktop**
- Consistent margins, spacing, and typography
- Accessible color contrast
- Skeleton loaders & lazy loading for performance

---

## 🧠 Folder Structure (Frontend)

src/
├── components/
├── pages/
├── features/
│ ├── auth/
│ ├── parcel/
│ ├── user/
├── redux/
│ ├── store.ts
│ ├── apiSlice.ts
├── hooks/
├── utils/
├── App.tsx
└── main.tsx

---

## 🧾 Installation & Setup

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/Sadid205/parcel-delivery-system-frontend-assignment-6.git



2️⃣ Install Dependencies
npm install

3️⃣ Create Environment Variables

Create a .env file and add:

VITE_BASE_URL=http://localhost:5000/api/v1

4️⃣ Run the Development Server
npm run dev


🤝 Contributing

Pull requests are welcome!
If you’d like to improve this project, feel free to fork it and submit a PR.


🧑‍🎓 Author

Md Abdullah Al Sadid
💼 Full Stack Developer | React | Django | Node.js
🌐 LinkedIn

📧 Email:abdullahalsadid1914@gmail.com
```
