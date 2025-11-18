export default function Button({ children, onClick, type = "button", color="blue" }) {
  function makeColorStyle(color) {
    return `
      border border-${color}-500
      text-${color}-700
      hover:bg-${color}-300
      hover:text-white
      active:bg-${color}-800
    `;
  }
  console.log(makeColorStyle(color));

  return (
    <button
      type={type}
      onClick={onClick}
      class={`px-4 py-2 text-white rounded-lg transition ${makeColorStyle(color)}`}
    >
      {children}
    </button>
  );
}
