-- Migration to create persistent caching layer for scraped articles
CREATE EXTENSION IF NOT EXISTS vector; -- Enable pgvector extension if supported

CREATE TABLE IF NOT EXISTS articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT UNIQUE NOT NULL,
  description TEXT,
  source TEXT NOT NULL,
  category TEXT NOT NULL,
  sentiment TEXT NOT NULL,
  region TEXT NOT NULL,
  date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  image_url TEXT,
  link TEXT NOT NULL,
  credibility DOUBLE PRECISION DEFAULT 0.85,
  embedding VECTOR(1536) -- Accommodates standard OpenAI embeddings
);

-- Optimize date and category queries for faster landing feed index scans
CREATE INDEX IF NOT EXISTS articles_date_category_idx ON articles (date DESC, category);
