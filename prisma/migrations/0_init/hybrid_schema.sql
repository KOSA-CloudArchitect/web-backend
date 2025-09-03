-- 하이브리드 스키마: 관계형 + NoSQL 최적화

-- ========================================
-- 1. 관계형 DB: 구조화된 데이터 (PostgreSQL)
-- ========================================

-- 사용자 관련 (관계형 유지)
CREATE TABLE users (
    id VARCHAR(50) PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'user',
    is_active BOOLEAN DEFAULT true,
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

-- 상품 관련 (관계형 유지)
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

-- 분석 요청 (관계형 유지 - 추적 필요)
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

-- ========================================
-- 2. NoSQL 최적화: 실시간 분석 데이터
-- ========================================

-- 실시간 분석 세션 (PostgreSQL JSONB 활용)
CREATE TABLE realtime_analysis_sessions (
    id VARCHAR(50) PRIMARY KEY,
    product_id VARCHAR(50) NOT NULL REFERENCES products(id),
    task_id VARCHAR(100) UNIQUE NOT NULL,
    status VARCHAR(20) DEFAULT 'processing',
    
    -- 실시간 카드 데이터 (JSONB로 저장)
    emotion_cards JSONB DEFAULT '[]'::jsonb,
    
    -- 실시간 통계
    current_stats JSONB DEFAULT '{
        "positive": 0,
        "negative": 0, 
        "neutral": 0,
        "totalProcessed": 0,
        "progressPercentage": 0
    }'::jsonb,
    
    -- 실시간 키워드 (빈도순 정렬)
    trending_keywords JSONB DEFAULT '[]'::jsonb,
    
    -- 메타데이터
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP DEFAULT (CURRENT_TIMESTAMP + INTERVAL '2 hours')
);

-- 최종 분석 결과 (관계형 유지 - 장기 저장)
CREATE TABLE analysis_results (
    id VARCHAR(50) PRIMARY KEY,
    product_id VARCHAR(50) NOT NULL REFERENCES products(id),
    task_id VARCHAR(100) UNIQUE NOT NULL,
    status VARCHAR(20) DEFAULT 'completed',
    
    -- 최종 감정 분석 결과
    sentiment_positive DECIMAL(5,4),
    sentiment_negative DECIMAL(5,4),
    sentiment_neutral DECIMAL(5,4),
    
    -- 최종 요약 및 키워드
    summary TEXT,
    final_keywords JSONB,
    
    -- 통계
    total_reviews INTEGER DEFAULT 0,
    average_rating DECIMAL(3,2),
    rating_distribution JSONB,
    
    -- 처리 정보
    processing_time INTEGER,
    error_message TEXT,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ========================================
-- 3. 기타 테이블들 (관계형 유지)
-- ========================================

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

CREATE TABLE search_history (
    id VARCHAR(50) PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL REFERENCES users(id),
    query VARCHAR(500) NOT NULL,
    result_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE price_history (
    id VARCHAR(50) PRIMARY KEY,
    product_id VARCHAR(50) NOT NULL REFERENCES products(id),
    price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ========================================
-- 4. 인덱스 최적화
-- ========================================

-- 실시간 분석 세션 인덱스
CREATE INDEX idx_realtime_sessions_product_id ON realtime_analysis_sessions(product_id);
CREATE INDEX idx_realtime_sessions_task_id ON realtime_analysis_sessions(task_id);
CREATE INDEX idx_realtime_sessions_status ON realtime_analysis_sessions(status);
CREATE INDEX idx_realtime_sessions_expires_at ON realtime_analysis_sessions(expires_at);

-- JSONB 인덱스 (PostgreSQL 전용)
CREATE INDEX idx_realtime_sessions_stats ON realtime_analysis_sessions USING GIN (current_stats);
CREATE INDEX idx_realtime_sessions_cards ON realtime_analysis_sessions USING GIN (emotion_cards);

-- 기본 인덱스들
CREATE INDEX idx_products_url ON products(url);
CREATE INDEX idx_analysis_requests_product_id ON analysis_requests(product_id);
CREATE INDEX idx_analysis_results_product_id ON analysis_results(product_id);