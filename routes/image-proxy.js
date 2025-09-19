// routes/image-proxy.js
const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');

// 이미지 프록시 엔드포인트
router.get('/proxy', async (req, res) => {
  try {
    const { url } = req.query;
    
    if (!url) {
      return res.status(400).json({ error: '이미지 URL이 필요합니다.' });
    }
    
    // URL 디코딩
    const imageUrl = decodeURIComponent(url);
    console.log(`🖼️ 이미지 프록시 요청: ${imageUrl}`);
    
    // 쿠팡 이미지에 적절한 헤더 설정
    const headers = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      'Referer': 'https://www.coupang.com/',
      'Accept': 'image/webp,image/apng,image/*,*/*;q=0.8',
      'Accept-Language': 'ko-KR,ko;q=0.9,en;q=0.8',
    };
    
    const response = await fetch(imageUrl, {
      headers,
      timeout: 10000
    });
    
    if (!response.ok) {
      console.warn(`⚠️ 이미지 프록시 응답 오류: ${response.status} for ${imageUrl}`);
      return res.status(404).send('이미지를 찾을 수 없습니다.');
    }
    
    // 응답 헤더 설정
    const contentType = response.headers.get('content-type') || 'image/jpeg';
    res.set({
      'Content-Type': contentType,
      'Cache-Control': 'public, max-age=86400', // 24시간 캐시
      'Access-Control-Allow-Origin': '*',
    });
    
    // 이미지 데이터 스트리밍
    response.body.pipe(res);
    
  } catch (error) {
    console.error('❌ 이미지 프록시 오류:', error);
    res.status(500).send('이미지 로딩 실패');
  }
});

module.exports = router;