import { useState } from "react";
import { TOC } from "./constants";

/** Avattava sisällysluettelo etusivun yläosassa. */
export function TableOfContentsSection() {
  const [open, setOpen] = useState(false);
  return (
    <div className="container mx-auto px-4 mt-6">
      <button onClick={() => setOpen(!open)} className="text-sm text-gold border border-[color:var(--gold)]/30 rounded-md px-4 py-2 hover:bg-surface">
        📋 Sisällys {open ? "▴" : "▾"}
      </button>
      {open && (
        <ol className="mt-3 grid sm:grid-cols-2 gap-2 bg-surface gold-border rounded-xl p-5 text-sm">
          {TOC.map((item, i) => (
            <li key={item.id} className="flex gap-2">
              <span className="text-gold font-bold tabular-nums">{i + 1}.</span>
              <a href={`#${item.id}`} className="hover:text-gold">{item.label}</a>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}