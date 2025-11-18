export default function Modal({ open, onClose, children }) {
  if (!open) return null;

  return (
    <div
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={onClose} // klik overlay = tutup modal
    >
      <div
        class="bg-white p-4 rounded-lg shadow w-full max-w-md  mx-2"
        onClick={(e) => e.stopPropagation()} // klik di dalam modal tidak menutup
      >
        <div>
          {children}
        </div>
      </div>
    </div>
  );
}
