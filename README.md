# Book Catalog Frontend

Frontend application for Book Catalog built with Next.js and Tailwind CSS.

## Run Locally

### 1. Prerequisites

Make sure these are installed:

- Node.js 20+
- npm 10+

Check your versions:

```bash
node -v
npm -v
```

### 2. Install Dependencies

From the project root, run:

```bash
npm install
```

### 3. Setup Environment Variables

Create a file named `.env.local` in the project root, then add:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

Update the URL to match your backend API.

### 4. Start Development Server

Run:

```bash
npm run dev
```

Open in browser:

```text
http://localhost:3000
```

## Useful Commands

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Start production server (after build)
npm run start

# Run lint
npm run lint
```

## Troubleshooting

- If API requests fail, re-check `NEXT_PUBLIC_API_URL` in `.env.local`.
- If dependency issues occur, remove `node_modules` and `package-lock.json`, then run `npm install` again.
