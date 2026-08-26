const apiKey = process.env.PDFSHIFT_API_KEY;
console.log('API Key set:', !!apiKey);
console.log('Key preview:', apiKey ? apiKey.substring(0, 10) + '...' : 'NOT SET');

const html = '<html><body><h1>Test</h1><p>Hello World</p></body></html>';

fetch('https://api.pdfshift.io/v3/convert/html', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    source: html,
    landscape: false,
    use_print_media: true,
    margin: '0.5in',
  }),
})
.then(r => {
  console.log('Status:', r.status);
  console.log('OK:', r.ok);
  return r.text();
})
.then(t => console.log('Response:', t.substring(0, 200)))
.catch(e => console.error('Error:', e.message));
