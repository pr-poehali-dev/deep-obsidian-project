import { useEffect, useRef, useState } from "react";
import SiteNav from "@/components/SiteNav";
import MusicSection from "@/components/MusicSection";
import ShopSection from "@/components/ShopSection";
import EventsAboutContacts from "@/components/EventsAboutContacts";

export default function Index() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const trailRef = useRef<HTMLDivElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const move = (e: MouseEvent) => {
      if (cursorRef.current) {
        cursorRef.current.style.left = e.clientX + "px";
        cursorRef.current.style.top = e.clientY + "px";
      }
      setTimeout(() => {
        if (trailRef.current) {
          trailRef.current.style.left = e.clientX + "px";
          trailRef.current.style.top = e.clientY + "px";
        }
      }, 80);
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  return (
    <div className="min-h-screen" style={{ background: "var(--obsidian)", position: "relative" }}>
      <div ref={cursorRef} className="cursor" />
      <div ref={trailRef} className="cursor-trail" />
      <div className="scanline" />

      {/* Smoke orbs */}
      <div className="smoke-orb" style={{ width: 600, height: 600, top: -100, left: -200, animationDuration: "12s" }} />
      <div className="smoke-orb" style={{ width: 400, height: 400, top: "40%", right: -100, animationDuration: "18s", animationDelay: "3s" }} />
      <div className="smoke-orb" style={{ width: 300, height: 300, bottom: "20%", left: "30%", animationDuration: "15s", animationDelay: "6s" }} />

      <SiteNav
        scrollTo={scrollTo}
        cartCount={cartCount}
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
        setCartOpen={setCartOpen}
      />

      <MusicSection scrollTo={scrollTo} />

      <ShopSection
        cartOpen={cartOpen}
        setCartOpen={setCartOpen}
        cartCount={cartCount}
        setCartCount={setCartCount}
      />

      <EventsAboutContacts />
    </div>
  );
}
