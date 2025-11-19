<?php
$f3 = require('../lib/base.php');

$f3->set('TEMP', '../tmp/');
$f3->set('DEBUG', 3);
$f3->set('AUTOLOAD', '../app/controllers/;../app/models/');
$f3->set('DB', new DB\SQL('mysql:host=localhost;port=3306;dbname=penjualan', 'root', 'd'));

// OPTIONS preflight
$f3->route('OPTIONS /api/*', function($f3) {
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type');
    header('Content-Length: 0');
    header('Content-Type: text/plain');
    echo ''; // Wajib, body kosong
    exit; // hentikan eksekusi
});


// Route API
$f3->route('GET /', function() {
    readfile('index.html');
});
$f3->route('GET /api/barang', 'BarangController->getAll');
$f3->route('POST /api/barang', 'BarangController->create');
$f3->route('PUT /api/barang/@id', 'BarangController->update');
$f3->route('DELETE /api/barang/@id', 'BarangController->delete');
$f3->route('POST /api/barang/import', 'BarangController->importCSV');

$f3->route('GET /api/harga-spesial/@id_barang', 'HargaSpesialController->getAll');
$f3->route('POST /api/harga-spesial/@id_barang', 'HargaSpesialController->create');
$f3->route('DELETE /api/harga-spesial/@id', 'HargaSpesialController->delete');
$f3->route('GET /api/pembeli', 'PembeliController->getAll');
$f3->route('POST /api/penjualan', 'PenjualanController->create');




$f3->run();
