# FullStackProject myBooking (Replica-of-Airbnb)
# MyBooking

A full-stack property booking platform inspired by Airbnb, built using Node.js, Express.js, MongoDB Atlas, EJS, Cloudinary, Passport.js, and deployed on AWS EC2 with Nginx, PM2, and HTTPS.

---

## Live Demo

**Website:** https://mybooking.helpothers.space

---

## Features

### User Authentication

* Secure user registration and login
* Password hashing and salting using Passport Local Mongoose
* Session-based authentication
* Protected routes for authenticated users

### Property Listings

* Create new listings
* Edit existing listings
* Delete listings
* View detailed property information
* Property owner management

### Image Management

* Upload images directly to Cloudinary
* Cloud-based image storage
* Optimized image delivery

### Reviews & Ratings

* Add reviews for properties
* Star-based rating system
* Review ownership validation
* Automatic review cleanup when listings are deleted

### Authorization

* Listing owners can modify only their own properties
* Review authors can manage only their own reviews
* Route protection middleware

### Data Validation

* Joi schema validation
* Server-side validation
* Error handling middleware

### Deployment

* AWS EC2 hosting
* Nginx reverse proxy
* PM2 process management
* SSL certificate via Let's Encrypt
* MongoDB Atlas cloud database

---

## Tech Stack

### Frontend

* EJS
* HTML5
* CSS3
* JavaScript
* Bootstrap

### Backend

* Node.js
* Express.js

### Database

* MongoDB Atlas
* Mongoose ODM

### Authentication

* Passport.js
* Passport Local
* Passport Local Mongoose
* Express Session

### Cloud Services

* Cloudinary

### Deployment

* AWS EC2
* Nginx
* PM2
* Certbot SSL

---

## Project Architecture

```text
                     ┌─────────────────────┐
                     │      End User       │
                     └──────────┬──────────┘
                                │ HTTPS
                                ▼
                     ┌─────────────────────┐
                     │       Nginx         │
                     │   Reverse Proxy     │
                     └──────────┬──────────┘
                                │
                                ▼
                     ┌─────────────────────┐
                     │   Node.js + Express │
                     │      MyBooking      │
                     └──────────┬──────────┘
                                │
          ┌─────────────────────┼─────────────────────┐
          ▼                     ▼                     ▼

 ┌───────────────┐   ┌─────────────────┐   ┌─────────────────┐
 │ Passport Auth │   │   Cloudinary    │   │ MongoDB Atlas   │
 │ Sessions      │   │ Image Storage   │   │ Application DB  │
 └───────────────┘   └─────────────────┘   └─────────────────┘
```

---

## Listing Creation Flow

```text
User
 │
 ▼
Create Listing Form
 │
 ▼
Multer Middleware
 │
 ▼
Cloudinary Upload
 │
 ▼
Image URL Generated
 │
 ▼
MongoDB Atlas
 │
 ▼
Listing Stored
 │
 ▼
Success Response
```

---

## Database Design

### User

```javascript
{
  username,
  email,
  password(hash)
}
```

### Listing

```javascript
{
  title,
  description,
  image,
  price,
  location,
  country,
  owner,
  reviews[],
  approved
}
```

### Review

```javascript
{
  rating,
  comment,
  author,
  createdAt
}
```

---

## Security Features

* Password hashing and salting
* Session management
* Route protection
* Authorization middleware
* Server-side validation
* Cloud image storage
* Secure environment variables

---

## Installation

### Clone Repository

```bash
git clone <repository-url>
```

### Install Dependencies

```bash
npm install
```

### Configure Environment Variables

Create a `.env` file:

```env
ATLASDB_URL=
CLOUD_NAME=
CLOUD_API_KEY=
CLOUD_API_SECRET=
SECRET=
```

### Run Project

```bash
node app.js
```

---

## Deployment Architecture

```text
AWS EC2
 │
 ├── Nginx
 │
 ├── PM2
 │
 ├── Node.js Application
 │
 └── MongoDB Atlas
```

---

## Key Learnings

* Full-stack web development
* Authentication and authorization
* Cloud image storage
* MongoDB schema design
* RESTful routing
* AWS deployment
* Reverse proxy configuration
* SSL certificate management
* Production-grade application hosting

---

## Author

Rahul Shukla

B.Tech CSE'28 | Full Stack Developer

Tech Stack:
Node.js • Express.js • MongoDB • EJS • AWS • Cloudinary • PM2 • Nginx
