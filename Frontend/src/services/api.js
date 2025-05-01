
import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000",
});

export const startGame = (training_mode) =>
  API.post("/start_game", { training_mode });

export const attackerAction = (game_id, action) =>
  API.post("/attacker_action", { game_id, action });

export const defenderAction = (game_id, action, detection_chance) =>
  API.post("/defender_action", { game_id, action, detection_chance });

export const getGameState = (game_id) =>
  API.get(`/get_game_state?game_id=${game_id}`);

export const getScore = (game_id) =>
  API.get(`/get_score?game_id=${game_id}`);

