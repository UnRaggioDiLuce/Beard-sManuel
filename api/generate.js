const { init } = require(’@heyputer/puter.js/src/init.cjs’);

export default async function handler(req, res) {
if (req.method !== ‘POST’) return res.status(405).end();

res.setHeader(‘Access-Control-Allow-Origin’, ‘*’);

const { imageBase64, prompt } = req.body;
const token = process.env.PUTER_AUTH_TOKEN;

if (!token) return res.status(500).json({ error: ‘Token non configurato in Vercel.’ });

try {
// Inizializza Puter con il TUO token — gli amici non devono fare login
const puter = init(token);

```
const result = await puter.ai.txt2img(prompt, {
  model: 'gemini-2.5-flash-image-preview',
  input_images: [imageBase64]   // img2img: passa la foto originale
});

// result è un HTMLImageElement (browser) o Buffer (node) — prendiamo il src
let base64Data;
if (result && result.src) {
  // formato data URL: "data:image/png;base64,XXXXX"
  base64Data = result.src.split(',')[1];
} else if (Buffer.isBuffer(result)) {
  base64Data = result.toString('base64');
} else {
  throw new Error('Formato risposta non riconosciuto.');
}

return res.status(200).json({ image: base64Data });
```

} catch (err) {
return res.status(500).json({ error: err.message });
}
}
