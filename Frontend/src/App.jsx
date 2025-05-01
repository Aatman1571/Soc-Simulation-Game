
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import GameBoard from "./pages/GameBoard";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/game/:game_id" element={<GameBoard />} />
      </Routes>
    </Router>
  );
}

export default App;
