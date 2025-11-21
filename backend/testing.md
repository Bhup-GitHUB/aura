# API Testing Guide

## Base URL

- **Local**: `http://localhost:8787`
- **Production**: `https://your-worker.workers.dev`

---

## Authentication Flow

### 1. Signup

**Request:**

```bash
POST /api/auth/signup
Content-Type: application/json

{
  "email": "test@example.com",
  "username": "testuser",
  "password": "password123",
  "firstName": "Test",
  "lastName": "User",
  "brokerage": "ABC Realty"
}
```

**Response (201):**

```json
{
  "success": true,
  "message": "User created successfully",
  "data": {
    "user": {
      "id": 1,
      "email": "test@example.com",
      "username": "testuser",
      "subscriptionTier": "free"
    },
    "token": "eyJ1c2VySWQ...."
  }
}
```

### 2. Login

**Request:**

```bash
POST /api/auth/login
Content-Type: application/json

{
  "username": "testuser",
  "password": "password123"
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJ1c2VySWQ....",
    "user": {
      "id": 1,
      "email": "test@example.com",
      "username": "testuser",
      "subscriptionTier": "free"
    }
  }
}
```

### 3. Get Profile

**Request:**

```bash
GET /api/auth/me
Authorization: Bearer YOUR_TOKEN_HERE
```

**Response (200):**

```json
{
  "success": true,
  "data": {
    "id": 1,
    "email": "test@example.com",
    "username": "testuser",
    "firstName": "Test",
    "lastName": "User",
    "brokerage": "ABC Realty",
    "subscriptionTier": "free",
    "createdAt": "2024-11-21T10:00:00Z",
    "lastLogin": "2024-11-21T10:30:00Z",
    "profile": null
  }
}
```

### 4. Update Profile

**Request:**

```bash
PUT /api/auth/me
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: application/json

{
  "firstName": "Updated",
  "lastName": "Name",
  "phone": "+91-9876543210",
  "address": "123 Main St",
  "city": "Mumbai"
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "id": 1,
    "email": "test@example.com",
    "username": "testuser",
    "firstName": "Updated",
    "lastName": "Name",
    "profile": {
      "phone": "+91-9876543210",
      "address": "123 Main St",
      "city": "Mumbai"
    }
  }
}
```

### 5. Change Password

**Request:**

```bash
PUT /api/auth/change-password
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: application/json

{
  "currentPassword": "password123",
  "newPassword": "newpassword456"
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

---

## Property Management

### 1. Create Property

**Request:**

```bash
POST /api/properties
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: application/json

{
  "title": "Luxury 3BHK Apartment",
  "description": "Spacious apartment with modern amenities",
  "propertyType": "apartment",
  "location": "Bandra West, Mumbai",
  "city": "Mumbai",
  "locality": "Bandra West",
  "address": "Tower A, Sea View Complex",
  "latitude": 19.0596,
  "longitude": 72.8295,
  "price": 7500000,
  "areaSqft": 1667,
  "bedrooms": 3,
  "bathrooms": 2,
  "furnishingStatus": "fully-furnished",
  "floorNumber": 12,
  "totalFloors": 20,
  "ageYears": 5,
  "amenities": ["gym", "pool", "parking", "security"]
}
```

**Response (201):**

```json
{
  "success": true,
  "message": "Property created successfully",
  "data": {
    "id": 1,
    "title": "Luxury 3BHK Apartment",
    "propertyType": "apartment",
    "city": "Mumbai",
    "locality": "Bandra West",
    "price": 7500000,
    "pricePerSqft": 4498.8,
    "areaSqft": 1667,
    "bedrooms": 3,
    "bathrooms": 2,
    "createdAt": "2024-11-21T10:00:00Z"
  }
}
```

### 2. Search Properties

**Request:**

```bash
GET /api/properties?city=Mumbai&locality=Bandra&minPrice=5000000&maxPrice=10000000&bedrooms=3&page=1&limit=20
Authorization: Bearer YOUR_TOKEN_HERE
```

**Response (200):**

```json
{
  "success": true,
  "data": {
    "properties": [
      {
        "id": 1,
        "title": "Luxury 3BHK Apartment",
        "propertyType": "apartment",
        "location": "Bandra West, Mumbai",
        "city": "Mumbai",
        "locality": "Bandra West",
        "price": 7500000,
        "pricePerSqft": 4498.8,
        "areaSqft": 1667,
        "bedrooms": 3,
        "bathrooms": 2,
        "furnishingStatus": "fully-furnished",
        "createdAt": "2024-11-21T10:00:00Z"
      }
    ],
    "pagination": {
      "total": 45,
      "page": 1,
      "limit": 20,
      "pages": 3
    }
  }
}
```

### 3. Get Property by ID

**Request:**

```bash
GET /api/properties/1
Authorization: Bearer YOUR_TOKEN_HERE
```

**Response (200):**

```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "Luxury 3BHK Apartment",
    "description": "Spacious apartment with modern amenities",
    "propertyType": "apartment",
    "location": "Bandra West, Mumbai",
    "city": "Mumbai",
    "locality": "Bandra West",
    "price": 7500000,
    "pricePerSqft": 4498.8,
    "areaSqft": 1667,
    "bedrooms": 3,
    "bathrooms": 2,
    "amenities": ["gym", "pool", "parking", "security"],
    "latestAnalysis": null
  }
}
```

### 4. Update Property

**Request:**

```bash
PUT /api/properties/1
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: application/json

{
  "price": 7800000,
  "description": "Updated description with price change"
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Property updated successfully",
  "data": {
    "id": 1,
    "price": 7800000,
    "pricePerSqft": 4678.7,
    "description": "Updated description with price change",
    "updatedAt": "2024-11-21T11:00:00Z"
  }
}
```

### 5. Delete Property

**Request:**

```bash
DELETE /api/properties/1
Authorization: Bearer YOUR_TOKEN_HERE
```

**Response (200):**

```json
{
  "success": true,
  "message": "Property deleted successfully"
}
```

### 6. Get Nearby Properties

**Request:**

```bash
GET /api/properties/nearby/1?radius=2
Authorization: Bearer YOUR_TOKEN_HERE
```

**Response (200):**

```json
{
  "success": true,
  "data": [
    {
      "id": 2,
      "title": "Spacious 2BHK",
      "city": "Mumbai",
      "locality": "Bandra West",
      "price": 6500000,
      "pricePerSqft": 5200
    }
  ]
}
```

### 7. Compare Properties

**Request:**

```bash
POST /api/properties/compare
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: application/json

{
  "propertyIds": [1, 2, 3]
}
```

**Response (200):**

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "Luxury 3BHK",
      "price": 7500000,
      "pricePerSqft": 4498.8,
      "analysis": null
    },
    {
      "id": 2,
      "title": "Spacious 2BHK",
      "price": 6500000,
      "pricePerSqft": 5200,
      "analysis": null
    }
  ]
}
```

---

## Saved Properties

### 1. Save Property

**Request:**

```bash
POST /api/properties/saved/1
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: application/json

{
  "notes": "Great location near metro",
  "tags": ["favorite", "premium", "urgent"]
}
```

**Response (201):**

```json
{
  "success": true,
  "message": "Property saved successfully",
  "data": {
    "id": 1,
    "userId": 1,
    "propertyId": 1,
    "notes": "Great location near metro",
    "tags": ["favorite", "premium", "urgent"],
    "savedAt": "2024-11-21T10:00:00Z"
  }
}
```

### 2. Get Saved Properties

**Request:**

```bash
GET /api/properties/saved/all
Authorization: Bearer YOUR_TOKEN_HERE
```

**Response (200):**

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "notes": "Great location near metro",
      "tags": ["favorite", "premium"],
      "savedAt": "2024-11-21T10:00:00Z",
      "property": {
        "id": 1,
        "title": "Luxury 3BHK",
        "price": 7500000,
        "city": "Mumbai"
      }
    }
  ]
}
```

### 3. Update Saved Property

**Request:**

```bash
PUT /api/properties/saved/1
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: application/json

{
  "notes": "Updated notes - scheduled viewing",
  "tags": ["favorite", "viewing-scheduled"]
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Saved property updated successfully"
}
```

### 4. Remove Saved Property

**Request:**

```bash
DELETE /api/properties/saved/1
Authorization: Bearer YOUR_TOKEN_HERE
```

**Response (200):**

```json
{
  "success": true,
  "message": "Property removed from saved list"
}
```

---

## Error Responses

### 400 Bad Request

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Username must be at least 3 characters"
  }
}
```

### 401 Unauthorized

```json
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Invalid or expired token"
  }
}
```

### 404 Not Found

```json
{
  "success": false,
  "error": {
    "code": "PROPERTY_NOT_FOUND",
    "message": "Property not found"
  }
}
```

### 500 Internal Server Error

```json
{
  "success": false,
  "error": {
    "code": "INTERNAL_SERVER_ERROR",
    "message": "Internal server error"
  }
}
```
