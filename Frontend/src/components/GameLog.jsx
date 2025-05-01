
export default function GameLog({ log }) {
  return (
    <div className="mt-8">
      <h3 className="text-xl font-bold mb-2">Activity Log</h3>
      <div className="bg-gray-100 p-4 rounded-lg h-60 overflow-y-auto">
        {log.map((entry, idx) => (
          <div key={idx} className="text-sm mb-1">{entry}</div>
        ))}
      </div>
    </div>
  );
}
