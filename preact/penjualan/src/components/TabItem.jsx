// components/TabItem.jsx
export default function TabItem({ icon, label, active, onClick }) {
  return (
    <button
      class={`flex flex-col items-center text-xs py-2 border-l last:border-r ${
        active
          ? 'bg-blue-100 text-blue-600 font-semibold'
          : 'bg-white text-gray-600'
      }`}
      onClick={onClick}
    >
      <span class="text-lg">{icon}</span>
      <span>{label}</span>
    </button>
  );
}
