# TaskFlow - Modern Task Management Platform

TaskFlow is a full-stack, enterprise-grade task management platform built to help teams and individuals organize their work, track progress, and manage files seamlessly. It features a modern, highly responsive UI, real-time updates, and robust security through Clerk authentication.

![TaskFlow Overview](https://img.shields.io/badge/Status-Active-success) ![License](https://img.shields.io/badge/License-MIT-blue)

---

## 🏗️ Architecture & Tech Stack

TaskFlow is divided into two decoupled applications: a Next.js frontend and a NestJS backend. They communicate via REST APIs and WebSockets.

### Frontend
* **Framework:** [Next.js 15](https://nextjs.org/) (React 19)
* **Styling:** [Tailwind CSS](https://tailwindcss.com/) & [shadcn/ui](https://ui.shadcn.com/)
* **State Management:** [React Query](https://tanstack.com/query/v5) (Data Fetching, Caching, Optimistic Updates)
* **Authentication:** [Clerk](https://clerk.com/) (Next.js SDK)
* **Drag & Drop:** [@dnd-kit](https://dndkit.com/) (For Kanban Boards)
* **Components & Icons:** Lucide React, Sonner (Toasts)

### Backend
* **Framework:** [NestJS 11](https://nestjs.com/)
* **Database:** [MongoDB](https://www.mongodb.com/) via Mongoose
* **Real-time Engine:** [Socket.io](https://socket.io/) (NestJS WebSockets)
* **Authentication Guard:** Clerk Node SDK (`@clerk/clerk-sdk-node`)
* **Security:** Helmet, NestJS Throttler (Rate Limiting)
* **Documentation:** Swagger UI (`@nestjs/swagger`)

---

## 🔗 How It All Connects

### 1. Authentication Flow
Authentication is entirely offloaded to **Clerk**.
1. The user logs in on the Next.js frontend using Clerk's pre-built UI.
2. Clerk provides the frontend with a short-lived JWT session token.
3. Every Axios request to the backend includes this token in the `Authorization: Bearer <token>` header.
4. The NestJS backend uses a custom `@UseGuards(ClerkAuthGuard)` which validates the JWT against the Clerk JWKS (JSON Web Key Set). If valid, it extracts the `userId` and attaches it to the request object (`req.user.userId`).
5. This ensures all database queries are scoped *strictly* to the authenticated user.

### 2. Data Fetching & Caching
The frontend utilizes **React Query** (`useTasks`, `useFiles` hooks) to manage server state.
* **Optimistic Updates:** When a user drags a task on the Kanban board or checks off a task, the UI updates instantly in the React Query cache while the background mutation is sent to the NestJS backend. If the request fails, the UI automatically rolls back and shows a `sonner` error toast.

### 3. Real-time Communication (WebSockets)
We use **Socket.io** to push real-time notifications to the client.
* When the frontend connects to the Socket.io server, it passes the user's `userId` in the connection handshake.
* The backend (`EventsGateway`) intercepts this connection and forces the socket into a private room named after the `userId`.
* When background processes occur (e.g., File Uploads), the backend uses `emitToUser(userId, ...)` to securely push notifications *only* to the browser tabs belonging to that specific user.

### 4. File Lifecycle
* **Upload:** Files are posted to `/files/upload` via `multipart/form-data`. NestJS intercepts the file using `diskStorage` and saves it locally in the `./uploads` directory while recording the metadata in MongoDB.
* **Download:** The frontend queries `/files/:id/download`, and the backend streams the physical file back to the browser.
* **Deletion:** When a file is deleted via the UI, the backend deletes the MongoDB metadata record *and* uses Node's `fs/promises.unlink` to destroy the physical file, preventing server storage leaks.

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB (Local or Atlas URL)
- Clerk API Keys

### Environment Variables
You will need to set up `.env.local` files in both directories. Check the provided `.env.example` files in both the `/frontend` and `/backend` directories for the required keys.

### Running the Backend

```bash
cd backend
npm install
npm run start:dev
```
*The backend will run on `http://localhost:3001`.*
*Swagger API Docs available at `http://localhost:3001/api-docs`.*

### Running the Frontend

```bash
cd frontend
npm install
npm run dev
```
*The frontend will run on `http://localhost:3000`.*

---

## 🛡️ Security Best Practices Implemented
1. **No Shared JWT Secrets:** Instead of sharing a static JWT secret between the frontend and backend, the backend dynamically verifies tokens against Clerk's public JWKS endpoints.
2. **User-Scoped Database Queries:** Every single database query strictly filters by `userId`. A user can never modify or access a task/file they do not own, even if they guess the MongoDB `_id`.
3. **Private WebSocket Rooms:** Socket emissions are never broadcasted globally; they are targeted specifically at the `userId` room, preventing real-time data leaks.
4. **Global Exception Filters:** Internal server errors (stack traces) are caught by `AllExceptionsFilter` and sanitized into standard JSON responses before reaching the client.
