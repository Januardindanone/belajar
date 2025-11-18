import { useState, useEffect } from 'preact/hooks';
import Judul from './components/Judul.jsx'
import Button from "./components/Button";

export function App() {
  const [user, setUsers] = useState([]);

  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/users")
      .then(res => res.json())
      .then(data => setUsers(data))
  }, []);

  return (
    <div>
    <Judul text="Daftar User" />
    <ul>
      {user.map(u =>(
        <li key={u.id}>{u.name}</li>
        ))}
    </ul>
    <div class="p-6">
      <Button color="blue">Klik Saya</Button>
    </div>
  </div>
  )
}
