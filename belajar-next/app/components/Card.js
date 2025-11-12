export default function Card({ title, content }) {
  return (
    <div className="bg-white shadow-md rounded-xl p-6 text-center hover:shadow-lg transition">
      <h2 className="text-2xl font-semibold mb-2 text-blue-700">{title}</h2>
      <p>{content}</p>
    </div>
  );
}
