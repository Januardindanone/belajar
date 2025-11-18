export default function Table({ columns, data, actions }) {
  return (
    <div class="overflow-x-auto bg-white rounded-lg shadow-sm border border-gray-200 mb-4">
      <table class="w-full text-sm">
        <thead class="bg-blue-100 text-blue-700">
          <tr>
            {columns.map((col) => (
              <th class="p-2 border" key={col.key}>{col.label}</th>
            ))}
            {actions && <th class="p-2 border w-32 text-center">Aksi</th>}
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr class="hover:bg-blue-50" key={row.id}>
              {columns.map((col) => (
                <td class="border p-2" key={col.key}>
                  {col.render ? col.render(row) : row[col.key]}
                </td>
              ))}
              {actions && (
                <td class="border p-2 text-center">
                  <div class="flex justify-center gap-2">
                    {actions.map((action) => (
                      <button
                        key={action.label}
                        onClick={() => action.onClick(row)}
                        class={`border px-2 py-0.5 rounded-lg text-[11px] font-medium transition ${action.color}`}
                      >
                        {action.label}
                      </button>
                    ))}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
