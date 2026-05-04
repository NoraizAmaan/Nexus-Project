import dotenv from 'dotenv';
dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.error('API key missing');
  process.exit(1);
}

fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`)
  .then(res => res.json())
  .then(data => {
    console.log("AVAILABLE MODELS:");
    if (data.models) {
      data.models.forEach(m => {
        if (m.supportedGenerationMethods.includes('generateContent')) {
          console.log(m.name);
        }
      });
    } else {
      console.log(data);
    }
  })
  .catch(err => console.error(err));
