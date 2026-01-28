import KeyboardExplosion from "@/components/KeyboardExplosion";

export default function Home() {
  return (
    <main className="relative bg-[#050505] min-h-screen">
      <KeyboardExplosion />

      {/* Текстовые слои */}
      <div className="relative z-10 pointer-events-none">
        <section className="h-screen flex items-center justify-center">
          <h1 className="text-6xl md:text-9xl font-bold tracking-tighter text-white/90 mix-blend-difference">
            AULA F75
          </h1>
        </section>

        <section className="h-screen flex items-center justify-start px-10">
          <div className="max-w-xl">
            <h2 className="text-4xl font-bold text-white/90 mb-4">GASKET MOUNTED</h2>
            <p className="text-xl text-white/60">
              Мягкая прокладка. Идеальный звук.
            </p>
          </div>
        </section>

        <section className="h-screen flex items-center justify-end px-10">
          <div className="max-w-xl text-right">
            <h2 className="text-4xl font-bold text-white/90 mb-4">HOTSWAP & PCB</h2>
            <p className="text-xl text-white/60">
              Меняй свитчи без пайки. Полная свобода.
            </p>
          </div>
        </section>

        <section className="h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-white/90 mb-4">ENGINEERED FOR THOCK</h2>
            <button className="pointer-events-auto px-8 py-3 bg-white text-black font-bold rounded-full hover:scale-110 transition-transform">
              КУПИТЬ
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}