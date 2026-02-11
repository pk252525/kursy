-- Migracja: Dodaj pole image_url do tabeli courses
ALTER TABLE courses ADD COLUMN IF NOT EXISTS image_url TEXT;
