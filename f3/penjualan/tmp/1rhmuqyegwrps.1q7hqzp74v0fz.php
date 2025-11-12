<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8">
<title><?= ($judul) ?></title>
</head>
<body>
<h1><?= ($judul) ?></h1>
<table border="1">
<tr>
    <th>No</th>
    <th>Nama Barang</th>
    <th>Harga</th>
</tr>
<?php foreach (($barang?:[]) as $idx=>$item): ?>
<tr>
    <td><?= ($idx + 1) ?></td>
    <td><?= ($item['nama']) ?></td>
    <td>Rp <?= ($item['harga']) ?></td>
</tr>
<?php endforeach; ?>
</table>
</body>
</html>
