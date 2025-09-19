// services/nosqlProductRepo.js
const crypto = require('crypto');
const ProductSnapshot = require('../models/ProductSnapshot');
const ProductLatest = require('../models/ProductLatest');

function toNumberSafe(s, price=false) {
  if (!s) return null;
  const n = Number(String(s).replace(price ? /[^0-9.]/g : /[^0-9.-]/g, ''));
  return Number.isFinite(n) ? n : null;
}

function makeProductKey({ product_code, url }) {
  if (product_code) return `PCODE#${product_code}`;
  const hash = crypto.createHash('sha1').update(String(url || '')).digest('hex');
  return `URL#${hash}`;
}

/** 크롤러 응답(info_list)을 일괄 저장하고 최신본 갱신 */
async function saveBatchFromCrawler({ info_list = [], keyword }) {
  const saved = [];
  for (const it of info_list) {
    try {
      const productKey = makeProductKey({ product_code: it.product_code, url: it.url });
      const doc = {
        productKey,
        title: it.title || '',
        url: it.url || null,
        imageUrl: it.img || null,
        final_price: it.final_price || null,
        origin_price: it.origin_price || null,
        finalPriceNumber: toNumberSafe(it.final_price, true),
        originPriceNumber: toNumberSafe(it.origin_price, true),
        review_rating: toNumberSafe(it.review_rating),
        review_count: toNumberSafe(it.review_count),
        source: it.source || null,
        keyword: keyword || null,
        product_code: it.product_code || null,
        crawledAt: new Date(),
      };

      // 1) 전체 히스토리 스냅샷 저장
      const snap = await ProductSnapshot.create(doc);

      // 2) 최신본 upsert (productKey unique)
      await ProductLatest.findOneAndUpdate(
        { productKey },
        {
          $set: {
            snapshotId: snap._id,
            title: snap.title,
            url: snap.url,
            imageUrl: snap.imageUrl,
            finalPriceNumber: snap.finalPriceNumber,
            originPriceNumber: snap.originPriceNumber,
            review_rating: snap.review_rating,
            review_count: snap.review_count,
            source: snap.source,
            keyword: snap.keyword,
            product_code: snap.product_code,
            crawledAt: snap.crawledAt,
          }
        },
        { upsert: true, new: true }
      );

      saved.push(snap._id.toString());
    } catch (e) {
      console.error('DocDB save failed:', e.message);
    }
  }
  return { insertedSnapshotIds: saved, count: saved.length };
}

/** 최신 목록(검색/페이징) */
async function listLatest({ page = 1, limit = 20, search, source }) {
  const q = {};
  if (search) q.$or = [{ title: new RegExp(search, 'i') }, { product_code: new RegExp(search, 'i') }];
  if (source) q.source = source;

  const skip = (Number(page) - 1) * Number(limit);
  const [items, total] = await Promise.all([
    ProductLatest.find(q).sort({ crawledAt: -1, _id: -1 }).skip(skip).limit(Number(limit)).lean(),
    ProductLatest.countDocuments(q),
  ]);

  return {
    items,
    pagination: {
      currentPage: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
      totalCount: total,
      limit: Number(limit),
      hasNext: skip + Number(limit) < total,
      hasPrev: Number(page) > 1,
    },
  };
}

/** 단건 조회(스냅샷 ID) */
async function getSnapshotById(id) {
  return ProductSnapshot.findById(id).lean();
}

/** 최신본 조회(productKey) */
async function getLatestByKey(productKey) {
  return ProductLatest.findOne({ productKey }).lean();
}

module.exports = {
  saveBatchFromCrawler,
  listLatest,
  getSnapshotById,
  getLatestByKey,
};
