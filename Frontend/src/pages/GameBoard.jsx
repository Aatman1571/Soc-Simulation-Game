import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  attackerAction,
  defenderAction,
  getGameState,
  getScore,
} from "../services/api";
import ActionPanel from "../components/ActionPanel";
import GameLog from "../components/GameLog";
import MiniMap from "../components/MiniMap";


export default function GameBoard() {
  const { game_id } = useParams();
  const navigate = useNavigate();
  const [gameState, setGameState] = useState(null);
  const [scoreData, setScoreData] = useState(null);
  const [selectedAttack, setSelectedAttack] = useState("");
  const [selectedDefense, setSelectedDefense] = useState("");
  const [sessionExpired, setSessionExpired] = useState(false);

  const fetchState = async () => {
    try {
      const { data } = await getGameState(game_id);
      setGameState(data);
    } catch (error) {
      console.error("Error fetching game state:", error);
      if (error.response?.status === 404) setSessionExpired(true);
    }
  };

  const fetchScore = async () => {
    try {
      const { data } = await getScore(game_id);
      setScoreData(data);
    } catch (error) {
      console.error("Error fetching score:", error);
    }
  };

  useEffect(() => {
    fetchState();
  }, []);

  useEffect(() => {
    if (gameState?.attacker_objective_complete || gameState?.defender_detected) {
      fetchScore();
    }
  }, [gameState]);

  const handleTurn = async () => {
    try {
      const attack = await attackerAction(game_id, selectedAttack);
      await defenderAction(game_id, selectedDefense, attack.data.detection_chance);
      await fetchState();
      setSelectedAttack("");
      setSelectedDefense("");
    } catch (error) {
      console.error("Turn Error:", error);
      if (error.response?.status === 404) setSessionExpired(true);
    }
  };

  if (sessionExpired) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-center">
        <h1 className="text-4xl font-bold text-red-600 mb-6">Session Expired</h1>
        <p className="text-lg mb-6">Your game session is invalid or expired.</p>
        <button
          onClick={() => navigate("/")}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Go to Home
        </button>
      </div>
    );
  }

  if (!gameState) {
    return (
      <div className="flex items-center justify-center h-screen">
        <h1 className="text-2xl">Loading game...</h1>
      </div>
    );
  }

  if (
    (gameState.attacker_objective_complete || gameState.defender_detected) &&
    scoreData
  ) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center p-4">
        <h1 className="text-4xl font-bold text-purple-700 mb-4">🎯 Game Over</h1>
        <h2 className="text-xl font-semibold mb-2">{scoreData.outcome}</h2>
        <div className="bg-white shadow rounded-lg p-6 text-left max-w-md w-full mb-6">
          <p><strong>Turn Count:</strong> {scoreData.turns_played}</p>
          <p><strong>Detection Turn:</strong> {scoreData.detection_turn ?? "N/A"}</p>
          <p><strong>Defender Resources Left:</strong> {scoreData.resources_remaining}</p>
          <p><strong>Red Team Stage Reached:</strong> {scoreData.attacker_stage}</p>
          <p><strong>Final Score:</strong> <span className="text-green-700 font-bold">{scoreData.final_score}/100</span></p>
        </div>
        {scoreData.badges && scoreData.badges.length > 0 && (
          <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-4 w-full max-w-md text-left">
            <h3 className="font-bold text-lg mb-2">🏅 Achievements Unlocked</h3>
            <ul className="list-disc list-inside">
              {scoreData.badges.map((badge, index) => (
                <li key={index}>{badge}</li>
              ))}
            </ul>
          </div>
        )}

        <button
          onClick={() => navigate("/")}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Play Again
        </button>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4">Turn {gameState.turn}</h2>
      <MiniMap attackerStage={gameState.attacker_stage} />
      <div className="grid grid-cols-2 gap-4 mb-4">
        <ActionPanel
          title="Red Team Actions"
          actions={
            gameState.attacker_stage === 0
              ? ["Launch Phishing Email", "Insider Threat Action"]
              : gameState.attacker_stage === 1
              ? ["Deploy Malware", "Exploit Cloud Misconfiguration"]
              : gameState.attacker_stage === 2
              ? ["Network Port Scanning", "Lateral Movement"]
              : ["Data Exfiltration"]
          }
          selected={selectedAttack}
          setSelected={setSelectedAttack}
        />
        <ActionPanel
          title="Blue Team Actions"
          actions={[
            "Review Email Alerts",
            "Analyze Endpoint Behavior",
            "Monitor Network Traffic",
            "Conduct Threat Hunt",
            "Cloud Security Audit",
            "Internal User Behavior Monitoring",
            "Respond to Threat Event"
          ]}
          selected={selectedDefense}
          setSelected={setSelectedDefense}
        />
      </div>

      <button
        disabled={!selectedAttack || !selectedDefense}
        onClick={handleTurn}
        className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 mb-8"
      >
        Play Turn
      </button>

      {gameState.active_threats && gameState.active_threats.length > 0 && (
        <div className="mb-8">
          <h3 className="text-xl font-bold mb-2">Active Threat Events</h3>
          <ul className="bg-yellow-100 p-4 rounded-lg">
            {gameState.active_threats.map((t, idx) => (
              <li key={idx} className="mb-1">
                🔥 <strong>{t.severity.toUpperCase()}</strong> – {t.event} ({t.turns_left} turns left)
              </li>
            ))}
          </ul>
        </div>
      )}

      <GameLog log={gameState.log || []} />
    </div>
  );
}
