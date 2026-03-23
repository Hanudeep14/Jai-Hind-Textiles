# Jaihind Textiles

Textile e-commerce platform built with Next.js App Router, Tailwind CSS, and MongoDB.

## Prerequisites

- Node.js 18+ (Node.js 20 recommended)
- npm 9+
- MongoDB running locally or a MongoDB Atlas connection string

## 1) Install dependencies

```bash
npm install
```

## 2) Configure environment variables

Create `.env.local` in the project root.

You can copy from `.env.example` and update values:

```bash
cp .env.example .env.local
```

If you are on Windows PowerShell:

```powershell
Copy-Item .env.example .env.local
```

Minimum required values:

```env
MONGODB_URI=mongodb://127.0.0.1:27017/jaihind
JWT_SECRET=change-this-to-a-strong-secret
```

Optional integrations (can stay empty for now):

- Cloudinary (`CLOUDINARY_*`)
- Razorpay (`RAZORPAY_*`)
- SMTP mail (`SMTP_*`)

## 3) Seed initial data

Run:

```bash
npm run seed
```

This creates:

- 1 admin user
- 5 sections
- 10 sample products

Admin credentials:

- Email: `admin@jaihindtextiles.com`
- Password: `Admin@123`

## 4) Start development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 5) Main routes

User storefront:

- `/`
- `/products`
- `/products/[id]`
- `/login`
- `/signup`
- `/cart`
- `/checkout`
- `/orders`
- `/profile`

Admin portal:

- `/admin/login`
- `/admin/dashboard`
- `/admin/sections`
- `/admin/products`
- `/admin/orders`
- `/admin/reviews`

## Useful scripts

- `npm run dev` - start local development server
- `npm run lint` - run ESLint checks
- `npm run build` - production build
- `npm run start` - run production server
- `npm run seed` - seed admin, sections, products

## Common issues

- **`Missing MONGODB_URI`**  
  Add `MONGODB_URI` in `.env.local`.

- **Seed command fails**  
  Ensure MongoDB is running and connection string is correct.

- **Admin login fails after seeding**  
  Re-run `npm run seed` and use the seeded credentials exactly.
