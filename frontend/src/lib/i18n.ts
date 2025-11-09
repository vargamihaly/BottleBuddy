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
        createPageTitle: "List Your Bottles",
        createPageSubtitle: "Share your bottle collection details and connect with volunteers who can help return them",
        title: "Title",
        titleOptional: "Title (Optional)",
        titlePlaceholder: "e.g., 50 Water Bottles in Budapest",
        titlePlaceholder2: "e.g., 50 bottles near City Center",
        bottleCount: "Number of Bottles",
        bottleCountRequired: "Number of Bottles *",
        bottleCountPlaceholder: "e.g., 50",
        bottleCountPlaceholder2: "e.g., 25",
        location: "Location",
        locationPlaceholder: "Address or description",
        estimatedRefund: "Estimated Total Refund",
        estimatedRefundHelp: "Each bottle is typically worth 50 HUF",
        totalBottleRefund: "Total Bottle Refund",
        autoCalculated: "Automatically calculated: Each bottle refund is 50 HUF in Hungary",
        splitPercentage: "Your Share",
        splitPercentageWithValue: "Your Share: {{value}}%",
        splitPercentageHelp: "Percentage of refund you keep",
        notes: "Additional Notes",
        description: "Description (Optional)",
        descriptionPlaceholder: "Add any additional details about the bottles, pickup instructions, etc.",
        notesPlaceholder: "Any special instructions...",
        createButton: "Create Listing",
        creatingButton: "Creating...",
        updateButton: "Update Listing",
        deleteButton: "Delete Listing",
        deletingButton: "Deleting...",
        deleteConfirm: "Are you sure you want to delete this listing?",
        createSuccess: "Listing created successfully",
        updateSuccess: "Listing updated successfully",
        deleteSuccess: "Listing deleted successfully",
        pickupRequests: "Pickup Requests",
        noPickupRequests: "No pickup requests yet",
        loadingRequests: "Loading requests...",
        shareToGetVolunteers: "Share your listing to get volunteers!",
        yourListing: "Your Listing",
        offerToPickUp: "Offer to Pick Up",
        sendingRequest: "Sending request...",
        requestPending: "Request Pending...",
        accept: "Accept",
        reject: "Reject",
        message: "Message",
        markAsCompleted: "Mark as Completed",
        pending: "Pending",
        accepted: "Accepted",
        rejected: "Rejected",
        completed: "Completed",
        open: "Open",
        yourShare: "Your share",
        volunteerShare: "Volunteer share",
        youReceive: "You receive (cash)",
        volunteerKeeps: "Volunteer keeps",
        ofTotal: "{{value}}% of total",
        rateExchange: "Rate This Exchange",
        rate: "Rate {{name}}",
        youRated: "You rated this exchange",
        transactionCompleted: "Transaction Completed",
        yourPickupRequest: "Your Pickup Request",
        waitingForAcceptance: "Waiting for {{name}} to accept",
        coordinatePickup: "Accepted! Coordinate pickup details",
        howPaymentWorks: "How payment works:",
        paymentExplanation: "The volunteer who picks up your bottles will return them to a collection point and receive the full refund. They will then pay you your agreed share in cash when picking up the bottles. You both benefit from recycling together!",
        pickupDeadline: "Pickup Deadline (Optional)",
        sliderLabels: {
          zero: "0%",
          twentyFive: "25%",
          fifty: "50%",
          seventyFive: "75%",
          hundred: "100%"
        },
        tip: "💡 Tip: Most users choose 50/50 split. Adjust to attract more volunteers or get a bigger share!",
        bottlesPerHuf: "({{count}} × 50 HUF)",
        confirmOffer: "Are you sure you want to offer to pick up {{count}} bottles from {{location}}?",
        confirmAccept: "Accept this pickup request? This will mark the listing as claimed.",
        confirmReject: "Reject this pickup request?",
        confirmComplete: "Mark this pickup as completed? This confirms the bottles were successfully exchanged."
      },
      userDashboard: {
        title: "My Dashboard",
        trackImpact: "Track your recycling impact",
        back: "Back",
        level: {
          ecoChampion: "Eco Champion"
        },
        profile: {
          rating: "rating",
          reviews: "reviews",
          noRatings: "No ratings yet",
          completedExchanges: "completed exchanges"
        },
        stats: {
          totalBottles: "Total Bottles",
          totalEarnings: "Total Earnings",
          successRate: "Success Rate",
          thisWeekBottles: "+{{count}} this week",
          thisWeekEarnings: "+{{amount}} this week"
        },
        actions: {
          listNewBottles: "List New Bottles",
          findBottles: "Find Bottles to Pick Up"
        },
        recentActivity: {
          title: "Recent Activity",
          subtitle: "Your latest bottle exchanges and listings",
          pickedUp: "Picked up bottles",
          listed: "Listed bottles",
          with: "with {{name}}",
          earnings: "+{{amount}} HUF"
        },
        loading: "Loading profile..."
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
      },
      terms: {
        title: "Terms of Service",
        lastUpdated: "Last Updated",
        section1: {
          title: "Introduction",
          content: "BottleBuddy (\"we\", \"us\", \"our\") is a community-driven platform operated in Hungary that connects users who wish to recycle bottles with volunteers. By using our website or mobile application (the \"Service\"), you agree to these Terms of Service (\"Terms\").\n\nThe platform's purpose is to facilitate connections between users for recycling and bottle exchange, making bottle return more accessible and rewarding for everyone involved."
        },
        section2: {
          title: "Acceptance of Terms",
          content: "By creating an account, accessing, or using BottleBuddy, you accept and agree to be bound by these Terms.\n\n• You must be at least 18 years old to use this Service, or have parental/guardian consent if you are a minor.\n• We reserve the right to update these Terms periodically. Continued use of the Service after changes constitutes acceptance of the revised Terms.\n• If you do not agree to these Terms, you must discontinue use of the Service immediately."
        },
        section3: {
          title: "User Accounts",
          content: "Users are responsible for:\n\n• Maintaining the confidentiality of their login credentials and account information\n• Providing accurate, current, and complete information during registration and keeping it updated\n• Not sharing accounts or impersonating others\n• All activities that occur under their account\n\nWe reserve the right to suspend or terminate accounts for:\n• Violations of these Terms\n• Fraudulent or illegal activity\n• Misuse of the platform or abuse of other users\n• Any other conduct we deem harmful to the Service or community"
        },
        section4: {
          title: "Service Description",
          content: "BottleBuddy provides:\n\n• A platform connecting users for bottle pickup and refund-sharing\n• Messaging and coordination tools to facilitate exchanges\n• Map-based discovery of nearby bottle listings\n• User rating and reputation system\n\nDisclaimer: BottleBuddy is not a delivery service, financial institution, or party to any transaction. We only facilitate user interactions. All exchanges, payments, and arrangements are made directly between users at their own discretion and risk."
        },
        section5: {
          title: "User Conduct",
          content: "Users must not:\n\n• Post illegal, offensive, false, or misleading content\n• Harass, threaten, spam, or abuse other users\n• Attempt to circumvent platform systems or security measures\n• Upload malicious files, viruses, or harmful code\n• Violate intellectual property rights or privacy of others\n• Use the Service for unauthorized commercial purposes\n• Create fake accounts or manipulate ratings\n• Engage in fraudulent activity or scams\n\nViolations may result in immediate account suspension or termination, and we may report illegal activity to authorities."
        },
        section6: {
          title: "Listings and Transactions",
          content: "BottleBuddy acts only as a facilitator, not as a party in transactions:\n\n• Users create listings and arrange pickups at their own discretion\n• Bottle exchanges and all related arrangements are private agreements between users\n• Refund sharing (HUF amounts) is a private arrangement; we do not process payments\n• Users handle all exchanges, meetings, and payments at their own risk\n\nWe are not responsible for:\n• Damages, losses, or disputes arising from user transactions\n• The accuracy of listings or user representations\n• Fraud, theft, or misconduct between users\n• Any injuries or damages occurring during meetups or exchanges"
        },
        section7: {
          title: "Messaging System",
          content: "Our in-app messaging system:\n\n• Messages are private between users but may be monitored for abuse, security, or legal compliance\n• Spam, harassment, and inappropriate content are prohibited\n• Images and attachments must comply with these Terms and applicable laws\n• We reserve the right to review, remove, or report messages that violate our policies\n\nUsers should report any abusive or suspicious messages immediately."
        },
        section8: {
          title: "Payments and Refunds",
          content: "Currently, BottleBuddy does not operate a payment system:\n\n• All payments between users are handled privately (typically cash during pickup)\n• We do not process, hold, or guarantee any payments\n• Refund-sharing arrangements are private agreements between users\n\nIf payment features are added in the future:\n• Terms will be updated with detailed payment and dispute resolution mechanisms\n• All transactions will be considered final unless otherwise required by law\n• Refund policies will be clearly stated"
        },
        section9: {
          title: "Intellectual Property",
          content: "BottleBuddy owns all rights to:\n\n• Platform branding, logos, trademarks, and design elements\n• User interface, source code, and software\n• Content created by BottleBuddy\n\nUser-generated content:\n• Users retain ownership of their posts, photos, and listings\n• By posting content, users grant BottleBuddy a non-exclusive, royalty-free, worldwide license to display, distribute, and use the content within the platform for operational purposes\n• Users represent that they have the right to post all content they upload"
        },
        section10: {
          title: "Privacy and Data Protection",
          content: "Your privacy is important to us. Please review our Privacy Policy for detailed information.\n\n• We use Google OAuth and JWT for secure authentication\n• We comply with GDPR and EU data protection regulations\n• Users have the right to access, correct, and delete their personal data\n• We implement industry-standard security practices to protect user data\n• Data retention periods and practices are outlined in our Privacy Policy\n\nFor privacy-related requests, contact us at: misi@protonmail.ch"
        },
        section11: {
          title: "Account Termination",
          content: "Accounts may be suspended or terminated for:\n\n• Violation of these Terms\n• Extended inactivity\n• Legal requirements or court orders\n• Protecting the safety and integrity of the platform\n\nUpon account deletion:\n• Your listings will be removed\n• Messages may be retained for legal compliance\n• Personal data will be handled according to our Privacy Policy and GDPR requirements\n• Some information may be retained for legal, accounting, or security purposes"
        },
        section12: {
          title: "Limitation of Liability",
          content: "TO THE MAXIMUM EXTENT PERMITTED BY LAW:\n\n• BottleBuddy is provided \"AS IS\" without warranties of any kind, express or implied\n• We make no guarantees about availability, accuracy, or reliability of the Service\n• We are not liable for lost profits, damages, disputes, or losses arising from use of the Service\n• We are not responsible for user-generated content or actions of users\n• We are not liable for system downtime, bugs, data loss, or technical issues\n• Users assume all risks associated with using the platform\n\nYour sole remedy for dissatisfaction is to discontinue use of the Service."
        },
        section13: {
          title: "Indemnification",
          content: "You agree to indemnify, defend, and hold harmless BottleBuddy, its operators, and affiliates from any claims, damages, losses, or expenses (including legal fees) arising from:\n\n• Your use or misuse of the Service\n• Your violation of these Terms\n• Your violation of any rights of another user or third party\n• Any illegal activity or fraud\n• Content you post or actions you take on the platform"
        },
        section14: {
          title: "Governing Law and Jurisdiction",
          content: "These Terms are governed by the laws of Hungary.\n\n• Any disputes arising from these Terms or use of the Service shall be resolved in Hungarian courts\n• If any provision of these Terms is found invalid or unenforceable, the remaining provisions remain in full effect\n• These Terms constitute the entire agreement between you and BottleBuddy regarding use of the Service"
        },
        section15: {
          title: "Contact Information",
          content: "For questions, support, or inquiries regarding these Terms of Service:\n\nEmail: misi@protonmail.ch\nPlatform: BottleBuddy\nOperator: Hungary\n\nFor data protection and privacy requests, please use the same contact information.\n\nThank you for being part of the BottleBuddy community!"
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
        createPageTitle: "Palackok meghirdetése",
        createPageSubtitle: "Oszd meg a palackgyűjteményedet és lépj kapcsolatba olyan önkéntesekkel, akik segítenek visszavinni őket",
        title: "Cím",
        titleOptional: "Cím (opcionális)",
        titlePlaceholder: "pl. 50 vízes palack Budapesten",
        titlePlaceholder2: "pl. 50 palack a Belvárosban",
        bottleCount: "Palackok száma",
        bottleCountRequired: "Palackok száma *",
        bottleCountPlaceholder: "pl. 50",
        bottleCountPlaceholder2: "pl. 25",
        location: "Helyszín",
        locationPlaceholder: "Cím vagy leírás",
        estimatedRefund: "Becsült teljes visszatérítés",
        estimatedRefundHelp: "Minden palack általában 50 Ft-ot ér",
        totalBottleRefund: "Teljes palack visszatérítés",
        autoCalculated: "Automatikusan számított: Minden palack visszatérítése 50 Ft Magyarországon",
        splitPercentage: "A te részed",
        splitPercentageWithValue: "A te részed: {{value}}%",
        splitPercentageHelp: "A visszatérítés hány százalékát tartod meg",
        notes: "További megjegyzések",
        description: "Leírás (opcionális)",
        descriptionPlaceholder: "További részletek a palackokról, átvételi utasításokról stb.",
        notesPlaceholder: "Bármilyen speciális utasítás...",
        createButton: "Hirdetés létrehozása",
        creatingButton: "Létrehozás...",
        updateButton: "Hirdetés frissítése",
        deleteButton: "Hirdetés törlése",
        deletingButton: "Törlés...",
        deleteConfirm: "Biztosan törölni szeretnéd ezt a hirdetést?",
        createSuccess: "Hirdetés sikeresen létrehozva",
        updateSuccess: "Hirdetés sikeresen frissítve",
        deleteSuccess: "Hirdetés sikeresen törölve",
        pickupRequests: "Átvételi kérelmek",
        noPickupRequests: "Még nincsenek átvételi kérelmek",
        loadingRequests: "Kérelmek betöltése...",
        shareToGetVolunteers: "Oszd meg a hirdetésed, hogy önkénteseket szerezz!",
        yourListing: "A te hirdetésed",
        offerToPickUp: "Felajánlom az átvételt",
        sendingRequest: "Kérelem küldése...",
        requestPending: "Kérelem függőben...",
        accept: "Elfogadás",
        reject: "Elutasítás",
        message: "Üzenet",
        markAsCompleted: "Megjelölés befejezettként",
        pending: "Függőben",
        accepted: "Elfogadva",
        rejected: "Elutasítva",
        completed: "Befejezve",
        open: "Nyitott",
        yourShare: "A te részed",
        volunteerShare: "Önkéntes része",
        youReceive: "Te kapsz (készpénz)",
        volunteerKeeps: "Önkéntes megtartja",
        ofTotal: "a teljes {{value}}%-a",
        rateExchange: "Csere értékelése",
        rate: "{{name}} értékelése",
        youRated: "Értékelted ezt a cserét",
        transactionCompleted: "Tranzakció befejezve",
        yourPickupRequest: "Átvételi kérelmed",
        waitingForAcceptance: "Várakozás {{name}} elfogadására",
        coordinatePickup: "Elfogadva! Egyeztess az átvétel részleteiről",
        howPaymentWorks: "Hogyan működik a fizetés:",
        paymentExplanation: "Az önkéntes, aki átveszi a palackjaidat, visszaviszi őket egy gyűjtőhelyre és megkapja a teljes visszatérítést. Ezután kifizeti neked a megállapodott részedet készpénzben a palackok átvételekor. Mindketten profitáltok az együttes újrahasznosításból!",
        pickupDeadline: "Átvételi határidő (opcionális)",
        sliderLabels: {
          zero: "0%",
          twentyFive: "25%",
          fifty: "50%",
          seventyFive: "75%",
          hundred: "100%"
        },
        tip: "💡 Tipp: A legtöbb felhasználó 50/50 megosztást választ. Módosítsd, hogy több önkéntest vonzz vagy nagyobb részt kapj!",
        bottlesPerHuf: "({{count}} × 50 Ft)",
        confirmOffer: "Biztosan fel szeretnéd ajánlani {{count}} palack átvételét innen: {{location}}?",
        confirmAccept: "Elfogadod ezt az átvételi kérelmet? Ez lefoglaltként jelöli meg a hirdetést.",
        confirmReject: "Elutasítod ezt az átvételi kérelmet?",
        confirmComplete: "Befejezettként jelölöd meg ezt az átvételt? Ez megerősíti, hogy a palackok sikeresen cserélődtek."
      },
      userDashboard: {
        title: "Irányítópultom",
        trackImpact: "Kövesd az újrahasznosítási hatásodat",
        back: "Vissza",
        level: {
          ecoChampion: "Öko Bajnok"
        },
        profile: {
          rating: "értékelés",
          reviews: "vélemény",
          noRatings: "Még nincsenek értékelések",
          completedExchanges: "teljesített csere"
        },
        stats: {
          totalBottles: "Összes palack",
          totalEarnings: "Összes bevétel",
          successRate: "Sikerességi arány",
          thisWeekBottles: "+{{count}} ezen a héten",
          thisWeekEarnings: "+{{amount}} ezen a héten"
        },
        actions: {
          listNewBottles: "Új palackok meghirdetése",
          findBottles: "Palackok keresése átvételhez"
        },
        recentActivity: {
          title: "Legutóbbi tevékenység",
          subtitle: "Legutóbbi palackcseréid és hirdetéseid",
          pickedUp: "Palackok átvéve",
          listed: "Palackok meghirdetve",
          with: "{{name}} nevű felhasználóval",
          earnings: "+{{amount}} Ft"
        },
        loading: "Profil betöltése..."
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
      },
      terms: {
        title: "Felhasználási Feltételek",
        lastUpdated: "Utolsó frissítés",
        section1: {
          title: "Bevezetés",
          content: "A BottleBuddy (\"mi\", \"minket\", \"miénk\") egy közösség által vezérelt platform, amely Magyarországon működik, és összeköti azokat a felhasználókat, akik palackokat szeretnének újrahasznosítani önkéntesekkel. Weboldalunk vagy mobilalkalmazásunk (a \"Szolgáltatás\") használatával elfogadod ezeket a Felhasználási Feltételeket (\"Feltételek\").\n\nA platform célja, hogy megkönnyítse a felhasználók közötti kapcsolatfelvételt újrahasznosítás és palackok cseréje céljából, így a palackok visszaváltását mindenki számára hozzáférhetőbbé és jutalmazóbbá téve."
        },
        section2: {
          title: "A Feltételek Elfogadása",
          content: "A BottleBuddy fiók létrehozásával, elérésekor vagy használatakor elfogadod és válaszd, hogy kötelezed magad ezekhez a Feltételekhez.\n\n• A Szolgáltatás használatához legalább 18 évesnek kell lenned, vagy kiskorú esetén szülői/gyámi beleegyezéssel kell rendelkezned.\n• Fenntartjuk a jogot arra, hogy időszakosan frissítsük ezeket a Feltételeket. A Szolgáltatás folyamatos használata a változások után a módosított Feltételek elfogadását jelenti.\n• Ha nem értesz egyet ezekkel a Feltételekkel, azonnal abba kell hagynod a Szolgáltatás használatát."
        },
        section3: {
          title: "Felhasználói Fiókok",
          content: "A felhasználók felelősek a következőkért:\n\n• Bejelentkezési adataik és fiókjuk bizalmas kezelése\n• Pontos, aktuális és teljes információk megadása a regisztráció során és azok naprakészen tartása\n• Fiókok megosztásának mellőzése és mások megszemélyesítésének elkerülése\n• Minden tevékenységért, ami a fiókjuk alatt történik\n\nFenntartjuk a jogot fiókok felfüggesztésére vagy megszüntetésére:\n• Jelen Feltételek megsértése esetén\n• Csalárd vagy illegális tevékenység esetén\n• A platform visszaélésszerű használata vagy más felhasználók bántalmazása esetén\n• Bármely más magatartás, amely szerintünk káros a Szolgáltatásra vagy a közösségre nézve"
        },
        section4: {
          title: "Szolgáltatás Leírása",
          content: "A BottleBuddy az alábbiakat nyújtja:\n\n• Egy platform, amely összeköti a felhasználókat palackok átvétele és visszatérítés megosztása céljából\n• Üzenetküldő és koordinációs eszközök a cserék megkönnyítésére\n• Térkép alapú felfedezés a közeli palackhirdetésekhez\n• Felhasználói értékelési és hírnévrendszer\n\nJogi nyilatkozat: A BottleBuddy nem szállítási szolgáltatás, nem pénzügyi intézmény, és nem fél semmilyen tranzakcióban. Csak a felhasználói interakciókat segítjük elő. Minden csere, fizetés és megállapodás közvetlenül a felhasználók között történik saját belátásuk és kockázatuk szerint."
        },
        section5: {
          title: "Felhasználói Magatartás",
          content: "A felhasználók nem tehetik a következőket:\n\n• Illegális, sértő, hamis vagy megtévesztő tartalom közzététele\n• Más felhasználók zaklatása, fenyegetése, spammelése vagy bántalmazása\n• A platformrendszerek vagy biztonsági intézkedések megkerülésére tett kísérlet\n• Rosszindulatú fájlok, vírusok vagy káros kód feltöltése\n• Mások szellemi tulajdonjogainak vagy magánéletének megsértése\n• A Szolgáltatás jogosulatlan kereskedelmi célra történő használata\n• Hamis fiókok létrehozása vagy értékelések manipulálása\n• Csalárd tevékenység vagy átverések\n\nA szabálysértések azonnali fiókfelfüggesztést vagy megszüntetést eredményezhetnek, és illegális tevékenységet jelenthetünk a hatóságoknak."
        },
        section6: {
          title: "Hirdetések és Tranzakciók",
          content: "A BottleBuddy csak közvetítőként működik, nem részese a tranzakcióknak:\n\n• A felhasználók saját belátásuk szerint hoznak létre hirdetéseket és szerveznek átvételeket\n• A palackcserék és az összes kapcsolódó megállapodás privát egyezmények a felhasználók között\n• A visszatérítés megosztása (HUF összegek) privát megállapodás; nem dolgozunk fel kifizetéseket\n• A felhasználók minden cserét, találkozót és kifizetést saját kockázatukra kezelnek\n\nNem vagyunk felelősek:\n• A felhasználói tranzakciókból eredő károkért, veszteségekért vagy vitákért\n• A hirdetések vagy felhasználói nyilatkozatok pontosságáért\n• A felhasználók közötti csalásért, lopásért vagy visszaélésért\n• A találkozók vagy cserék során bekövetkező sérülésekért vagy károkért"
        },
        section7: {
          title: "Üzenetküldő Rendszer",
          content: "Alkalmazáson belüli üzenetküldő rendszerünk:\n\n• Az üzenetek privát a felhasználók között, de figyelhetők visszaélés, biztonság vagy jogi megfelelés miatt\n• A spam, zaklatás és nem megfelelő tartalom tilos\n• A képeknek és mellékleteknek meg kell felelniük ezeknek a Feltételeknek és az alkalmazandó jogszabályoknak\n• Fenntartjuk a jogot az üzenetek felülvizsgálatára, eltávolítására vagy jelentésére, amelyek megsértik szabályzatainkat\n\nA felhasználóknak azonnal jelenteniük kell minden visszaélésszerű vagy gyanús üzenetet."
        },
        section8: {
          title: "Fizetések és Visszatérítések",
          content: "Jelenleg a BottleBuddy nem működtet fizetési rendszert:\n\n• Minden felhasználók közötti fizetés privát módon történik (jellemzően készpénz az átvételkor)\n• Nem dolgozunk fel, nem tartunk fenn és nem garantálunk semmilyen kifizetést\n• A visszatérítés megosztási megállapodások privát egyezmények a felhasználók között\n\nHa a jövőben fizetési funkciókat adunk hozzá:\n• A Feltételek frissülnek részletes fizetési és vitarendezési mechanizmusokkal\n• Minden tranzakció véglegessé válik, kivéve ha a törvény másként előírja\n• A visszatérítési szabályzatok egyértelműen lesznek közölve"
        },
        section9: {
          title: "Szellemi Tulajdon",
          content: "A BottleBuddy tulajdonában van minden jog:\n\n• Platform branding, logók, védjegyek és design elemek\n• Felhasználói felület, forráskód és szoftver\n• A BottleBuddy által létrehozott tartalom\n\nFelhasználók által generált tartalom:\n• A felhasználók megtartják bejegyzéseik, fotóik és hirdetéseik tulajdonjogát\n• Tartalom közzétételével a felhasználók nem-kizárólagos, jogdíjmentes, világszintű licencet adnak a BottleBuddynak a tartalom megjelenítésére, terjesztésére és használatára a platformon belül működési célokra\n• A felhasználók kijelentik, hogy joguk van minden általuk feltöltött tartalom közzétételéhez"
        },
        section10: {
          title: "Adatvédelem és Adatkezelés",
          content: "Az adataid fontosak számunkra. Kérjük, tekintsd át Adatvédelmi Szabályzatunkat részletes információkért.\n\n• Google OAuth-ot és JWT-t használunk biztonságos hitelesítéshez\n• Megfelelünk a GDPR és EU adatvédelmi szabályozásoknak\n• A felhasználóknak joguk van személyes adataik hozzáféréséhez, javításához és törléséhez\n• Iparági szabványnak megfelelő biztonsági gyakorlatokat alkalmazunk a felhasználói adatok védelme érdekében\n• Az adatmegőrzési időszakok és gyakorlatok Adatvédelmi Szabályzatunkban vannak részletezve\n\nAdatvédelmi kérelmekért lépj kapcsolatba velünk: misi@protonmail.ch"
        },
        section11: {
          title: "Fiók Megszüntetése",
          content: "A fiókok felfüggeszthetők vagy megszüntethetők:\n\n• Jelen Feltételek megsértése esetén\n• Hosszan tartó inaktivitás esetén\n• Jogi követelmények vagy bírósági végzések alapján\n• A platform biztonságának és integritásának védelme érdekében\n\nFiók törlése esetén:\n• Hirdetéseid eltávolításra kerülnek\n• Az üzenetek megőrizhetők jogi megfelelés céljából\n• A személyes adatok kezelése az Adatvédelmi Szabályzatunk és GDPR követelmények szerint történik\n• Egyes információk megőrizhetők jogi, könyvelési vagy biztonsági célokra"
        },
        section12: {
          title: "Felelősség Korlátozása",
          content: "A TÖRVÉNY ÁLTAL MEGENGEDETT MAXIMÁLIS MÉRTÉKBEN:\n\n• A BottleBuddy \"JELEN ÁLLAPOTÁBAN\" kerül biztosításra, mindenféle kifejezett vagy hallgatólagos garancia nélkül\n• Nem garantáljuk a Szolgáltatás rendelkezésre állását, pontosságát vagy megbízhatóságát\n• Nem vagyunk felelősek elvesztett nyereségért, károkért, vitákért vagy veszteségekért, amelyek a Szolgáltatás használatából erednek\n• Nem vagyunk felelősek a felhasználók által generált tartalomért vagy a felhasználók cselekedeteiért\n• Nem vagyunk felelősek rendszerleállásokért, hibákért, adatvesztésért vagy technikai problémákért\n• A felhasználók vállalják a platformhasználattal járó minden kockázatot\n\nElégedetlenség esetén az egyetlen jogorvoslat a Szolgáltatás használatának beszüntetése."
        },
        section13: {
          title: "Kártalanítás",
          content: "Beleegyezel, hogy kártalanítod, megvéded és mentesíted a BottleBuddyt, annak üzemeltetőit és kapcsolt vállalkozásait minden igénytől, kártól, veszteségtől vagy költségtől (beleértve jogi díjakat) amely a következőkből ered:\n\n• A Szolgáltatás használatából vagy visszaélésszerű használatából\n• Jelen Feltételek megsértéséből\n• Más felhasználó vagy harmadik fél jogainak megsértéséből\n• Bármilyen illegális tevékenységből vagy csalásból\n• A platformon közzétett tartalomból vagy általad végzett cselekedetekből"
        },
        section14: {
          title: "Irányadó Jog és Joghatóság",
          content: "Ezekre a Feltételekre a magyar jogszabályok az irányadók.\n\n• A Feltételekből vagy a Szolgáltatás használatából eredő viták magyar bíróságok előtt rendezendők\n• Ha a Feltételek bármely rendelkezése érvénytelennek vagy végrehajthatatlannak bizonyul, a többi rendelkezés teljes hatályban marad\n• Ezek a Feltételek képezik a teljes megállapodást közted és a BottleBuddy között a Szolgáltatás használatára vonatkozóan"
        },
        section15: {
          title: "Kapcsolattartási Információk",
          content: "Kérdések, támogatás vagy érdeklődés a Felhasználási Feltételekkel kapcsolatban:\n\nEmail: misi@protonmail.ch\nPlatform: BottleBuddy\nÜzemeltető: Magyarország\n\nAdatvédelmi és adatkezelési kérelmekhez kérjük, használd ugyanezeket az elérhetőségeket.\n\nKöszönjük, hogy a BottleBuddy közösség része vagy!"
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
