# Aura MarketVision - API Testing Guide

## Base URL

```
https://aura.bkumar-be23.workers.dev
```

---

## 🔐 Authentication

### 1. Signup

```bash
POST /api/auth/signup
Content-Type: application/json

{
  "email": "user@example.com",
  "username": "testuser",
  "password": "Test123!",
  "firstName": "John",
  "lastName": "Doe"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "user": { "id": 1, "email": "user@example.com", "username": "testuser" },
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

### 2. Login

```bash
POST /api/auth/login
Content-Type: application/json

{
  "username": "testuser",
  "password": "Test123!"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": { "id": 1, "username": "testuser", "subscriptionTier": "free" }
  }
}
```

### 3. Get Profile

```bash
GET /api/auth/me
Authorization: Bearer <token>
```

---

## 🔍 Property Search

### Search Properties

```bash
GET /api/properties?city=Mumbai&propertyType=apartment&minPrice=5000000&maxPrice=10000000&bedrooms=3
Authorization: Bearer <token>
```

**Query Params:**

- `city` - Mumbai, Delhi, Bangalore
- `locality` - e.g., Bandra West
- `propertyType` - apartment, villa, penthouse, studio, plot
- `minPrice`, `maxPrice` - Price range
- `minArea`, `maxArea` - Area in sqft
- `bedrooms`, `bathrooms` - Count
- `furnishingStatus` - unfurnished, semi-furnished, fully-furnished
- `page`, `limit` - Pagination

**Response:**

```json
{
  "success": true,
  "data": {
    "properties": [
      {
        "id": 1,
        "title": "Luxury 3BHK Apartment",
        "city": "Mumbai",
        "locality": "Bandra West",
        "price": 7500000,
        "pricePerSqft": 4498.8,
        "areaSqft": 1667,
        "bedrooms": 3,
        "bathrooms": 2
      }
    ],
    "pagination": { "total": 145, "page": 1, "limit": 20, "pages": 8 }
  }
}
```

---

## 🤖 AI Property Analysis

### Analyze Property with AI

```bash
POST /api/properties/analyze-ai
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Luxury 3BHK Apartment",
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

**Response:**

```json
{
  "success": true,
  "message": "Property analyzed successfully",
  "data": {
    "analysisId": 1,
    "analysis": {
      "fairMarketValue": { "min": 7200000, "max": 7800000 },
      "valuationStatus": "fair",
      "confidenceScore": 8.5,
      "summary": "This property is priced fairly within the Bandra West micro-market...",
      "priceAdvantagePercent": -3.5,
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
        }
      ],
      "growthFactors": [
        {
          "type": "infrastructure",
          "description": "Metro line within 1km",
          "impact": "high"
        }
      ]
    }
  }
}
```

### Quick Price Estimate

```bash
GET /api/properties/quick-estimate?city=Mumbai&locality=Bandra%20West&areaSqft=1500&propertyType=apartment
Authorization: Bearer <token>
```

**Response:**

```json
{
  "success": true,
  "data": {
    "estimate": {
      "minPrice": 6500000,
      "maxPrice": 7500000,
      "avgPrice": 7000000,
      "pricePerSqft": { "min": 4333, "max": 5000 },
      "confidence": 8.2
    }
  }
}
```

---

## 💾 Saved Properties

### Get Saved Properties

```bash
GET /api/properties/saved/all
Authorization: Bearer <token>
```

### Save Property

```bash
POST /api/properties/saved/:propertyId
Authorization: Bearer <token>
Content-Type: application/json

{
  "notes": "Great location",
  "tags": ["favorite", "urgent"]
}
```

### Remove Saved Property

```bash
DELETE /api/properties/saved/:propertyId
Authorization: Bearer <token>
```

---

## 🧪 Quick Test Flow

```bash
# 1. Signup
curl -X POST https://aura.bkumar-be23.workers.dev/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","username":"testuser","password":"Test123!","firstName":"Test","lastName":"User"}'

# 2. Login (save token)
curl -X POST https://aura.bkumar-be23.workers.dev/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"Test123!"}'

# 3. AI Analysis
curl -X POST https://aura.bkumar-be23.workers.dev/api/properties/analyze-ai \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Property",
    "propertyType": "apartment",
    "location": "Bandra West",
    "city": "Mumbai",
    "locality": "Bandra West",
    "price": 7500000,
    "areaSqft": 1667,
    "bedrooms": 3,
    "bathrooms": 2
  }'

# 4. Search Properties
curl "https://aura.bkumar-be23.workers.dev/api/properties?city=Mumbai" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## ❌ Error Responses

**400 Bad Request:**

```json
{
  "success": false,
  "error": { "code": "VALIDATION_ERROR", "message": "Invalid input" }
}
```

**401 Unauthorized:**

```json
{
  "success": false,
  "error": { "code": "UNAUTHORIZED", "message": "Invalid token" }
}
```

**404 Not Found:**

```json
{
  "success": false,
  "error": { "code": "NOT_FOUND", "message": "Resource not found" }
}
```

---

## ✅ Status

- **Deployed:** ✅ `https://aura.bkumar-be23.workers.dev`
- **Gemini API:** ✅ Configured
- **Database:** ✅ Cloudflare D1
- **Auth:** ✅ JWT tokens
- **AI Analysis:** ✅ Working

**Ready for testing!** 🚀
