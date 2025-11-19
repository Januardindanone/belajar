import { h } from 'preact';
import { useState, useEffect } from 'preact/hooks';
import { getBarang, getHargaSpesial, getPembeli, addPenjualan } from '../api';
import Toast from '../components/Toast';

export default function TambahPenjualan() {
  const [barangList, setBarangList] = useState([]);
  const [namaPembeli, setNamaPembeli] = useState('');
  const [utang, setUtang] = useState(false);
  const [jumlahBayar, setJumlahBayar] = useState('');
  const [barangAktif, setBarangAktif] = useState(null);
  const [dataBarang, setDataBarang] = useState([]);
  const [dropdown, setDropdown] = useState([]);
  const [keyword, setKeyword] = useState('');
  const [jumlah, setJumlah] = useState(1);
  const [hargaSatuan, setHargaSatuan] = useState(0);
  const [totalHarga, setTotalHarga] = useState(null);
  const [hargaSpesial, setHargaSpesial] = useState(null);
  const [pembeliList, setPembeliList] = useState([]);
  const [filteredPembeli, setFilteredPembeli] = useState([]);
  const [dropdownPembeliVisible, setDropdownPembeliVisible] = useState(false);
  const [selectedPembeliId, setSelectedPembeliId] = useState(null);
  const [toast, setToast] = useState(null);
  const showToast = (message, type) => setToast({ message, type });


  const hitungTotalHarga = () => {
    if (!barangAktif) return 0;

    const normal = hargaSatuan;

    // Jika tidak ada harga spesial
    if (!hargaSpesial || hargaSpesial.length === 0) {
      return normal * jumlah;
    }

    // Sort harga spesial dari jumlah_minimal terbesar → terkecil
    const paket = [...hargaSpesial].sort(
      (a, b) => b.jumlah_minimal - a.jumlah_minimal
    );

    let sisa = jumlah;
    let total = 0;

    for (const p of paket) {
      while (sisa >= p.jumlah_minimal) {
        total += p.harga_total;
        sisa -= p.jumlah_minimal;
      }
    }
    total += sisa * normal;
    return total;
  };

  const simpanPenjualan = async () => {
    const items = [
      ...dataBarang.map(b => ({
        id: b.id,
        nama: b.nama,
        harga: b.harga,
        jumlah: b.jumlah,
        total: b.total,
      })),
      ...(barangAktif ? [{
        id: barangAktif.id,
        nama: barangAktif.nama,
        harga: hargaSatuan,
        jumlah,
        total: hitungTotalHarga()
      }] : [])
    ];

    if (items.length === 0) {
      showToast("Tambahkan minimal 1 barang!", "error");
      return;
    }
    if (utang && !namaPembeli.trim()) {
      showToast("Tidak bisa membuat utang tanpa nama pembeli!", "error");
      return;
    }
    if (namaPembeli.trim().length < 3 && namaPembeli.trim() != "") {
      showToast("Nama pembeli minimal 3 hurufff!", "error");
      return;
    }

    const payload = {
      nama_pembeli: namaPembeli.trim() ? namaPembeli.trim() : null,
      id_pembeli: selectedPembeliId || null,
      barang: items,
      total: items.reduce((s, it) => s + (it.total || 0), 0),
      utang,
      jumlah_bayar: utang ? Number(jumlahBayar || 0) : items.reduce((s, it) => s + (it.total || 0), 0)
    };

    try {
      const response = await addPenjualan(payload);
      if (response.status === "success") {
        showToast("Penjualan berhasil disimpan!", "success");
        // Reset seluruh form
          try {
            const updated = await getPembeli();
            setPembeliList(updated || []);
          } catch (e) {
            console.error("Gagal refresh pembeli:", e);
          }
        setNamaPembeli("");
        setSelectedPembeliId(null);
        setDataBarang([]);
        setBarangAktif(null);
        setJumlah(1);
        setHargaSatuan(0);
        setHargaSpesial(null);
        setUtang(false);
        setJumlahBayar('');
      } else {
        showToast("Gagal: " + response.message, "error");
      }

    } catch (err) {
      console.error(err);
      showToast("Terjadi kesalahan server.", "error");
    }
  };




  // isNaN(jumlah) ? setJumlah(1) : setJumlah(jumlah);
  // const totalBarangAktif = barangAktif ? hargaSatuan * jumlah : 0;
  const totalBarangAktif = hitungTotalHarga();
  const totalKeseluruhan = dataBarang.reduce((sum, b) => sum + b.total, 0) + totalBarangAktif;
  const barangTersedia = barangList
  ? barangList.filter(b => !dataBarang.some(p => p.id === b.id))
  : [];

  useEffect(() => {
    getPembeli()
      .then(data => setPembeliList(data || []))
      .catch(err => {
        console.error("Gagal mengambil pembeli:", err);
        setPembeliList([]);
      });
  }, []);

  useEffect(() => {
    if (selectedPembeliId !== null) return;
    if (!namaPembeli.trim()) {
      setFilteredPembeli([]);
      return;
    }

    const hasil = pembeliList.filter(p =>
      p.nama.toLowerCase().includes(namaPembeli.toLowerCase())
    );

    setFilteredPembeli(hasil);
  }, [namaPembeli, pembeliList]);


  const pilihPembeli = (item) => {
    setNamaPembeli(item.nama);
    setSelectedPembeliId(item.id);
    setDropdownPembeliVisible(false);
  };




  useEffect(() => {
    getBarang().then(data => {
      setBarangList(data);
    }).catch(err => {
      console.error("Gagal mengambil data barang:", err);
    });
  }, []);

  useEffect(() => {
    if (!keyword) {
      setDropdown([]);
      return;
    }
    const hasil = barangTersedia.filter(item =>
      item.nama.toLowerCase().includes(keyword.toLowerCase())
    );
    setDropdown(hasil);
  }, [keyword, barangList, dataBarang]);

  const pilihBarang = (item) => {
    setTotalHarga(true);
    setBarangAktif(item);
    setHargaSatuan(item.harga);
    setJumlah(1);
    setKeyword('');

    getHargaSpesial(item.id)
      .then(res => {
        setHargaSpesial(res); // res = { jumlah_minimal, harga_total }
      })
      .catch(err => {
        console.error("Gagal mengambil harga spesial:", err);
        setHargaSpesial(null);
      });
    };


    const tambahBarangKeList = () => {
      if (!barangAktif) return;

      const item = {
        id: barangAktif.id,
        nama: barangAktif.nama,
        harga: hargaSatuan,
        jumlah,
        total: hitungTotalHarga()
      };

      setDataBarang(prev => [...prev, item]);

      setBarangAktif(null);
      setJumlah(1);
      setHargaSatuan(0);
      setHargaSpesial(null);
    };


  const hapusBarang = (id) => {
    setDataBarang(dataBarang.filter(b => b.id !== id));
  };

  const updateJumlah = (val) => {
    const n = Math.max(1, Math.floor(val || 1));
    setJumlah(n);
  };


  return (
    <div class="max-w-md mx-auto">
      <h2 class="text-lg font-bold mb-3 text-blue-600 text-center">🧾 Tambah Penjualan</h2>

      <div class="relative mb-2">
        <input
        type="text"
        placeholder="Masukkan nama pembeli..."
        class="w-full border rounded-lg p-2.5 text-sm"
        value={namaPembeli}
        onInput={(e) => {
          const val = e.target.value;
          setNamaPembeli(val);
          if (selectedPembeliId !== null && val !== pembeliList.find(p => p.id === selectedPembeliId)?.nama) {
            setSelectedPembeliId(null);
          }
          if (val.trim() !== '') {
            setDropdownPembeliVisible(true);
          } else {
            setDropdownPembeliVisible(false);
          }
        }}
        onFocus={() => {
          if (namaPembeli.trim()) setDropdownPembeliVisible(true);
        }}
        onBlur={() => {
          setTimeout(() => setDropdownPembeliVisible(false), 120);
        }}
      />


        {dropdownPembeliVisible && filteredPembeli.length > 0 && (
          <ul class="absolute z-20 bg-white border rounded-lg w-full mt-1 shadow-lg max-h-40 overflow-y-auto text-sm">
            {filteredPembeli.map(item => (
              <li
                key={item.id}
                class="p-2 hover:bg-blue-100 cursor-pointer"
                onMouseDown={(e) => {
                  e.preventDefault();
                  pilihPembeli(item);
                }}
              >
                {item.nama}
              </li>
            ))}
          </ul>
        )}
      </div>



      {dataBarang.length > 0 && (
        <div>
          {dataBarang.map(item => (
          <div key={item.id} class="text-sm flex items-center border rounded-lg px-2 py-1 bg-white mb-1">
            <div class="flex flex-1 flex-col">
              <span>{item.nama}</span>
              <span class="text-xs text-gray-600">@Rp {item.harga}</span>
            </div>
            <div class="flex items-center space-x-1 mr-1">
              <span>beli</span>
              <span>{item.jumlah}</span>
            </div>
            <span class="text-right mr-1 font-bold">= Rp</span>
            <span class="w-[45px] text-right inline-block mr-2 font-mono font-bold">
              {item.total}
            </span>
            <button
              class="bg-red-500 text-white text-xs px-1.5 py-1 rounded-lg"
              onClick={() => hapusBarang(item.id)}
            >
              Hapus
            </button>

          </div>



          ))}
        </div>
      )}

      {!barangAktif && (
        <div class="relative mb-2">
          <input
            type="text"
            placeholder="Ketik nama barang..."
            class="w-full border rounded-lg p-2.5 text-sm"
            value={keyword}
            onInput={e => setKeyword(e.target.value)}
          />
          {dropdown.length > 0 && (
            <ul class="absolute z-10 bg-white border rounded-lg w-full mt-1 shadow-lg max-h-40 overflow-y-auto text-sm">
              {dropdown.map(item => (
                <li
                  key={item.id}
                  class="p-2 hover:bg-blue-100 cursor-pointer"
                  onClick={() => pilihBarang(item)}
                >
                  {item.nama} → Rp {item.harga.toLocaleString()}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}


      {barangAktif && (
        <div class="text-sm flex items-center border rounded-lg px-2 py-1 bg-white mb-2">
          <div class="flex flex-1 flex-col">
              <span>{barangAktif.nama}</span>
              <span class="text-xs text-gray-600">@Rp {hargaSatuan}</span>
            </div>
            <div class="flex items-center space-x-1 mr-1">
              <span>beli</span>
              <span>{jumlah}</span>
            </div>
            <span class="text-right mr-1 font-bold">= Rp</span>
            <span class="w-[45px] text-right inline-block mr-2 font-mono font-bold">
              {totalBarangAktif}
            </span>
            <button
              class="bg-red-500 text-white text-xs px-1.5 py-1 rounded-lg"
              onClick={() => setBarangAktif(null)}
            >
              Hapus
            </button>
        </div>




      )}
      {totalHarga && (
      <div class="justify-end flex">
        <div class="text-center justify-end border rounded-xl text-sm bg-white px-3 py-1 mb-2 border-blue-700">
          Total harga <span class="text-base font-bold">Rp {totalKeseluruhan}</span>
        </div>
      </div>
      )}

      {barangAktif && (
        <div class="grid grid-cols-2 gap-2 mb-4">
         <div class="flex flex-col col-span-1">
          <label class="text-center text-xs">Jumlah</label>
          <div class="flex items-center">
            <button
              class="px-4 py-1 border rounded-l-lg text-lg"
              onClick={() => updateJumlah(jumlah > 1 ? jumlah - 1 : 1)}
            >
              -
            </button>
            <input
              type="number"
              class="text-center border-t border-b py-1 text-lg w-16"
              value={jumlah}
              min={1}
              onInput={e => updateJumlah(Number(e.target.value) || 0)}

            />
            <button
              class="px-4 py-1 border rounded-r-lg text-lg"
              onClick={() => updateJumlah(jumlah + 1)}
            >
              +
            </button>
          </div>
        </div>

          <div class="flex flex-col col-span-1 mt-4">
            <button
              class="bg-green-500 text-white text-sm px-2  py-2 rounded-lg"
              onClick={tambahBarangKeList}
            >
              Tambah barang lain
            </button>
          </div>
        </div>
      )}


      {namaPembeli.length >= 3 && (
        <div class="flex items-center gap-2 my-2">
          <input
            type="checkbox"
            checked={utang}
            onInput={e => setUtang(e.target.checked)}
            class="w-4 h-4 text-blue-600 rounded"
          />
          <span class="text-sm text-gray-700">
            Transaksi ini adalah <b class="text-blue-600">Utang</b>
          </span>
        </div>
      )}

      {utang && (
        <div class="mb-2">
          <input
            type="number"
            placeholder="Masukkan jumlah bayar"
            class="w-full border rounded-lg p-2.5 text-sm"
            value={jumlahBayar}
            onInput={e => setJumlahBayar(e.target.value)}
          />
        </div>
      )}

      <button class="w-full bg-blue-600 text-white py-2 mt-2 rounded-lg" onClick={simpanPenjualan}>💾 Simpan Penjualan</button>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          duration={1500}
          onClose={() => setToast(null)}
        />
      )}

    </div>
  );
}
