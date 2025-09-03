// models/ProductSnapshot.js
const { Schema, model } = require('mongoose');

const ProductSnapshotSchema = new Schema({
  productKey: { type: String, required: true, index: true }, // PCODE#..., URL#...
  title: String,
  url: { type: String, index: true },
  imageUrl: String,
  final_price: String,
  origin_price: String,
  finalPriceNumber: Number,
  originPriceNumber: Number,
  review_rating: Number,
  review_count: Number,
  source: String,
  keyword: String,
  product_code: String,
  crawledAt: { type: Date, default: Date.now },
}, { timestamps: true });

ProductSnapshotSchema.index({ productKey: 1, crawledAt: -1 });

module.exports = model('ProductSnapshot', ProductSnapshotSchema, 'product_snapshots');
