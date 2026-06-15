# PropSpace

A full-stack property listing application. Users can list, browse, update, and
delete properties for rent or sale, with authentication, a personal dashboard,
search filters, and account management.

## Tech stack

- **Frontend:** React + TypeScript (Vite), React Router, React Icons, native Fetch API
- **Backend:** Node.js + Express + TypeScript
- **Database:** MongoDB (Mongoose)
- **Auth:** JWT access tokens, bcrypt password hashing
- **Uploads:** Multer (image files stored on disk and served statically)

## Project structure

```
propspace/
├── backend/
│   └── src/
│       ├── routes/         Routing only: params, middleware, delegation
│       ├── controllers/    Parse request, call service, map HTTP status
│       ├── services/       Business validation and rules
│       ├── repositories/   Direct database access via models
│       ├── models/         Mongoose schemas
│       ├── middleware/      Auth guard, uploads, error handling
│       ├── config/         Env + database connection
│       └── utils/          Errors, JWT, validators, async wrapper
└── frontend/
    └── src/
        ├── api/            Central fetch client + resource modules
        ├── components/     One component per file (PropertyCard, etc.)
        ├── pages/          Route-level screens
        ├── context/        Auth state provider
        ├── hooks/          useAuth
        ├── types/          Shared TypeScript models
        └── styles/         Theme tokens + global styles
```

The backend follows a strict layered flow:
`route -> controller -> service -> repository -> model`. Each layer has a single
responsibility, so business rules never leak into routing and the database is
only touched from the repository layer.

## Getting started

### Prerequisites

- Node.js 18+
- A running MongoDB instance (local or Atlas)

### 1. Backend

```bash
cd backend
cp .env.example .env        # then edit the values
npm install
npm run dev                 # starts on http://localhost:5000
```

Environment variables (`backend/.env`):

| Key            | Description                              |
| -------------- | ---------------------------------------- |
| PORT           | API port (default 5000)                  |
| MONGODB_URI    | MongoDB connection string                |
| JWT_SECRET     | Secret used to sign tokens               |
| JWT_EXPIRES_IN | Token lifetime, e.g. `7d`                |
| CLIENT_ORIGIN  | Allowed CORS origin (the frontend URL)   |

### 2. Frontend

```bash
cd frontend
cp .env.example .env        # VITE_API_BASE_URL points at the backend
npm install
npm run dev                 # starts on http://localhost:5173
```

## API reference

All routes are prefixed with `/api`.

### Auth

| Method | Endpoint         | Access | Description                  |
| ------ | ---------------- | ------ | ---------------------------- |
| POST   | `/auth/register` | Public | Create an account, get token |
| POST   | `/auth/login`    | Public | Sign in, get token           |

### Users

| Method | Endpoint            | Access  | Description                       |
| ------ | ------------------- | ------- | --------------------------------- |
| GET    | `/users/me`         | Private | Get the current profile           |
| PUT    | `/users/me`         | Private | Update name, phone, avatar         |
| PUT    | `/users/me/password`| Private | Change password (verifies old one) |

### Properties

| Method | Endpoint           | Access      | Description                          |
| ------ | ------------------ | ----------- | ------------------------------------ |
| GET    | `/properties`      | Public      | List + filter (city, price, type)    |
| GET    | `/properties/mine` | Private     | The current user's own listings      |
| GET    | `/properties/:id`  | Public      | Single listing                       |
| POST   | `/properties`      | Private     | Create (multipart, supports uploads) |
| PUT    | `/properties/:id`  | Private/Author | Update own listing                |
| DELETE | `/properties/:id`  | Private/Author | Delete own listing                |

### Status codes

- `200 OK` / `201 Created` for successful operations
- `400 Bad Request` for invalid or malformed input
- `401 Unauthorized` / `403 Forbidden` for failed tokens or cross-user edits
- `404 Not Found` for missing records

Ownership is enforced on the server: a non-author cannot update or delete a
listing even with a valid token.

## Notes

- Passwords are salted and hashed with bcrypt and never returned by the API.
- The frontend's fetch client attaches the token to every request and clears it
  on a `401`, so route guards redirect expired sessions back to login.
- Uploaded images are served from `/uploads` on the backend.
