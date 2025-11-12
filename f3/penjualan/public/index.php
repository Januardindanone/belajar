<?php
$f3 = require('../lib/base.php');
$f3->set('DEBUG', 3);
$f3->set('TEMP', __DIR__ . '/../tmp/'); 
$f3->set('UI', '../app/views/');
ini_set('display_errors', 1);
require_once '../app/controllers/BarangController.php';


$db = new \DB\SQL('mysql:host=localhost;port=3306;dbname=penjualan', 'root', 'd');
$f3->set('DB', $db);

$barangController = new BarangController($f3);

$f3->route('GET /', function($f3) {
    // Set variabel untuk template
    $f3->set('judul', 'Selamat Datang di Penjualan');
    $f3->set('welcome', 'Halo, F3 sudah berjalan!');
    echo Template::instance()->render('home.html');
});

$f3->route('GET /barang', 'BarangController->index');
$f3->route('GET /barang/create', 'BarangController->create');
$f3->route('POST /barang/store', 'BarangController->store');
$f3->route('GET /barang/edit/@id', 'BarangController->edit');
$f3->route('POST /barang/update/@id', 'BarangController->update');
$f3->route('GET /barang/delete/@id', 'BarangController->delete');



$f3->run();
