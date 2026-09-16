fetch('https://tawjihihub.com/api/library', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({})
})
.then(res => res.text().then(text => console.log(res.status, text)))
.catch(err => console.error(err));
