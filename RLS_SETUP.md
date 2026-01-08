# Row Level Security (RLS) Setup Guide

## Problem
Your Supabase connection is working, but queries return empty arrays because RLS policies are blocking public read access.

## Solution: Enable Public Read Access

### Step 1: Open Supabase Dashboard
1. Go to https://supabase.com/dashboard
2. Select your project
3. Go to **Authentication** → **Policies** (or **Table Editor** → select table → **Policies**)

### Step 2: Create Policy for `category` Table

1. Click on the `category` table in the left sidebar
2. Click on the **"Policies"** tab (or **"RLS"** tab)
3. Click **"New Policy"** or **"Create Policy"**
4. Choose **"Create a policy from scratch"** or **"For full customization"**

5. Fill in the policy:
   - **Policy Name**: `Allow public read access`
   - **Allowed Operation**: `SELECT`
   - **Target Roles**: `public` (or `anon`)
   - **USING expression**: `true` (this allows everyone to read)
   - **WITH CHECK expression**: Leave empty (not needed for SELECT)

6. Click **"Review"** then **"Save Policy"**

### Step 3: Create Policy for `items` Table

1. Click on the `items` table
2. Click on the **"Policies"** tab
3. Click **"New Policy"**
4. Fill in the same way:
   - **Policy Name**: `Allow public read access`
   - **Allowed Operation**: `SELECT`
   - **Target Roles**: `public` (or `anon`)
   - **USING expression**: `true`

5. Click **"Save Policy"**

### Alternative: Using SQL Editor

If you prefer SQL, run these commands in the **SQL Editor**:

```sql
-- Enable RLS on tables (if not already enabled)
ALTER TABLE category ENABLE ROW LEVEL SECURITY;
ALTER TABLE items ENABLE ROW LEVEL SECURITY;

-- Create policy for category table
CREATE POLICY "Allow public read access on category"
ON category
FOR SELECT
TO public
USING (true);

-- Create policy for items table
CREATE POLICY "Allow public read access on items"
ON items
FOR SELECT
TO public
USING (true);
```

### Step 4: Verify

After creating the policies:
1. Refresh your Next.js app
2. Check the browser console
3. You should now see your categories and items logged

## Security Note

⚠️ **Important**: These policies allow **anyone** to read your data. This is fine for a public menu, but if you need to restrict access later, you can:
- Remove the `public` role and use authenticated users only
- Add conditions to the `USING` expression to filter data
- Use more specific roles instead of `public`

## Troubleshooting

If it still doesn't work:
1. Make sure RLS is enabled on the tables
2. Check that the policy is saved and active
3. Verify you're using the correct table names (`category` and `items`)
4. Check the browser console for any new errors

