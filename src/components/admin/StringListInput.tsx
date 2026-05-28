import { useState } from "react";

export function StringListInput({
  label,
  value,
  onChange,
  placeholder,
  accentClass = "text-[color:var(--success)]",
}: {
  label: string;
  value: string[];
  onChange: (next: string[]) => void;
  placeholder?: string;
  accentClass?: string;
}) {
  const [draft, setDraft] = useState("");
  const add = () => {
    const v = draft.trim();
    if (!v) return;
    onChange([...value, v]);
    setDraft("");
  };
  return (
    <div>
      <label className={`text-xs uppercase tracking-wider font-bold ${accentClass}`}>{label}</label>
      <ul className="my-2 space-y-1">
        {value.map((item, i) => (
          <li key={i} className="flex items-center gap-2 bg-background/60 rounded px-2 py-1.5">
            <span className={`${accentClass} font-bold`}>•</span>
            <input
              className="flex-1 bg-transparent text-sm outline-none"
              value={item}
              onChange={(e) => {
                const next = [...value];
                next[i] = e.target.value;
                onChange(next);
              }}
            />
            <button
              type="button"
              onClick={() => onChange(value.filter((_, j) => j !== i))}
              className="text-xs text-[color:var(--danger)] hover:underline"
            >
              Poista
            </button>
          </li>
        ))}
      </ul>
      <div className="flex gap-2">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              add();
            }
          }}
          placeholder={placeholder ?? "Kirjoita ja paina Enter"}
          className="flex-1 bg-background border border-[color:var(--gold)]/30 rounded px-3 py-1.5 text-sm"
        />
        <button type="button" onClick={add} className="px-3 py-1.5 text-sm border border-[color:var(--gold)]/40 rounded text-gold hover:bg-surface-2">
          + Lisää
        </button>
      </div>
    </div>
  );
}