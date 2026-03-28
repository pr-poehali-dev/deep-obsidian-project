import Icon from "@/components/ui/icon";

interface SiteNavProps {
  scrollTo: (id: string) => void;
  cartCount: number;
  menuOpen: boolean;
  setMenuOpen: (open: boolean) => void;
  setCartOpen: (open: boolean) => void;
}

export default function SiteNav({ scrollTo, cartCount, menuOpen, setMenuOpen, setCartOpen }: SiteNavProps) {
  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-5"
        style={{ background: "linear-gradient(to bottom, rgba(10,10,12,0.96), transparent)", backdropFilter: "blur(12px)" }}>
        <button onClick={() => scrollTo("main")}
          className="glitch-wrapper font-oswald text-white text-xl font-bold tracking-[0.2em]"
          data-text="МРАКОБЕСИЕ 2.0">
          МРАКОБЕСИЕ 2.0
        </button>

        <div className="hidden md:flex items-center gap-8">
          {[
            { label: "главная", id: "main" },
            { label: "музыка", id: "музыка" },
            { label: "мерч", id: "мерч" },
            { label: "афиша", id: "афиша" },
            { label: "об артисте", id: "about" },
            { label: "контакты", id: "контакты" },
          ].map(link => (
            <button key={link.id} onClick={() => scrollTo(link.id)} className="nav-link">
              {link.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <button className="relative text-white" onClick={() => setCartOpen(true)}>
            <Icon name="ShoppingBag" size={20} />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full font-mono-ibm text-black flex items-center justify-center"
                style={{ background: "var(--neon)", fontSize: "0.55rem" }}>{cartCount}</span>
            )}
          </button>
          <button className="md:hidden text-white" onClick={() => setMenuOpen(!menuOpen)}>
            <Icon name={menuOpen ? "X" : "Menu"} size={20} />
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div className="fixed inset-0 z-40 flex flex-col items-center justify-center gap-8"
          style={{ background: "rgba(10,10,12,0.97)" }}>
          {[
            { label: "ГЛАВНАЯ", id: "main" },
            { label: "МУЗЫКА", id: "музыка" },
            { label: "МЕРЧ", id: "мерч" },
            { label: "АФИША", id: "афиша" },
            { label: "ОБ АРТИСТЕ", id: "about" },
            { label: "КОНТАКТЫ", id: "контакты" },
          ].map(link => (
            <button key={link.id} onClick={() => scrollTo(link.id)}
              className="font-oswald text-white text-3xl tracking-widest hover:text-[var(--neon)] transition-colors">
              {link.label}
            </button>
          ))}
        </div>
      )}
    </>
  );
}
