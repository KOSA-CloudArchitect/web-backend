-- ERD Cloud 최적화 버전 - 관계선이 명확하게 표시되도록 개선

-- 1. 사용자 관련 테이블들
CREATE TABLE users (
    id VARCHAR(50) PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'user',
    is_active BOOLEAN DEFAULT true,
    email_verified BOOLEAN DEFAULT false,
    last_login_at TIMESTAMP,
    failed_login_attempts INTEGER DEFAULT 0,
    locked_until TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE user_profiles (
    id VARCHAR(50) PRIMARY KEY,
    user_id VARCHAR(50) UNIQUE NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    phone VARCHAR(20),
    avatar_url VARCHAR(500),
    timezone VARCHAR(50) DEFAULT 'Asia/Seoul',
    language VARCHAR(10) DEFAULT 'ko',
    notification_preferences TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_user_profiles_user_id 
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE user_sessions (
    id VARCHAR(50) PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL,
    refresh_token_hash VARCHAR(255) NOT NULL,
    device_info TEXT,
    ip_address VARCHAR(45),
    user_agent TEXT,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_used_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_user_sessions_user_id 
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 2. 카테고리 테이블 (자기참조)
CREATE TABLE categories (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    parent_id VARCHAR(50),
    path VARCHAR(1000) NOT NULL,
    level INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_categories_parent_id 
        FOREIGN KEY (parent_id) REFERENCES categories(id) ON DELETE SET NULL
);

-- 3. 상품 관련 테이블들
CREATE TABLE products (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(500) NOT NULL,
    url VARCHAR(1000) UNIQUE NOT NULL,
    category_id VARCHAR(50),
    current_price DECIMAL(10,2),
    average_rating DECIMAL(3,2),
    total_reviews INTEGER DEFAULT 0,
    image_url VARCHAR(1000),
    is_active BOOLEAN DEFAULT true,
    last_crawled_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_products_category_id 
        FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
);

CREATE TABLE price_history (
    id VARCHAR(50) PRIMARY KEY,
    product_id VARCHAR(50) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_price_history_product_id 
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- 4. 분석 관련 테이블들
CREATE TABLE analysis_requests (
    id VARCHAR(50) PRIMARY KEY,
    user_id VARCHAR(50),
    product_id VARCHAR(50) NOT NULL,
    task_id VARCHAR(100) UNIQUE NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    progress INTEGER DEFAULT 0,
    request_type VARCHAR(20) NOT NULL,
    priority INTEGER DEFAULT 5,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP,
    
    CONSTRAINT fk_analysis_requests_user_id 
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    CONSTRAINT fk_analysis_requests_product_id 
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

CREATE TABLE analysis_results (
    id VARCHAR(50) PRIMARY KEY,
    product_id VARCHAR(50) NOT NULL,
    task_id VARCHAR(100) UNIQUE NOT NULL,
    status VARCHAR(20) DEFAULT 'processing',
    sentiment_positive DECIMAL(5,4),
    sentiment_negative DECIMAL(5,4),
    sentiment_neutral DECIMAL(5,4),
    summary TEXT,
    keywords TEXT,
    total_reviews INTEGER DEFAULT 0,
    average_rating DECIMAL(3,2),
    rating_distribution TEXT,
    error_message TEXT,
    processing_time INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_analysis_results_product_id 
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

CREATE TABLE keywords (
    id VARCHAR(50) PRIMARY KEY,
    analysis_result_id VARCHAR(50) NOT NULL,
    keyword VARCHAR(100) NOT NULL,
    sentiment VARCHAR(20) NOT NULL,
    frequency INTEGER NOT NULL,
    confidence DECIMAL(5,4) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_keywords_analysis_result_id 
        FOREIGN KEY (analysis_result_id) REFERENCES analysis_results(id) ON DELETE CASCADE
);

-- 5. 사용자 활동 관련 테이블들
CREATE TABLE search_history (
    id VARCHAR(50) PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL,
    query VARCHAR(500) NOT NULL,
    result_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_search_history_user_id 
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE watch_list (
    id VARCHAR(50) PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL,
    product_id VARCHAR(50) NOT NULL,
    price_alert BOOLEAN DEFAULT true,
    target_price DECIMAL(10,2),
    last_notified_at TIMESTAMP,
    analysis_frequency VARCHAR(20) DEFAULT 'daily',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_watch_list_user_id 
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_watch_list_product_id 
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    CONSTRAINT uk_watch_list_user_product 
        UNIQUE (user_id, product_id)
);

-- 6. 시스템 설정 테이블
CREATE TABLE system_config (
    id VARCHAR(50) PRIMARY KEY,
    key VARCHAR(100) UNIQUE NOT NULL,
    value TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 인덱스 생성 (성능 최적화)
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_is_active ON users(is_active);

CREATE INDEX idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX idx_user_sessions_expires_at ON user_sessions(expires_at);

CREATE INDEX idx_categories_parent_id ON categories(parent_id);
CREATE INDEX idx_categories_level ON categories(level);

CREATE INDEX idx_products_url ON products(url);
CREATE INDEX idx_products_category_id ON products(category_id);
CREATE INDEX idx_products_is_active ON products(is_active);

CREATE INDEX idx_price_history_product_id ON price_history(product_id);
CREATE INDEX idx_price_history_created_at ON price_history(created_at);

CREATE INDEX idx_analysis_requests_user_id ON analysis_requests(user_id);
CREATE INDEX idx_analysis_requests_product_id ON analysis_requests(product_id);
CREATE INDEX idx_analysis_requests_status ON analysis_requests(status);

CREATE INDEX idx_analysis_results_product_id ON analysis_results(product_id);
CREATE INDEX idx_analysis_results_status ON analysis_results(status);

CREATE INDEX idx_keywords_analysis_result_id ON keywords(analysis_result_id);
CREATE INDEX idx_keywords_keyword ON keywords(keyword);

CREATE INDEX idx_search_history_user_id ON search_history(user_id);
CREATE INDEX idx_search_history_query ON search_history(query);

CREATE INDEX idx_watch_list_user_id ON watch_list(user_id);
CREATE INDEX idx_watch_list_product_id ON watch_list(product_id);
CREATE INDEX idx_watch_list_is_active ON watch_list(is_active);