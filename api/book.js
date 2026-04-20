const GAS_WEBAPP_URL = 'https://script.google.com/macros/s/AKfycbxRDywg23acgY-1GIXNAujOH17U4lzm7CV5J6c0Ceq0RweBchG6xoOFCaLFlXTicX4VVA/exec';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      message: 'Method Not Allowed'
    });
  }

  try {
    const payload = req.body || {};

    const gasResponse = await fetch(GAS_WEBAPP_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const gasResult = await gasResponse.json();

    if (!gasResult.success) {
      return res.status(400).json({
        success: false,
        message: gasResult.message || 'GAS側で予約作成に失敗しました。'
      });
    }

    return res.status(200).json({
      success: true,
      bookingId: gasResult.bookingId,
      fullName: gasResult.fullName,
      bookingDate: gasResult.bookingDate,
      bookingStartTime: gasResult.bookingStartTime,
      bookingEndTime: gasResult.bookingEndTime,
      managementUrl: gasResult.managementUrl
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'VercelからGASへの通信でエラーが発生しました。'
    });
  }
}
