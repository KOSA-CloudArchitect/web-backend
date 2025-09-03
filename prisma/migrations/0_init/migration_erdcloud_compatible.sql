-- ERD Cloud 완전 호환 버전 - 관계선 표시 보장

-- 1. 사용자 테이블
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

-- 2. 사용자 프로필 테이블
CREATE TABLE user_profiles (
    id VARCHAR(50) PRIMARY KEY,
    user_id VARCHAR(50) UNIQUE NOT NULL REFERENCES users(id),
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    phone VARCHAR(20),
    avatar_url VARCHAR(500),
    timezone VARCHAR(50) DEFAULT 'Asia/Seoul',
    language VARCHAR(10) DEFAULT 'ko',
    notification_preferences TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. 사용자 세션 테이블
CREATE TABLE user_sessions (
    id VARCHAR(50) PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL REFERENCES users(id),
    refresh_token_hash VARCHAR(255) NOT NULL,
    device_info TEXT,
    ip_address VARCHAR(45),
    user_agent TEXT,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_used_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. 카테고리 테이블 (자기참조)
CREATE TABLE categories (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    parent_id VARCHAR(50) REFERENCES categories(id),
    path VARCHAR(1000) NOT NULL,
    level INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. 상품 테이블
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

-- 6. 가격 이력 테이블
CREATE TABLE price_history (
    id VARCHAR(50) PRIMARY KEY,
    product_id VARCHAR(50) NOT NULL REFERENCES products(id),
    price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 7. 분석 요청 테이블
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

-- 8. 분석 결과 테이블
CREATE TABLE analysis_results (
    id VARCHAR(50) PRIMARY KEY,
    product_id VARCHAR(50) NOT NULL REFERENCES products(id),
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
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 9. 키워드 테이블
CREATE TABLE keywords (
    id VARCHAR(50) PRIMARY KEY,
    analysis_result_id VARCHAR(50) NOT NULL REFERENCES analysis_results(id),
    keyword VARCHAR(100) NOT NULL,
    sentiment VARCHAR(20) NOT NULL,
    frequency INTEGER NOT NULL,
    confidence DECIMAL(5,4) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 10. 검색 이력 테이블
CREATE TABLE search_history (
    id VARCHAR(50) PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL REFERENCES users(id),
    query VARCHAR(500) NOT NULL,
    result_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 11. 관심 상품 테이블
CREATE TABLE watch_list (
    id VARCHAR(50) PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL REFERENCES users(id),
    product_id VARCHAR(50) NOT NULL REFERENCES products(id),
    price_alert BOOLEAN DEFAULT true,
    target_price DECIMAL(10,2),
    last_notified_at TIMESTAMP,
    analysis_frequency VARCHAR(20) DEFAULT 'daily',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, product_id)
);

-- 12. 시스템 설정 테이블
CREATE TABLE system_config (
    id VARCHAR(50) PRIMARY KEY,
    key VARCHAR(100) UNIQUE NOT NULL,
    value TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);