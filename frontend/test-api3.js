require('dotenv').config();
const jwt = require('jsonwebtoken');

const token = jwt.sign({ id: 'test-admin', role: 'ADMIN' }, process.env.JWT_SECRET || 'fallback-secret');

fetch('https://tawjihihub.com/api/library', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + token
  },
  body: JSON.stringify({
    titleAr: 'Test Link',
    titleEn: 'Test Link',
    grade: 'GRADE_12',
    subject: 'MATH',
    type: 'SUMMARY',
    fileUrl: 'https://drive.google.com/test'
  })
})
.then(res => res.text().then(text => console.log(res.status, text)))
.catch(err => console.error(err));
