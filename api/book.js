const GAS_WEBAPP_URL = 'https://script.google.com/macros/s/AKfycbxRDywg23acgY-1GIXNAujOH17U4lzm7CV5J6c0Ceq0RweBchG6xoOFCaLFlXTicX4VVA/exec';

const DATE_MAP = {
  '4/21(火)': '2026/04/21',
  '4/23(木)': '2026/04/23',
  '4/24(金)': '2026/04/24'
};

function normalizeTimeRangeToStart(timeRange) {
  if (!timeRange) return '';
  return String(timeRange).split('〜')[0].trim();
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      message: 'Method Not Allowed'
    });
  }

  try {
    const payload = req.body || {};

    const bookingDate = DATE_MAP[payload.selectedDate] || '';
    const bookingStartTime = normalizeTimeRangeToStart(payload.selectedTime);

    const gasPayload = {
      lastName: payload.lastName,
      firstName: payload.firstName,
      email: payload.email,
      phone: payload.phone,
      phoneConfirm: payload.phoneConfirm,
      yearsOfService: payload.yearsOfService,
      retirementDate: payload.retirementDate,
      socialInsurance: payload.socialInsurance,
      employmentInsurance: payload.employmentInsurance,
      bookingDate,
      bookingStartTime
    };

    const gasResponse = await fetch(GAS_WEBAPP_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(gasPayload)
    });

    const rawText = await gasResponse.text();

    let gasResult;
    try {
      gasResult = JSON.parse(rawText);
    } catch (parseError) {
      return res.status(500).json({
        success: false,
        message: `GASの返却がJSONではありません。HTTP ${gasResponse.status} / ${rawText.slice(0, 200)}`
      });
    }

    if (!gasResponse.ok || !gasResult.success) {
      return res.status(400).json({
        success: false,
        message: gasResult.message || `GAS側エラー HTTP ${gasResponse.status}`
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
      message: `VercelからGASへの通信でエラーが発生しました: ${error.message}`
    });
  }
}
