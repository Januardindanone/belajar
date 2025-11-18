export default function Button({ children, color = 'blue', onClick, className = '' }) {
  const base = "px-4 py-2 rounded-lg text-sm font-medium transition";
  const colors = {
    blue: "bg-blue-100 border-2 border-blue-500 text-blue-600 hover:bg-blue-50 active:bg-blue-100",
    green: "bg-green-100 border-2 border-green-500 text-green-600 hover:bg-green-50 active:bg-green-100",
    yellow: "bg-yellow-100 border-2 border-yellow-400 text-yellow-500 hover:bg-yellow-50 active:bg-yellow-100",
    red: "bg-red-100 border-2 border-red-500 text-red-600 hover:bg-red-50 active:bg-red-100",
    gray: "bg-gray-100 border-2 border-gray-400 text-gray-600 hover:bg-gray-50 active:bg-gray-100",
  };



  return (
    <button onClick={onClick} class={`${base} ${colors[color]} ${className}`}>
      {children}
    </button>
  );
}
