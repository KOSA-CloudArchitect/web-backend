const { v4: uuidv4 } = require('uuid');

/**
 * 분석 결과 모델
 */
class AnalysisModel {
    constructor(pool) {
        this.pool = pool;
    }

    async create(analysis) {
        const id = analysis.id || uuidv4();
        const now = new Date();

        const query = `
      INSERT INTO analysis_results (
        id, product_id, task_id, status, 
        sentiment_positive, sentiment_negative, sentiment_neutral,
        summary, keywords, total_reviews, error, created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      RETURNING *
    `;

        const values = [
            id,
            analysis.productId,
            analysis.taskId,
            analysis.status,
            analysis.sentiment?.positive || null,
            analysis.sentiment?.negative || null,
            analysis.sentiment?.neutral || null,
            analysis.summary || null,
            analysis.keywords ? JSON.stringify(analysis.keywords) : null,
            analysis.totalReviews || null,
            analysis.error || null,
            analysis.createdAt || now,
            analysis.updatedAt || now
        ];

        const result = await this.pool.query(query, values);
        return this.mapDbResultToAnalysis(result.rows[0]);
    }

    async findByProductId(productId) {
        const query = `
      SELECT * FROM analysis_results 
      WHERE product_id = $1 
      ORDER BY created_at DESC 
      LIMIT 1
    `;

        const result = await this.pool.query(query, [productId]);

        if (result.rows.length === 0) {
            return null;
        }

        return this.mapDbResultToAnalysis(result.rows[0]);
    }

    async findByTaskId(taskId) {
        const query = `
      SELECT * FROM analysis_results 
      WHERE task_id = $1
    `;

        const result = await this.pool.query(query, [taskId]);

        if (result.rows.length === 0) {
            return null;
        }

        return this.mapDbResultToAnalysis(result.rows[0]);
    }

    async updateStatus(taskId, status, error) {
        const query = `
      UPDATE analysis_results 
      SET status = $1, error = $2, updated_at = $3
      WHERE task_id = $4
      RETURNING *
    `;

        const result = await this.pool.query(query, [status, error || null, new Date(), taskId]);

        if (result.rows.length === 0) {
            return null;
        }

        return this.mapDbResultToAnalysis(result.rows[0]);
    }

    async updateResults(taskId, analysisData) {
        const query = `
      UPDATE analysis_results 
      SET 
        status = $1, 
        sentiment_positive = $2, 
        sentiment_negative = $3, 
        sentiment_neutral = $4,
        summary = $5, 
        keywords = $6, 
        total_reviews = $7, 
        updated_at = $8
      WHERE task_id = $9
      RETURNING *
    `;

        const values = [
            'completed',
            analysisData.sentiment?.positive || null,
            analysisData.sentiment?.negative || null,
            analysisData.sentiment?.neutral || null,
            analysisData.summary || null,
            analysisData.keywords ? JSON.stringify(analysisData.keywords) : null,
            analysisData.totalReviews || null,
            new Date(),
            taskId
        ];

        const result = await this.pool.query(query, values);

        if (result.rows.length === 0) {
            return null;
        }

        return this.mapDbResultToAnalysis(result.rows[0]);
    }

    mapDbResultToAnalysis(row) {
        return {
            id: row.id,
            productId: row.product_id,
            taskId: row.task_id,
            status: row.status,
            sentiment: row.sentiment_positive !== null ? {
                positive: parseFloat(row.sentiment_positive),
                negative: parseFloat(row.sentiment_negative),
                neutral: parseFloat(row.sentiment_neutral)
            } : undefined,
            summary: row.summary,
            keywords: row.keywords ? JSON.parse(row.keywords) : undefined,
            totalReviews: row.total_reviews ? parseInt(row.total_reviews) : undefined,
            error: row.error,
            createdAt: row.created_at,
            updatedAt: row.updated_at
        };
    }
}

module.exports = {
    AnalysisModel
};