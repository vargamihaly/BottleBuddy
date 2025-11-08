import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export const HowItWorksSection = () => {
  return (
    <section className="py-20 px-4 bg-gradient-to-b from-white to-green-50">
      <div className="max-w-6xl mx-auto">
        <h3 className="text-3xl font-bold text-center text-gray-900 mb-4">Hogyan működik a BottleBuddy</h3>
        <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
          Egyszerű, átlátható és kényelmes – juss hozzá a visszaváltási összeg részedhez felesleges utánajárás nélkül.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-green-200 hover:border-green-400 transition-all hover:shadow-lg">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📦</span>
              </div>
              <CardTitle className="text-lg">1. Hirdesd meg a palackokat</CardTitle>
              <CardDescription className="text-sm">
                Add meg, hány palackod van és hol találhatók. Állítsd be, hogyan szeretnéd megosztani a visszajáró összeget.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-blue-200 hover:border-blue-400 transition-all hover:shadow-lg">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🤝</span>
              </div>
              <CardTitle className="text-lg">2. Találj partnert</CardTitle>
              <CardDescription className="text-sm">
                A közelben lévő önkéntesek látják a hirdetésed és átvételi kérelmet küldenek. Üzenetben egyeztethettek.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-purple-200 hover:border-purple-400 transition-all hover:shadow-lg">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💵</span>
              </div>
              <CardTitle className="text-lg">3. Azonnali kifizetés</CardTitle>
              <CardDescription className="text-sm">
                Az önkéntes a helyszínen kifizeti a rád eső részt (pl. 25 Ft/palack). Nem kell újra találkoznotok!
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-emerald-200 hover:border-emerald-400 transition-all hover:shadow-lg">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">♻️</span>
              </div>
              <CardTitle className="text-lg">4. A palackok visszaváltva</CardTitle>
              <CardDescription className="text-sm">
                Az önkéntes visszaviszi a palackokat, felveszi az 50 Ft-ot és megtartja a részét. Mindenki jól jár!
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Key Point Highlight */}
        <div className="mt-12 max-w-3xl mx-auto">
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <span className="text-2xl">💡</span>
              </div>
              <div>
                <h4 className="font-bold text-lg mb-2">Gyors és kényelmes fizetés</h4>
                <p className="text-white/90 text-sm leading-relaxed">
                  <strong>A helyszínen azonnal megkapod a részedet</strong> – nincs várakozás és nincs újabb találkozó.
                  Az önkéntes előre odaadja az egyeztetett összeget, majd ő intézi a visszaváltást és a teljes visszatérítést.
                  Ennyire egyszerű!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};