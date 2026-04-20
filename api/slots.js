const GAS_WEBAPP_URL = 'https://script.google.com/macros/s/AKfycbxRDywg23acgY-1GIXNAujOH17U4lzm7CV5J6c0Ceq0RweBchG6xoOFCaLFlXTicX4VVA/exec';

export default async function handler(req, res) {
  try {
    const response = await fetch(`${GAS_WEBAPP_URL}?mode=slots`);
    const rawText = await response.text();

    let result;
    try {
      result = JSON.parse(rawText);
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: `GAS slots の返却がJSONではありません。HTTP ${response.status} / ${rawText.slice(0, 200)}`
      });
    }

    if (!response.ok || !result.success) {
      return res.status(400).json({
        success: false,
        message: result.message || `GAS slots 取得失敗 HTTP ${response.status}`
      });
    }

    return res.status(200).json({
      success: true,
      dates: result.dates || []
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `VercelからGAS slots取得でエラーが発生しました: ${error.message}`
    });
  }
}
