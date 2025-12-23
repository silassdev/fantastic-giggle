Next.js E-commerce

A modern full-stack e-commerce scaffold built with Next.js App Router, designed for a computer & accessories store.
Includes a production-ready frontend, API routes, MongoDB backend, and a lightweight admin system.

––––
Tech Stack

Frontend
	•	Next.js (App Router) – server components by default
	•	TypeScript
	•	Tailwind CSS
	•	Framer Motion (animations)

Backend
	•	MongoDB + Mongoose
	•	Next.js Route Handlers (app/api/*)
	•	JWT authentication (httpOnly cookie)

Services
	•	Cloudinary

⸻

Features

Core
	•	App Router architecture
	•	Fully typed codebase
	•	Responsive UI with Tailwind CSS
	•	Animations via Framer Motion

Authentication
	•	Shared /login route for users and admins
	•	JWT stored in httpOnly cookie
	•	Role-based access (admin vs user)
	•	Secure password hashing

Admin System
	•	Admin dashboard for product management
	•	Add / edit / delete products
	•	Upload product images (Cloudinary example)
	•	Product attributes:
	•	Tags
	•	Colors
	•	Stock status (outOfStock)
	•	Toggle product visibility from public store
	•	One-time safe admin seeding via environment variables
	•	Admin password reset flow (token-based)

Data Models
	•	User
	•	Product
	•	Order

Storefront
	•	Public product listing
	•	Option to hide out-of-stock products
	•	Clean separation of public vs admin routes

⸻



Security Notes
	•	JWT stored in httpOnly cookies
	•	Admin routes protected server-side
	•	No sensitive secrets exposed to the client
	•	Password reset tokens are time-limited

⸻

Intended Use

This project is ideal for:
	•	Learning Next.js App Router
	•	Rapid e-commerce prototyping
	•	Internal tools or MVPs
	•	Custom storefronts with admin control


⸻

Roadmap Ideas
	•	Payments (Stripe)
	•	Order history for users
	•	Product search & filters
	•	Role-based permissions
	•	Email notifications
