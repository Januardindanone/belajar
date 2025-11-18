import { useState, useEffect } from 'preact/hooks';
import Modal from '../components/Modal';
import Button from '../components/Button';
import Table from '../components/Table';
import Toast from '../components/Toast';
import ConfirmAction from '../components/ConfirmAction';
import FormGeneric from '../components/FormGeneric';
import { getBarang, addBarang, deleteBarang, updateBarang, importCSV, getHargaSpesial, addHargaSpesial, deleteHargaSpesial} from '../api';

export default function Barang() {
  const [dataBarang, setDataBarang] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [toast, setToast] = useState(null);
  const [searchText, setSearchText] = useState("");

  const filteredDataBarang = dataBarang.filter((item) =>
    item.nama.toLowerCase().includes(searchText.toLowerCase())
  );

  const showToast = (message, type) => setToast({ message, type });

  const fetchDataBarang = async () => {
    try {
      const data = await getBarang();
      setDataBarang(data);
    } catch (err) {
      console.error(err);
      showToast(err.message, 'error');
    }
  };

  useEffect(() => {
    fetchDataBarang();
  }, []);

  // ---------------------------
  // 🔵 Tambah Barang
  // ---------------------------
  const handleAddSubmit = async (formData) => {
    try {
      await addBarang(formData);
      showToast('Berhasil menambah barang', 'success');
      fetchDataBarang();
    } catch (err) {
      showToast(err.message, 'error');
    }
    setModalOpen(false);
  };

  // ---------------------------
  // 🟡 Update Barang
  // ---------------------------
  const handleUpdateSubmit = async (id, formData) => {
    try {
      await updateBarang(id, formData);
      showToast("Berhasil mengubah barang", "success");
      fetchDataBarang();
    } catch (err) {
      showToast(err.message, "error");
    }

    setModalOpen(false);
  };

  const handleImportSubmit = async (formData) => {
    try {
      await importCSV(formData); // API untuk upload CSV
      showToast('Berhasil mengimpor data CSV', 'success');
      fetchDataBarang();
    } catch (err) {
      showToast(err.message, 'error');
    }
    setModalOpen(false);
  };

  // Tambahkan fungsi ini di komponen Barang
  const handleExportCSV = () => {
    setModalContent(
      <ConfirmAction
        name="semua data barang"
        actionText="Download CSV"
        actionColor="green"
        onConfirm={() => {
          // Buat CSV dari dataBarang
          const header = ['Nama', 'Harga'];
          const rows = dataBarang.map(item => [item.nama, item.harga]);
          const csvContent = [header, ...rows].map(e => e.join(",")).join("\n");

          // Buat blob dan link download
          const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
          const url = URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", "data_barang.csv");
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);

          setModalOpen(false);
          showToast("CSV berhasil diunduh", "success");
        }}
        onCancel={() => setModalOpen(false)}
      >
        <p>Apakah Anda yakin ingin men-download semua data barang?</p>
      </ConfirmAction>
    );
    setModalOpen(true);
  };


  // ---------------------------
  // 🔵 OPEN FORM: ADD
  // ---------------------------
  const bukaFormTambah = () => {
    setModalContent(
      <FormGeneric
        autoFocusKey="nama"
        title="Tambah Barang"
        fields={[
          { key: 'nama', label: 'Nama Barang', placeholder: 'Masukkan nama barang' },
          { key: 'harga', label: 'Harga', type: 'number', placeholder: 'Masukkan harga' },
        ]}
        initialValues={{}}
        onSubmit={handleAddSubmit}
        onClose={() => setModalOpen(false)}
      />
    );
    setModalOpen(true);
  };


  // ---------------------------
  // 🟡 OPEN FORM: EDIT
  // ---------------------------
  const bukaFormEdit = (item) => {
    setModalContent(
      <FormGeneric
        title="Ubah Barang"
        fields={[
          { key: 'nama', label: 'Nama Barang' },
          { key: 'harga', label: 'Harga', type: 'number' },
        ]}
        initialValues={item}
        onSubmit={(formData) => handleUpdateSubmit(item.id, formData)}  // ⬅ ITEM dibawa langsung
        onClose={() => setModalOpen(false)}
      />
    );
    setModalOpen(true);
  };

  const bukaFormImport = () => {
    setModalContent(
      <FormGeneric
        submit="Import"
        title="Import CSV Barang"
        fields={[
          { key: 'file', label: 'Pilih File CSV', type: 'file' }
        ]}
        initialValues={{}}
        onSubmit={handleImportSubmit}
        onClose={() => setModalOpen(false)}
      />
    );
    setModalOpen(true);
  };

  // ---------------------------
  // 🔴 HAPUS BARANG
  // ---------------------------
  const handleHapusClick = (item) => {
    setModalContent(
      <ConfirmAction
        name={item.nama}
        actionText="Hapus"
        actionColor="red"
        onConfirm={async () => {
          try {
            await deleteBarang(item.id);
            showToast(`Berhasil menghapus ${item.nama}`, 'success');
            fetchDataBarang();
          } catch (err) {
            showToast(err.message, 'error');
          }
          setModalOpen(false);
        }}
        onCancel={() => setModalOpen(false)}
      />
    );
    setModalOpen(true);
  };

  // const columns = [
  //   { key: 'nama', label: 'Nama Barang' },
  //   { key: 'harga', label: 'Harga' },

  // ];

  const columns = [
    { key: 'nama', label: 'Nama Barang' },
    { 
      key: 'harga', 
      label: 'Harga',
      render: (row) => (
        <span
          class="text-blue-600 font-semibold cursor-pointer hover:underline"
          onClick={() => bukaModalHargaSpesial(row)}
        >
          {row.harga}
        </span>
      )
    },
  ];


  const actions = [
    { label: 'Ubah', onClick: (row) => bukaFormEdit(row), color: 'border-yellow-500 text-yellow-600 hover:bg-yellow-50 active:bg-yellow-400' },
    { label: 'Hapus', onClick: (row) => handleHapusClick(row), color: 'border-red-500 text-red-600 hover:bg-red-50 active:bg-red-400' },
  ];

  const handleHapusHargaSpesial = (id, barang) => {
    setModalContent(
      <ConfirmAction
        name="Harga spesial ini"
        actionText="Hapus"
        actionColor="red"
        onConfirm={async () => {
          try {
            await deleteHargaSpesial(id);
            showToast(`Berhasil menghapus harga spesial`, 'success');
            fetchDataBarang();
          } catch (err) {
            showToast(err.message, 'error');
          }
          setModalOpen(false);
          bukaModalHargaSpesial(barang);
        }}
        onCancel={() => setModalOpen(false)}
      />
    );
    setModalOpen(true);
  };

  const bukaModalHargaSpesial = async (barang) => {
    try {
      let hsData = await getHargaSpesial(barang.id);

      let showForm = false;
      let jumlah = '';
      let hargaTotal = '';

      const renderModalContent = () => (
        <div>
          <h3 class="text-lg font-semibold mb-2 text-center text-blue-700">{barang.nama}</h3>
          <span class="block text-sm text-gray-700 mb-3">
            Harga satuan: <span class="font-medium text-gray-900">{barang.harga}</span>
          </span>

          <div class="space-y-2 mb-4">
            {hsData.length === 0 ? (
              <p class="text-gray-500 text-center">Belum ada harga spesial</p>
            ) : (
              hsData.map(hs => (
                <div key={hs.id} class="flex items-center bg-gray-50 border rounded-lg px-3 py-2">
                  <span class="font-medium text-gray-900">Beli {hs.jumlah_minimal}</span>
                  <span class="mx-1 text-gray-700">•</span>
                  <span class="font-semibold text-blue-600">Rp {hs.harga_total}</span>
                  <button
                    onClick={()=>{handleHapusHargaSpesial(hs.id, barang)}}
                    class="ml-auto border border-red-500 text-red-600 bg-white hover:bg-red-50 px-2 py-0.5 rounded-full text-[11px] font-medium transition"
                  >
                    Hapus
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Tombol Tambah / Form */}
          {!showForm ? (
            <Button
              color="blue"
              onClick={() => {
                showForm = true;
                setModalContent(renderModalContent());
              }}
            >
              Tambah Harga Spesial
            </Button>
          ) : (
            <>
              <div class="grid grid-cols-2 gap-2 mb-4">
                {/* Kolom 1 */}
                <div class="flex flex-col">
                  <label class="text-sm text-center font-medium mb-1">Jumlah Barang</label>
                  <input
                    type="number"
                    placeholder="Jumlah Barang"
                    class="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    value={jumlah}
                    onInput={(e) => { jumlah = e.target.value; }}
                    min={2}
                  />
                </div>

                {/* Kolom 2 */}
                <div class="flex flex-col">
                  <label class="text-sm text-center font-medium mb-1">Harga Total</label>
                  <input
                    type="number"
                    placeholder="Harga Total"
                    class="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    value={hargaTotal}
                    onInput={(e) => { hargaTotal = e.target.value; }}
                    min={1000}
                  />
                </div>
              </div>

              <Button
                color="blue"
                onClick={async () => {
                  if (!jumlah || !hargaTotal) {
                    showToast("Jumlah dan Harga Total wajib diisi", "error");
                    return;
                  }
                  try {
                    await addHargaSpesial(barang.id, {
                      jumlah_minimal: parseInt(jumlah),
                      harga_total: parseInt(hargaTotal),
                    });
                    hsData = await getHargaSpesial(barang.id);
                    showForm = false;
                    jumlah = '';
                    hargaTotal = '';
                    setModalContent(renderModalContent());
                    showToast("Harga spesial berhasil ditambahkan", "success");
                  } catch (err) {
                    showToast(err.message, "error");
                  }
                }}
              >
                Simpan
              </Button>
            </>
          )}

          <div class="flex justify-end mt-2">
            <Button color="gray" onClick={() => setModalOpen(false)}>Tutup</Button>
          </div>
        </div>
      );

      setModalContent(renderModalContent());
      setModalOpen(true);
    } catch (err) {
      showToast(err.message, "error");
    }
  };



  return (
    <div>
      <h2 class="text-lg font-semibold mb-4 text-blue-700 text-center">📦 Data Barang</h2>
      {/* Container Utama */}
      <div class="flex flex-col gap-4 mb-4">
        {/* Baris 1: Import & Export */}
        <div class="flex gap-2 justify-end">
          <Button color="green" onClick={bukaFormImport}>📥 Import CSV</Button>
          <Button color="yellow" onClick={handleExportCSV}>📤 Export CSV</Button>
        </div>

        {/* Baris 2: Tambah Barang + Pencarian */}
        <div class="flex items-center gap-2">
          <Button
            color="blue"
            onClick={bukaFormTambah}
            class="shrink-0"
          >
            ➕ Tambah Barang
          </Button>

          <input
            type="text"
            placeholder="Cari barang..."
            value={searchText}
            onInput={(e) => setSearchText(e.target.value)}
            class="flex-1 border px-4 py-2 rounded-lg w-1/3 shadow focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>


      <Table columns={columns} data={filteredDataBarang} actions={actions} />

      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        {modalContent}
      </Modal>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
