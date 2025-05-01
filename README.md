# Blue Team vs Red Team: SOC Simulation Game 🛡️🎮

An interactive **Red Team vs Blue Team cybersecurity simulation** game designed to train SOC (Security Operations Center) analysts. Learn to detect, respond to, and stop simulated cyberattacks through realistic gameplay.

## 🚀 Features

- 🔴 Multi-stage Red Team attacks (Phishing → Malware → Lateral Movement → Exfiltration)
- 🔵 Blue Team defenses with resource management and detection strategies
- 🎲 Random Threat Events with severity levels (critical/medium/low)
- 🗺️ Mini Map of attacker progression across network nodes
- 🎯 End-of-game Scoring System (turns, detection, resource use)
- 🏅 Achievement Badges based on performance (e.g. "Speed Hunter")
- 🎓 Training Mode for guaranteed detection (learning mode)

## 📁 Project Structure

| Folder     | Description                        |
|------------|------------------------------------|
| `/backend` | Flask API with game engine logic   |
| `/frontend`| React + Vite UI for gameplay       |

## 💻 Running the Project Locally

### ✅ Prerequisites

- Python 3.10 or newer
- Node.js (v16+ recommended)
- npm (comes with Node.js)

### 🧪 1. Clone the Repository

```bash
git clone https://github.com/Soc-Simulation-Game.git
cd blue-vs-red-soc-game
```

### 🖥️ 2. Start the Backend (Flask)

```bash
pip install -r requirements.txt
python game.py
```

> Flask server will start on `http://127.0.0.1:5000/`

### 🌐 3. Start the Frontend (React)

In a **new terminal tab/window**:

```bash
cd frontend
npm install
npm run dev
```

> React app will start on `http://localhost:5173/`

## ✅ Tech Stack

| Layer     | Tech          |
|-----------|---------------|
| Frontend  | React + Vite  |
| Backend   | Flask + Python |
| Styling   | Tailwind CSS  |
| API Comm  | Axios         |

## 🏁 How to Play

1. Visit `http://localhost:5173/`
2. Click "Start Game" (optionally enable Training Mode)
3. Each turn:
   - Choose a Red Team (Attacker) move
   - Choose a Blue Team (Defender) move
4. View logs and active threats
5. Win/Lose screen appears with Score + Achievements

## 📄 License

MIT

## 🙋‍♂️ Credits

Made by Aatman Dilipkumar Shah
