
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { startGame } from "../services/api";

export default function Home() {
  const navigate = useNavigate();
  const [trainingMode, setTrainingMode] = useState(false);

  const handleStartGame = async () => {
    const { data } = await startGame(trainingMode);
    navigate(`/game/${data.game_id}`);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold mb-4">Blue vs Red: SOC Training Simulator</h1>
      <div className="flex items-center gap-2 mb-4">
        <label className="text-lg">Training Mode:</label>
        <input
          type="checkbox"
          checked={trainingMode}
          onChange={() => setTrainingMode(!trainingMode)}
        />
      </div>
      <button
        onClick={handleStartGame}
        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        Start Game
      </button>
    </div>
  );
}
