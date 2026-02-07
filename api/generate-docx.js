/**
 * Generate DOCX - Simple text-based approach
 */
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
    const data = req.body;

    // Create simple text-based trade record
    const tradeRecord = `
TRADE RECORD SHEET
Sutton Group Realty Systems Inc. Brokerage

═══════════════════════════════════════════════════════════

MLS#: ${data.mlsNumber || '________________'}

Property Address: ${data.propertyAddress || '________________'}

Vendor: ${data.vendor || '________________'}

Purchaser: ${data.purchaser || '________________'}

Mandatory Your CLIENT'S Birthdate: ${data.clientBirthdate || '________________'}

Optional: Your Client's Email: ${data.clientEmail || '________________'}

═══════════════════════════════════════════════════════════

FINANCIAL INFORMATION

Sale Price: ${data.salePrice || '________________'}

Total Commission: ${data.totalCommissionPercent || '____'}%

═══════════════════════════════════════════════════════════

AGENT INFORMATION

Sutton Agent: ${data.suttonAgentName || '________________'}

Other Agent: ${data.otherAgentName || '________________'}

Other Brokerage: ${data.otherBrokerage || '________________'}

═══════════════════════════════════════════════════════════

SELLER'S SOLICITOR

Name: ${data.sellerSolicitorName || '________________'}

Phone: ${data.sellerSolicitorPhone || '________________'}

Email: ${data.sellerSolicitorEmail || '________________'}

═══════════════════════════════════════════════════════════

BUYER'S SOLICITOR

Name: ${data.buyerSolicitorName || '________________'}

Phone: ${data.buyerSolicitorPhone || '________________'}

Email: ${data.buyerSolicitorEmail || '________________'}

═══════════════════════════════════════════════════════════

DEAL INFORMATION

Firm Deal: ${data.firmDeal || '________________'}

Closing: ${data.closingDate || '________________'}

Deposit Amount: ${data.depositAmount || '________________'}

═══════════════════════════════════════════════════════════

INVOICE

To: Sutton Group Realty System Inc.
1542 Dundas Street West
Mississauga, Ontario L5C 1E4

Commission: ${data.commission || '________________'}

HST 13%: ${data.hst || '________________'}

Total Commission: ${data.totalCommission || '________________'}

Agent Signature: __________________

═══════════════════════════════════════════════════════════

CONGRATULATIONS!! WE LOVE NEW DEALS-KEEP THEM COMING!

═══════════════════════════════════════════════════════════
`;

    // Return as text file (can be opened in Word)
    res.setHeader('Content-Type', 'text/plain');
    res.setHeader('Content-Disposition', `attachment; filename="Trade_Record_${(data.propertyAddress || 'Sheet').replace(/[^a-zA-Z0-9]/g, '_')}.txt"`);
    
    return res.status(200).send(tradeRecord);

  } catch (error) {
    console.error('Generation error:', error);
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
}
