# API Configuration Guide

## 📋 Overview

File này hướng dẫn cách cấu hình API endpoints cho SecondBicycle Frontend.

## 📁 File Structure

```
src/
├── constants/
│   ├── api.ts          # API configuration & endpoints
│   └── routes.ts       # Frontend routes
├── services/
│   └── auth.service.ts # Authentication service
```

## 🔧 Configuration

### 1. Environment Variables

Tạo file `.env` từ `.env.example`:

```bash
cp .env.example .env
```

Cấu hình trong `.env`:

```env
# Development (Local Backend)
VITE_API_BASE_URL=http://localhost:5000/api

# Production (khi BE deploy)
# VITE_API_BASE_URL=https://api.secondbicycle.com/api
```

### 2. API Constants (`src/constants/api.ts`)

#### API_CONFIG

- `BASE_URL`: Lấy từ `VITE_API_BASE_URL` hoặc fallback về localhost
- `LOCAL_URL`: URL development (localhost:5000)
- `PRODUCTION_URL`: URL production (cập nhật khi BE deploy)
- `TIMEOUT`: Request timeout (30s)

#### API_ENDPOINTS

Tất cả endpoints được định nghĩa sẵn:

**Authentication:**

- `/auth/send-otp` - Gửi OTP qua email
- `/auth/verify-otp` - Xác minh OTP
- `/auth/register` - Đăng ký tài khoản
- `/auth/login` - Đăng nhập
- `/auth/google` - Google OAuth
- `/auth/logout` - Đăng xuất
- `/auth/refresh-token` - Refresh token
- `/auth/forgot-password` - Quên mật khẩu
- `/auth/reset-password` - Đặt lại mật khẩu

**User:**

- `/user/profile` - Lấy thông tin user
- `/user/profile/update` - Cập nhật profile
- `/user/change-password` - Đổi mật khẩu
- `/user/avatar` - Upload avatar

**Bikes:**

- `/bikes` - Danh sách xe
- `/bikes/:id` - Chi tiết xe
- `/bikes/search` - Tìm kiếm
- `/bikes/filter` - Lọc xe

**Cart, Wishlist, Orders, Seller, Inspector, Admin:**

- Xem file `api.ts` để biết chi tiết

## 🚀 Usage

### Trong Service Files

```typescript
import { API_CONFIG, API_ENDPOINTS } from "../constants/api";
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
});

// Sử dụng endpoint
const login = async (email: string, password: string) => {
  const response = await axiosInstance.post(API_ENDPOINTS.AUTH.LOGIN, {
    email,
    password,
  });
  return response.data;
};
```

### Dynamic Endpoints

```typescript
// Lấy chi tiết bike
const bikeId = "123";
const endpoint = API_ENDPOINTS.BIKES.DETAIL(bikeId);
// => '/bikes/123'

const response = await axiosInstance.get(endpoint);
```

## 📝 Mock vs Real API

### Current Status (Mock)

Hiện tại `auth.service.ts` đang sử dụng **mock data**:

- OTP mặc định: `123456`
- Password mặc định: `12345678`
- Delay 1s để simulate network

### Khi Backend Ready

Uncomment code trong các TODO comments:

```typescript
// BEFORE (Mock)
sendOTP: async (email: string) => {
  // TODO: Replace with real API call
  // const response = await axiosInstance.post(API_ENDPOINTS.AUTH.SEND_OTP, { email });
  // return response.data;
  // Mock response...
};

// AFTER (Real API)
sendOTP: async (email: string) => {
  const response = await axiosInstance.post(API_ENDPOINTS.AUTH.SEND_OTP, {
    email,
  });
  return response.data;
};
```

## 🔐 Authentication Flow

1. **Register:**

   ```
   POST /auth/send-otp       { email }
   POST /auth/verify-otp     { email, otp }
   POST /auth/register       { email, password, otpToken }
   ```

2. **Login:**

   ```
   POST /auth/login          { email, password }
   ```

3. **Google OAuth:**
   ```
   POST /auth/google         { token: googleToken }
   ```

## 📞 Contact Backend Team

Khi Backend team gửi API documentation, cập nhật:

1. ✅ `PRODUCTION_URL` trong `api.ts`
2. ✅ Endpoints (nếu khác)
3. ✅ Request/Response format trong services
4. ✅ Remove mock code
5. ✅ Update `.env`

## ⚠️ Important Notes

- **NEVER** commit `.env` file (đã có trong `.gitignore`)
- **ALWAYS** update `.env.example` khi thêm env variables mới
- **CHECK** Backend API documentation trước khi integrate
- **TEST** với Postman/Insomnia trước khi code
