# ARcodic — Client Portal

A premium client onboarding portal for ARcodic Digital Studio. Clients receive a unique 8-digit EMPLID and use it to access their personal portal where they fill in business details, project brief, upload assets, and e-sign all legal documents.

---

## Stack

- **React 18** + **Vite**
- **Supabase** — database + auth
- **Vanilla CSS** — glassmorphism, Cormorant Garamond + DM Sans typography

---

## Local Development

```bash
# 1. Clone the repo
git clone https://github.com/YOUR_USERNAME/arcodic-portal.git
cd arcodic-portal

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env.local
# Then open .env.local and fill in your Supabase credentials (see below)

# 4. Run locally
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

---

## Connecting Supabase — Step by Step

### Step 1 — Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com) and sign in
2. Click **New Project**
3. Give it a name (e.g. `arcodic-portal`), choose a strong database password, pick a region close to South Africa (e.g. **eu-west-1** or **ap-southeast-1**)
4. Click **Create new project** and wait ~2 minutes for it to provision

### Step 2 — Run the Database Schema

1. In your Supabase dashboard, go to **SQL Editor** → **New Query**
2. Copy the entire contents of `supabase-schema.sql` from this repo
3. Paste it into the SQL Editor and click **Run**
4. You should see the `clients` and `submissions` tables appear under **Table Editor**

### Step 3 — Get Your API Keys

1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy the **Project URL** (looks like `https://abcdefgh.supabase.co`)
3. Copy the **anon / public** key (long JWT string)

### Step 4 — Add Keys to Your Project

Open `.env.local` and fill in:

```env
VITE_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
VITE_ADMIN_EMAIL=arcodichq@gmail.com
```

### Step 5 — Wire the App to Supabase

Open `src/App.jsx` and find the comment blocks marked:

```
// TODO: SUPABASE — replace with: getClients()
// TODO: SUPABASE — replace with: createClient()
// TODO: SUPABASE — replace with: verifyEmplid()
// TODO: SUPABASE — replace with: saveSubmission()
```

Each one has a ready-made function in `src/supabase.js`. Import and swap the mock data calls:

```js
import { getClients, createClient, verifyEmplid, saveSubmission } from './supabase.js'
```

---

## Deploying to Vercel

```bash
# 1. Build the project
npm run build

# 2. Install Vercel CLI (if not installed)
npm i -g vercel

# 3. Deploy
vercel

# 4. Add environment variables in Vercel dashboard:
#    vercel.com → your project → Settings → Environment Variables
#    Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY
```

Or connect your GitHub repo directly in the Vercel dashboard for auto-deploy on every push.

---

## Email Notifications (via n8n)

To send a PDF summary to `arcodichq@gmail.com` when a client submits:

1. In your n8n instance, create a new workflow
2. **Trigger**: Supabase → On new row in `submissions` table
3. **Action**: Gmail → Send email to `arcodichq@gmail.com` with submission data formatted as JSON or a template

---

## Project Structure

```
arcodic-portal/
├── index.html
├── vite.config.js
├── package.json
├── .env.example          ← copy to .env.local
├── .gitignore
├── supabase-schema.sql   ← run this in Supabase SQL Editor
└── src/
    ├── main.jsx           ← React entry point
    ├── App.jsx            ← full portal (admin + client)
    └── supabase.js        ← all Supabase helper functions
```

---

## Features

- **Admin Panel** — generate client EMPLIDs, view roster, manage settings
- **Client Auth** — 8-digit EMPLID gate
- **Business Info** — full brand questionnaire with colour picker
- **Project Brief** — project type, pages, features, inspiration, competitors
- **Legal Documents** — SOW, Copyright, NDA, Payment Terms, Liability — all with e-signature (draw or type)
- **Asset Uploads** — logo + brand files
- **Review & Submit** — progress tracking, submission summary

---

© 2025 ARcodic Digital Studio. All rights reserved.
