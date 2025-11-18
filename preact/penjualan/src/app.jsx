import { useState } from 'preact/hooks';

/* Halaman */
import TambahPenjualan from './pages/TambahPenjualan';
import Penjualan from './pages/Penjualan';
import Utang from './pages/Utang';
import Barang from './pages/Barang';

/* Tab */
import TabItem from './components/TabItem';

export function App() {
  const [tab, setTab] = useState('tambahPenjualan');

  return (
    <div class="h-screen flex flex-col">
      {/* Konten */}
      <div class="flex-1 p-4 overflow-y-auto">
        {tab === 'tambahPenjualan' && <TambahPenjualan />}
        {tab === 'penjualan' && <Penjualan />}
        {tab === 'utang' && <Utang />}
        {tab === 'barang' && <Barang />}
      </div>

      {/* Bottom Tab Bar */}
      <div class="grid grid-cols-4 border-t bg-white">
        <TabItem icon="➕" label="Tambah" active={tab === 'tambahPenjualan'} onClick={() => setTab('tambahPenjualan')} />
        <TabItem icon="📊" label="Penjualan" active={tab === 'penjualan'} onClick={() => setTab('penjualan')} />
        <TabItem icon="💳" label="Utang" active={tab === 'utang'} onClick={() => setTab('utang')} />
        <TabItem icon="📦" label="Barang" active={tab === 'barang'} onClick={() => setTab('barang')} />
      </div>
    </div>
  );
}