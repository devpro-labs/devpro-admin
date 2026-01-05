"use client";

export default function ItemList({
  items,
  onDelete
}: {
  items: any[];
  onDelete: (id: number) => void;
}) {
  return (
    <ul>
      {items.map((item) => (
        <li key={item.id}>
          {item.name}
          <button onClick={() => onDelete(item.id)}>
            Delete
          </button>
        </li>
      ))}
    </ul>
  );
}
