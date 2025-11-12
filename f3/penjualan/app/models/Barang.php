<?php

class Barang extends DB\SQL\Mapper {
    public function __construct(DB\SQL $db) {
        parent::__construct($db, 'barang');
    }

    public function all() {
        return $this->find();
    }

    public function getById($id) {
        return $this->load(['id = ?', $id]);
    }

    public function saveBarang($data) {
        $this->copyFrom($data);
        $this->save();
    }

    public function deleteBarang($id) {
        $this->load(['id = ?', $id]);
        $this->erase();
    }
}
