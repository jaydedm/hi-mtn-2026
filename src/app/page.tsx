export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        {/* Background image grid */}
        <div className="absolute inset-0 bg-forest-dark grid grid-cols-3 grid-rows-2 gap-3 p-3">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="rounded-2xl overflow-hidden">
              <img
                src={`/images/hero-${n}.png`}
                alt=""
                className="w-full h-full object-cover"
                style={{
                  objectPosition: n === 6 ? "center 30%" : "center 60%",
                }}
              />
            </div>
          ))}
        </div>
        {/* Dark overlay — radial fade so photos show at edges */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(30,14,8,0.9) 0%, rgba(30,14,8,0.55) 60%, rgba(30,14,8,0.25) 100%)",
          }}
        />
        {/* Content */}
        <div className="relative text-cream py-24 px-6 text-center">
          <h1 className="font-brand text-5xl md:text-7xl font-extrabold text-mustard mb-4 tracking-tight">
            Hi-Mountain
          </h1>
          <p className="text-xl md:text-2xl font-brand text-cream-dark">
            The Best Burgers in Utah
          </p>
          <p className="text-lg md:text-xl font-serif italic text-cream-dark mt-2">
            A Walk Down Memory Lane Since 1918
          </p>
          <div className="mt-8 w-24 h-1 bg-mustard mx-auto rounded" />
          <p className="mt-6 text-lg text-cream/80">
            Juicy Burgers · Homestyle Fries ·{" "}
            <span className="whitespace-nowrap">Thick Milkshakes</span>
          </p>
          <div className="mt-8 flex justify-center">
            <div className="flex items-center">
              {Array.from({ length: 16 }, (_, i) => 2009 + i).map((year, i) => (
                <img
                  key={year}
                  src="/images/best-of-state.png"
                  alt={`Best of State Utah ${year} - Best Burgers`}
                  title={`Best of State ${year}`}
                  className="w-14 h-14 md:w-16 md:h-16 object-contain drop-shadow-lg rounded-full"
                  style={{ marginLeft: i === 0 ? 0 : "-2.75rem", zIndex: i }}
                />
              ))}
            </div>
          </div>
          <p className="mt-3 text-sm text-mustard font-semibold">
            16× Best of State Award Winner
          </p>
        </div>
      </section>

      {/* About — Tagline */}
      <section
        style={{ background: "linear-gradient(135deg, #fef7ed, #fed7aa)" }}
        className="py-16 px-6"
      >
        <div className="max-w-4xl mx-auto text-center">
          <p className="font-brand text-2xl md:text-3xl text-wood leading-relaxed">
            Something we all grew up with. Something we can&rsquo;t always find.
            In a world of strip malls and fast food chains...
            <span className="relative inline-block text-mustard font-bold font-serif italic">
              <span className="relative z-10">we like being different.</span>
              <span
                className="absolute bottom-1 left-0 w-full h-3 bg-white/40 -rotate-1 rounded"
                aria-hidden="true"
              />
            </span>
          </p>
        </div>
      </section>

      {/* About — Traditions */}
      <section className="bg-forest text-cream py-16 px-6">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center text-center md:text-left">
          <div>
            <h2 className="font-brand text-3xl font-bold text-mustard mb-4">
              Pride in Our Traditions
            </h2>
            <p className="text-lg leading-relaxed">
              At Hi-Mountain, we take{" "}
              <span className="font-bold text-mustard">
                pride in our traditions
              </span>
              . The food you loved as a child tastes just as good today. We
              strive to give you{" "}
              <span className="font-serif italic text-mustard/80">
                quality food
              </span>{" "}
              paired with{" "}
              <span className="font-serif italic text-mustard/80">
                exceptional service
              </span>
              .
            </p>
          </div>
          <div className="bg-forest-dark rounded-lg p-8 border border-mustard/30">
            <p className="font-serif text-xl italic text-mustard text-center leading-relaxed">
              &ldquo;The food you loved as a child tastes just as good
              today.&rdquo;
            </p>
          </div>
        </div>
      </section>

      {/* About — History */}
      <section
        style={{ background: "linear-gradient(135deg, #fef7ed, #fed7aa)" }}
        className="py-16 px-6"
      >
        <div className="max-w-3xl mx-auto text-center md:text-left">
          <h2 className="font-brand text-3xl font-bold text-wood mb-6 text-center">
            The Drug Store
          </h2>
          <p className="text-lg leading-relaxed text-wood mb-6">
            Built in <span className="font-bold text-wood">1918</span> as
            a confectionary, the store has had very few changes since it first
            opened its doors. Although the pharmacy is now closed, we are still
            — and most likely will be for years to come — fondly known as{" "}
            <span className="relative inline-block font-bold text-wood font-serif italic">
              <span className="relative z-10">
                &ldquo;The Drug Store.&rdquo;
              </span>
              <span
                className="absolute bottom-1 left-0 w-full h-3 bg-mustard/25 -rotate-1 rounded"
                aria-hidden="true"
              />
            </span>
          </p>
          <p className="text-lg leading-relaxed text-wood">
            So,{" "}
            <span className="font-bold text-wood">
              belly up to the bar
            </span>
            , enjoy some down-home service, and take a walk down memory lane.
            Before you go, peek below the old-fashioned ice cream counter at the{" "}
            <span className="font-serif italic text-wood">
              original tile mural
            </span>
            , and help yourself to a heaping serving of{" "}
            <span className="font-bold text-mustard">nostalgia</span>. Let us
            help you create{" "}
            <span className="font-serif italic text-wood">
              special memories
            </span>{" "}
            with your loved ones that will carry on through the years.
          </p>
        </div>
      </section>

      {/* About — Promise */}
      <section className="bg-forest-dark text-cream py-16 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-brand text-2xl font-bold text-mustard mb-4">
            Our Promise To You
          </h2>
          <p className="text-lg leading-relaxed">
            When you walk into our store, we are dedicated to providing you with{" "}
            <span className="font-bold text-mustard">friendly service</span>, a{" "}
            <span className="font-bold text-mustard">welcoming atmosphere</span>
            , and <span className="font-bold text-mustard">excellent food</span>{" "}
            made with the highest quality ingredients. If you are not satisfied,
            please let us know and we will do whatever we can to{" "}
            <span className="relative inline-block font-serif italic font-bold">
              <span className="relative z-10">make things right!</span>
              <span
                className="absolute bottom-1 left-0 w-full h-3 bg-mustard/20 -rotate-1 rounded"
                aria-hidden="true"
              />
            </span>
          </p>
        </div>
      </section>
    </>
  );
}
