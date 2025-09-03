-- Simplified version for ERD Cloud (PostgreSQL specific syntax removed)

-- CreateTable
CREATE TABLE users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT DEFAULT 'user',
    is_active BOOLEAN DEFAULT true,
    email_verified BOOLEAN DEFAULT false,
    last_login_at TIMESTAMP,
    failed_login_attempts INTEGER DEFAULT 0,
    locked_until TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP
);

-- CreateTable
CREATE TABLE user_profiles (
    id TEXT PRIMARY KEY,
    user_id TEXT UNIQUE NOT NULL,
    first_name TEXT,
    last_name TEXT,
    phone TEXT,
    avatar_url TEXT,
    timezone TEXT DEFAULT 'Asia/Seoul',
    language TEXT DEFAULT 'ko',
    notification_preferences TEXT, -- JSON as TEXT for compatibility
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- CreateTable
CREATE TABLE user_sessions (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    refresh_token_hash TEXT NOT NULL,
    device_info TEXT, -- JSON as TEXT
    ip_address TEXT,
    user_agent TEXT,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_used_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- CreateTable
CREATE TABLE categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    parent_id TEXT,
    path TEXT NOT NULL,
    level INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP,
    FOREIGN KEY (parent_id) REFERENCES categories(id)
);

-- CreateTable
CREATE TABLE products (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    url TEXT UNIQUE NOT NULL,
    category_id TEXT,
    current_price DECIMAL(10,2),
    average_rating FLOAT,
    total_reviews INTEGER DEFAULT 0,
    image_url TEXT,
    is_active BOOLEAN DEFAULT true,
    last_crawled_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id)
);

-- CreateTable
CREATE TABLE price_history (
    id TEXT PRIMARY KEY,
    product_id TEXT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- CreateTable
CREATE TABLE analysis_requests (
    id TEXT PRIMARY KEY,
    user_id TEXT,
    product_id TEXT NOT NULL,
    task_id TEXT UNIQUE NOT NULL,
    status TEXT DEFAULT 'pending',
    progress INTEGER DEFAULT 0,
    request_type TEXT NOT NULL,
    priority INTEGER DEFAULT 5,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
);

-- CreateTable
CREATE TABLE analysis_results (
    id TEXT PRIMARY KEY,
    product_id TEXT NOT NULL,
    task_id TEXT UNIQUE NOT NULL,
    status TEXT DEFAULT 'processing',
    sentiment_positive FLOAT,
    sentiment_negative FLOAT,
    sentiment_neutral FLOAT,
    summary TEXT,
    keywords TEXT, -- JSON as TEXT
    total_reviews INTEGER DEFAULT 0,
    average_rating FLOAT,
    rating_distribution TEXT, -- JSON as TEXT
    error_message TEXT,
    processing_time INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id)
);

-- CreateTable
CREATE TABLE keywords (
    id TEXT PRIMARY KEY,
    analysis_result_id TEXT NOT NULL,
    keyword TEXT NOT NULL,
    sentiment TEXT NOT NULL,
    frequency INTEGER NOT NULL,
    confidence FLOAT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (analysis_result_id) REFERENCES analysis_results(id) ON DELETE CASCADE
);

-- CreateTable
CREATE TABLE search_history (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    query TEXT NOT NULL,
    result_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- CreateTable
CREATE TABLE watch_list (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    product_id TEXT NOT NULL,
    price_alert BOOLEAN DEFAULT true,
    target_price DECIMAL(10,2),
    last_notified_at TIMESTAMP,
    analysis_frequency TEXT DEFAULT 'daily',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP,
    UNIQUE(user_id, product_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- CreateTable
CREATE TABLE system_config (
    id TEXT PRIMARY KEY,
    key TEXT UNIQUE NOT NULL,
    value TEXT NOT NULL, -- JSON as TEXT
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP
);