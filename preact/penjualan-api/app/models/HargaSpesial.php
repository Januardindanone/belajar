<?php

class HargaSpesial extends DB\SQL\Mapper {
    public function __construct($db) {
        parent::__construct($db, 'harga_spesial');
    }

    public function create($data) {
        $this->copyFrom($data);
        try {
            $this->save();
            return true;
        } catch (\Exception $e) {
            return false;
        }
    }

    public function findAllById($id_barang) {
        return $this->find(['id_barang=?', $id_barang]);
    }

    public function delete($id) {
        $this->load(['id=?', $id]);
        if ($this->dry()) return false;
        try {
            $this->erase();
            return true;
        } catch (\Exception $e) {
            return false;
        }
    }


}
