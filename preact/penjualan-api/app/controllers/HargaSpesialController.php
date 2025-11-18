<?php

class HargaSpesialController {
    protected $f3;
    protected $db;
    protected $hargaSpesial;

    public function __construct() {
        $this->f3 = \Base::instance();
        $this->db = $this->f3->get('DB');
        $this->hargaSpesial = new HargaSpesial($this->db);
    }

    protected function setCORS() {
        header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type');
    }

    public function getAll($f3, $params) {
        $this->setCORS();
        $id = $params['id_barang'];
        $records = $this->hargaSpesial->findAllById($id);
        $data = [];
        foreach($records as $r){
            $data[] = $r->cast();
        }

        echo json_encode([
            'status' => 'success',
            'data' => $data,
            'message' => 'Berhasil mengambil data harga spesial dari DB'
        ]);
    }

    public function create($f3, $params) {
        $this->setCORS();
        $input = json_decode(file_get_contents('php://input'), true);
        $input['id_barang'] = $params['id_barang'];
        // Validasi sederhana
        if (empty($input['jumlah_minimal']) || !isset($input['harga_total'])) {
            echo json_encode([
                'status' => 'error',
                'data' => null,
                'message' => 'Jumlah dan harga total wajib diisi'
            ]);
            return;
        }

        if ($input['jumlah_minimal'] < 2 || $input['harga_total'] < 1000){
                        echo json_encode([
                'status' => 'error',
                'data' => null,
                'message' => 'Jumlah atau harga terlalu sedikit'
            ]);
            return;
        }

        try {
            $newItem = $this->hargaSpesial->create($input);
            echo json_encode([
                'status' => 'success',
                'data' => $newItem,
                'message' => 'Berhasil menambahkan Harga Spesial'
            ]);
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

        $id = $params['id'];

        try {
            $deleted = $this->hargaSpesial->delete($id);
            if ($deleted) {
                echo json_encode([
                    'status' => 'success',
                    'data' => null,
                    'message' => "Berhasil menghapus harga spesial dengan ID $id"
                ]);
            } else {
                echo json_encode([
                    'status' => 'error',
                    'data' => null,
                    'message' => "Harga Spesial dengan ID $id tidak ditemukan"
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

}
