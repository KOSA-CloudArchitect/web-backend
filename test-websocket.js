// WebSocket 연결 테스트 스크립트
const { io } = require('socket.io-client');

console.log('🔍 WebSocket 연결 테스트 시작...');

// 백엔드 WebSocket 서버에 연결
const socket = io('http://localhost:3001', {
  transports: ['websocket'],
  timeout: 10000,
});

socket.on('connect', () => {
  console.log('✅ WebSocket 연결 성공!');
  console.log(`🔌 Socket ID: ${socket.id}`);
  
  // 검색 테스트 (실제 프론트엔드에서 사용하는 이벤트)
  socket.emit('search-products', {
    keyword: '아이폰',
    page: 1,
    limit: 10
  });
  
  console.log('📤 검색 이벤트 전송 완료');
});

socket.on('disconnect', (reason) => {
  console.log(`❌ WebSocket 연결 종료: ${reason}`);
});

socket.on('connect_error', (error) => {
  console.error('❌ WebSocket 연결 오류:', error.message);
});

// 검색 관련 이벤트 수신
socket.on('search-started', (data) => {
  console.log('🔍 검색 시작:', data);
});

socket.on('search-completed', (data) => {
  console.log('✅ 검색 완료:', data);
});

socket.on('search-error', (data) => {
  console.log('❌ 검색 오류:', data);
});

// 연결 확인 응답
socket.on('connected', (data) => {
  console.log('📨 연결 확인 응답:', data);
});

// 일반적인 이벤트 수신
socket.on('message', (data) => {
  console.log('📨 메시지 수신:', data);
});

// 10초 후 종료
setTimeout(() => {
  console.log('🏁 테스트 종료');
  socket.disconnect();
  process.exit(0);
}, 10000);