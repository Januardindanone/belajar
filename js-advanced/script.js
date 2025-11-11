// cara membuat object pada javascript
// 1. Object Literal
// let orang = {
// 	nama: 'Fatah',
// 	power: 8,
// 	makan: function(porsi) {
// 		this.power += porsi;
// 		console.log(`halo ${this.nama}, selamat makan!`);
// 	}
// }


// 2. Function Declaration

const methodMahasiswa = {
	makan : function(porsi){
		this.energi += porsi;
		console.log(`halo ${this.nama}, energi kamu menjadi ${this.energi}`);
	},
	main : function(jam) {
		this.energi -= jam;
		console.log(`halo ${this.nama}, energi kamu menjadi ${this.energi}`);

	}
}

function Mahasiswa(nama, energi){
	let mahasiswa = Object.create(methodMahasiswa);
	mahasiswa.nama = nama;
	mahasiswa.energi = energi;
	
	return mahasiswa;
}

let danone = Mahasiswa("Danu", 10);



// 3. Construction Function
// function Mahasiswa(nama, energi){
// 	this.nama = nama;
// 	this.energi = energi;

// 	this.makan = function(porsi){
// 		this.energi += porsi;
// 		console.log(`halo ${this.nama}, energi kamu menjadi ${this.energi}`);
// 	}

// 	this.main = function(jam) {
// 		this.energi -= jam;
// 		console.log(`halo ${this.nama}, energi kamu menjadi ${this.energi}`);

// 	}
// }

// let danone = new Mahasiswa('danone', 10);


// 4. Object.create
