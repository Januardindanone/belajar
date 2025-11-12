<?php
// Load F3
$f3 = require('../lib/base.php');
require_once '../lib/template.php';

require '../app/controllers/BarangController.php';

// Debug mode
$f3->set('DEBUG', 3);

// Folder view
$f3->set('UI', '../app/views/');

$f3->route('GET /', function($f3) {
    // Set variabel untuk template
    $f3->set('judul', 'Selamat Datang di Penjualan');
    $f3->set('welcome', 'Halo, F3 sudah berjalan!');
    // Render template dari app/views/
    echo Template::instance()->render('home.html');
});

// Jalankan F3
$f3->run();
