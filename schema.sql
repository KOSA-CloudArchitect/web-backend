-- Database schema for KOSA backend

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Products table
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  url TEXT,
  category_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  parent_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (parent_id) REFERENCES categories(id) ON DELETE SET NULL
);

-- Add foreign key to products table
ALTER TABLE products
  ADD CONSTRAINT fk_product_category
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL;

-- Analysis results table
CREATE TABLE IF NOT EXISTS analysis_results (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id VARCHAR(255) NOT NULL,
  task_id VARCHAR(255) NOT NULL UNIQUE,
  status VARCHAR(50) NOT NULL,
  sentiment_positive DECIMAL(5,2),
  sentiment_negative DECIMAL(5,2),
  sentiment_neutral DECIMAL(5,2),
  summary TEXT,
  keywords JSONB,
  total_reviews INTEGER,
  error TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create index on product_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_analysis_product_id ON analysis_results(product_id);

-- Create index on task_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_analysis_task_id ON analysis_results(task_id);