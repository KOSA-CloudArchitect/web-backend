// Test script to verify WebSocket room subscription fix
const axios = require('axios');

async function testRoomSubscription() {
  console.log('🧪 Testing WebSocket room subscription fix...\n');

  // Test the same search term multiple times
  const keyword = '청소기';
  const requests = [];

  // Make 3 concurrent requests for the same keyword
  for (let i = 1; i <= 3; i++) {
    requests.push(
      axios.post('http://localhost:3001/api/products', {
        keyword: keyword,
        max_links: 10
      })
      .then(response => ({
        requestId: i,
        jobId: response.data.jobId,
        status: response.data.status,
        message: response.data.message
      }))
      .catch(error => ({
        requestId: i,
        error: error.message
      }))
    );
  }

  const results = await Promise.all(requests);
  
  console.log('📊 Test Results:');
  results.forEach(result => {
    if (result.error) {
      console.log(`❌ Request ${result.requestId}: ERROR - ${result.error}`);
    } else {
      console.log(`✅ Request ${result.requestId}: jobId = "${result.jobId}", status = "${result.status}"`);
    }
  });

  // Check if all jobIds are the same
  const jobIds = results.filter(r => !r.error).map(r => r.jobId);
  const uniqueJobIds = [...new Set(jobIds)];
  
  console.log(`\n🔍 Analysis:`);
  console.log(`- Total successful requests: ${jobIds.length}`);
  console.log(`- Unique jobIds: ${uniqueJobIds.length}`);
  console.log(`- All requests got same jobId: ${uniqueJobIds.length === 1 ? '✅ YES' : '❌ NO'}`);
  
  if (uniqueJobIds.length === 1) {
    console.log(`🎉 SUCCESS: All clients will join the same WebSocket room: "search:${uniqueJobIds[0]}"`);
  } else {
    console.log(`❌ PROBLEM: Clients will join different rooms:`, uniqueJobIds);
  }
}

testRoomSubscription().catch(console.error);