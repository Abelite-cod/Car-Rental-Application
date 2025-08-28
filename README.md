# 🚗 Car Rental Application

A complete **Car Rental Application** built with **Node.js, Express, MongoDB, and Flutterwave** for car rentals and payments.  
It includes **authentication (Email/Password + Google OAuth), car management, rental system, and secure payments.**

---

## ✨ Features

### 🔐 Authentication
- User Signup & Login
- JWT Authentication
- Google OAuth 2.0 Login
- Email Verification & OTP-based Password Reset
- Admin Role Management

### 👤 User Profile
- Upload, Update & Delete Profile Picture (Cloudinary)
- Update Profile Details
- View Profile

### 🚘 Car Management (Admin only)
- Add new cars
- Edit existing cars
- Delete cars
- Search available cars
- View all cars

### 📦 Rental System
- Rent a car with start & end dates
- Rental total price auto-calculated
- Rental status: `pending`, `paid`, `failed`

### 💳 Payments (Flutterwave Integration)
- Secure payments using Flutterwave
- Callback & Webhook handling
- Updates rental & car status after successful payment

---

## 🛠️ Tech Stack

- **Backend:** Node.js, Express.js
- **Database:** MongoDB with Mongoose
- **Authentication:** JWT + Google OAuth 2.0
- **Payments:** Flutterwave API
- **File Uploads:** Cloudinary
- **Other Tools:** Bcrypt, Multer, Nodemailer



----------------------------------------------------------
-----------------------------------------------------------

## ⚙️ Installation & Setup

1️⃣ Clone the repository

git clone https://github.com/Abelite-cod/Car-Rental-Application.git
cd Car-Rental-Application

---
2️⃣ Clone the repository
npm install

3️⃣ Create .env file

Inside the project root, create a .env file and add:

PORT=3000
MONGO_URL=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_EXPIRATION=1h

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:3000/api/auth/google/callback

# Flutterwave
FLW_PUBLIC_KEY=your_flutterwave_public_key
FLW_SECRET_KEY=your_flutterwave_secret_key

# Cloudinary
CLOUD_NAME=your_cloudinary_cloud_name
CLOUD_API_KEY=your_cloudinary_api_key
CLOUD_API_SECRET=your_cloudinary_api_secret

4️⃣ Run the server
npm start


Server runs at: http://localhost:3000

📡 API Endpoints
🔐 Auth

POST /api/auth/signup → Register user

POST /api/auth/login → Login user

PATCH /api/auth/make-admin/:userId → Make user an admin

POST /api/auth/forgot-password → Request OTP

POST /api/auth/reset-password/:userId → Reset password

POST /api/auth/verify-otp → Verify OTP

GET /api/auth/verify-email → Verify email

GET /api/auth/google → Google login

GET /api/auth/google/callback → Google OAuth callback

DELETE /api/auth/unlink-google/:userId → Unlink Google account

POST /api/auth/set-password/:userId → Set password for Google user

👤 Profile

GET /api/auth/profile → Get user profile

PUT /api/auth/profile → Update profile

POST /api/auth/profile/picture → Upload profile picture

DELETE /api/auth/profile/picture → Delete profile picture

🚘 Cars (Admin only)

POST /api/admin/add-car → Add car

GET /api/admin/search-cars → Search cars

GET /api/admin/get-cars → Get all cars

PUT /api/admin/edit-car/:carId → Edit car

DELETE /api/admin/delete-car/:carId → Delete car

📦 Rentals

POST /api/admin/rent-car/:carId → Rent a car

💳 Payments

GET /api/payment/callback → Flutterwave redirect callback

POST /api/payment/webhook → Flutterwave webhook (server-to-server)



------------------------------------------------------------------------------
------------------------------------------------------------------------------
🧪 API Testing (Example Requests & Responses)
1️⃣ Signup

Request

POST /api/auth/signup
{
  "firstName": "Abel",
  "lastName": "Okagbare",
  "email": "abel@example.com",
  "password": "StrongPass123"
}


Response

{
  "message": "User registered successfully",
  "user": {
    "_id": "64af67d2f5573904259f34cd",
    "firstName": "Abel",
    "lastName": "Okagbare",
    "email": "abel@example.com"
  },
  "token": "jwt_token_here"
}

2️⃣ Login

Request

POST /api/auth/login
{
  "email": "abel@example.com",
  "password": "StrongPass123"
}


Response

{
  "message": "Login successful",
  "token": "jwt_token_here",
  "user": {
    "_id": "64af67d2f5573904259f34cd",
    "email": "abel@example.com",
    "role": "user"
  }
}

3️⃣ Add Car (Admin)

Request

POST /api/admin/add-car
{
  "make": "Toyota",
  "model": "Corolla",
  "year": 2020,
  "price": 15000
}


Response

{
  "message": "Car added successfully",
  "car": {
    "_id": "64af67d2f5573904259f34ab",
    "make": "Toyota",
    "model": "Corolla",
    "year": 2020,
    "price": 15000,
    "isRented": false
  }
}

4️⃣ Rent a Car

Request

POST /api/admin/rent-car/64af67d2f5573904259f34ab
{
  "startDate": "2025-08-29",
  "endDate": "2025-09-01"
}


Response

{
  "message": "Rental created successfully",
  "rental": {
    "_id": "68af67d2f5573904259f34cd",
    "carId": "64af67d2f5573904259f34ab",
    "userId": "64af67d2f5573904259f34cd",
    "startDate": "2025-08-29",
    "endDate": "2025-09-01",
    "totalPrice": 45000,
    "status": "pending"
  },
  "paymentLink": "https://checkout.flutterwave.com/xxxxxx"
}

5️⃣ Payment Callback (After Success)

Response from backend

{
  "message": "Payment verified successfully",
  "rental": {
    "_id": "68af67d2f5573904259f34cd",
    "status": "paid"
  }
}

👨‍💻 Author

Abelite-cod (Abel Okagbare)
GitHub: [Abelite-cod](https://github.com/Abelite-cod/Car-Rental-Application)
