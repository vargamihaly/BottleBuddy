import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  hu: {
    translation: {
      common: {
        brandName: "BottleBuddy",
        tagline: "Oszd meg. Vidd vissza. Hasznosítsd újra.",
        home: "Kezdőlap",
        exploreMap: "Térkép megnyitása",
        about: "Rólunk",
        faq: "GYIK",
        signIn: "Bejelentkezés",
        signOut: "Kijelentkezés",
        profile: "Profil",
        loading: "Betöltés...",
        error: "Hiba",
        retry: "Próbálja újra",
        backToHome: "Vissza a főoldalra",
        statisticsUnavailable: "Az adatok átmenetileg nem érhetők el.",
        volunteer: "Önkéntes",
        mapView: "Térképen megtekintés",
        notAvailable: "Nincs adat"
      },
      hero: {
        title: "Váltsd palackjaidat közös haszonra",
        description:
          "Kapcsolódj a közösségedhez, és adjátok le együtt a műanyag palackokat. Osztozzatok az 50 forintos visszaváltáson, és segíts Magyarországnak hatékonyabban újrahasznosítani.",
        listBottles: "Palackok meghirdetése",
        findBottles: "Közeli palackok keresése",
        getStarted: "Kezdd el",
        signIn: "Bejelentkezés"
      },
      dashboard: {
        welcome: {
          greetings: {
            morning: "Jó reggelt",
            afternoon: "Jó napot",
            evening: "Jó estét"
          },
          defaultName: "Barát",
          cta: "Készen állsz ma változást hozni?"
        },
        quickActions: {
          title: "Gyors műveletek",
          listBottles: {
            label: "Palackok meghirdetése",
            description: "Új hirdetés létrehozása"
          },
          findBottles: {
            label: "Palackok keresése",
            description: "Elérhető ajánlatok böngészése"
          },
          messages: {
            label: "Üzenetek",
            description: "Beszélgetések megnyitása"
          },
          myListings: {
            label: "Hirdetéseim",
            description: "Palackok kezelése"
          }
        },
        impact: {
          title: "Hatásod",
          description: "Kövesd az újrahasznosítási utadat",
          totalEarnings: "Teljes bevétel",
          earningsValue: "{{amount}} Ft",
          bottlesReturned: "Visszavitt palackok",
          completedPickups: "Teljesített átvételek",
          rating: "Értékelésed"
        },
        activePickups: {
          title: "Aktív átvételek",
          emptyDescription: "Nincsenek aktív átvételi feladataid",
          emptyCtaDescription: "Böngéssz a közeli palackok között, hogy elkezdhess keresni!",
          emptyButton: "Összes átvételi feladat megtekintése",
          viewAll: "Összes megtekintése",
          description: "Közelgő palackátvételeid",
          bottleCount: "{{count}} palack",
          status: {
            pending: "Függőben",
            accepted: "Elfogadva"
          },
          noMessage: "Nincs üzenet"
        }
      }
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "hu",
    fallbackLng: "hu",
    interpolation: {
      escapeValue: false,
    },
  })
  .catch((error) => {
    console.error("i18n initialization failed", error);
  });

export default i18n;
