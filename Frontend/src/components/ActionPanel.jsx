
export default function ActionPanel({ title, actions, selected, setSelected }) {
  return (
    <div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <div className="flex flex-col gap-2">
        {actions.map((action) => (
          <button
            key={action}
            onClick={() => setSelected(action)}
            className={`p-2 border rounded-lg ${selected === action ? 'bg-blue-500' : 'bg-white'}`}
          >
            {action}
          </button>
        ))}
      </div>
    </div>
  );
}
