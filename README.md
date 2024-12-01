I'll provide the entire markdown content in a single block that you can directly copy and paste:

# Product View Tracker

A containerized Node.js application that integrates Firebase and Redis to track and display recently viewed products for authenticated users.

## Features

- **User Authentication:** Firebase Authentication for secure user login.
- **Recently Viewed Products:** Tracks products users viewed and stores them in Firestore under a `recentlyViewed` subcollection.
- **Caching:** Redis is used to cache frequently accessed data for faster performance.
- **Product Detail Page:** Displays product information, including category, brand, stock, and price.
- **API Versioning:** Follows a versioned API structure (`/api/v1`).
- **Swagger Documentation:** Comprehensive API documentation available.

## Prerequisites

Before starting, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v16 or later)
- [Docker](https://www.docker.com/)
- Firebase project configured with:
  - Firestore
  - Authentication

## Installation

### Clone the Repository

git clone <repo_url>
cd product-view-tracker

### Environment Variables

#### Backend

Create a `.env` file in the root directory with the following content:

VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
REDIS_HOST=redis
REDIS_PORT=6379
PORT=8000

#### Frontend

Create a `.env` file in the `frontend/` directory:

VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id

### Firebase Service Account

Add your Firebase service account JSON file as `serviceAccountKey.json` in the root directory. Obtain this file from your Firebase Console under Project Settings > Service Accounts.

### Run the Project

#### Using Docker

Build and start the Docker containers:

docker-compose up --build

The application will be available at: http://localhost:8000

## Usage

### API Endpoints

- `GET /api/v1/users/:userId/recentlyViewed`
  - Fetch recently viewed products for a user.
  - Requires Firebase authentication.

### Swagger Documentation

API documentation is available at:
http://localhost:8000/api/v1/docs
