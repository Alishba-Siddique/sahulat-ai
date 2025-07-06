# Supabase Database Setup Guide

## Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Sign up/Login and create a new project
3. Choose a project name (e.g., "sahulat-ai")
4. Set a database password
5. Choose a region close to your users
6. Wait for the project to be created

## Step 2: Get Environment Variables

1. Go to your project dashboard
2. Navigate to Settings > API
3. Copy the following values:
   - **Project URL** (starts with `https://`)
   - **Anon/Public Key** (starts with `eyJ`)

## Step 3: Configure Environment Variables

Create a `.env.local` file in your project root and add:

```env
NEXT_PUBLIC_SUPABASE_URL=your_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

## Step 4: Set Up Database Schema

### Option A: Using Supabase Dashboard (Recommended)

1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Copy and paste the contents of `supabase-setup.sql`
4. Click "Run" to execute the script

### Option B: Using API (Alternative)

If the table doesn't exist, you can use the setup API:

```bash
curl -X POST http://localhost:3000/api/setup-db
```

## Step 5: Insert Sample Data

After setting up the table, insert the sample data:

```bash
curl -X POST http://localhost:3000/api/programs \
  -H "Content-Type: application/json" \
  -d '{"action": "insert-sample-data"}'
```

## Step 6: Verify Setup

Test the API to ensure everything is working:

```bash
curl http://localhost:3000/api/programs
```

You should see a response with 30 government programs.

## Step 7: Test the Application

1. Start your development server: `npm run dev`
2. Open http://localhost:3000
3. Test the chat interface with sample queries like:
   - "I'm a 20-year-old student looking for scholarships"
   - "I need a business loan for my startup"
   - "I want to learn IT skills"

## Troubleshooting

### Issue: API returns empty data
- Check if the table exists in Supabase dashboard
- Verify environment variables are correct
- Check browser console for errors

### Issue: Database connection errors
- Ensure Supabase project is active
- Check if the project URL and key are correct
- Verify network connectivity

### Issue: RLS (Row Level Security) errors
- The setup script includes RLS policies
- If you need to disable RLS temporarily, run:
  ```sql
  ALTER TABLE government_programs DISABLE ROW LEVEL SECURITY;
  ```

## Database Schema Overview

The `government_programs` table includes:

- **Basic Info**: id, title, description (English & Urdu)
- **Categories**: scholarship, loan, skill_training, employment, etc.
- **Eligibility**: age, education, income, location, gender
- **Benefits**: funding amounts, duration, requirements
- **Application**: deadlines, URLs, contact info
- **Metadata**: timestamps, active status

## Sample Data

The application includes 30 comprehensive government programs:

- **15 Scholarships**: HEC, medical, law, architecture, etc.
- **2 Loans**: PM Youth Business Loan, Kamyab Jawan
- **5 Skill Training**: women, IT, technical, engineering, quality control
- **2 Employment**: PCSIR, SUPARCO
- **1 Grant**: PCRWR Innovation
- **5 Special Categories**: women empowerment, youth, technology, business

All programs include bilingual content (English/Urdu) and detailed eligibility criteria. 