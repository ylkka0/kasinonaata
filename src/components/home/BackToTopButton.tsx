import { useEffect, useState } from "react";

/** "Takaisin ylös" -nappi. */
export function BackToTopButton() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 300);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  if (!show) return null;
  return (
    <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Takaisin ylös"
      className="fixed bottom-20 md:bottom-8 right-6 z-50 w-12 h-12 rounded-full gradient-gold text-background font-bold text-xl shadow-lg gold-glow">
      ↑
    </button>
  );
}
