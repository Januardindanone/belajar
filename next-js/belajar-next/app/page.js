import Card from './components/Card'

export default async function Home() {
  // Ambil data dari API publik
  const res = await fetch("https://jsonplaceholder.typicode.com/posts?_limit=12");
  const posts = await res.json();

  return (
    <main className="p-10">
      <h1 className="text-3xl font-bold mb-4 text-blue-700">
        Data dari API (Server Component)
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
        {posts.map((post) => (
            <Card key={post.id} title={post.title} content={post.body} />
        ))}
          </div>
    </main>
  );
}
