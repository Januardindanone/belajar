import Link from "next/link";

export default function Header() {
  return (
    <header className="bg-blue-600 text-white p-4 shadow-md">
      <nav className="flex justify-center space-x-4">
        <Link href="/" className="hover:underline">Beranda</Link>
        <Link href="/about" className="hover:underline">Tentang</Link>
      </nav>
    </header>
  );
}
