# PixelAI 🎬

A modern creator dashboard for uploading, transforming, and sharing media assets with AI-powered features. Built with **Next.js 16**, **Cloudinary**, **Prisma**, **PostgreSQL**, and **Clerk Authentication**.

## 🎯 Overview

PixelAI enables authenticated creators to:
- **Upload and optimize images** with social media-ready transformations
- **Upload and compress videos** with automatic metadata extraction
- **Share media** with automatic resizing for various social platforms
- **Browse a public feed** of community-uploaded videos
- **Track compression metrics** with before/after size comparisons

## ✨ Features

| Feature | Description |
|---------|------------|
| 🔒 **Clerk Authentication** | Secure user authentication protecting upload endpoints |
| 📸 **Social Image Upload** | Upload images with instant resizing for social platforms (Instagram, Twitter, etc.) |
| 🎥 **Video Upload & Compression** | Upload videos with automatic Cloudinary compression and metadata persistence |
| 🌐 **Public Video Feed** | Browse and discover all uploaded videos with optimized thumbnails |
| 📊 **Compression Metrics** | Track original vs. compressed file sizes for videos |
| ⚡ **Upload Streaming** | Efficient server-side upload streaming with Cloudinary |
| 🎨 **Modern UI** | Clean, responsive design with Tailwind CSS and Lucide icons |
| 🔔 **Toast Notifications** | Real-time user feedback with React Hot Toast |

## 🧱 Tech Stack

### Core Framework
- **Next.js** 16.2.2 - React framework with App Router
- **React** 19.2.4 - UI library
- **TypeScript** 5 - Type-safe development

### Styling & UI
- **Tailwind CSS** 4 - Utility-first CSS
- **Lucide React** 1.7.0 - Icon library
- **React Hot Toast** 2.6.0 - Toast notifications

### Backend & Database
- **Prisma** 7.6.0 - ORM with PostgreSQL adapter
- **PostgreSQL** 8.20.0 - Relational database
- **@prisma/adapter-pg** 7.6.0 - Native PostgreSQL driver

### Authentication & Media
- **Clerk** 7.0.8 - User authentication
- **Cloudinary** 2.9.0 - Media hosting & transformation
- **Next Cloudinary** 6.17.5 - Cloudinary integration
- **Filesize** 11.0.15 - File size formatting
- **Day.js** 1.11.20 - Date utility

## 📁 Project Structure

```
pixelai/
├── app/
│   ├── page.tsx                           # Landing page
│   ├── globals.css                        # Global styles
│   ├── layout.tsx                         # Root layout
│   ├── (app)/                             # Protected routes group
│   │   ├── layout.tsx                     # App layout with sidebar
│   │   ├── home/page.tsx                  # Public video feed
│   │   ├── social-share/page.tsx          # Image upload & transform
│   │   └── video-upload/page.tsx          # Video upload interface
│   ├── (auth)/                            # Auth routes group
│   │   ├── sign-in/[[...sign-in]]/        # Clerk sign-in
│   │   └── sign-up/[[...sign-up]]/        # Clerk sign-up
│   └── api/
│       ├── image-upload/route.ts          # Image → Cloudinary upload
│       ├── video-upload/route.ts          # Video → Cloudinary + DB
│       └── videos/route.ts                # Fetch video metadata
├── components/
│   └── VideoCard.tsx                      # Reusable video display card
├── lib/
│   └── prisma.ts                          # Prisma client singleton
├── prisma/
│   ├── schema.prisma                      # Database schema
│   └── migrations/                        # Migration history
├── generated/prisma/                      # Auto-generated Prisma client
├── public/                                # Static assets
├── package.json                           # Dependencies
├── tsconfig.json                          # TypeScript config
├── next.config.ts                         # Next.js config
└── README.md                              # This file
```

## 🗄️ Database Schema

### Video Model
Stores metadata for all uploaded videos in PostgreSQL:

```prisma
model Video {
  id              String    @id @default(cuid())        # Unique identifier
  title           String                                 # Video title
  description     String?                                # Optional description
  publicId        String                                 # Cloudinary public ID
  originalSize    String                                 # Original file size (bytes)
  compressedSize  String                                 # Compressed file size (bytes)
  duration        Float                                  # Video duration (seconds)
  createdAt       DateTime  @default(now())              # Upload timestamp
  updatedAt       DateTime  @updatedAt                   # Last modified
}
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- PostgreSQL database (local or cloud-hosted)
- Cloudinary account (free tier available)
- Clerk account (free tier available)

### 1. Clone & Install

```bash
# Clone the repository
git clone <repository-url>
cd pixelai

# Install dependencies
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the project root:

```env
# Database
DATABASE_URL=postgresql://USER:PASSWORD@localhost:5432/pixelai

# Clerk Authentication
CLERK_SECRET_KEY=sk_test_xxx
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxx

# Cloudinary (server-side - video upload)
CLOUD_NAME=your-cloud-name
CLOUD_API_KEY=your-api-key
CLOUD_API_SECRET=your-api-secret

# Cloudinary (client-side - image preview & display)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
NEXT_PUBLIC_CLOUDINARY_CLOUD_API_KEY=your-api-key
NEXT_PUBLIC_CLOUDINARY_CLOUD_API_SECRET=your-api-secret
```

**Note:** The server uses `CLOUD_*` variables for secure video uploads, while client-side image/preview operations use `NEXT_PUBLIC_CLOUDINARY_*` variables.

### 3. Initialize Database

```bash
# Run migrations
npx prisma migrate deploy

# (Optional) Open Prisma Studio to inspect database
npx prisma studio
```

### 4. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` to access the app.

## 🔌 API Endpoints

### POST `/api/image-upload`
Upload and transform an image for social media.

**Request:**
```
Content-Type: multipart/form-data
- file: File (image)
- transformation: string (optional, e.g., "instagram", "twitter")
```

**Response:**
```json
{
  "publicId": "pixelai/abc123",
  "url": "https://res.cloudinary.com/...",
  "thumbnail": "https://res.cloudinary.com/..."
}
```

### POST `/api/video-upload`
Upload a video, compress it, extract metadata, and store in database.

**Request:**
```
Content-Type: multipart/form-data
- file: File (video)
- title: string
- description: string (optional)
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "cuid123",
    "title": "My Video",
    "publicId": "pixelai/video123",
    "originalSize": "50MB",
    "compressedSize": "12MB",
    "duration": 45.5,
    "createdAt": "2026-04-11T10:30:00Z"
  }
}
```

### GET `/api/videos`
Fetch all uploaded videos for the public feed.

**Response:**
```json
{
  "videos": [
    {
      "id": "cuid123",
      "title": "My Video",
      "description": "A great video",
      "publicId": "pixelai/video123",
      "thumbnail": "https://res.cloudinary.com/...",
      "duration": 45.5,
      "createdAt": "2026-04-11T10:30:00Z"
    }
  ]
}
```

## 🛠️ Development Workflow

### Run Dev Server
```bash
npm run dev
```

### Build for Production
```bash
npm run build
npm start
```

### Linting
```bash
npm run lint
```

### Database Migrations
```bash
# Create a new migration
npx prisma migrate dev --name <migration-name>

# View database in Prisma Studio
npx prisma studio
```

## 🐛 Troubleshooting

### "Cannot find module 'filesize'"
Ensure `filesize` is installed:
```bash
npm install filesize
```

### Database Connection Error
- Verify `DATABASE_URL` in `.env` points to a running PostgreSQL instance
- Check credentials are correct
- Ensure database exists

### Cloudinary Upload Fails
- Verify all `CLOUD_*` and `NEXT_PUBLIC_CLOUDINARY_*` variables are set
- Check Cloudinary API key and secret are valid
- Ensure Cloudinary account has upload permissions enabled

### Clerk Authentication Issues
- Verify `CLERK_SECRET_KEY` and `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` are correct
- Clear browser cookies and try signing in again
- Check Clerk dashboard for any restricted keys

## 📝 Environment Variable Reference

| Variable | Purpose | Example |
|----------|---------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@localhost/pixelai` |
| `CLERK_SECRET_KEY` | Clerk secret key (server-side) | `sk_test_xxx` |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk public key (client-side) | `pk_test_xxx` |
| `CLOUD_NAME` | Cloudinary cloud name (server) | `my-cloud` |
| `CLOUD_API_KEY` | Cloudinary API key (server) | `123456789` |
| `CLOUD_API_SECRET` | Cloudinary API secret (server) | `abc123xyz` |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name (client) | `my-cloud` |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_API_KEY` | Cloudinary API key (client) | `123456789` |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_API_SECRET` | Cloudinary API secret (client) | `abc123xyz` |

## 📦 Dependencies

See [package.json](./package.json) for the complete list of dependencies and versions.

### Key Dependencies
- **Next.js**: React framework
- **Prisma**: Database ORM
- **Cloudinary**: Media hosting
- **Clerk**: Authentication
- **Tailwind CSS**: Styling
- **React Hot Toast**: Notifications

## 🤝 Contributing

1. Create a new feature branch: `git checkout -b feature/amazing-feature`
2. Commit changes: `git commit -m 'Add amazing feature'`
3. Push to branch: `git push origin feature/amazing-feature`
4. Open a pull request

## 📄 License

This project is private. All rights reserved.

## 🚦 Status

Currently in **active development**. Features and APIs may change.

### 3. Run database migrations

```bash
npx prisma migrate dev --name init
```

### 4. Start the development server

```bash
npm run dev
```

Open `http://localhost:3000` in your browser.

## 📌 Important App Routes

- `/` — Landing page
- `/home` — Public feed with Cloudinary video thumbnails
- `/social-share` — Upload images and apply social media resizing
- `/video-upload` — Video upload page (currently placeholder)
- `/sign-in` — Clerk sign-in flow
- `/sign-up` — Clerk sign-up flow

## 🧩 API Endpoints

- `POST /api/image-upload`
  - Receives image files via `FormData`
  - Uploads to Cloudinary folder `saas-pixelAI`
  - Returns `publicId`
- `POST /api/video-upload`
  - Authenticates with Clerk
  - Uploads video to Cloudinary folder `saas-pixelAI-video-upload`
  - Applies Cloudinary transformation for auto quality + MP4
  - Persists metadata in Postgres via Prisma
- `GET /api/videos`
  - Returns stored videos ordered by newest first

## ✅ Running Locally

```bash
npm run dev
```

### Build for production

```bash
npm run build
npm run start
```

### Linting

```bash
npm run lint
```

## 💡 Notes & TODOs

- The `video-upload` page currently renders a placeholder `VideoShare` component and can be expanded into a full upload form.
- The public feed uses Cloudinary video thumbnails via `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/video/upload/...`.
- Auth is wired in server-side routes, so ensure Clerk is properly configured if you extend the app.
- The app uses `@prisma/adapter-pg` and `PrismaClient` from `generated/prisma/client`.

## 🚀 Deployment

Recommended deployment target:

- Vercel for Next.js frontend and API routes
- PostgreSQL provider for `DATABASE_URL`
- Cloudinary for media storage

Make sure the same environment variables are set in the deployment platform.

## 📚 Useful Commands

- `npm install` — install dependencies
- `npm run dev` — start development server
- `npm run build` — create production build
- `npm run start` — run production build
- `npm run lint` — lint project

