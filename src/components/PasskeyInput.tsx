"use client";

import { useState } from "react";

export default function PasskeyInput({
  onSubmit
}: {
  onSubmit: (key: string) => void;
}) {
  const [key, setKey] = useState("");

  return (
    <div style={{ marginBottom: 20 }}>
      <input
        type="password"
        placeholder="Enter admin passkey"
        value={key}
        onChange={(e) => setKey(e.target.value)}
      />
      <button onClick={() => onSubmit(key)}>
        Save Passkey
      </button>
    </div>
  );
}
