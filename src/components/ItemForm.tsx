"use client";

import { useState } from "react";

export default function ItemForm({
  onSubmit
}: {
  onSubmit: (data: any) => void;
}) {
  const [name, setName] = useState("");

  return (
    <div>
      <input
        placeholder="Item name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button
        onClick={() => {
          onSubmit({ name });
          setName("");
        }}
      >
        Create
      </button>
    </div>
  );
}
