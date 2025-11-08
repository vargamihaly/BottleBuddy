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
        mapView: "Térképen megtekintés"
      },
      hero: {
        title: "Váltsd palackjaidat közös haszonra",
        description:
          "Kapcsolódj a közösségedhez, és adjátok le együtt a műanyag palackokat. Osztozzatok az 50 forintos visszaváltáson, és segíts Magyarországnak hatékonyabban újrahasznosítani.",
        listBottles: "Palackok meghirdetése",
        findBottles: "Közeli palackok keresése",
        getStarted: "Kezdd el",
        signIn: "Bejelentkezés"
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
