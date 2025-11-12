<?php
require_once __DIR__ . '/../models/Barang.php';

class BarangController {
    protected $f3;
    protected $db;
    protected $model;

    public function __construct($f3) {
        $this->f3 = $f3;
        $this->db = $f3->get('DB');
        $this->model = new Barang($this->db);
    }

    public function index() {
        $this->f3->set('judul', 'Daftar Barang');
        $this->f3->set('barang', $this->model->all());
        echo Template::instance()->render('barang/index.html');
    }

    public function create() {
        $this->f3->set('judul', 'Tambah Barang');
        echo Template::instance()->render('barang/tambah.html');
    }

    public function store() {
        $this->model->saveBarang($_POST);
        $this->f3->reroute('/barang');
    }

    public function edit() {
        $id = $this->f3->get('PARAMS.id');
        $barang = $this->model->getById($id);
        $this->f3->set('barang', $barang);
        $this->f3->set('judul', 'Edit Barang');
        echo Template::instance()->render('barang/form.html');
    }

    public function update() {
        $id = $this->f3->get('PARAMS.id');
        $barang = $this->model->getById($id);
        $barang->copyFrom($_POST);
        $barang->update();
        $this->f3->reroute('/barang');
    }

    public function delete() {
        $id = $this->f3->get('PARAMS.id');
        $this->model->deleteBarang($id);
        $this->f3->reroute('/barang');
    }
}
