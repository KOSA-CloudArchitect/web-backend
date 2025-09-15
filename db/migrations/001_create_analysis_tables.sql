-- 분석 상태 ENUM 타입 생성 (PostgreSQL 기준)
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'analysis_status_enum') THEN
        CREATE TYPE analysis_status_enum AS ENUM ('pending', 'processing', 'completed', 'failed');
    END IF;
END $$;

-- 분석 상태 테이블
CREATE TABLE IF NOT EXISTS analysis_status (
    id SERIAL PRIMARY KEY,
    product_id INTEGER NOT NULL UNIQUE, -- 유니크 제약
    task_id VARCHAR(100),
    status analysis_status_enum NOT NULL DEFAULT 'pending', -- ENUM 타입
    progress INTEGER DEFAULT 0,
    estimated_time INTEGER,
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP WITH TIME ZONE,
    FOREIGN KEY (product_id) REFERENCES product(product_id)
);

-- 분석 결과 테이블
CREATE TABLE IF NOT EXISTS analysis_result (
    id SERIAL PRIMARY KEY,
    product_id INTEGER NOT NULL,
    total_summary TEXT, -- TEXT 타입으로 변경
    sentiment_positive TEXT, -- TEXT 타입으로 변경
    sentiment_negative TEXT, -- TEXT 타입으로 변경
    sentiment_neutral TEXT, -- TEXT 타입으로 변경
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES product(product_id)
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_analysis_status_product_id ON analysis_status(product_id);
CREATE INDEX IF NOT EXISTS idx_analysis_status_task_id ON analysis_status(task_id);
CREATE INDEX IF NOT EXISTS idx_analysis_result_product_id ON analysis_result(product_id); 