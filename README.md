# RESTful API: User Auth & Product Management

A backend API built with **Node.js**, **Express**, and **PostgreSQL (TypeORM)** to handle:

- User registration with OTP verification
- Secure login using JWT
- Product management (CRUD)
- Geo-blocking users based on IP

---

## 🔧 Tech Stack

- Node.js
- Express
- PostgreSQL
- TypeORM
- JWT
- Bcrypt
- IP-based Geolocation

---

## 📦 Installation

### 1. Clone the repository

```bash
git clone https://github.com/saurabh3569/user-auth-and-product-management.git
cd user-auth-and-product-management
```

````

### 2. Install dependencies

```bash
npm install
```

### 3. Setup `.env` file

Create a `.env` file in the root of your project:

```env
PORT=3000
DATABASE_URL=postgres://postgres:postgres@localhost:5432/:dbname
JWT_SECRET=your_jwt_secret
NODE_ENV=development
```

Replace `your_jwt_secret` with a secure secret.

---

## 🗄️ Run Locally

Make sure PostgreSQL is running and a database named `assignment` exists.

Then run:

```bash
npm start
```

Server will start on `http://localhost:3000`

---

## 📮 API Endpoints

### 🔐 Auth

| Method | Route                  | Description                 |
| ------ | ---------------------- | --------------------------- |
| POST   | `/api/auth/signup`     | Register user (OTP sent)    |
| POST   | `/api/auth/login`      | Login and receive JWT       |
| POST   | `/api/auth/verify-otp` | Submit OTP for verification |

### 📦 Products (Requires JWT)

Send `Authorization: Bearer <token>` in headers.

| Method | Route               | Description          |
| ------ | ------------------- | -------------------- |
| GET    | `/api/products`     | Get all products     |
| GET    | `/api/products/:id` | Get single product   |
| POST   | `/api/products`     | Create a new product |
| PUT    | `/api/products/:id` | Update product       |
| DELETE | `/api/products/:id` | Delete product       |

---

## 🔍 Query Parameters (GET `/api/products`)

- `page` (default: 1)
- `limit` (default: 10)
- `sort` (default: name)
- `order` (`asc` or `desc`)
- `priceMin`, `priceMax` – filter by price

---

## 🌐 Notes

- OTP is simulated: returned in signup response.
- Restricted countries: `Syria`, `Afghanistan`, `Iran`
- JWT expires in 1 hour.

---
````
