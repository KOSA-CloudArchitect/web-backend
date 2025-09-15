const express = require('express');
const router = express.Router();
const db = require('../db');

// 카테고리 전체 조회
router.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM category ORDER BY id ASC');
    res.json(result.rows);
  } catch (error) {
    console.error('카테고리 조회 에러:', error);
    res.status(500).json({ error: '카테고리 조회 실패' });
  }
});

module.exports = router; 