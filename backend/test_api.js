const http = require('http');

// Wait 1 second then test backend health
setTimeout(() => {
  http.get('http://localhost:5000/api/health', (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      console.log('✅ API Health Test Response:', JSON.parse(data));
      process.exit(0);
    });
  }).on('error', (err) => {
    console.error('❌ API Test Failed:', err.message);
    process.exit(1);
  });
}, 1000);
