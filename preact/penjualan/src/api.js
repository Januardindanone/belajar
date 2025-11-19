const API_BASE = 'http://10.10.10.197:8000/api';

export const getPembeli = async () => {
  const res = await fetch(`${API_BASE}/pembeli`);
  const result = await res.json();
  if (res.ok && result.status === 'success') return result.data || [];
  throw new Error(result.message || 'Gagal memuat data pembeli');
};


export const addPenjualan = async (data) => {
  const res = await fetch(`${API_BASE}/penjualan`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  const result = await res.json();
  if (res.ok && result.status === 'success') return result;
  throw new Error(result.message || 'Gagal menambahkan penjualan');
};


export const getHargaSpesial = async (id_barang) => {
  const res = await fetch(`${API_BASE}/harga-spesial/${id_barang}`);
  const result = await res.json();
  if (res.ok && result.status === 'success') return result.data || [];
  throw new Error(result.message || 'Gagal memuat data');
};

export const addHargaSpesial = async (id_barang,  data) => {
  const res = await fetch(`${API_BASE}/harga-spesial/${id_barang}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  const result = await res.json();
  if (res.ok && result.status === 'success') return result;
  throw new Error(result.message || 'Gagal menambahkan Harga Spesial');
};

export const deleteHargaSpesial = async (id) => {
  const res = await fetch(`${API_BASE}/harga-spesial/${id}`, { method: 'DELETE' });
  const result = await res.json();
  if (res.ok && result.status === 'success') return result;
  throw new Error(result.message || 'Gagal menghapus harga spesial');
};

export const getBarang = async () => {
  const res = await fetch(`${API_BASE}/barang`);
  const result = await res.json();
  if (res.ok && result.status === 'success') return result.data || [];
  throw new Error(result.message || 'Gagal memuat data');
};

export const addBarang = async (data) => {
  const res = await fetch(`${API_BASE}/barang`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  const result = await res.json();
  if (res.ok && result.status === 'success') return result;
  throw new Error(result.message || 'Gagal menambahkan barang');
};

export const updateBarang = async (id, data) => {
  const res = await fetch(`${API_BASE}/barang/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  const result = await res.json();
  if (res.ok && result.status === 'success') return result;
  throw new Error(result.message || 'Gagal mengupdate barang');
};

export const deleteBarang = async (id) => {
  const res = await fetch(`${API_BASE}/barang/${id}`, { method: 'DELETE' });
  const result = await res.json();
  if (res.ok && result.status === 'success') return result;
  throw new Error(result.message || 'Gagal menghapus barang');
};

export const importCSV = async (formData) => {
  const res = await fetch(`${API_BASE}/barang/import`, {
    method: 'POST',
    body: formData, // penting! tanpa Content-Type agar browser set multipart otomatis
  });

  const result = await res.json();
  if (res.ok && result.status === 'success') return result;
  throw new Error(result.message || 'Gagal mengimpor CSV');
};
