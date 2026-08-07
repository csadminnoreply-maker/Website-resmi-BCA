export interface BrandInfo {
  name: string;
  code: string;
}

export const detectCardType = (cardNumberDigits: string): BrandInfo => {
  const clean = cardNumberDigits.replace(/\D/g, '');
  if (!clean) return { name: 'KARTU DEBIT/KREDIT', code: 'GENERIC' };

  if (/^4/.test(clean)) return { name: 'VISA', code: 'VISA' };
  if (/^(5[1-5]|2[2-7])/.test(clean)) return { name: 'MASTERCARD', code: 'MASTERCARD' };
  if (/^3[47]/.test(clean)) return { name: 'AMERICAN EXPRESS', code: 'AMEX' };
  if (/^35/.test(clean)) return { name: 'JCB', code: 'JCB' };
  if (/^(6019|8688|5210|62)/.test(clean)) return { name: 'BCA CARD / PASPOR BCA', code: 'BCA' };

  return { name: 'GPN / KARTU BANK', code: 'GPN' };
};

export const hasCvvCapability = (_cardNumberDigits: string): boolean => {
  return true;
};

export const formatCardNumber = (value: string): string => {
  const digits = value.replace(/\D/g, '').slice(0, 16);
  return digits.replace(/(.{4})/g, '$1 ').trim();
};

export const formatExpiry = (value: string): string => {
  const digits = value.replace(/\D/g, '').slice(0, 4);
  if (digits.length >= 3) {
    return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  }
  return digits;
};

export const formatRupiah = (value: string): string => {
  const digits = value.replace(/\D/g, '');
  if (!digits) return '';
  const number = parseInt(digits, 10);
  return 'Rp ' + number.toLocaleString('id-ID');
};

// Luhn validation algorithm
export const isValidLuhn = (digits: string): boolean => {
  const clean = digits.replace(/\D/g, '');
  if (clean.length < 13 || clean.length > 16) return false;
  let sum = 0;
  let shouldDouble = false;
  for (let i = clean.length - 1; i >= 0; i--) {
    let digit = parseInt(clean.charAt(i), 10);
    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    shouldDouble = !shouldDouble;
  }
  return sum % 10 === 0;
};

export const validateLuhn = isValidLuhn;

export const getCardNumberError = (cardNumber: string): string | null => {
  const clean = cardNumber.replace(/\D/g, '');
  if (!clean) return 'Nomor kartu tidak boleh kosong';
  if (clean.length < 16) return `Nomor kartu harus 16 digit (${clean.length}/16)`;
  if (clean.length > 16) return 'Nomor kartu maksimal 16 digit';
  if (!isValidLuhn(clean)) return 'Nomor kartu tidak valid (Gagal verifikasi algoritma Luhn)';
  return null;
};

export const getPhoneError = (phone: string): string | null => {
  const clean = phone.replace(/\D/g, '');
  if (!clean) return 'Nomor handphone tidak boleh kosong';
  if (!clean.startsWith('08')) return 'Nomor HP harus diawali 08 (contoh: 08123456789)';
  if (clean.length < 10) return `Nomor HP minimal 10 digit (${clean.length}/10)`;
  if (clean.length > 15) return 'Nomor HP maksimal 15 digit';
  return null;
};

export const getExpiryError = (expiry: string): string | null => {
  const clean = expiry.replace(/\D/g, '');
  if (!clean) return 'Masa berlaku tidak boleh kosong';
  if (clean.length < 4) return 'Format masa berlaku harus MM/YY (4 digit)';
  const month = parseInt(clean.slice(0, 2), 10);
  if (month < 1 || month > 12) return 'Bulan tidak valid (01 - 12)';
  return null;
};

export const getCvvError = (cvv: string): string | null => {
  const clean = cvv.replace(/\D/g, '');
  if (!clean) return 'CVV / CVC tidak boleh kosong';
  if (clean.length < 3) return 'CVV minimal 3 digit';
  return null;
};

export const getLimitError = (limit: string): string | null => {
  const clean = limit.replace(/\D/g, '');
  if (!clean) return 'Limit / saldo tidak boleh kosong';
  if (parseInt(clean, 10) <= 0) return 'Nominal saldo harus lebih besar dari 0';
  return null;
};
