-- ========================================
-- PostgreSQL 테이블 설계 (최종 업데이트 버전)
-- 용도: 사용자, 상품, 분석 요청 등 관계형 데이터
-- ========================================

-- 사용자 테이블
CREATE TABLE users (
    id VARCHAR PRIMARY KEY,
    email VARCHAR UNIQUE NOT NULL,
    password VARCHAR NOT NULL,
    role VARCHAR DEFAULT 'user',
    is_active BOOLEAN DEFAULT true,
    email_verified BOOLEAN DEFAULT false,
    last_login_at TIMESTAMP,
    failed_login_attempts INTEGER DEFAULT 0,
    locked_until TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 사용자 프로필 테이블
CREATE TABLE user_profiles (
    id VARCHAR PRIMARY KEY,
    user_id VARCHAR UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    first_name VARCHAR,
    last_name VARCHAR,
    phone VARCHAR,
    avatar_url VARCHAR,
    timezone VARCHAR DEFAULT 'Asia/Seoul',
    language VARCHAR DEFAULT 'ko',
    notification_preferences TEXT, -- JSON 형태로 저장
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 사용자 세션 테이블
CREATE TABLE user_sessions (
    id VARCHAR PRIMARY KEY,
    user_id VARCHAR NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    refresh_token_hash VARCHAR,
    device_info TEXT,
    ip_address VARCHAR,
    user_agent TEXT,
    expires_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_used_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 상품 테이블 (RDB)
CREATE TABLE products (
    id VARCHAR PRIMARY KEY,
    name VARCHAR NOT NULL,
    url VARCHAR UNIQUE NOT NULL,
    category VARCHAR,
    current_price DECIMAL(10,2),
    origin_price DECIMAL(10,2),
    average_rating DECIMAL(3,2),
    total_reviews INTEGER DEFAULT 0,
    image_url VARCHAR,
    last_crawled_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 분석 요청 테이블 (status 필드 추가)
CREATE TABLE analysis_requests (
    id VARCHAR PRIMARY KEY,
    user_id VARCHAR REFERENCES users(id) ON DELETE SET NULL,
    product_id VARCHAR NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    task_id VARCHAR UNIQUE NOT NULL,
    progress INTEGER DEFAULT 0,
    request_type VARCHAR NOT NULL, -- 'realtime', 'batch'
    status VARCHAR DEFAULT 'pending', -- 'pending', 'processing', 'completed', 'failed'
    error_message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP
);

-- 분석 결과 테이블
CREATE TABLE analysis_results (
    id VARCHAR PRIMARY KEY,
    product_id VARCHAR NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    task_id VARCHAR UNIQUE NOT NULL,
    sentiment_positive DECIMAL(5,2),
    sentiment_negative DECIMAL(5,2),
    sentiment_neutral DECIMAL(5,2),
    summary TEXT,
    total_reviews INTEGER,
    average_rating DECIMAL(3,2),
    processing_time INTEGER, -- 초 단위
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 검색 기록 테이블
CREATE TABLE search_history (
    id VARCHAR PRIMARY KEY,
    user_id VARCHAR NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    query VARCHAR NOT NULL,
    result_count INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 관심 상품 테이블 (watch_list로 명명)
CREATE TABLE watch_list (
    id VARCHAR PRIMARY KEY,
    user_id VARCHAR NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    product_id VARCHAR NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    price_alert BOOLEAN DEFAULT false,
    target_price DECIMAL(10,2),
    last_notified_at TIMESTAMP,
    analysis_frequency VARCHAR DEFAULT 'weekly', -- 'daily', 'weekly', 'monthly'
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,             
    
    -- 복합 유니크 제약조건
    UNIQUE(user_id, product_id)
);

-- 시스템 설정 테이블
CREATE TABLE system_config (
    id VARCHAR PRIMARY KEY,
    key VARCHAR UNIQUE NOT NULL,
    value TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ========================================
-- 인덱스 생성
-- ========================================

-- 사용자 관련 인덱스
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_is_active ON users(is_active);

-- 세션 관련 인덱스
CREATE INDEX idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX idx_user_sessions_expires_at ON user_sessions(expires_at);

-- 상품 관련 인덱스
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_name ON products(name);
CREATE INDEX idx_products_last_crawled_at ON products(last_crawled_at);

-- 분석 관련 인덱스
CREATE INDEX idx_analysis_requests_user_id ON analysis_requests(user_id);
CREATE INDEX idx_analysis_requests_product_id ON analysis_requests(product_id);
CREATE INDEX idx_analysis_requests_task_id ON analysis_requests(task_id);
CREATE INDEX idx_analysis_requests_status ON analysis_requests(status);
CREATE INDEX idx_analysis_requests_created_at ON analysis_requests(created_at);

CREATE INDEX idx_analysis_results_product_id ON analysis_results(product_id);
CREATE INDEX idx_analysis_results_created_at ON analysis_results(created_at);

-- 검색 기록 인덱스
CREATE INDEX idx_search_history_user_id ON search_history(user_id);
CREATE INDEX idx_search_history_created_at ON search_history(created_at);

-- 관심 상품 인덱스
CREATE INDEX idx_watch_list_user_id ON watch_list(user_id);
CREATE INDEX idx_watch_list_product_id ON watch_list(product_id);
CREATE INDEX idx_watch_list_is_active ON watch_list(is_active);
CREATE INDEX idx_watch_list_price_alert ON watch_list(price_alert);

-- 시스템 설정 인덱스
CREATE INDEX idx_system_config_key ON system_config(key);