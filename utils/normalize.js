function parsePrice(str) {
  if (!str) return null;
  const n = String(str).replace(/[^\d]/g, '');
  return n ? Number(n) : null;
}

function parseRating(str) {
  if (str == null || str === '') return null;
  const n = Number(String(str).replace(',', '.'));
  return isNaN(n) ? null : n;
}

function normalizeItem(item) {
  // 이미지 URL 처리 - 여러 가능한 필드명 확인
  let imageUrl = null;
  if (item.img) {
    imageUrl = item.img;
  } else if (item.image_url) {
    imageUrl = item.image_url;
  } else if (item.image) {
    imageUrl = item.image;
  } else if (item.thumbnail) {
    imageUrl = item.thumbnail;
  }
  
  // 디버그 로그 (첫 10개 아이템만)
  if (Math.random() < 0.1) { // 10% 확률로 로그
    console.log('🖼️ 이미지 URL 정규화:', {
      원본_필드들: {
        img: item.img,
        image_url: item.image_url,
        image: item.image,
        thumbnail: item.thumbnail
      },
      최종_선택: imageUrl,
      제목: item.title
    });
  }
  
  return {
    source: 'coupang',
    product_code: item.product_code,
    title: item.title || null,
    url: item.url,
    image_url: imageUrl,
    final_price: parsePrice(item.final_price),
    origin_price: parsePrice(item.origin_price),
    review_count: item.review_count ?? null,
    review_rating: parseRating(item.review_rating),
  };
}

module.exports = { normalizeItem };