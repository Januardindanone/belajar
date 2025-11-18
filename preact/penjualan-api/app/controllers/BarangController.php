<?php

class BarangController {
    protected $f3;
    protected $db;
    protected $barang;

    public function __construct() {
        $this->f3 = \Base::instance();
        $this->db = $this->f3->get('DB');
        $this->barang = new Barang($this->db);
    }

    protected function setCORS() {
        header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type');
    }

    public function getAll() {
        $this->setCORS();
        $records = $this->barang->all();
        $data = [];
        foreach($records as $r){
            $data[] = $r->cast();
        }

        echo json_encode([
            'status' => 'success',
            'data' => $data,
            'message' => 'Berhasil mengambil data barang dari DB'
        ]);
    }

    public function create() {
        $this->setCORS();
        $input = json_decode(file_get_contents('php://input'), true);
        // Validasi sederhana
        if (empty($input['nama']) || !isset($input['harga'])) {
            echo json_encode([
                'status' => 'error',
                'data' => null,
                'message' => 'Nama dan harga wajib diisi'
            ]);
            return;
        }

        try {
            $newItem = $this->barang->create($input); // method create di model
            echo json_encode([
                'status' => 'success',
                'data' => $newItem,
                'message' => 'Berhasil menambahkan barang'
            ]);
        } catch (\Exception $e) {
            echo json_encode([
                'status' => 'error',
                'data' => null,
                'message' => $e->getMessage()
            ]);
        }
    }

    public function update($f3, $params) {
        $this->setCORS();

        $id = $params['id'];
        $input = json_decode(file_get_contents('php://input'), true);

        if (empty($input['nama']) || !isset($input['harga'])) {
            echo json_encode([
                'status' => 'error',
                'data' => null,
                'message' => 'Nama dan harga wajib diisi'
            ]);
            return;
        }

        try {
            $updated = $this->barang->updateById($id, $input);

            if ($updated) {
                echo json_encode([
                    'status' => 'success',
                    'data' => $updated,
                    'message' => "Berhasil mengupdate barang ID $id"
                ]);
            } else {
                echo json_encode([
                    'status' => 'error',
                    'data' => null,
                    'message' => "Barang dengan ID $id tidak ditemukan"
                ]);
            }
        } catch (\Exception $e) {
            echo json_encode([
                'status' => 'error',
                'data' => null,
                'message' => $e->getMessage()
            ]);
        }
    }


    public function delete($f3, $params) {
        $this->setCORS();

        $id = $params['id']; // <-- ini ID yang benar

        try {
            $deleted = $this->barang->delete($id);
            if ($deleted) {
                echo json_encode([
                    'status' => 'success',
                    'data' => null,
                    'message' => "Berhasil menghapus barang dengan ID $id"
                ]);
            } else {
                echo json_encode([
                    'status' => 'error',
                    'data' => null,
                    'message' => "Barang dengan ID $id tidak ditemukan"
                ]);
            }
        } catch (\Throwable $e) {
            echo json_encode([
                'status' => 'error',
                'data' => null,
                'message' => "Terjadi error: " . $e->getMessage()
            ]);
        }
    }

    public function importCSV() {
        $this->setCORS();

        if (!isset($_FILES['file']) || $_FILES['file']['error'] !== UPLOAD_ERR_OK) {
            echo json_encode([
                'status' => 'error',
                'message' => 'File CSV tidak valid'
            ]);
            return;
        }

        $file = $_FILES['file']['tmp_name'];

        if (($handle = fopen($file, "r")) === FALSE) {
            echo json_encode([
                'status' => 'error',
                'message' => 'Gagal membaca file CSV'
            ]);
            return;
        }

        // Ambil header
        $header = fgetcsv($handle, 1000, ',');

        if (count($header) < 2) {
            fclose($handle);
            echo json_encode([
                'status' => 'error',
                'message' => 'Format CSV minimal: nama,harga'
            ]);
            return;
        }

        $db = $this->db;
        $count = 0;

        // Loop data CSV
        while (($row = fgetcsv($handle, 1000, ",")) !== FALSE) {
            $nama  = trim($row[0] ?? '');
            $harga = (float)($row[1] ?? 0);

            if ($nama === '') continue;

            $barang = new Barang($db);
            $barang->copyfrom([
                'nama'  => $nama,
                'harga' => $harga
            ]);
            $barang->save();

            $count++;
        }

        fclose($handle);

        echo json_encode([
            'status' => 'success',
            'imported' => $count,
            'message' => "$count data berhasil diimport"
        ]);
    }



}
