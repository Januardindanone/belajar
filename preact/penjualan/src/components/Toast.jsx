// components/ToastCard.jsx
import { useEffect, useState } from 'preact/hooks';

export default function ToastCard({ message, type = 'success', duration = 1500, onClose }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(() => onClose?.(), 500);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const bgIcon = type === 'success' ? 'bg-green-100 text-green-500' : 'bg-red-100 text-red-500';
  const textColor = type === 'success' ? 'text-green-600' : 'text-red-600';
  const title = type === 'success' ? 'Berhasil!' : 'Gagal!';

  return (
    <div class="fixed inset-0 flex items-center justify-center z-50 pointer-events-none ">
      <div
        class={`bg-white rounded-3xl shadow-2xl w-full max-w-md  mx-2 px-8 py-6 text-center transform transition-all duration-500 ${
          visible ? 'scale-100 opacity-100' : 'scale-90 opacity-0'
        } pointer-events-auto`}
      >
        {/* Icon */}
        <div class="flex justify-center mb-4">
          <div class={`rounded-full p-4 ${bgIcon}`}>
            {type === 'success' ? (
              // Ceklis sederhana
              <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            ) : (
              // X sederhana
              <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <line x1="6" y1="18" x2="18" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            )}
          </div>
        </div>

        {/* Title */}
        <h2 class={`text-xl font-bold mb-1 ${textColor}`}>{title}</h2>

        {/* Message */}
        <p class="text-gray-600 text-sm leading-relaxed">{message}</p>
      </div>
    </div>
  );
}
