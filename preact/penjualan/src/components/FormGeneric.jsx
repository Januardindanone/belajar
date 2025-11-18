import { useState, useEffect, useRef } from 'preact/hooks';
import Button from './Button';

export default function FormGeneric({
  title = "Form",
  submit = "simpan",
  fields,
  initialValues = {},
  onSubmit,
  onClose,
  autoFocusKey, // 🔹 tambahkan parameter
}) {
  const [formData, setFormData] = useState(() => {
    const data = {};
    fields.forEach(f => {
      if (f.type === 'file') data[f.key] = null;
      else data[f.key] = initialValues[f.key] ?? '';
    });
    return data;
  });

  // 🔹 Ref untuk semua input
  const inputRefs = {};
  fields.forEach(f => {
    inputRefs[f.key] = useRef(null);
  });

  // 🔹 Fokus otomatis saat form mount
  useEffect(() => {
    if (autoFocusKey && inputRefs[autoFocusKey]?.current) {
      inputRefs[autoFocusKey].current.focus();
    }
  }, [autoFocusKey]);

  const handleChange = (key, value, type) => {
    if (type === 'file') {
      setFormData(prev => ({ ...prev, [key]: value[0] || null }));
    } else if (type === 'number') {
      setFormData(prev => ({ ...prev, [key]: Number(value) }));
    } else {
      setFormData(prev => ({ ...prev, [key]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const hasFile = fields.some(f => f.type === 'file' && formData[f.key]);
    if (hasFile) {
      const data = new FormData();
      fields.forEach(f => {
        if (f.type === 'file' && formData[f.key]) data.append(f.key, formData[f.key]);
        else data.append(f.key, formData[f.key]);
      });
      onSubmit(data);
    } else {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} class="space-y-4">

      <h3 class="text-xl font-semibold text-center text-blue-700 mb-4">
        {title}
      </h3>

      {fields.map(field => (
        <div key={field.key} class="flex flex-col">
          <label class="font-semibold mb-1">{field.label}</label>
          <input
            ref={inputRefs[field.key]} // 🔹 pasang ref sesuai key
            type={field.type || 'text'}
            value={field.type === 'file' ? undefined : formData[field.key]}
            onInput={(e) => handleChange(field.key, field.type === 'file' ? e.target.files : e.target.value, field.type)}
            placeholder={field.placeholder || ''}
            class={`border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 ${field.type === 'file' ? 'cursor-pointer' : ''}`}
          />
        </div>
      ))}

      <div class="flex justify-end gap-2 mt-4">
        {onClose && (
          <Button color="gray" type="button" onClick={onClose}>
            Batal
          </Button>
        )}
        <Button color="blue" type="submit">
          {submit}
        </Button>
      </div>
    </form>
  );
}
