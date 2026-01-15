/*
  # Create allowed emails whitelist table

  1. New Tables
    - `allowed_emails`
      - `id` (uuid, primary key) - Unique identifier
      - `email` (text, unique, not null) - Email address that's allowed to access the app
      - `added_at` (timestamptz) - When the email was added to the whitelist
      - `added_by` (text) - Optional note about who added this email
      - `notes` (text) - Optional notes about this user
  
  2. Security
    - Enable RLS on `allowed_emails` table
    - Add policy for public read access (needed for signup verification)
    - Only authenticated users can read (to check if they're allowed)
  
  3. Important Notes
    - This table acts as a whitelist for user registration
    - Only emails in this table can sign up and use the app
    - You'll need to manually insert allowed emails into this table
*/

CREATE TABLE IF NOT EXISTS allowed_emails (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  added_at timestamptz DEFAULT now(),
  added_by text,
  notes text
);

ALTER TABLE allowed_emails ENABLE ROW LEVEL SECURITY;

-- Allow anyone to check if an email is in the allowed list (needed for signup verification)
CREATE POLICY "Anyone can check if email is allowed"
  ON allowed_emails
  FOR SELECT
  USING (true);

-- Create an index for faster email lookups
CREATE INDEX IF NOT EXISTS idx_allowed_emails_email ON allowed_emails(email);