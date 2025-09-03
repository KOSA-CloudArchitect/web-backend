const db = require('../db');

// 상품 UPSERT + 키워드 매핑을 트랜잭션으로 처리
async function upsertProductsWithKeyword(keyword, items) {
  const client = await db.getClient();
  try {
    await client.query('BEGIN');

    const upsertSql = `
      INSERT INTO product
        (source, product_code, title, url, image_url, final_price, origin_price, review_count, review_rating, last_seen_at, updated_at)
      VALUES
        ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW(), NOW())
      ON CONFLICT (source, product_code) DO UPDATE
        SET title = EXCLUDED.title,
            url = EXCLUDED.url,
            image_url = EXCLUDED.image_url,
            final_price = EXCLUDED.final_price,
            origin_price = EXCLUDED.origin_price,
            review_count = EXCLUDED.review_count,
            review_rating = EXCLUDED.review_rating,
            last_seen_at = NOW(),
            updated_at = NOW()
      RETURNING id
    `;

    const mapSql = `
      INSERT INTO product_keyword_map (keyword, product_id)
      VALUES ($1, $2)
      ON CONFLICT (keyword, product_id) DO NOTHING
    `;

    const productIds = [];
    for (const item of items) {
      const { source, product_code, title, url, image_url, final_price, origin_price, review_count, review_rating } = item;

      const upsertRes = await client.query(upsertSql, [
        source, product_code, title, url, image_url,
        final_price, origin_price, review_count, review_rating
      ]);
      const productId = upsertRes.rows[0].id;
      productIds.push(productId);

      await client.query(mapSql, [keyword, productId]);
    }

    await client.query('COMMIT');
    return productIds;
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  } finally {
    client.release();
  }
}

module.exports = { upsertProductsWithKeyword };