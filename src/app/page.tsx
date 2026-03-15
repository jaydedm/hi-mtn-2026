export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative bg-forest-dark text-cream py-24 px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <h1 className="font-serif text-5xl md:text-7xl font-black text-mustard mb-4 tracking-tight">
            Hi-Mountain
          </h1>
          <p className="text-xl md:text-2xl font-serif italic text-cream-dark">
            Juicy Burgers · Homestyle Fries · Thick Milkshakes
          </p>
          <div className="mt-8 w-24 h-1 bg-mustard mx-auto rounded" />
          <p className="mt-6 text-lg text-cream/80">
            A walk down memory lane since 1918.
          </p>
        </div>
      </section>

      {/* About — Tagline */}
      <section className="bg-cream py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <p className="font-serif text-2xl md:text-3xl text-forest-dark leading-relaxed">
            &ldquo;Something we all grew up with. Something we can&rsquo;t always find.
            In a world of strip malls and fast food chains,{" "}
            <span className="text-mustard font-bold">we like being different.</span>&rdquo;
          </p>
        </div>
      </section>

      {/* About — Traditions */}
      <section className="bg-forest text-cream py-16 px-6">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="font-serif text-3xl font-bold text-mustard mb-4">
              Pride in Our Traditions
            </h2>
            <p className="text-lg leading-relaxed">
              At Hi-Mountain, we take pride in our traditions. The food you loved as a
              child tastes just as good today. We strive to give you quality food paired
              with exceptional service.
            </p>
          </div>
          <div className="bg-forest-dark rounded-lg p-8 border border-mustard/30">
            <p className="font-serif text-xl italic text-mustard text-center leading-relaxed">
              &ldquo;The food you loved as a child tastes just as good today.&rdquo;
            </p>
          </div>
        </div>
      </section>

      {/* About — History */}
      <section className="bg-cream-dark py-16 px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-serif text-3xl font-bold text-forest-dark mb-6 text-center">
            The Drug Store
          </h2>
          <p className="text-lg leading-relaxed text-wood mb-6">
            Built in 1918 as a confectionary, the store has had very few changes since it
            first opened its doors. Although the pharmacy is now closed, we are still —
            and most likely will be for years to come — fondly known as
            &ldquo;The Drug Store.&rdquo;
          </p>
          <p className="text-lg leading-relaxed text-wood">
            So, belly up to the bar, enjoy some down-home service, and take a walk down
            memory lane. Before you go, peek below the old-fashioned ice cream counter at
            the original tile mural, and help yourself to a heaping serving of nostalgia.
            Let us help you create special memories with your loved ones that will carry
            on through the years.
          </p>
        </div>
      </section>

      {/* About — Promise */}
      <section className="bg-forest-dark text-cream py-16 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-serif text-2xl font-bold text-mustard mb-4">
            Our Promise To You
          </h2>
          <p className="text-lg leading-relaxed">
            When you walk into our store, we are dedicated to providing you with friendly
            service, a welcoming atmosphere, and excellent food made with the highest
            quality ingredients. If you are not satisfied, please let us know and we will
            do whatever we can to make things right!
          </p>
        </div>
      </section>
    </>
  );
}
