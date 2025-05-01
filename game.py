from flask import Flask, request, jsonify
import random
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)

class Attacker:
    def __init__(self):
        self.stealth = 100
        self.objective_stage = 0
        self.objective_complete = False

class Defender:
    def __init__(self):
        self.resources = 100
        self.detected = False

class Game:
    def __init__(self, training_mode=False):
        self.attacker = Attacker()
        self.defender = Defender()
        self.training_mode = training_mode
        self.active_threats = []  # holds currently active threat events
        self.detection_turn = None
        self.resolved_threats = 0
        self.turn = 1
        self.log = []

    def random_threat_event(self):
        events = [
            ("Zero-day vulnerability discovered!", -20, "critical"),
            ("Firewall misconfiguration detected!", -10, "medium"),
            ("Unexpected insider leak attempt!", -15, "critical"),
            ("Cloud provider outage - reduced monitoring!", -5, "medium"),
            ("Benign scan from internal subnet.", 0, "low"),
            ("Phishing campaign spike detected!", -10, "medium"),
        ]
        if random.randint(1, 100) <= 40:  # 40% chance of event each turn
            event, penalty, severity = random.choice(events)
            self.active_threats.append({
                "event": event,
                "severity": severity,
                "penalty": penalty,
                "turns_left": 3
            })
            self.log.append(f"Threat Event ({severity.upper()}): {event}")


    def resolve_turn(self, attacker_action, attacker_detection_chance, defender_action, defender_cost):
        self.defender.resources -= defender_cost
        self.random_threat_event()

        # Map attack to correct defense
        attack_defense_map = {
            "Launch Phishing Email": "Review Email Alerts",
            "Deploy Malware": "Analyze Endpoint Behavior",
            "Network Port Scanning": "Monitor Network Traffic",
            "Lateral Movement": "Monitor Network Traffic",
            "Data Exfiltration": "Conduct Threat Hunt",
            "Exploit Cloud Misconfiguration": "Cloud Security Audit",
            "Insider Threat Action": "Internal User Behavior Monitoring",
        }

        # Allowed actions per stage
        stage_attack_map = {
            0: ["Launch Phishing Email", "Insider Threat Action"],
            1: ["Deploy Malware", "Exploit Cloud Misconfiguration"],
            2: ["Network Port Scanning", "Lateral Movement"],
            3: ["Data Exfiltration"],
        }

        best_defense = attack_defense_map.get(attacker_action, "")

        # Optional new blue team action: respond to a threat event
        if defender_action == "Respond to Threat Event" and self.active_threats:
            # Respond to the highest severity event first
            sorted_events = sorted(self.active_threats, key=lambda e: e['severity'], reverse=True)
            event = sorted_events[0]
            self.resolved_threats += 1
            self.active_threats.remove(event)
            self.defender.resources -= 15 if event['severity'] == 'critical' else 10
            self.log.append(f"Blue Team responded to {event['severity']} threat: {event['event']}")

        if defender_action == best_defense:
            if self.training_mode:
                self.defender.detected = True
                self.log.append(f"Training Mode: Defense automatically succeeded! {defender_action} detected {attacker_action}.")
            else:
                effective_detection = attacker_detection_chance + random.randint(-10, 10)
                detect_roll = random.randint(1, 100)
                if detect_roll <= effective_detection:
                    self.defender.detected = True
                    self.log.append(f"Defense succeeded! {defender_action} detected {attacker_action}.")
                else:
                    self.attacker.stealth -= 10
                    self.log.append(f"Defense failed. {attacker_action} remains undetected.")
        else:
            effective_detection = 5
            detect_roll = random.randint(1, 100)
            if detect_roll <= effective_detection:
                self.defender.detected = True
                self.log.append(f"Lucky detection! {defender_action} detected {attacker_action}.")
            else:
                self.attacker.stealth -= 10
                self.log.append(f"Defense failed. {attacker_action} remains undetected.")

        # Progress attacker stage if allowed
        if attacker_action in stage_attack_map.get(self.attacker.objective_stage, []):
            self.attacker.objective_stage += 1
            self.log.append(f"Attacker progressed to Stage {self.attacker.objective_stage}!")

        # Attacker wins if Data Exfiltration successful
        if self.attacker.objective_stage > 3:
            self.attacker.objective_complete = True

        # Attacker stealth too low -> automatic detection
        if self.attacker.stealth <= 20:
            self.defender.detected = True
            if self.detection_turn is None:
                self.detection_turn = self.turn

            self.log.append("Attacker's stealth too low! Defender detected suspicious activity.")

        self.turn += 1
    # Decrement duration of active threats
        for event in self.active_threats:
            event["turns_left"] -= 1
        # Remove expired
        self.active_threats = [e for e in self.active_threats if e["turns_left"] > 0]


    def get_game_state(self):
        return {
            "turn": self.turn,
            "attacker_stealth": self.attacker.stealth,
            "attacker_stage": self.attacker.objective_stage,
            "defender_resources": self.defender.resources,
            "defender_detected": self.defender.detected,
            "attacker_objective_complete": self.attacker.objective_complete,
            "log": self.log,
            "active_threats": self.active_threats
        }

GAMES = {}

@app.route('/start_game', methods=['POST'])
def start_game():
    game_id = str(random.randint(1000, 9999))
    training_mode = request.json.get('training_mode', False)
    GAMES[game_id] = Game(training_mode)
    return jsonify({"game_id": game_id})

@app.route('/attacker_action', methods=['POST'])
def attacker_action():
    game_id = request.json['game_id']
    action = request.json['action']

    if game_id not in GAMES:
        return jsonify({"error": "Invalid game ID"}), 404

    attacker_actions = {
        "Launch Phishing Email": 30,
        "Deploy Malware": 40,
        "Network Port Scanning": 50,
        "Lateral Movement": 35,
        "Data Exfiltration": 25,
        "Exploit Cloud Misconfiguration": 30,
        "Insider Threat Action": 20
    }

    # Stage allowed moves
    stage_attack_map = {
        0: ["Launch Phishing Email", "Insider Threat Action"],
        1: ["Deploy Malware", "Exploit Cloud Misconfiguration"],
        2: ["Network Port Scanning", "Lateral Movement"],
        3: ["Data Exfiltration"],
    }

    current_stage = GAMES[game_id].attacker.objective_stage
    if action not in stage_attack_map.get(current_stage, []):
        return jsonify({"error": f"Action not allowed at current stage {current_stage}."}), 400

    detection_chance = attacker_actions.get(action, 30)
    GAMES[game_id].log.append(f"Red Team action: {action}")

    # Save attack temporarily
    GAMES[game_id].last_attack = action
    GAMES[game_id].last_detection_chance = detection_chance

    return jsonify({"detection_chance": detection_chance})


@app.route('/defender_action', methods=['POST'])
def defender_action():
    game_id = request.json['game_id']
    action = request.json['action']

    if game_id not in GAMES:
        return jsonify({"error": "Invalid game ID"}), 404

    defender_actions = {
        "Review Email Alerts": 20,
        "Analyze Endpoint Behavior": 30,
        "Monitor Network Traffic": 25,
        "Conduct Threat Hunt": 40,
        "Cloud Security Audit": 35,
        "Internal User Behavior Monitoring": 30
    }

    cost = defender_actions.get(action, 20)
    GAMES[game_id].log.append(f"Blue Team action: {action}")

    # Use saved Red Team move
    GAMES[game_id].resolve_turn(
        GAMES[game_id].last_attack,
        GAMES[game_id].last_detection_chance,
        action,
        cost
    )
    return jsonify({"message": "Turn resolved."})

@app.route('/get_game_state', methods=['GET'])
def get_game_state():
    game_id = request.args.get('game_id')
    if game_id in GAMES:
        return jsonify(GAMES[game_id].get_game_state())
    else:
        return jsonify({"error": "Game not found"}), 404

@app.route('/get_score', methods=['GET'])
def get_score():
    game_id = request.args.get("game_id")
    game = GAMES.get(game_id)

    if not game:
        return jsonify({"error": "Invalid game ID"}), 404

    outcome = (
        "Blue Team Wins (Detected)"
        if game.defender.detected else
        "Red Team Wins (Exfiltrated)"
        if game.attacker.objective_complete else
        "Game Incomplete"
    )

    score = 50
    if game.defender.detected:
        score += 30
        if game.detection_turn:
            score += max(0, 20 - game.detection_turn * 2)
    elif game.attacker.objective_complete:
        score -= 30

    # 🏅 ACHIEVEMENTS
    badges = []

    if game.detection_turn is not None and game.detection_turn <= 3:
        badges.append("Speed Hunter")

    if game.defender.resources >= 60:
        badges.append("Resourceful Defender")

    if game.attacker.objective_stage >= 4:
        badges.append("Full Exfiltration")

    if hasattr(game, "resolved_threats") and game.resolved_threats >= 2:
        badges.append("Threat Responder")

    return jsonify({
        "turns_played": game.turn,
        "resources_remaining": game.defender.resources,
        "attacker_stage": game.attacker.objective_stage,
        "detection_turn": game.detection_turn,
        "outcome": outcome,
        "final_score": min(max(score, 0), 100),
        "badges": badges
    })



if __name__ == "__main__":
    app.run(debug=True)
