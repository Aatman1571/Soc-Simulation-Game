import React from "react";

const systems = [
  "Email GW", "Web Server", "Workstation", "File Server",
  "DB Server", "LDAP Auth", "VPN Gateway", "S3 Bucket",
  "Dev Server", "SIEM", "Jump Box", "Finance App",
];

// Map attacker stages to positions
const attackerPositionMap = {
  0: 0,  // Email GW
  1: 1,  // Web Server
  2: 6,  // VPN Gateway
  3: 7,  // S3 Bucket
};

export default function MiniMap({ attackerStage }) {
  return (
    <div className="mb-6">
      <h3 className="text-xl font-semibold mb-2">Network Map</h3>
      <div className="grid grid-cols-4 gap-2">
        {systems.map((sys, idx) => {
          const isAttacker = attackerPositionMap[attackerStage] === idx;
          return (
            <div
              key={idx}
              className={`border rounded p-2 text-center h-16 flex items-center justify-center text-sm ${
                isAttacker ? "bg-red-500 text-white font-bold" : "bg-gray-100"
              }`}
            >
              {isAttacker ? "🟥 " : ""}{sys}
            </div>
          );
        })}
      </div>
    </div>
  );
}
