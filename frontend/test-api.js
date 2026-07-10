const jwt = require('jsonwebtoken');

const token = jwt.sign(
  { userId: '29792a34-5ea5-4a78-bc7d-8a097845beab', role: 'STUDENT' }, 
  process.env.JWT_SECRET || 'tawjihi-hub-secret-key-for-jwt-2024'
);

async function test() {
  const res = await fetch('http://localhost:5000/api/courses', {
    headers: { Authorization: `Bearer ${token}` }
  });
  const data = await res.json();
  console.log(JSON.stringify(data, null, 2));
}

test();
