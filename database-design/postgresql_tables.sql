-- ========================================
-- PostgreSQL (RDS) - 관계형 데이터
-- 용도: 구조화된 데이터, 트랜잭션, 일관성이 중요한 데이터
-- ========================================

-- 1. 사용자 관리
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
    user_id VARCHAR(50) UNIQUE NOT NULL REFERENCES users(id),
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    phone VARCHAR(20),
    avatar_url VARCHAR(500),
    timezone VARCHAR(50) DEFAULT 'Asia/Seoul',
    language VARCHAR(10) DEFAULT 'ko',
    notification_preferences JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. 상품 마스터 데이터
CREATE TABLE categories (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    parent_id VARCHAR(50) REFERENCES categories(id),
    path VARCHAR(1000) NOT NULL,
    level INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE products (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(500) NOT NULL,
    url VARCHAR(1000) UNIQUE NOT NULL,
    category_id VARCHAR(50) REFERENCES categories(id),
    current_price DECIMAL(10,2),
    average_rating DECIMAL(3,2),
    total_reviews INTEGER DEFAULT 0,
    image_url VARCHAR(1000),
    is_active BOOLEAN DEFAULT true,
    last_crawled_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. 관심 상품 (트랜잭션 중요)
CREATE TABLE watch_list (
    id VARCHAR(50) PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL REFERENCES users(id),
    product_id VARCHAR(50) NOT NULL REFERENCES products(id),
    price_alert BOOLEAN DEFAULT true,
    target_price DECIMAL(10,2),
    analysis_frequency VARCHAR(20) DEFAULT 'daily',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, product_id)
);

-- 4. 가격 이력 (시계열 데이터)
CREATE TABLE price_history (
    id VARCHAR(50) PRIMARY KEY,
    product_id VARCHAR(50) NOT NULL REFERENCES products(id),
    price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. 분석 요청 추적 (상태 관리 중요)
CREATE TABLE analysis_requests (
    id VARCHAR(50) PRIMARY KEY,
    user_id VARCHAR(50) REFERENCES users(id),
    product_id VARCHAR(50) NOT NULL REFERENCES products(id),
    task_id VARCHAR(100) UNIQUE NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    progress INTEGER DEFAULT 0,
    request_type VARCHAR(20) NOT NULL,
    priority INTEGER DEFAULT 5,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP
);

-- 6. 최종 분석 결과 (장기 보관)
CREATE TABLE analysis_results (
    id VARCHAR(50) PRIMARY KEY,
    product_id VARCHAR(50) NOT NULL REFERENCES products(id),
    task_id VARCHAR(100) UNIQUE NOT NULL,
    status VARCHAR(20) DEFAULT 'completed',
    sentiment_positive DECIMAL(5,4),
    sentiment_negative DECIMAL(5,4),
    sentiment_neutral DECIMAL(5,4),
    summary TEXT,
    final_keywords JSONB,
    total_reviews INTEGER DEFAULT 0,
    average_rating DECIMAL(3,2),
    rating_distribution JSONB,
    processing_time INTEGER,
    error_message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 7. 검색 이력 (사용자 행동 분석용)
CREATE TABLE search_history (
    id VARCHAR(50) PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL REFERENCES users(id),
    query VARCHAR(500) NOT NULL,
    result_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 8. 시스템 설정
CREATE TABLE system_config (
    id VARCHAR(50) PRIMARY KEY,
    key VARCHAR(100) UNIQUE NOT NULL,
    value JSONB NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 인덱스
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_products_url ON products(url);
CREATE INDEX idx_watch_list_user_id ON watch_list(user_id);
CREATE INDEX idx_price_history_product_id ON price_history(product_id, created_at);
CREATE INDEX idx_analysis_requests_status ON analysis_requests(status);
CREATE INDEX idx_search_history_user_id ON search_history(user_id, created_at);