/**
 * Extract endpoint using Node.js (works better on Vercel)
 */
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { files, transactionType } = req.body;

    if (!files || files.length === 0) {
      return res.status(400).json({ error: 'No files provided' });
    }

    const results = [];

    for (const file of files) {
      try {
        const response = await openai.chat.completions.create({
          model: "gpt-4o",
          messages: [{
            role: "user",
            content: [{
              type: "image_url",
              image_url: {
                url: `data:application/pdf;base64,${file.data}`
              }
            }, {
              type: "text",
              text: `Extract ALL data from this ${transactionType} document. Return ONLY valid JSON:
{
  "mlsNumber": "",
  "propertyAddress": "",
  "vendor": "",
  "purchaser": "",
  "clientBirthdate": "",
  "clientEmail": "",
  "salePrice": "",
  "totalCommissionPercent": "",
  "commission": "",
  "hst": "",
  "totalCommission": "",
  "suttonAgentName": "",
  "otherAgentName": "",
  "otherBrokerage": "",
  "sellerSolicitorName": "",
  "sellerSolicitorPhone": "",
  "sellerSolicitorEmail": "",
  "buyerSolicitorName": "",
  "buyerSolicitorPhone": "",
  "buyerSolicitorEmail": "",
  "closingDate": "",
  "depositAmount": "",
  "firmDeal": ""
}`
            }]
          }],
          max_tokens: 2000,
          temperature: 0.1
        });

        const resultText = response.choices[0].message.content.trim();
        const jsonText = resultText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
        const extractedData = JSON.parse(jsonText);

        results.push({
          filename: file.name,
          success: true,
          data: extractedData
        });
      } catch (error) {
        console.error(`Error processing ${file.name}:`, error);
        results.push({
          filename: file.name,
          success: false,
          error: 'Extraction failed'
        });
      }
    }

    return res.status(200).json({
      success: true,
      results
    });

  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
}
