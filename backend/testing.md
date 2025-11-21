# Aura MarketVision - Backend API Testing Guide

## Base URL

```
https://aura.bkumar-be23.workers.dev
```

---

## 📋 Table of Contents

- [Authentication Routes](#authentication-routes)
- [Property Routes](#property-routes)
- [Saved Properties Routes](#saved-properties-routes)
- [Error Responses](#error-responses)

---

## 🔐 Authentication Routes

### 1. Health Check

**GET** `/health`

**Description:** Check if the API is running

**Auth Required:** ❌ No

**Response:**

```json
{
  "status": "ok",
  "timestamp": "2024-11-21T10:00:00.000Z"
}
```

---

### 2. User Signup

**POST** `/api/auth/signup`

**Description:** Create a new user account

**Auth Required:** ❌ No

**Request Body:**

```json
{
  "email": "user@example.com",
  "username": "johndoe",
  "password": "SecurePass123!",
  "firstName": "John",
  "lastName": "Doe",
  "brokerage": "ABC Realty"
}
```

**Success Response (201):**

```json
{
  "success": true,
  "message": "User created successfully",
  "data": {
    "user": {
      "id": 1,
      "email": "user@example.com",
      "username": "johndoe",
      "subscriptionTier": "free"
    },
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

**Error Response (400):**

```json
{
  "success": false,
  "error": {
    "code": "SIGNUP_ERROR",
    "message": "Username already exists"
  }
}
```

---

### 3. User Login

**POST** `/api/auth/login`

**Description:** Login with existing credentials

**Auth Required:** ❌ No

**Request Body:**

```json
{
  "username": "johndoe",
  "password": "SecurePass123!"
}
```

**Success Response (200):**

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "id": 1,
      "email": "user@example.com",
      "username": "johndoe",
      "subscriptionTier": "free"
    }
  }
}
```

**Error Response (401):**

```json
{
  "success": false,
  "error": {
    "code": "LOGIN_ERROR",
    "message": "Invalid credentials"
  }
}
```

---

### 4. Get User Profile

**GET** `/api/auth/me`

**Description:** Get current user's profile information

**Auth Required:** ✅ Yes

**Headers:**

```
Authorization: Bearer <your_token_here>
```

**Success Response (200):**

```json
{
  "success": true,
  "data": {
    "id": 1,
    "email": "user@example.com",
    "username": "johndoe",
    "firstName": "John",
    "lastName": "Doe",
    "brokerage": "ABC Realty",
    "subscriptionTier": "free",
    "createdAt": "2024-11-21T10:00:00.000Z",
    "lastLogin": "2024-11-21T10:30:00.000Z",
    "profile": {
      "id": 1,
      "userId": 1,
      "phone": "+91 9876543210",
      "address": "123 Main St",
      "city": "Mumbai",
      "preferences": null
    }
  }
}
```

---

### 5. Update User Profile

**PUT** `/api/auth/me`

**Description:** Update user profile information

**Auth Required:** ✅ Yes

**Headers:**

```
Authorization: Bearer <your_token_here>
```

**Request Body:**

```json
{
  "firstName": "Jane",
  "lastName": "Smith",
  "brokerage": "XYZ Realty",
  "phone": "+91 9876543210",
  "address": "123 Main St",
  "city": "Mumbai"
}
```

**Success Response (200):**

```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "id": 1,
    "email": "user@example.com",
    "username": "johndoe",
    "firstName": "Jane",
    "lastName": "Smith",
    "brokerage": "XYZ Realty",
    "subscriptionTier": "free",
    "profile": {
      "phone": "+91 9876543210",
      "address": "123 Main St",
      "city": "Mumbai"
    }
  }
}
```

---

### 6. Change Password

**PUT** `/api/auth/change-password`

**Description:** Change user password

**Auth Required:** ✅ Yes

**Headers:**

```
Authorization: Bearer <your_token_here>
```

**Request Body:**

```json
{
  "currentPassword": "OldPass123!",
  "newPassword": "NewPass456!"
}
```

**Success Response (200):**

```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

**Error Response (401):**

```json
{
  "success": false,
  "error": {
    "code": "PASSWORD_CHANGE_ERROR",
    "message": "Current password is incorrect"
  }
}
```

---

### 7. Refresh Token

**POST** `/api/auth/refresh`

**Description:** Refresh authentication token

**Auth Required:** ✅ Yes

**Headers:**

```
Authorization: Bearer <your_token_here>
```

**Success Response (200):**

```json
{
  "success": true,
  "message": "Token refreshed successfully",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

---

### 8. Logout

**POST** `/api/auth/logout`

**Description:** Logout user (client-side token removal)

**Auth Required:** ✅ Yes

**Headers:**

```
Authorization: Bearer <your_token_here>
```

**Success Response (200):**

```json
{
  "success": true,
  "message": "Logout successful"
}
```

---

## 🏠 Property Routes

### 9. Search Properties

**GET** `/api/properties`

**Description:** Search and filter properties

**Auth Required:** ✅ Yes

**Headers:**

```
Authorization: Bearer <your_token_here>
```

**Query Parameters:**

```
city            (optional) - Mumbai, Delhi, or Bangalore
locality        (optional) - e.g., Bandra, Worli
propertyType    (optional) - apartment, villa, penthouse, studio, plot
minPrice        (optional) - minimum price
maxPrice        (optional) - maximum price
minArea         (optional) - minimum area in sqft
maxArea         (optional) - maximum area in sqft
bedrooms        (optional) - number of bedrooms
bathrooms       (optional) - number of bathrooms
furnishingStatus (optional) - unfurnished, semi-furnished, fully-furnished
page            (optional) - page number (default: 1)
limit           (optional) - items per page (default: 20)
```

**Example Request:**

```
GET /api/properties?city=Mumbai&locality=Bandra&propertyType=apartment&minPrice=5000000&maxPrice=10000000&bedrooms=3&page=1&limit=20
```

**Success Response (200):**

```json
{
  "success": true,
  "data": {
    "properties": [
      {
        "id": 1,
        "title": "Luxury 3BHK Apartment in Bandra West",
        "description": "Spacious apartment with sea view",
        "propertyType": "apartment",
        "location": "Bandra West",
        "city": "Mumbai",
        "locality": "Bandra West",
        "address": "123 Hill Road",
        "latitude": 19.0596,
        "longitude": 72.8295,
        "price": 7500000,
        "pricePerSqft": 4498.8,
        "areaSqft": 1667,
        "bedrooms": 3,
        "bathrooms": 2,
        "furnishingStatus": "fully-furnished",
        "floorNumber": 12,
        "totalFloors": 20,
        "ageYears": 5,
        "amenities": "[\"gym\", \"pool\", \"parking\"]",
        "createdAt": "2024-11-21T10:00:00.000Z",
        "updatedAt": null
      }
    ],
    "pagination": {
      "total": 145,
      "page": 1,
      "limit": 20,
      "pages": 8
    }
  }
}
```

---

### 10. Get Property by ID

**GET** `/api/properties/:id`

**Description:** Get detailed information about a specific property

**Auth Required:** ✅ Yes

**Headers:**

```
Authorization: Bearer <your_token_here>
```

**Example Request:**

```
GET /api/properties/1
```

**Success Response (200):**

```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "Luxury 3BHK Apartment in Bandra West",
    "description": "Spacious apartment with sea view",
    "propertyType": "apartment",
    "location": "Bandra West",
    "city": "Mumbai",
    "locality": "Bandra West",
    "price": 7500000,
    "pricePerSqft": 4498.8,
    "areaSqft": 1667,
    "bedrooms": 3,
    "bathrooms": 2,
    "furnishingStatus": "fully-furnished",
    "latestAnalysis": {
      "id": 1,
      "propertyId": 1,
      "fairMarketValueMin": 7200000,
      "fairMarketValueMax": 7800000,
      "confidenceScore": 8.5,
      "valuationStatus": "fair"
    }
  }
}
```

**Error Response (404):**

```json
{
  "success": false,
  "error": {
    "code": "PROPERTY_NOT_FOUND",
    "message": "Property not found"
  }
}
```

---

### 11. Create Property

**POST** `/api/properties`

**Description:** Create a new property listing

**Auth Required:** ✅ Yes

**Headers:**

```
Authorization: Bearer <your_token_here>
Content-Type: application/json
```

**Request Body:**

```json
{
  "title": "Luxury 3BHK Apartment",
  "description": "Beautiful apartment with all amenities",
  "propertyType": "apartment",
  "location": "Bandra West",
  "city": "Mumbai",
  "locality": "Bandra West",
  "address": "123 Hill Road",
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

**Success Response (201):**

```json
{
  "success": true,
  "message": "Property created successfully",
  "data": {
    "id": 1,
    "title": "Luxury 3BHK Apartment",
    "propertyType": "apartment",
    "city": "Mumbai",
    "price": 7500000,
    "pricePerSqft": 4498.8,
    "areaSqft": 1667,
    "createdAt": "2024-11-21T10:00:00.000Z"
  }
}
```

---

### 12. Update Property

**PUT** `/api/properties/:id`

**Description:** Update an existing property

**Auth Required:** ✅ Yes

**Headers:**

```
Authorization: Bearer <your_token_here>
Content-Type: application/json
```

**Request Body (partial update allowed):**

```json
{
  "price": 8000000,
  "description": "Updated description",
  "furnishingStatus": "semi-furnished"
}
```

**Success Response (200):**

```json
{
  "success": true,
  "message": "Property updated successfully",
  "data": {
    "id": 1,
    "title": "Luxury 3BHK Apartment",
    "price": 8000000,
    "pricePerSqft": 4798.08,
    "updatedAt": "2024-11-21T11:00:00.000Z"
  }
}
```

---

### 13. Delete Property

**DELETE** `/api/properties/:id`

**Description:** Delete a property listing

**Auth Required:** ✅ Yes

**Headers:**

```
Authorization: Bearer <your_token_here>
```

**Success Response (200):**

```json
{
  "success": true,
  "message": "Property deleted successfully"
}
```

---

### 14. Get Property Analysis

**GET** `/api/properties/:id/analysis`

**Description:** Get AI analysis history for a property

**Auth Required:** ✅ Yes

**Headers:**

```
Authorization: Bearer <your_token_here>
```

**Success Response (200):**

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "propertyId": 1,
      "userId": 1,
      "fairMarketValueMin": 7200000,
      "fairMarketValueMax": 7800000,
      "confidenceScore": 8.5,
      "valuationStatus": "fair",
      "priceAdvantagePercent": -3.2,
      "aiSummary": "This property is priced fairly...",
      "riskFactors": "[{\"type\":\"age\",\"severity\":\"low\"}]",
      "growthFactors": "[{\"type\":\"infrastructure\",\"impact\":\"high\"}]",
      "rentalYieldPercent": 3.2,
      "projected5yGrowthPercent": 42,
      "livabilityScore": 9.2,
      "infrastructureScore": 8.7,
      "connectivityScore": 9.0,
      "analyzedAt": "2024-11-21T10:00:00.000Z"
    }
  ]
}
```

---

### 15. Get Nearby Properties

**GET** `/api/properties/nearby/:id`

**Description:** Get properties near a specific location

**Auth Required:** ✅ Yes

**Headers:**

```
Authorization: Bearer <your_token_here>
```

**Query Parameters:**

```
radius  (optional) - search radius in km (default: 2)
```

**Success Response (200):**

```json
{
  "success": true,
  "data": [
    {
      "id": 2,
      "title": "2BHK Apartment",
      "city": "Mumbai",
      "locality": "Bandra West",
      "price": 5500000,
      "areaSqft": 1200
    }
  ]
}
```

---

### 16. Compare Properties

**POST** `/api/properties/compare`

**Description:** Compare multiple properties side by side

**Auth Required:** ✅ Yes

**Headers:**

```
Authorization: Bearer <your_token_here>
Content-Type: application/json
```

**Request Body:**

```json
{
  "propertyIds": [1, 2, 3]
}
```

**Success Response (200):**

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "Luxury 3BHK",
      "price": 7500000,
      "areaSqft": 1667,
      "analysis": {
        "confidenceScore": 8.5,
        "valuationStatus": "fair"
      }
    },
    {
      "id": 2,
      "title": "Premium 2BHK",
      "price": 5500000,
      "areaSqft": 1200,
      "analysis": null
    }
  ]
}
```

---

## 🤖 AI-Powered Analysis Routes

### 21. Analyze Property with AI

**POST** `/api/properties/analyze-ai`

**Description:** Get comprehensive AI-powered property analysis using Google Gemini

**Auth Required:** ✅ Yes

**Headers:**

```
Authorization: Bearer <your_token_here>
Content-Type: application/json
```

**Request Body:**

```json
{
  "title": "Luxury 3BHK Apartment",
  "description": "Beautiful apartment with premium amenities",
  "propertyType": "apartment",
  "location": "Bandra West",
  "city": "Mumbai",
  "locality": "Bandra West",
  "price": 7500000,
  "areaSqft": 1667,
  "bedrooms": 3,
  "bathrooms": 2,
  "furnishingStatus": "fully-furnished",
  "floorNumber": 12,
  "totalFloors": 20,
  "ageYears": 5
}
```

**Success Response (200):**

```json
{
  "success": true,
  "message": "Property analyzed successfully",
  "data": {
    "analysisId": 1,
    "propertyInput": {
      "title": "Luxury 3BHK Apartment",
      "city": "Mumbai",
      "locality": "Bandra West",
      "price": 7500000,
      "areaSqft": 1667
    },
    "analysis": {
      "fairMarketValue": {
        "min": 7200000,
        "max": 7800000
      },
      "valuationStatus": "fair",
      "priceAdvantagePercent": -3.5,
      "confidenceScore": 8.5,
      "summary": "This property is priced fairly within the Bandra West micro-market. The location offers excellent connectivity and lifestyle amenities. Good investment potential with projected growth.",
      "metrics": {
        "rentalYieldPercent": 3.2,
        "projected5yGrowthPercent": 42,
        "livabilityScore": 9.2,
        "infrastructureScore": 8.7,
        "connectivityScore": 9.0
      },
      "riskFactors": [
        {
          "type": "age",
          "description": "Building age over 5 years",
          "severity": "low"
        },
        {
          "type": "market_saturation",
          "description": "High supply in micro-market",
          "severity": "medium"
        }
      ],
      "growthFactors": [
        {
          "type": "infrastructure",
          "description": "Metro line within 1km radius",
          "impact": "high"
        },
        {
          "type": "location",
          "description": "Prime Bandra West location",
          "impact": "high"
        },
        {
          "type": "amenities",
          "description": "Premium building with modern facilities",
          "impact": "medium"
        }
      ],
      "marketContext": {
        "microMarketAvgPrice": 4498,
        "macroMarketAvgPrice": 4273
      },
      "analyzedAt": "2024-11-21T12:00:00.000Z"
    }
  }
}
```

**Error Response (400):**

```json
{
  "success": false,
  "error": {
    "code": "AI_ANALYSIS_ERROR",
    "message": "Gemini API key not configured"
  }
}
```

---

### 22. Quick Price Estimate

**GET** `/api/properties/quick-estimate`

**Description:** Get a quick AI-powered price estimate for any location

**Auth Required:** ✅ Yes

**Headers:**

```
Authorization: Bearer <your_token_here>
```

**Query Parameters:**

```
city         (required) - Mumbai, Delhi, or Bangalore
locality     (required) - e.g., Bandra West, Koramangala
areaSqft     (required) - property area in square feet
propertyType (required) - apartment, villa, penthouse, studio, or plot
```

**Example Request:**

```
GET /api/properties/quick-estimate?city=Mumbai&locality=Bandra%20West&areaSqft=1500&propertyType=apartment
```

**Success Response (200):**

```json
{
  "success": true,
  "data": {
    "city": "Mumbai",
    "locality": "Bandra West",
    "areaSqft": 1500,
    "propertyType": "apartment",
    "estimate": {
      "minPrice": 6500000,
      "maxPrice": 7500000,
      "avgPrice": 7000000,
      "pricePerSqft": {
        "min": 4333,
        "max": 5000
      },
      "confidence": 8.2
    }
  }
}
```

**Error Response (400):**

```json
{
  "success": false,
  "error": {
    "code": "PRICE_ESTIMATE_ERROR",
    "message": "Missing required parameters: city, locality, areaSqft, propertyType"
  }
}
```

---

## 💾 Saved Properties Routes

### 17. Get All Saved Properties

**GET** `/api/properties/saved/all`

**Description:** Get all properties saved by the current user

**Auth Required:** ✅ Yes

**Headers:**

```
Authorization: Bearer <your_token_here>
```

**Success Response (200):**

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "notes": "Great location near metro station",
      "tags": "[\"favorite\", \"urgent\"]",
      "savedAt": "2024-11-21T10:00:00.000Z",
      "property": {
        "id": 1,
        "title": "Luxury 3BHK Apartment",
        "city": "Mumbai",
        "locality": "Bandra West",
        "price": 7500000,
        "areaSqft": 1667,
        "bedrooms": 3,
        "pricePerSqft": 4498.8
      }
    }
  ]
}
```

---

### 18. Save a Property

**POST** `/api/properties/saved/:propertyId`

**Description:** Add a property to saved list

**Auth Required:** ✅ Yes

**Headers:**

```
Authorization: Bearer <your_token_here>
Content-Type: application/json
```

**Request Body:**

```json
{
  "notes": "Great location near metro station",
  "tags": ["favorite", "urgent"]
}
```

**Success Response (201):**

```json
{
  "success": true,
  "message": "Property saved successfully",
  "data": {
    "id": 1,
    "userId": 1,
    "propertyId": 1,
    "notes": "Great location near metro station",
    "tags": "[\"favorite\", \"urgent\"]",
    "savedAt": "2024-11-21T10:00:00.000Z"
  }
}
```

**Error Response (400):**

```json
{
  "success": false,
  "error": {
    "code": "SAVE_PROPERTY_ERROR",
    "message": "Property already saved"
  }
}
```

---

### 19. Update Saved Property

**PUT** `/api/properties/saved/:propertyId`

**Description:** Update notes/tags for a saved property

**Auth Required:** ✅ Yes

**Headers:**

```
Authorization: Bearer <your_token_here>
Content-Type: application/json
```

**Request Body:**

```json
{
  "notes": "Updated notes - contacted owner",
  "tags": ["contacted", "negotiating"]
}
```

**Success Response (200):**

```json
{
  "success": true,
  "message": "Saved property updated successfully"
}
```

---

### 20. Remove Saved Property

**DELETE** `/api/properties/saved/:propertyId`

**Description:** Remove a property from saved list

**Auth Required:** ✅ Yes

**Headers:**

```
Authorization: Bearer <your_token_here>
```

**Success Response (200):**

```json
{
  "success": true,
  "message": "Property removed from saved list"
}
```

---

## ❌ Error Responses

### 400 Bad Request

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data"
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
    "code": "NOT_FOUND",
    "message": "Resource not found"
  }
}
```

### 500 Internal Server Error

```json
{
  "success": false,
  "error": {
    "code": "INTERNAL_SERVER_ERROR",
    "message": "An unexpected error occurred"
  }
}
```

---

## 🔑 Setup: Gemini API Key

Before using AI analysis features, you need to set up your Gemini API key:

### Get Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy your API key

### Add to Cloudflare Workers

```bash
cd backend
npx wrangler secret put GEMINI_API_KEY
# Paste your Gemini API key when prompted
```

### Verify Setup

```bash
# Check if secret is set
npx wrangler secret list
```

---

## 🧪 Testing with cURL

### Example: Complete Flow with AI Analysis

```bash
# 1. Health Check
curl https://aura.bkumar-be23.workers.dev/health

# 2. Signup
curl -X POST https://aura.bkumar-be23.workers.dev/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","username":"testuser","password":"Test123!","firstName":"Test","lastName":"User"}'

# 3. Login
curl -X POST https://aura.bkumar-be23.workers.dev/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"Test123!"}'

# Save the token from the response
TOKEN="your_token_here"

# 4. Get Profile
curl https://aura.bkumar-be23.workers.dev/api/auth/me \
  -H "Authorization: Bearer $TOKEN"

# 5. AI Property Analysis (NEW!)
curl -X POST https://aura.bkumar-be23.workers.dev/api/properties/analyze-ai \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Luxury 3BHK in Bandra",
    "propertyType": "apartment",
    "location": "Bandra West",
    "city": "Mumbai",
    "locality": "Bandra West",
    "price": 7500000,
    "areaSqft": 1667,
    "bedrooms": 3,
    "bathrooms": 2,
    "furnishingStatus": "fully-furnished",
    "floorNumber": 12,
    "totalFloors": 20,
    "ageYears": 5
  }'

# 6. Quick Price Estimate (NEW!)
curl "https://aura.bkumar-be23.workers.dev/api/properties/quick-estimate?city=Mumbai&locality=Bandra%20West&areaSqft=1500&propertyType=apartment" \
  -H "Authorization: Bearer $TOKEN"

# 7. Create a Property
curl -X POST https://aura.bkumar-be23.workers.dev/api/properties \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Property",
    "propertyType": "apartment",
    "location": "Bandra West",
    "city": "Mumbai",
    "locality": "Bandra West",
    "price": 7500000,
    "areaSqft": 1500,
    "bedrooms": 3,
    "bathrooms": 2
  }'

# 8. Search Properties
curl "https://aura.bkumar-be23.workers.dev/api/properties?city=Mumbai&propertyType=apartment" \
  -H "Authorization: Bearer $TOKEN"

# 9. Save a Property
curl -X POST https://aura.bkumar-be23.workers.dev/api/properties/saved/1 \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"notes":"Interested in this property","tags":["favorite"]}'

# 10. Get Saved Properties
curl https://aura.bkumar-be23.workers.dev/api/properties/saved/all \
  -H "Authorization: Bearer $TOKEN"
```

---

## 📝 Notes

- All timestamps are in ISO 8601 format
- All prices are in Indian Rupees (INR)
- Area measurements are in square feet (sqft)
- Token expires after 7 days
- Rate limiting applies based on subscription tier
- JSON arrays in database are stored as strings (need parsing)
- **Gemini API Key must be configured for AI analysis features**

---

## 🚀 Quick Test URLs

**Base:** `https://aura.bkumar-be23.workers.dev`

### Public Endpoints

- Health: `GET /health`
- Signup: `POST /api/auth/signup`
- Login: `POST /api/auth/login`

### Protected Endpoints (requires auth)

- Profile: `GET /api/auth/me`
- Properties: `GET /api/properties`
- Create Property: `POST /api/properties`
- **AI Analysis: `POST /api/properties/analyze-ai`** ⭐ NEW
- **Quick Estimate: `GET /api/properties/quick-estimate`** ⭐ NEW
- Saved Properties: `GET /api/properties/saved/all`

---

## 🎯 Features Implemented

✅ **Authentication System** - Signup, Login, Profile Management  
✅ **Property Management** - CRUD operations for properties  
✅ **Property Search** - Advanced filtering and search  
✅ **Saved Properties** - Bookmark and manage favorites  
✅ **AI-Powered Analysis** - Gemini integration for price analysis ⭐ NEW  
✅ **Quick Price Estimates** - Instant AI-powered valuations ⭐ NEW

---

**Version:** 1.1 (AI-Enhanced)  
**Last Updated:** November 21, 2024  
**Status:** ✅ Deployed with Gemini AI Integration  
**API:** `https://aura.bkumar-be23.workers.dev`
