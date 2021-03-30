const messages = {
  ERR02001: {
    en: 'Client ID is required',
    th: 'ระบุ Client ID',
  },
  ERR02002: {
    en: 'Client Secret is required',
    th: 'ระบุ Client Secret',
  },
  ERR02003: {
    en: 'Access Token is required',
    th: 'ระบุ Access Token',
  },
  ERR02004: {
    en: 'Grant Type is required',
    th: 'ระบุ Grant Type',
  },
  ERR02005: {
    en: 'Client credential not found',
    th: 'ไม่พบข้อมูล Client',
  },
  ERR02006: {
    en: 'Access Token is invalid',
    th: 'Access Token ไม่ถูกต้อง',
  },
  ERR02007: {
    en: 'This E-mail is already registered',
    th: 'อีเมลนี้มีการลงทะเบียนแล้ว',
  },
  ERR02008: {
    en: 'Username is required',
    th: 'กรุณาระบุชื่อผู้ใช้',
  },
  ERR02009: {
    en: 'Password is required',
    th: 'กรุณาระบุรหัสผ่าน',
  },
  ERR02010: {
    en: 'Username or password is incorrect please try again.',
    th: 'ชื่อผู้ใช้หรือรหัสผ่านของคุณไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง',
  },
  ERR02011: {
    en: 'Refresh Token is required',
    th: 'ระบุ Refresh Token',
  },
  ERR02012: {
    en: 'Refresh token is invalid',
    th: 'Refresh token ไม่ถูกต้อง',
  },
  ERR02013: {
    en: 'Email is required',
    th: 'กรุณาระบุอีเมล',
  },
  ERR02014: {
    en: 'Incorrect email please try again.',
    th: 'อีเมลไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง',
  },
  ERR02015: {
    en: 'Token is required',
    th: 'ระบุ Token',
  },
  ERR02016: {
    en: 'New Password is required',
    th: 'กรุณาระบุรหัสผ่านใหม่',
  },
  ERR02017: {
    en: 'Token is invalid',
    th: 'Token ไม่ถูกต้อง',
  },
  ERR02018: {
    en: 'Old Password is required',
    th: 'กรุณาระบุรหัสผ่านเดิม',
  },
  ERR02019: {
    en: 'Image Path is required',
    th: 'ระบุ Image Path',
  },
  ERR02020: {
    en: 'Image Url is required',
    th: 'กรุณาใส่รูปภาพ',
  },
  ERR02021: {
    en: 'Full name is required',
    th: 'กรุณาระบุชื่อเต็ม',
  },
  ERR02022: {
    en: 'Tel is required',
    th: 'กรุณาระบุเบอร์โทรศัพท์ 10 หลัก',
  },
  ERR02023: {
    en: 'Latitude Time is required',
    th: 'ระบุ Latitude',
  },
  ERR02024: {
    en: 'Longtitude Time is required',
    th: 'ระบุ Longtitude',
  },
  ERR02025: {
    en: 'Name is required',
    th: 'กรุณาระบุชื่อ',
  },
  ERR02026: {
    en: 'Address is required',
    th: 'กรุณาระบุที่อยู่',
  },
  ERR02027: {
    en: 'Is Default is required',
    th: 'ระบุ Is Default',
  },
  ERR02028: {
    en: 'Is Default must be Boolean',
    th: 'Is Default ต้องเป็น Boolean',
  },
  ERR02029: {
    en: 'Incorrect password',
    th: 'รหัสผ่านไม่ถูกต้อง',
  },
  ERR02030: {
    en: 'Active is required',
    th: 'ระบุ Active',
  },
  ERR02031: {
    en: 'Active must be Boolean',
    th: 'Active ต้องเป็น Boolean',
  },
  ERR02032: {
    en: 'Authorization Code is required',
    th: 'ระบุ Authorization Code',
  },
  ERR02033: {
    en: 'Authorization Code is invalid',
    th: 'Authorization Code ไม่ถูกต้อง',
  },
  ERR02034: {
    en: 'OTP is required',
    th: 'ระบุ OTP',
  },
  ERR02035: {
    en: 'Invalid verification code, please try again.',
    th: 'รหัสยืนยันไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง',
  },
  ERR02036: {
    en: 'Timeout. Please request for a new verification code.',
    th: 'หมดเวลา กรุณาคลิกรับรหัสใหม่อีกครั้ง',
  },
};

exports.getMessage = (code, lang = 'en') => {
  return messages[code][lang || lang];
};

