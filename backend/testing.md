# Backend Testing Guide

## Deployment URL
```
https://aura.bkumar-be23.workers.dev
```

## Endpoints

### Health Check
```
GET /health
```
**Response:**
```json
{
  "status": "ok",
  "timestamp": "2025-11-21T07:04:43.214Z"
}
```

### Signup
```
POST /api/auth/signup
```
**Request:**
```json
{
  "username": "testuser",
  "password": "testpass123"
}
```
**Response:**
```json
{
  "success": true,
  "message": "User created successfully",
  "data": {
    "user": {
      "id": 1,
      "username": "testuser"
    }
  }
}
```

### Login
```
POST /api/auth/login
```
**Request:**
```json
{
  "username": "testuser",
  "password": "testpass123"
}
```
**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "4730aec65db34a1a487ff0380bf0e2299580bb4ec4bf90c319036804b999d2b7",
    "user": {
      "id": 1,
      "username": "testuser"
    }
  }
}
```

