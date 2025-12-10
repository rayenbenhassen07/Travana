import Container from "@/components/(app)/Container";
import Hero from "@/components/(app)/Hero";

export const metadata = {
  title: "Naseam - Réservez Votre Séjour Parfait en Tunisie",
  description:
    "Découvrez et réservez des hôtels, des circuits et des expériences en Tunisie avec Naseam. Votre solution voyage unique.",
  keywords:
    "voyage Tunisie, réservation hôtel, Naseam, circuits Tunisie, logement Tunisie, excursions",
  openGraph: {
    title: "Naseam - Réservez Votre Séjour Parfait",
    description:
      "Explorez la Tunisie facilement. Réservez hôtels, circuits et plus avec Naseam.",
    url: "https://naseam.com",
    type: "website",
    images: [
      {
        url: "/images/hero.jpg",
        width: 1200,
        height: 630,
        alt: "Naseam - Découvrez la Tunisie",
      },
    ],
  },
};

const Home = () => {
  return (
    <div className="min-h-screen bg-white">
      <Hero />

      <Container>
        <div className="py-20">
          {/* Featured Section */}
          <section className="mb-24">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-[family-name:var(--font-poppins)] font-bold text-neutral-800 mb-4">
                Destinations{" "}
                <span className="text-primary-500">Populaires</span>
              </h2>
              <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
                Découvrez nos meilleures offres pour vos prochaines vacances
              </p>
            </div>

            {/* Add your property cards or listings here */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Placeholder cards */}
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all overflow-hidden group border border-orange-100"
                >
                  <div className="relative h-64 bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center overflow-hidden">
                    <span className="text-white text-7xl transform group-hover:scale-110 transition-transform duration-300">
                      🏖️
                    </span>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-[family-name:var(--font-poppins)] font-bold text-neutral-800 mb-3">
                      Destination {i}
                    </h3>
                    <p className="text-neutral-600 mb-5 text-base">
                      Découvrez cette magnifique destination
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-[family-name:var(--font-montserrat)] font-bold text-primary-500">
                        {150 + i * 50}€
                      </span>
                      <button className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-xl font-semibold transition-colors shadow-md hover:shadow-lg">
                        Voir
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Why Choose Us Section - Clean Orange Design */}
          <section className="py-20 bg-gradient-to-br from-primary-500 to-primary-600 text-white rounded-3xl shadow-2xl">
            <div className="text-center mb-16 px-4">
              <h2 className="text-4xl md:text-5xl font-[family-name:var(--font-poppins)] font-bold mb-4">
                Pourquoi choisir{" "}
                <span className="text-white drop-shadow-lg">Naseam</span> ?
              </h2>
              <p className="text-lg text-orange-50 max-w-2xl mx-auto">
                Votre partenaire de confiance pour des voyages inoubliables
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto px-4">
              <div className="text-center p-8 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 hover:bg-white/20 transition-all">
                <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-white/30">
                  <span className="text-5xl">✨</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">Meilleurs Prix</h3>
                <p className="text-base text-orange-50">
                  Garantie du meilleur prix sur toutes nos offres
                </p>
              </div>

              <div className="text-center p-8 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 hover:bg-white/20 transition-all">
                <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-white/30">
                  <span className="text-5xl">🎯</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">Service 24/7</h3>
                <p className="text-base text-orange-50">
                  Notre équipe est disponible à tout moment
                </p>
              </div>

              <div className="text-center p-8 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 hover:bg-white/20 transition-all">
                <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-white/30">
                  <span className="text-5xl">🏆</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">Qualité Garantie</h3>
                <p className="text-base text-orange-50">
                  Hébergements et services vérifiés
                </p>
              </div>
            </div>
          </section>
        </div>
      </Container>
    </div>
  );
};

export default Home;
