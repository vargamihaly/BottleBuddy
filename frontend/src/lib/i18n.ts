import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  en: {
    translation: {
      common: {
        brandName: "BottleBuddy",
        tagline: "Share. Return. Recycle.",
        home: "Home",
        exploreMap: "Explore Map",
        about: "About",
        faq: "FAQ",
        signIn: "Sign In",
        signOut: "Sign Out",
        profile: "Profile",
        loading: "Loading...",
        error: "Error",
        retry: "Retry",
        backToHome: "Back to Home",
        statisticsUnavailable: "Statistics temporarily unavailable.",
        volunteer: "Volunteer",
        mapView: "Map View",
        notAvailable: "N/A",
        bottles: "bottles",
        bottle: "bottle",
        status: "Status",
        location: "Location",
        createdBy: "Created by",
        viewAll: "View All",
        cancel: "Cancel",
        confirm: "Confirm",
        save: "Save",
        delete: "Delete",
        edit: "Edit",
        close: "Close",
        search: "Search",
        filter: "Filter",
        sort: "Sort",
        apply: "Apply",
        reset: "Reset"
      },
      hero: {
        title: "Turn Your Bottles into Shared Profit",
        description: "Connect with your community to return plastic bottles together. Share the 50 HUF refund and help Hungary recycle more efficiently.",
        listBottles: "List Your Bottles",
        findBottles: "Find Nearby Bottles",
        getStarted: "Get Started",
        signIn: "Sign In"
      },
      dashboard: {
        welcome: {
          greetings: {
            morning: "Good morning",
            afternoon: "Good afternoon",
            evening: "Good evening"
          },
          defaultName: "Friend",
          cta: "Ready to make a difference today?"
        },
        quickActions: {
          title: "Quick Actions",
          listBottles: {
            label: "List Bottles",
            description: "Create a new listing"
          },
          findBottles: {
            label: "Find Bottles",
            description: "Browse available offers"
          },
          messages: {
            label: "Messages",
            description: "Open conversations"
          },
          myListings: {
            label: "My Listings",
            description: "Manage your bottles"
          }
        },
        impact: {
          title: "Your Impact",
          description: "Track your recycling journey",
          totalEarnings: "Total Earnings",
          earningsValue: "{{amount}} HUF",
          bottlesReturned: "Bottles Returned",
          completedPickups: "Completed Pickups",
          rating: "Your Rating"
        },
        activePickups: {
          title: "Active Pickups",
          emptyDescription: "You have no active pickup tasks",
          emptyCtaDescription: "Browse nearby bottles to start earning!",
          emptyButton: "View All Pickup Tasks",
          viewAll: "View All",
          description: "Your upcoming bottle pickups",
          bottleCount: "{{count}} bottles",
          status: {
            pending: "Pending",
            accepted: "Accepted"
          },
          noMessage: "No message"
        }
      },
      homeSections: {
        cta: {
          title: "Ready to Start Sharing?",
          subtitle: "Join Hungary's growing community of eco-conscious bottle sharers today.",
          listBottles: "List Your Bottles",
          viewDashboard: "View Dashboard",
          signUpFree: "Sign Up Free",
          learnMore: "Learn More"
        },
        myListings: {
          title: "My Active Listings",
          subtitle: "Your bottles available for pickup",
          count: "{{count}} listing",
          count_plural: "{{count}} listings",
          viewAll: "View All",
          noListings: "You currently don't have any active listings.",
          createFirst: "Create Your First Listing"
        },
        availableBottles: {
          title: "Available Bottles Near You",
          subtitle: "Help others by picking up their bottles",
          count: "{{count}} listing",
          count_plural: "{{count}} listings",
          viewAll: "View All",
          viewMap: "View on Map",
          noBottles: "No bottles available near you at the moment.",
          checkBack: "Check back later or explore the map to find bottles!"
        },
        pickupTasks: {
          title: "My Pickup Tasks",
          subtitle: "Bottles you've offered to pick up",
          count: "{{count}} task",
          count_plural: "{{count}} tasks",
          viewAll: "View All",
          noTasks: "You don't have any active pickup tasks.",
          findBottles: "Find Bottles to Pick Up",
          pending: "Pending",
          accepted: "Accepted"
        },
        completedPickups: {
          title: "Completed Pickups",
          subtitle: "Your recycling history",
          count: "{{count}} completed",
          viewAll: "View All",
          noCompleted: "No completed pickups yet.",
          startPickup: "Start your first pickup!",
          completedOn: "Completed on {{date}}"
        }
      },
      stats: {
        bottlesReturned: "Bottles Returned",
        hufShared: "HUF Shared",
        activeUsers: "Active Users"
      },
      howItWorks: {
        title: "How BottleBuddy Works",
        subtitle: "Simple, transparent and convenient – get your share of the refund without the hassle.",
        step1: {
          title: "1. List Your Bottles",
          description: "Specify how many bottles you have and where they are. Set how you want to split the refund."
        },
        step2: {
          title: "2. Find a Partner",
          description: "Nearby volunteers will see your listing and send pickup requests. Coordinate via messaging."
        },
        step3: {
          title: "3. Get Paid Upfront",
          description: "The volunteer pays you your share on-site (e.g., 25 HUF/bottle). No need to meet again!"
        },
        step4: {
          title: "4. Bottles Get Returned",
          description: "The volunteer returns the bottles, collects the 50 HUF and keeps their share. Everyone wins!"
        },
        highlight: {
          title: "Quick and Convenient Payment",
          description: "You get your share immediately on-site – no waiting and no second meeting. The volunteer pays you the agreed amount upfront, then handles the return and collects the full refund. It's that simple!"
        }
      },
      auth: {
        signInTitle: "Welcome Back",
        signInSubtitle: "Sign in to your BottleBuddy account",
        signUpTitle: "Join BottleBuddy",
        signUpSubtitle: "Start recycling together today",
        email: "Email",
        password: "Password",
        name: "Name",
        signInButton: "Sign In",
        signUpButton: "Sign Up",
        signInWithGoogle: "Sign in with Google",
        signUpWithGoogle: "Sign up with Google",
        orContinueWith: "Or continue with",
        noAccount: "Don't have an account?",
        hasAccount: "Already have an account?",
        switchToSignUp: "Sign up",
        switchToSignIn: "Sign in",
        signOutSuccess: "Signed out successfully",
        signOutDescription: "You have been successfully signed out from your BottleBuddy account.",
        signOutError: "Sign out failed. Please try again."
      },
      listing: {
        createTitle: "List Your Bottles",
        createDescription: "Share your bottles with the community",
        title: "Title",
        titlePlaceholder: "e.g., 50 Water Bottles in Budapest",
        bottleCount: "Number of Bottles",
        bottleCountPlaceholder: "e.g., 50",
        location: "Location",
        locationPlaceholder: "Address or description",
        estimatedRefund: "Estimated Total Refund",
        estimatedRefundHelp: "Each bottle is typically worth 50 HUF",
        splitPercentage: "Your Share",
        splitPercentageHelp: "Percentage of refund you keep",
        notes: "Additional Notes",
        notesPlaceholder: "Any special instructions...",
        createButton: "Create Listing",
        updateButton: "Update Listing",
        deleteButton: "Delete Listing",
        deleteConfirm: "Are you sure you want to delete this listing?",
        createSuccess: "Listing created successfully",
        updateSuccess: "Listing updated successfully",
        deleteSuccess: "Listing deleted successfully",
        pickupRequests: "Pickup Requests",
        noPickupRequests: "No pickup requests yet",
        shareToGetVolunteers: "Share your listing to get volunteers!",
        yourListing: "Your Listing",
        offerToPickUp: "Offer to Pick Up",
        accept: "Accept",
        reject: "Reject",
        message: "Message",
        markAsCompleted: "Mark as Completed",
        pending: "Pending",
        accepted: "Accepted",
        rejected: "Rejected",
        completed: "Completed",
        yourShare: "Your share",
        volunteerShare: "Volunteer share",
        rateExchange: "Rate This Exchange",
        youRated: "You rated this exchange"
      },
      messages: {
        title: "Messages",
        conversations: "Conversations",
        noConversations: "No conversations yet",
        noConversationsDescription: "Start a pickup request to begin messaging",
        selectConversation: "Select a conversation",
        selectConversationDescription: "Choose a conversation from the list to view messages",
        typeMessage: "Type a message...",
        send: "Send",
        charactersLeft: "{{count}} characters left",
        attachImage: "Attach Image",
        delivered: "Delivered",
        read: "Read",
        typing: "is typing...",
        you: "You"
      },
      faq: {
        title: "Frequently Asked Questions",
        subtitle: "Everything you need to know about BottleBuddy",
        backToHome: "Back to Home",
        needHelp: "Need More Help?",
        contactSupport: "Contact Support",
        questions: {
          payment: {
            question: "When do I get paid for my bottles?",
            answer: "You get paid immediately during the pickup! The volunteer pays you your agreed share upfront (for example, 25 HUF per bottle if you agreed on a 50/50 split). There's no need to meet again after the exchange."
          },
          split: {
            question: "How does the payment split work?",
            answer: "You decide the split when creating your listing (e.g., 50/50, 60/40, etc.). The volunteer pays you your portion upfront during pickup, then they return the bottles to get the full 50 HUF refund and keep their share. For example: if you have 100 bottles and agree on 50/50, the volunteer pays you 2,500 HUF during pickup, then gets 5,000 HUF from the store."
          },
          risk: {
            question: "What if the volunteer doesn't return the bottles?",
            answer: "You've already received your payment upfront, so there's no risk to you! The volunteer is motivated to return the bottles because that's how they earn their portion of the refund. Our rating system helps build trust in the community."
          },
          meetings: {
            question: "Do I need to meet the volunteer twice?",
            answer: "No! You only meet once during pickup when you hand over the bottles and receive your payment. The volunteer handles returning the bottles on their own and keeps their share. It's one meeting, one payment, done."
          },
          agreement: {
            question: "How do we agree on the split?",
            answer: "When creating your listing, you set your preferred split (e.g., \"I want 25 HUF per bottle\"). Volunteers see this and can send a pickup request if they agree. You can also discuss and negotiate via the in-app messaging before accepting a request."
          },
          safety: {
            question: "Is it safe to invite someone to my home?",
            answer: "Your safety is important! You can choose to meet at a public location instead of your home. Our platform includes user ratings and reviews so you can see other people's experiences. You can also chat with volunteers first to get comfortable before accepting a pickup request."
          },
          create: {
            question: "How do I create a bottle listing?",
            answer: "After signing in, click the \"List Your Bottles\" button on the home page or in the header. Enter how many bottles you have, your location, and your preferred split percentage. You can also add photos and additional details to help volunteers."
          },
          cancel: {
            question: "Can I cancel a pickup request?",
            answer: "Yes! Both the listing owner and the volunteer can cancel a pickup request before it's completed. If you're the owner, you can reject requests. If you're the volunteer, you can cancel your request. Just remember to communicate via the chat if there's a change of plans."
          },
          rating: {
            question: "How does the rating system work?",
            answer: "After completing a pickup, both parties can rate each other on a scale of 1-5 stars and leave a comment. Ratings help build trust in the community and let users see who is reliable. Your average rating is displayed on your profile."
          },
          bottles: {
            question: "What types of bottles can I list?",
            answer: "Any returnable plastic bottles that are accepted at Hungarian stores for the 50 HUF deposit refund. This includes most beverage bottles (water, soda, juice, etc.). Make sure bottles are empty and reasonably clean before pickup."
          }
        }
      },
      footer: {
        platform: "Platform",
        aboutUs: "About Us",
        howItWorks: "How it Works",
        safetyGuidelines: "Safety Guidelines",
        pricing: "Pricing",
        community: "Community",
        userStories: "User Stories",
        environmentalImpact: "Environmental Impact",
        localPartners: "Local Partners",
        support: "Support",
        helpCenter: "Help Center",
        contactUs: "Contact Us",
        termsOfService: "Terms of Service",
        madeWithLove: "Made with 💚 in Hungary."
      },
      map: {
        title: "Bottle Map",
        nearYou: "{{count}} bottle near you",
        nearYou_plural: "{{count}} bottles near you",
        myLocation: "My Location",
        locationFound: "Location found",
        locationCentered: "Centered map on your location",
        locationUnavailable: "Location unavailable",
        locationDefault: "Using default location (Budapest)",
        locationEnable: "Please enable location services",
        searchPlaceholder: "Search by location or title...",
        nearbyBottles: "Nearby Bottles",
        sortedByDistance: "Sorted by distance from your location",
        noBottlesFound: "No bottles found nearby",
        tryAdjustingSearch: "Try adjusting your search",
        distance: "Distance",
        offerPickupConfirm: "Are you sure you want to offer to pick up {{count}} bottles from {{location}}?",
        pickupRequestSent: "Pickup request sent!",
        ownerNotified: "The listing owner will be notified of your offer.",
        sendingRequest: "Sending request..."
      },
      about: {
        title: "About BottleBuddy",
        backToHome: "Back to Home",
        madeWithLove: "Made with love for the planet",
        subtitle: "We're on a mission to make bottle recycling easier, more rewarding, and more social. BottleBuddy connects people who have returnable bottles with those willing to return them, creating a win-win situation for everyone involved.",
        mission: "Our Mission",
        missionText: "Making recycling profitable and community-driven across Hungary.",
        missionDescription: "To create a sustainable future by making bottle recycling accessible, social, and rewarding for everyone. We believe that small actions, when multiplied by millions of people, can transform the world.",
        story: "Our Story",
        storyText: "BottleBuddy was created to solve a simple problem: Many people collect bottles but don't have time to return them. We connect these people with volunteers who are happy to help in exchange for sharing the refund.",
        howWeHelp: "How We Help",
        whyChoose: "Why Choose BottleBuddy?",
        whyChooseSubtitle: "We've built the most comprehensive platform for bottle sharing and recycling. Here's what makes us special.",
        howItWorksTitle: "How It Works",
        feature1: {
          title: "Easy Bottle Sharing",
          description: "List your returnable bottles with just a few taps. Set your location, add details, and you're done!"
        },
        feature2: {
          title: "Community Driven",
          description: "Connect with neighbors who can pick up your bottles. Build a network of people who care about recycling."
        },
        feature3: {
          title: "Environmental Impact",
          description: "Every bottle returned is a step towards a cleaner planet. Track your contribution to sustainability."
        },
        feature4: {
          title: "Safe & Secure",
          description: "User ratings, verified profiles, and secure authentication ensure a trustworthy experience."
        },
        feature5: {
          title: "Fast & Efficient",
          description: "Real-time listings and notifications help you find bottles nearby instantly."
        },
        feature6: {
          title: "Local Focus",
          description: "Interactive map view shows bottles in your neighborhood, making collection easy and efficient."
        },
        step1: {
          title: "Create an Account",
          description: "Sign up with your email or Google account. It takes less than a minute to get started."
        },
        step2: {
          title: "List or Find Bottles",
          description: "Have bottles? Create a listing with details, location, and your preferred refund split. Looking to collect? Browse the map to find bottles near you and see the earnings potential."
        },
        step3: {
          title: "Get Paid Upfront During Pickup",
          description: "Coordinate pickup via in-app messaging. When you meet, the volunteer pays you your agreed share immediately (e.g., 25 HUF per bottle). No waiting, no second meetup needed!"
        },
        step4: {
          title: "Volunteer Returns Bottles",
          description: "The volunteer takes the bottles to the store, gets the full 50 HUF refund per bottle, and keeps their portion. Both parties profit, and you never have to leave home again!"
        },
        step5: {
          title: "Rate & Build Trust",
          description: "After a successful exchange, both parties can rate each other. This builds trust in the community and helps everyone find reliable partners for future exchanges."
        },
        paymentHighlight: {
          title: "Simple & Safe Payment",
          description: "You get paid immediately during the one and only meetup. The volunteer hands you cash for your share of the refund, takes the bottles, and that's it! They handle the return process and collect the full refund from the store. Everyone wins, and you never have to worry about meeting again or waiting for payment."
        },
        stats: {
          bottlesRecycled: "Bottles Recycled",
          activeUsers: "Active Users",
          cities: "Cities",
          userSatisfaction: "User Satisfaction"
        },
        cta: {
          title: "Ready to Make a Difference?",
          description: "Join thousands of users who are making bottle recycling easier and more rewarding.",
          getStarted: "Get Started Today",
          exploreListings: "Explore Listings",
          joinToday: "Join BottleBuddy Today"
        }
      }
    }
  },
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
        notAvailable: "Nincs adat",
        bottles: "palack",
        bottle: "palack",
        status: "Állapot",
        location: "Helyszín",
        createdBy: "Létrehozta",
        viewAll: "Összes megtekintése",
        cancel: "Mégse",
        confirm: "Megerősítés",
        save: "Mentés",
        delete: "Törlés",
        edit: "Szerkesztés",
        close: "Bezárás",
        search: "Keresés",
        filter: "Szűrés",
        sort: "Rendezés",
        apply: "Alkalmazás",
        reset: "Visszaállítás"
      },
      hero: {
        title: "Váltsd palackjaidat közös haszonra",
        description: "Kapcsolódj a közösségedhez, és adjátok le együtt a műanyag palackokat. Osztozzatok az 50 forintos visszaváltáson, és segíts Magyarországnak hatékonyabban újrahasznosítani.",
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
      },
      homeSections: {
        cta: {
          title: "Készen állsz a megosztásra?",
          subtitle: "Csatlakozz Magyarország növekvő környezettudatos palackmegosztó közösségéhez még ma.",
          listBottles: "Palackok meghirdetése",
          viewDashboard: "Irányítópult megtekintése",
          signUpFree: "Ingyenes regisztráció",
          learnMore: "Tudj meg többet"
        },
        myListings: {
          title: "Aktív hirdetéseim",
          subtitle: "Átvételre váró palackjaid",
          count: "{{count}} hirdetés",
          count_plural: "{{count}} hirdetés",
          viewAll: "Összes megtekintése",
          noListings: "Jelenleg nincsenek aktív hirdetéseid.",
          createFirst: "Hozd létre az első hirdetésedet"
        },
        availableBottles: {
          title: "Elérhető palackok a közeledben",
          subtitle: "Segíts másoknak a palackjaik átvételével",
          count: "{{count}} hirdetés",
          count_plural: "{{count}} hirdetés",
          viewAll: "Összes megtekintése",
          viewMap: "Megtekintés térképen",
          noBottles: "Jelenleg nincsenek elérhető palackok a közeledben.",
          checkBack: "Nézz vissza később, vagy fedezd fel a térképet, hogy palackokat találj!"
        },
        pickupTasks: {
          title: "Átvételi feladataim",
          subtitle: "Palackok, amelyeket felajánlottál átvételre",
          count: "{{count}} feladat",
          count_plural: "{{count}} feladat",
          viewAll: "Összes megtekintése",
          noTasks: "Nincsenek aktív átvételi feladataid.",
          findBottles: "Találj palackokat átvételre",
          pending: "Függőben",
          accepted: "Elfogadva"
        },
        completedPickups: {
          title: "Teljesített átvételek",
          subtitle: "Újrahasznosítási előzményeid",
          count: "{{count}} teljesítve",
          viewAll: "Összes megtekintése",
          noCompleted: "Még nincsenek teljesített átvételeid.",
          startPickup: "Kezdd el az első átvételedet!",
          completedOn: "Teljesítve: {{date}}"
        }
      },
      stats: {
        bottlesReturned: "Visszaváltott palackok",
        hufShared: "Megosztott forint",
        activeUsers: "Aktív felhasználók"
      },
      howItWorks: {
        title: "Hogyan működik a BottleBuddy",
        subtitle: "Egyszerű, átlátható és kényelmes – juss hozzá a visszaváltási összeg részedhez felesleges utánajárás nélkül.",
        step1: {
          title: "1. Hirdesd meg a palackokat",
          description: "Add meg, hány palackod van és hol találhatók. Állítsd be, hogyan szeretnéd megosztani a visszajáró összeget."
        },
        step2: {
          title: "2. Találj partnert",
          description: "A közelben lévő önkéntesek látják a hirdetésed és átvételi kérelmet küldenek. Üzenetben egyeztethettek."
        },
        step3: {
          title: "3. Azonnali kifizetés",
          description: "Az önkéntes a helyszínen kifizeti a rád eső részt (pl. 25 Ft/palack). Nem kell újra találkoznotok!"
        },
        step4: {
          title: "4. A palackok visszaváltva",
          description: "Az önkéntes visszaviszi a palackokat, felveszi az 50 Ft-ot és megtartja a részét. Mindenki jól jár!"
        },
        highlight: {
          title: "Gyors és kényelmes fizetés",
          description: "A helyszínen azonnal megkapod a részedet – nincs várakozás és nincs újabb találkozó. Az önkéntes előre odaadja az egyeztetett összeget, majd ő intézi a visszaváltást és a teljes visszatérítést. Ennyire egyszerű!"
        }
      },
      auth: {
        signInTitle: "Üdvözlünk vissza",
        signInSubtitle: "Jelentkezz be a BottleBuddy fiókodba",
        signUpTitle: "Csatlakozz a BottleBuddy-hoz",
        signUpSubtitle: "Kezdd el az együttes újrahasznosítást még ma",
        email: "E-mail",
        password: "Jelszó",
        name: "Név",
        signInButton: "Bejelentkezés",
        signUpButton: "Regisztráció",
        signInWithGoogle: "Bejelentkezés Google-lal",
        signUpWithGoogle: "Regisztráció Google-lal",
        orContinueWith: "Vagy folytasd ezzel",
        noAccount: "Nincs még fiókod?",
        hasAccount: "Már van fiókod?",
        switchToSignUp: "Regisztrálj",
        switchToSignIn: "Jelentkezz be",
        signOutSuccess: "Sikeres kijelentkezés",
        signOutDescription: "Sikeresen kijelentkeztél a BottleBuddy fiókodból.",
        signOutError: "A kijelentkezés nem sikerült. Kérjük, próbáld újra."
      },
      listing: {
        createTitle: "Palackok meghirdetése",
        createDescription: "Oszd meg a palackjaidat a közösséggel",
        title: "Cím",
        titlePlaceholder: "pl. 50 vízes palack Budapesten",
        bottleCount: "Palackok száma",
        bottleCountPlaceholder: "pl. 50",
        location: "Helyszín",
        locationPlaceholder: "Cím vagy leírás",
        estimatedRefund: "Becsült teljes visszatérítés",
        estimatedRefundHelp: "Minden palack általában 50 Ft-ot ér",
        splitPercentage: "A te részed",
        splitPercentageHelp: "A visszatérítés hány százalékát tartod meg",
        notes: "További megjegyzések",
        notesPlaceholder: "Bármilyen speciális utasítás...",
        createButton: "Hirdetés létrehozása",
        updateButton: "Hirdetés frissítése",
        deleteButton: "Hirdetés törlése",
        deleteConfirm: "Biztosan törölni szeretnéd ezt a hirdetést?",
        createSuccess: "Hirdetés sikeresen létrehozva",
        updateSuccess: "Hirdetés sikeresen frissítve",
        deleteSuccess: "Hirdetés sikeresen törölve",
        pickupRequests: "Átvételi kérelmek",
        noPickupRequests: "Még nincsenek átvételi kérelmek",
        shareToGetVolunteers: "Oszd meg a hirdetésed, hogy önkénteseket szerezz!",
        yourListing: "A te hirdetésed",
        offerToPickUp: "Felajánlom az átvételt",
        accept: "Elfogadás",
        reject: "Elutasítás",
        message: "Üzenet",
        markAsCompleted: "Megjelölés befejezettként",
        pending: "Függőben",
        accepted: "Elfogadva",
        rejected: "Elutasítva",
        completed: "Befejezve",
        yourShare: "A te részed",
        volunteerShare: "Önkéntes része",
        rateExchange: "Csere értékelése",
        youRated: "Értékelted ezt a cserét"
      },
      messages: {
        title: "Üzenetek",
        conversations: "Beszélgetések",
        noConversations: "Még nincsenek beszélgetések",
        noConversationsDescription: "Indíts egy átvételi kérelmet az üzenetküldés megkezdéséhez",
        selectConversation: "Válassz egy beszélgetést",
        selectConversationDescription: "Válassz egy beszélgetést a listából az üzenetek megtekintéséhez",
        typeMessage: "Írj egy üzenetet...",
        send: "Küldés",
        charactersLeft: "{{count}} karakter maradt",
        attachImage: "Kép csatolása",
        delivered: "Kézbesítve",
        read: "Olvasva",
        typing: "gépel...",
        you: "Te"
      },
      faq: {
        title: "Gyakran Ismételt Kérdések",
        subtitle: "Minden, amit a BottleBuddy-ról tudnod kell",
        backToHome: "Vissza a főoldalra",
        needHelp: "További segítségre van szükséged?",
        contactSupport: "Kapcsolatfelvétel az ügyfélszolgálattal",
        questions: {
          payment: {
            question: "Mikor kapom meg a pénzt a palackjaimért?",
            answer: "Azonnal megkapod az átvételkor! Az önkéntes az átvételkor kifizeti a megállapodott részedet (például 25 Ft/palack, ha 50/50-ben állapodtatok meg). Nem kell újra találkoznotok a csere után."
          },
          split: {
            question: "Hogyan működik a fizetés megosztása?",
            answer: "Te döntöd el az osztást a hirdetés létrehozásakor (pl. 50/50, 60/40 stb.). Az önkéntes az átvételkor kifizeti neked a részedet, majd visszaviszi a palackokat, hogy megkapja a teljes 50 Ft-os visszatérítést és megtartsa a részét. Például: ha 100 palackod van és 50/50-ben állapodtok meg, az önkéntes az átvételkor fizet neked 2500 Ft-ot, majd 5000 Ft-ot kap a boltból."
          },
          risk: {
            question: "Mi van, ha az önkéntes nem viszi vissza a palackokat?",
            answer: "A kifizetésedet már előre megkaptad, így nincs kockázat számodra! Az önkéntes motivált a palackok visszavitelére, mert így keresi meg a részét a visszatérítésből. Az értékelési rendszerünk segít a bizalom építésében a közösségen belül."
          },
          meetings: {
            question: "Kétszer kell találkoznom az önkéntessel?",
            answer: "Nem! Csak egyszer találkoztok az átvételkor, amikor átadod a palackokat és megkapod a kifizetésedet. Az önkéntes egyedül intézi a visszaváltást és megtartja a részét. Egy találkozó, egy fizetés, kész."
          },
          agreement: {
            question: "Hogyan állapodunk meg az osztásról?",
            answer: "A hirdetés létrehozásakor beállítod a preferált osztásodat (pl. \"25 Ft/palackot szeretnék\"). Az önkéntesek látják ezt, és átvételi kérelmet küldhetnek, ha egyetértenek. Az alkalmazáson belüli üzenetküldéssel is megbeszélhetitek és tárgyalhattok a kérelem elfogadása előtt."
          },
          safety: {
            question: "Biztonságos meghívni valakit az otthonomba?",
            answer: "A biztonságod fontos! Választhatsz nyilvános helyszínt az otthonod helyett a találkozóhoz. Platformunk felhasználói értékeléseket és véleményeket tartalmaz, így láthatod mások tapasztalatait. Az önkéntesekkel előbb is beszélgethetsz, hogy kényelmes legyél az átvételi kérelem elfogadása előtt."
          },
          create: {
            question: "Hogyan hozok létre palackhirdetést?",
            answer: "Bejelentkezés után kattints a \"Palackok meghirdetése\" gombra a főoldalon vagy a fejlécben. Add meg, hány palackod van, a helyszínt és a preferált osztási százalékot. Fotókat és további részleteket is hozzáadhatsz, hogy segíts az önkénteseknek."
          },
          cancel: {
            question: "Lemondhatom az átvételi kérelmet?",
            answer: "Igen! Mind a hirdetés tulajdonosa, mind az önkéntes lemondhatja az átvételi kérelmet, mielőtt befejezné. Ha te vagy a tulajdonos, elutasíthatod a kérelmeket. Ha te vagy az önkéntes, lemondhatod a kérelmedet. Csak ne felejtsd el kommunikálni a cseten keresztül, ha változás van a tervekben."
          },
          rating: {
            question: "Hogyan működik az értékelési rendszer?",
            answer: "Az átvétel befejezése után mindkét fél értékelheti egymást 1-5 csillagos skálán és hozzászólást hagyhat. Az értékelések segítenek a bizalom építésében a közösségen belül, és lehetővé teszik a felhasználók számára, hogy lássák, ki megbízható. Az átlagos értékelésed megjelenik a profilodban."
          },
          bottles: {
            question: "Milyen típusú palackokat hirdethetek?",
            answer: "Bármilyen visszaváltható műanyag palackot, amelyet magyar boltok elfogadnak az 50 Ft-os betétdíj visszatérítésre. Ez magában foglalja a legtöbb italos palackot (víz, üdítő, gyümölcslé stb.). Győződj meg róla, hogy a palackok üresek és viszonylag tiszták az átvétel előtt."
          }
        }
      },
      footer: {
        platform: "Platform",
        aboutUs: "Rólunk",
        howItWorks: "Hogyan működik",
        safetyGuidelines: "Biztonsági irányelvek",
        pricing: "Árazás",
        community: "Közösség",
        userStories: "Felhasználói történetek",
        environmentalImpact: "Környezeti hatás",
        localPartners: "Helyi partnerek",
        support: "Támogatás",
        helpCenter: "Súgó központ",
        contactUs: "Kapcsolat",
        termsOfService: "Felhasználási feltételek",
        madeWithLove: "Készítve 💚-vel Magyarországon."
      },
      map: {
        title: "Palack térkép",
        nearYou: "{{count}} palack a közeledben",
        nearYou_plural: "{{count}} palack a közeledben",
        myLocation: "Helyem",
        locationFound: "Helyzet megtalálva",
        locationCentered: "Térkép középre igazítva a helyzetedhez",
        locationUnavailable: "A helyzet nem érhető el",
        locationDefault: "Alapértelmezett helyzet használata (Budapest)",
        locationEnable: "Kérjük, engedélyezd a helyzetmeghatározási szolgáltatásokat",
        searchPlaceholder: "Keresés helyszín vagy cím alapján...",
        nearbyBottles: "Közeli palackok",
        sortedByDistance: "Rendezve távolság szerint a helyzetedtől",
        noBottlesFound: "Nem találhatók palackok a közelben",
        tryAdjustingSearch: "Próbáld módosítani a keresést",
        distance: "Távolság",
        offerPickupConfirm: "Biztosan fel szeretnéd ajánlani {{count}} palack átvételét innen: {{location}}?",
        pickupRequestSent: "Átvételi kérelem elküldve!",
        ownerNotified: "A hirdetés tulajdonosa értesítést kap az ajánlatodról.",
        sendingRequest: "Kérelem küldése..."
      },
      about: {
        title: "A BottleBuddy-ról",
        backToHome: "Vissza a főoldalra",
        madeWithLove: "Szeretettel készítve a bolygóért",
        subtitle: "Küldetésünk, hogy a palackok visszaváltását könnyebbé, jutalmazóbbá és közösségibbé tegyük. A BottleBuddy összeköti azokat az embereket, akiknek visszaváltható palackjaik vannak, azokkal, akik szívesen visszaviszik őket, mindenki számára előnyös helyzetet teremtve.",
        mission: "Küldetésünk",
        missionText: "Az újrahasznosítás jövedelmezővé és közösség-vezérelté tétele Magyarországon.",
        missionDescription: "Fenntartható jövő létrehozása azáltal, hogy a palackok visszaváltását mindenki számára elérhetővé, közösségivé és jutalmazóvá tesszük. Hiszünk abban, hogy a kis cselekedetek, ha milliók teszik őket, megváltoztathatják a világot.",
        story: "Történetünk",
        storyText: "A BottleBuddy-t azért hoztuk létre, hogy megoldjunk egy egyszerű problémát: Sokan gyűjtenek palackokat, de nincs idejük visszavinni őket. Összekapcsoljuk ezeket az embereket olyan önkéntesekkel, akik szívesen segítenek a visszatérítés megosztása fejében.",
        howWeHelp: "Hogyan segítünk",
        whyChoose: "Miért válaszd a BottleBuddy-t?",
        whyChooseSubtitle: "A legátfogóbb platformot építettük meg a palackok megosztásához és újrahasznosításához. Ez tesz minket különlegessé.",
        howItWorksTitle: "Hogyan működik",
        feature1: {
          title: "Könnyű palackmegosztás",
          description: "Hirdesd meg a visszaváltható palackjaidat néhány érintéssel. Add meg a helyszínt, a részleteket, és kész vagy!"
        },
        feature2: {
          title: "Közösség-vezérelt",
          description: "Lépj kapcsolatba szomszédokkal, akik elvihetik a palackjaidat. Építs egy hálózatot olyan emberekkel, akik törődnek az újrahasznosítással."
        },
        feature3: {
          title: "Környezeti hatás",
          description: "Minden visszaváltott palack egy lépés a tisztább bolygó felé. Kövesd nyomon a fenntarthatósághoz való hozzájárulásodat."
        },
        feature4: {
          title: "Biztonságos és megbízható",
          description: "Felhasználói értékelések, ellenőrzött profilok és biztonságos hitelesítés biztosítják a megbízható élményt."
        },
        feature5: {
          title: "Gyors és hatékony",
          description: "Valós idejű hirdetések és értesítések segítenek azonnal megtalálni a közeli palackokat."
        },
        feature6: {
          title: "Helyi fókusz",
          description: "Az interaktív térképnézet megmutatja a környékbeli palackokat, megkönnyítve és hatékonyabbá téve a gyűjtést."
        },
        step1: {
          title: "Hozz létre egy fiókot",
          description: "Regisztrálj az e-mail címeddel vagy Google fiókkal. Kevesebb, mint egy percbe telik az indulás."
        },
        step2: {
          title: "Hirdesd meg vagy keresd a palackokat",
          description: "Vannak palackjaid? Hozz létre egy hirdetést részletekkel, helyszínnel és az általad preferált visszatérítési osztással. Gyűjteni szeretnél? Böngéssz a térképen, hogy megtaláld a közeli palackokat és lásd a kereseti potenciált."
        },
        step3: {
          title: "Kapj előre fizetést az átvételkor",
          description: "Egyeztess az átvételről az alkalmazáson belüli üzenetküldéssel. Amikor találkoztok, az önkéntes azonnal fizet neked a megállapodott részedet (pl. 25 Ft/palack). Nincs várakozás, nincs második találkozó szükséges!"
        },
        step4: {
          title: "Az önkéntes visszaviszi a palackokat",
          description: "Az önkéntes elviszi a palackokat a boltba, megkapja a teljes 50 Ft-os visszatérítést palackonként, és megtartja a részét. Mindkét fél profitál, és neked soha nem kell többet elmenned otthonról!"
        },
        step5: {
          title: "Értékelj és építs bizalmat",
          description: "Egy sikeres csere után mindkét fél értékelheti a másikat. Ez bizalmat épít a közösségben és segít mindenkinek megbízható partnereket találni a jövőbeli cserékhez."
        },
        paymentHighlight: {
          title: "Egyszerű és biztonságos fizetés",
          description: "Azonnal megkapod a fizetést az egyetlen találkozó alkalmával. Az önkéntes készpénzben kifizeti neked a részedet a visszatérítésből, átveszi a palackokat, és ennyi! Ő intézi a visszaváltási folyamatot és beszedte a teljes visszatérítést a boltból. Mindenki nyer, és soha nem kell aggódnod újabb találkozó vagy a fizetésre való várakozás miatt."
        },
        stats: {
          bottlesRecycled: "Visszaváltott palackok",
          activeUsers: "Aktív felhasználók",
          cities: "Városok",
          userSatisfaction: "Felhasználói elégedettség"
        },
        cta: {
          title: "Készen állsz a változásra?",
          description: "Csatlakozz a felhasználók ezreihez, akik könnyebbé és jutalmazóbbá teszik a palackok visszaváltását.",
          getStarted: "Kezdd el ma",
          exploreListings: "Hirdetések böngészése",
          joinToday: "Csatlakozz még ma a BottleBuddy-hoz"
        }
      }
    }
  }
};

// Get saved language from localStorage, or default to Hungarian
const savedLanguage = localStorage.getItem('preferredLanguage') || 'hu';

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: savedLanguage,
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
  })
  .catch((error) => {
    console.error("i18n initialization failed", error);
  });

export default i18n;
