import { useState } from "react";
import Icon from "@/components/ui/icon";

const ARTIST_IMG = "https://cdn.poehali.dev/projects/a00ce720-a256-43b5-bf17-65d283f28886/files/fac367a0-4036-452d-921f-35c92c86b9ed.jpg";

const tracks = [
  { id: 1, title: "Четыре стены", iframeSrc: "https://music.yandex.ru/iframe/album/39688145/track/146093003" },
  { id: 2, title: "Кислород", iframeSrc: "https://music.yandex.ru/iframe/album/37601762/track/141420264" },
  { id: 3, title: "Блять...", iframeSrc: "https://music.yandex.ru/iframe/album/41276956/track/149544686" },
  { id: 4, title: "Балконная кровь", iframeSrc: "https://music.yandex.ru/iframe/album/37601762/track/141420266" },
  { id: 5, title: "Грустный Демон", iframeSrc: "https://music.yandex.ru/iframe/album/37601762/track/141420261" },
];

function WaveVisualizer({ playing }: { playing: boolean }) {
  const bars = Array.from({ length: 20 });
  return (
    <div className="flex items-end gap-[3px] h-8">
      {bars.map((_, i) => (
        <div
          key={i}
          className="wave-bar"
          style={{
            animationDelay: `${i * 0.06}s`,
            animationPlayState: playing ? "running" : "paused",
            height: playing ? undefined : "3px",
            opacity: playing ? 1 : 0.25,
          }}
        />
      ))}
    </div>
  );
}

interface MusicSectionProps {
  scrollTo: (id: string) => void;
}

export default function MusicSection({ scrollTo }: MusicSectionProps) {
  const [playingTrack, setPlayingTrack] = useState<number | null>(null);

  return (
    <>
      {/* ─── HERO ─── */}
      <section id="main" className="relative min-h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={ARTIST_IMG} alt="Артист"
            className="w-full h-full object-cover img-hover-glitch"
            style={{ opacity: 0.45, filter: "contrast(1.2) saturate(0.6)" }} />
          <div className="absolute inset-0" style={{
            background: "linear-gradient(105deg, rgba(10,10,12,0.97) 35%, rgba(10,10,12,0.2) 100%)"
          }} />
          <div className="absolute inset-0" style={{
            background: "linear-gradient(to top, rgba(10,10,12,1) 0%, transparent 60%)"
          }} />
        </div>

        <div className="relative z-10 px-8 md:px-16 pt-28 pb-20 max-w-4xl">
          <div className="section-label mb-6" style={{ animation: "fadeInUp 0.8s ease 0.2s both" }}>
            // официальный сайт_
          </div>

          <h1 className="glitch-wrapper font-oswald text-white leading-none mb-3"
            data-text="МРАКОБЕСИЕ 2.0"
            style={{
              fontSize: "clamp(48px, 10vw, 140px)",
              fontWeight: 700,
              letterSpacing: "-0.02em",
              animation: "fadeInUp 1s ease 0.4s both",
            }}>
            МРАКОБЕСИЕ 2.0
          </h1>

          <p className="font-cormorant text-2xl md:text-3xl mb-10 italic"
            style={{
              color: "rgba(255,255,255,0.45)",
              animation: "fadeInUp 1s ease 0.7s both"
            }}>
            Тьма как основа. Звук как оружие.
          </p>

          <div className="flex flex-wrap gap-4" style={{ animation: "fadeInUp 1s ease 1s both" }}>
            <button className="btn-neon" onClick={() => scrollTo("музыка")}><span>Слушать</span></button>
            <button className="btn-neon" onClick={() => scrollTo("афиша")}><span>Купить билет</span></button>
          </div>

          <div className="flex gap-10 mt-16" style={{ animation: "fadeInUp 1s ease 1.2s both" }}>
            {[["128K", "слушателей"], ["3", "альбома"], ["47", "концертов"]].map(([v, l]) => (
              <div key={l}>
                <div className="font-oswald text-4xl font-bold neon-text">{v}</div>
                <div className="font-mono-ibm text-xs mt-1" style={{ color: "rgba(255,255,255,0.3)", letterSpacing: "0.15em" }}>{l}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <div className="font-mono-ibm text-xs tracking-widest" style={{ color: "rgba(255,255,255,0.2)" }}>scroll</div>
          <div style={{ width: 1, height: 60, background: "linear-gradient(to bottom, rgba(255,255,255,0.15), transparent)" }} />
        </div>
      </section>

      {/* ─── МУЗЫКА ─── */}
      <section id="музыка" className="relative py-24 px-8 md:px-16">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-end justify-between mb-12">
            <div>
              <div className="section-label mb-3">02 // музыка</div>
              <h2 className="font-oswald text-white font-bold tracking-tight" style={{ fontSize: "clamp(40px, 7vw, 80px)" }}>ТРЕКИ</h2>
            </div>
            <WaveVisualizer playing={playingTrack !== null} />
          </div>

          <div>
            {tracks.map((track, i) => (
              <div key={track.id}>
                <div className="track-row flex items-center gap-4 py-5 px-4 cursor-none"
                  onClick={() => setPlayingTrack(playingTrack === track.id ? null : track.id)}>
                  <div className="w-8 text-center font-mono-ibm text-xs flex items-center justify-center"
                    style={{ color: "rgba(255,255,255,0.25)" }}>
                    {playingTrack === track.id
                      ? <Icon name="ChevronUp" size={14} style={{ color: "var(--neon)" }} />
                      : <span>{String(i + 1).padStart(2, "0")}</span>
                    }
                  </div>
                  <div className="flex-1 flex items-center gap-4">
                    <Icon name={playingTrack === track.id ? "Pause" : "Play"} size={16}
                      style={{ color: playingTrack === track.id ? "var(--neon)" : "rgba(255,255,255,0.3)" }} />
                    <div className={`font-oswald text-xl font-medium tracking-wide ${playingTrack === track.id ? "neon-text" : "text-white"}`}>
                      {track.title}
                    </div>
                  </div>
                  <div className="font-mono-ibm text-xs" style={{ color: "rgba(255,255,255,0.25)" }}>
                    {playingTrack === track.id ? "— скрыть" : "слушать →"}
                  </div>
                </div>
                {playingTrack === track.id && (
                  <div className="px-4 pb-4" style={{ background: "rgba(176,48,255,0.04)", borderBottom: "1px solid rgba(176,48,255,0.2)" }}>
                    <iframe
                      frameBorder="0"
                      allow="clipboard-write"
                      style={{ border: "none", width: "100%", height: 244, display: "block" }}
                      src={track.iframeSrc}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-12 flex gap-4">
            <a href="https://music.yandex.ru/artist/24448370" target="_blank" rel="noopener noreferrer" className="btn-neon"><span>Яндекс Музыка</span></a>
            <a href="https://vk.com/artist/mrakobesie2_0" target="_blank" rel="noopener noreferrer" className="btn-neon"><span>VK Музыка</span></a>
          </div>
        </div>
      </section>
    </>
  );
}
