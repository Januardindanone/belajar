function Card({judul, isi}) {
  return <div>
  	<h1>{judul}</h1>
  	<h3>{isi}</h3>
  </div>

}
function App(){
	return <div>
		<h1>Halo adik</h1>
		<Card judul="Bacot" isi="kemana saja kau dek" />
		<Card judul="Selow" isi="jangan panik kau dek" />
	</div>
}



// Render ke halaman
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
