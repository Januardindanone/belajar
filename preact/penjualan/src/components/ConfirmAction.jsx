import Button from './Button';

export default function ConfirmAction({ name, actionText = "OK", actionColor = "red", onConfirm, onCancel }) {
  return (
    <div class="p-4 text-center">
      {/* Judul / Pertanyaan */}
      <p class="text-lg font-semibold mb-4">
        Yakin ingin {actionText.toLowerCase()} <span class="text-gray-700 font-bold">{name}</span>?
      </p>

      {/* Tombol aksi */}
      <div class="flex justify-center gap-4">
        <Button color="gray" type="button" onClick={onCancel}>
          Batal
        </Button>
        <Button color={actionColor} type="button" onClick={onConfirm}>
          {actionText}
        </Button>
      </div>
    </div>
  );
}
