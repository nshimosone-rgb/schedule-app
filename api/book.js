export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      message: 'Method Not Allowed'
    });
  }

  const {
    selectedDate,
    selectedTime,
    lastName,
    firstName,
    email,
    phone,
    phoneConfirm,
    yearsOfService,
    retirementDate,
    socialInsurance,
    employmentInsurance
  } = req.body || {};

  if (!selectedDate) {
    return res.status(400).json({ success: false, message: '日付が未選択です。' });
  }

  if (!selectedTime) {
    return res.status(400).json({ success: false, message: '時間が未選択です。' });
  }

  if (!lastName || !firstName || !email || !phone || !phoneConfirm || !yearsOfService || !retirementDate || !socialInsurance || !employmentInsurance) {
    return res.status(400).json({ success: false, message: '必須項目が不足しています。' });
  }

  if (phone !== phoneConfirm) {
    return res.status(400).json({ success: false, message: '携帯番号と携帯番号(確認用)が一致していません。' });
  }

  return res.status(200).json({
    success: true,
    message: '仮保存は成功しました。',
    booking: {
      selectedDate,
      selectedTime,
      fullName: `${lastName} ${firstName}`,
      email,
      phone,
      yearsOfService,
      retirementDate,
      socialInsurance,
      employmentInsurance
    }
  });
}
