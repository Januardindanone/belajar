<?php

class Barang extends DB\SQL\Mapper {
    public function __construct($db) {
        parent::__construct($db, 'barang');
    }

    public function all() {
        return $this->find();
    }
    public function create($data) {
        if (empty($data['nama']) || !isset($data['harga'])) {
            throw new \Exception('Nama dan harga wajib diisi');
        }

        $this->copyFrom($data);

        try {
            $this->save();
            return $this->cast(); // kembalikan array untuk JSON
        } catch (\Exception $e) {
            throw new \Exception('Gagal menyimpan barang: ' . $e->getMessage());
        }
    }
    public function updateById($id, $data) {
        $this->load(['id=?', $id]);
        
        try {
            if (!$this->dry()) {
                $this->copyFrom($data);
                $this->save();
                return true;
            }
        } catch (\Exception $e) {
            return false;
        }
    }

    public function delete($id) {
        $this->load(['id=?', $id]);

        if ($this->dry()) {
            return false; // record tidak ada
        }

        try {
            $this->erase();
            return true;
        } catch (\Exception $e) {
            return false;
        }
    }




}
