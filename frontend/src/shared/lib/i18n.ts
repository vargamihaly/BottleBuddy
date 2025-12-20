import i18n from "i18next";
import {initReactI18next} from "react-i18next";

const resources = {
    en: {
        translation: {
            activities: {
                listingCreated: {
                    title: "Listing Created",
                    description: "You created a new listing for {{bottleCount}} bottles at {{locationAddress}}"
                },
                listingDeleted: {
                    title: "Listing Deleted",
                    description: "You deleted your listing for {{bottleCount}} bottles at {{locationAddress}}"
                },
                pickupRequestReceived: {
                    title: "New Pickup Request",
                    description: "{{volunteerName}} wants to pick up your {{bottleCount}} bottles at {{locationAddress}}"
                },
                pickupRequestAcceptedByOwner: {
                    title: "Pickup Request Accepted",
                    description: "You accepted {{volunteerName}}'s request to pick up your {{bottleCount}} bottles"
                },
                pickupRequestRejectedByOwner: {
                    title: "Pickup Request Rejected",
                    description: "You rejected {{volunteerName}}'s pickup request"
                },
                pickupRequestCompletedByOwner: {
                    title: "Pickup Completed",
                    description: "Pickup completed for your listing at {{locationAddress}}"
                },
                pickupRequestCreated: {
                    title: "Pickup Request Sent",
                    description: "You sent a pickup request for {{bottleCount}} bottles at {{locationAddress}}"
                },
                pickupRequestAccepted: {
                    title: "Pickup Request Accepted!",
                    description: "Your pickup request for {{bottleCount}} bottles at {{locationAddress}} was accepted!"
                },
                pickupRequestRejected: {
                    title: "Pickup Request Rejected",
                    description: "Your pickup request for {{locationAddress}} was not accepted"
                },
                pickupRequestCompleted: {
                    title: "Pickup Completed",
                    description: "You completed the pickup for {{bottleCount}} bottles at {{locationAddress}}"
                },
                transactionCompleted: {
                    title: "Transaction Completed",
                    descriptionOwner: "Transaction completed for your listing at {{locationAddress}}. You earned {{ownerAmount}} HUF",
                    descriptionVolunteer: "Transaction completed! You earned {{volunteerAmount}} HUF"
                },
                ratingReceived: {
                    title: "New Rating Received",
                    description: "You received a {{ratingValue}}-star rating from {{raterName}}",
                    descriptionWithComment: "You received a {{ratingValue}}-star rating from {{raterName}}: \"{{comment}}\""
                },
                default: {
                    title: "Notification",
                    description: "Activity type: {{type}}"
                },
                title: "Notifications",
                markAllRead: "Mark all read",
                new: "New",
                earlier: "Earlier",
                noActivities: "No notifications yet",
                viewAll: "View All Notifications"
            },
            notifications: {
                title: "Notifications",
                settings: "Notification Settings",
                all: "All",
                unread: "Unread",
                filterByType: "Filter by type",
                allTypes: "All Types",
                listings: "Listings",
                pickups: "Pickups",
                transactions: "Transactions",
                ratings: "Ratings",
                markAsRead: "Mark as read",
                markRead: "Mark read",
                delete: "Delete",
                empty: "No notifications",
                emptyDesc: "You're all caught up! Check back later for new notifications."
            },
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
                    primaryCTA: {
                        title: "Start Earning Today",
                        description: "List your bottles and get paid your share when volunteers pick them up",
                        button: "List Your Bottles"
                    },
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
                },
                activeListings: {
                    title: "My Active Listings",
                    description: "Your listings waiting for volunteers",
                    emptyDescription: "You have no active listings",
                    emptyCtaDescription: "Create your first listing to start earning!",
                    createButton: "Create Listing",
                    viewAll: "View All"
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
                signOutError: "Sign out failed. Please try again.",
                backToHome: "Back to Home",
                welcomeBack: "Welcome Back",
                joinBottleBuddy: "Join BottleBuddy",
                or: "or",
                emailPlaceholder: "your@email.com",
                passwordPlaceholder: "••••••••",
                fullName: "Full Name",
                fullNamePlaceholder: "John Doe",
                optional: "(optional)",
                username: "Username",
                usernamePlaceholder: "johndoe",
                usernameHint: "Letters, numbers, underscores, and hyphens only",
                phone: "Phone",
                phonePlaceholder: "+1234567890",
                confirmPassword: "Confirm Password",
                passwordHint: "Must be 8+ characters with uppercase, lowercase, and number",
                signIn: "Sign In",
                signUp: "Sign up",
                createAccount: "Create Account",
                signingIn: "Signing In...",
                creatingAccount: "Creating Account...",
                alreadyHaveAccount: "Already have an account?",
                dontHaveAccount: "Don't have an account?",
                // Validation messages
                emailRequired: "Email is required",
                emailInvalid: "Please enter a valid email address",
                passwordRequired: "Password is required",
                passwordMin: "Password must be at least 8 characters",
                passwordUppercase: "Password must contain at least one uppercase letter",
                passwordLowercase: "Password must contain at least one lowercase letter",
                passwordNumber: "Password must contain at least one number",
                passwordsDontMatch: "Passwords don't match",
                fullNameMax: "Full name cannot exceed 100 characters",
                usernameMax: "Username cannot exceed 50 characters",
                usernameInvalid: "Username can only contain letters, numbers, underscores, and hyphens",
                phoneInvalid: "Please enter a valid phone number",
                // Toast messages
                googleSignInSuccess: "Welcome!",
                googleSignInSuccessDesc: "Successfully signed in with Google",
                googleSignInError: "Authentication Failed",
                googleSignInErrorDesc: "Could not complete Google sign-in",
                signInSuccess: "Welcome back!",
                signInSuccessDesc: "Successfully signed in",
                signInError: "Sign in failed",
                signUpSuccess: "Account created!",
                signUpSuccessDesc: "Welcome to BottleBuddy",
                signUpError: "Sign up failed"
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
                pickupDeadline: "Pickup Deadline",
                pastDeadline: "Past Deadline",
                soon: "Soon",
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
            pickupRequests: {
                statusUpdateSuccessTitle: "Request Updated",
                statusUpdateSuccessDescription: "The pickup request has been {{status}}.",
                statusUpdateErrorTitle: "Update Failed",
                statusUpdateErrorDescription: "Could not update the pickup request status."
            },
            myListingsPage: {
                title: "My Listings",
                subtitle: "Manage all your bottle listings",
                newListing: "New Listing",
                signInRequired: "Sign In Required",
                signInMessage: "Please sign in to view your listings.",
                signIn: "Sign In",
                tabs: {
                    all: "All",
                    active: "Active",
                    claimed: "Claimed",
                    completed: "Completed"
                },
                descriptions: {
                    active: "Listings available for pickup requests",
                    claimed: "Listings with accepted pickup requests",
                    completed: "Successfully completed bottle exchanges"
                },
                empty: {
                    active: {
                        title: "No active listings",
                        message: "Create a new listing to get started!",
                        button: "Create Listing"
                    },
                    claimed: {
                        title: "No claimed listings",
                        message: "Listings appear here when you accept a pickup request."
                    },
                    completed: {
                        title: "No completed listings",
                        message: "Completed exchanges will appear here."
                    }
                },
                error: {
                    title: "Failed to load listings.",
                    button: "Try Again"
                },
                stats: {
                    totalActive: "Active Listings",
                    pendingRequests: "Pending Requests",
                    totalEarnings: "Total Earnings",
                    completedPickups: "Completed"
                },
                timeline: {
                    created: "Created",
                    requests: "Requests",
                    claimed: "Claimed",
                    complete: "Complete"
                },
                emptyWithFilters: "No listings match your filters",
                viewRequests: "View Requests"
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
                    noRecentActivityYet: "No recent activity yet. Start by creating a listing or picking up bottles!",
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
                subtitle: "Chat with your pickup partners",
                signInRequired: "Sign In Required",
                signInMessage: "Please sign in to view your messages.",
                signIn: "Sign In",
                conversations: "Conversations",
                activeConversations: "active conversation(s)",
                noConversations: "No Conversations",
                noConversationsDescription: "You don't have any active pickup requests yet.",
                createListingOrRequest: "Create a listing or request a pickup to start chatting!",
                selectConversation: "Select a Conversation",
                selectConversationDescription: "Choose a conversation from the left to start chatting",
                loadingConversations: "Loading conversations...",
                listingOwner: "Listing Owner",
                volunteer: "Volunteer",
                user: "User",
                typeMessage: "Type a message...",
                send: "Send",
                sending: "Sending...",
                charactersLeft: "{{count}} characters left",
                characterLimit: "Message content must not exceed 1000 characters",
                attachImage: "Attach image",
                attachImageTitle: "Attach image",
                delivered: "Delivered",
                read: "Read {{time}}",
                readAt: "Read at {{time}}",
                typing: "is typing...",
                typingMultiple: "{{users}} are typing...",
                typingOthers: "{{count}} others are typing...",
                you: "You",
                unknown: "Unknown",
                imageLoadError: "Failed to load image",
                noInitialMessage: "No initial message",
                loadingMessages: "Loading messages...",
                loadError: "Failed to load messages",
                tryAgain: "Try Again",
                noMessages: "No messages yet",
                startConversation: "Start a conversation with {{name}}!",
                conversationEnded: "This conversation is no longer active",
                messagePlaceholder: "Message {{name}}...",
                enterToSend: "Press Enter to send, Shift+Enter for new line",
                theOtherParty: "the other party",
                unreadMessages: "message(s)"
            },
            myPickupTasks: {
                title: "My Pickup Tasks",
                subtitle: "Manage all your pickup tasks",
                signInRequired: "Sign In Required",
                signInMessage: "Please sign in to view your pickup tasks.",
                signIn: "Sign In",
                tabs: {
                    all: "All",
                    active: "Active",
                    completed: "Completed"
                },
                descriptions: {
                    active: "Pickup tasks pending or in progress",
                    completed: "Successfully completed bottle pickups"
                },
                empty: {
                    active: {
                        title: "No active pickup tasks",
                        message: "Browse available bottles to start picking up!",
                        button: "Browse Bottles"
                    },
                    completed: {
                        title: "No completed pickup tasks",
                        message: "Completed pickups will appear here."
                    }
                },
                error: {
                    title: "Failed to load pickup tasks.",
                    button: "Try Again"
                }
            },
            rating: {
                title: "Rate Your Experience",
                description: "How was your experience with {{name}}?",
                selectRating: "Please select a star rating before submitting.",
                ratingRequired: "Rating required",
                transactionDetails: "Transaction Details:",
                totalRefund: "Total Refund: {{amount}} HUF",
                commentLabel: "Comment (Optional)",
                commentPlaceholder: "Share your experience...",
                cancel: "Cancel",
                submit: "Submit Rating",
                submitting: "Submitting...",
                ratings: {
                    poor: "Poor",
                    fair: "Fair",
                    good: "Good",
                    veryGood: "Very Good",
                    excellent: "Excellent"
                }
            },
            messageInput: {
                placeholder: "Type your message...",
                imageTypeError: "Only PNG, JPEG, JPG, and GIF images are allowed",
                imageSizeError: "Image size must be less than 5MB",
                enterToSend: "Press Enter to send, Shift+Enter for new line",
                attachImage: "Attach image",
                send: "Send"
            },
            readReceipt: {
                sending: "Sending...",
                sendingMessage: "Message is being sent",
                read: "Read",
                readAt: "Read at {{time}}",
                delivered: "Delivered"
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
            locationPicker: {
                title: "Pick Location on Map",
                subtitle: "Click on the map to select your bottle location, or search for an address",
                searchPlaceholder: "Search address in Hungary...",
                search: "Search",
                myLocation: "My Location",
                selectedAddress: "Selected Address",
                addressPlaceholder: "Address will appear here when you click on the map",
                addressHint: "You can edit the address manually if needed",
                latitude: "Latitude",
                longitude: "Longitude",
                tipTitle: "💡 Tip:",
                tipDescription: "Click anywhere on the map to set your bottle location. The address will be automatically filled in.",
                addressLookupFailed: "Address lookup failed",
                addressLookupFailedDesc: "Please enter the address manually",
                locationFound: "Location found",
                locationFoundDesc: "Click on the map to adjust if needed",
                locationNotFound: "Location not found",
                locationNotFoundDesc: "Try a different search or click on the map",
                searchFailed: "Search failed",
                searchFailedDesc: "Please try again or click on the map",
                usingYourLocation: "Using your current location",
                locationUnavailable: "Location unavailable",
                locationUnavailableDesc: "Please enable location services or search manually"
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
                searchAddressPlaceholder: "Search for an address...",
                search: "Search",
                searching: "Searching...",
                searchEmpty: "Search field is empty",
                pleaseEnterAddress: "Please enter an address to search",
                locationNotFound: "Location not found",
                tryDifferentAddress: "Please try a different address",
                searchFailed: "Search failed",
                searchFailedDesc: "Unable to search for the address. Please try again.",
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
            "terms": {
                "title": "Terms of Service",
                "lastUpdated": "Last Updated",

                "section1": {
                    "title": "Introduction",
                    "content": "BottleBuddy is a community platform that connects people who want to return bottles with volunteers willing to help. By using the Service, you agree to these Terms and commit to following them.\n\nBottleBuddy is not a delivery or financial service and does not participate in user agreements. We only facilitate communication."
                },

                "section2": {
                    "title": "Accounts and Eligibility",
                    "content": "To use the Service, you must be at least 18 years old or have parental/guardian consent.\n\nYou are responsible for:\n• keeping your account secure,\n• providing accurate information,\n• all activity associated with your account.\n\nWe may suspend or delete accounts in cases of abuse, fraud, or violation of these Terms."
                },

                "section3": {
                    "title": "Nature of the Service",
                    "content": "BottleBuddy acts solely as a facilitator.\n\n• We are not involved in bottle exchanges.\n• We do not verify listings.\n• We are not responsible for meetups, payments, or user behavior.\n\nAll exchanges and agreements take place entirely at the users' own risk."
                },

                "section4": {
                    "title": "User Conduct",
                    "content": "The following actions are prohibited:\n\n• posting illegal, offensive, or misleading content,\n• harassment or threats,\n• attempting to bypass platform security,\n• uploading malicious files,\n• manipulating ratings or creating fake accounts.\n\nViolations may result in immediate suspension."
                },

                "section5": {
                    "title": "Listings and Exchanges",
                    "content": "BottleBuddy is not a party to transactions.\n\n• Users are fully responsible for their listings.\n• Refund-sharing is a private agreement.\n• We do not guarantee that exchanges will occur.\n• We are not responsible for damages, disputes, misunderstandings, or offline events."
                },

                "section6": {
                    "title": "Messaging",
                    "content": "In-app messages exist to coordinate pickups.\n\n• Messages are private but may be reviewed in cases of abuse.\n• Spam, harassment, and inappropriate content are prohibited.\n• Uploaded images must comply with laws and these Terms."
                },

                "section7": {
                    "title": "Privacy and Security",
                    "content": "BottleBuddy processes data in accordance with GDPR. See our Privacy Policy for details.\n\n• We use Google OAuth and JWT authentication.\n• You may request access, correction, or deletion of your data.\n• Industry-standard security practices protect your information."
                },

                "section8": {
                    "title": "Limitation of Liability",
                    "content": "BottleBuddy is provided \"as is\" without warranties.\n\nWe are not liable for:\n• user behavior or content,\n• disputes, losses, or damages,\n• technical failures or data loss.\n\nIf you do not agree with these Terms, you may stop using the Service at any time."
                }
            }
        }
    },
    hu: {
        translation: {
            activities: {
                listingCreated: {
                    title: "Hirdetés létrehozva",
                    description: "Létrehoztál egy új hirdetést {{bottleCount}} palackra itt: {{locationAddress}}"
                },
                listingDeleted: {
                    title: "Hirdetés törölve",
                    description: "Törölted a hirdetésed {{bottleCount}} palackra itt: {{locationAddress}}"
                },
                pickupRequestReceived: {
                    title: "Új átvételi kérés",
                    description: "{{volunteerName}} át szeretné venni {{bottleCount}} palackodat itt: {{locationAddress}}"
                },
                pickupRequestAcceptedByOwner: {
                    title: "Átvételi kérés elfogadva",
                    description: "Elfogadtad {{volunteerName}} kérését {{bottleCount}} palackod átvételére"
                },
                pickupRequestRejectedByOwner: {
                    title: "Átvételi kérés elutasítva",
                    description: "Elutasítottad {{volunteerName}} átvételi kérését"
                },
                pickupRequestCompletedByOwner: {
                    title: "Átvétel befejezve",
                    description: "Átvétel befejezve a hirdetésnél itt: {{locationAddress}}"
                },
                pickupRequestCreated: {
                    title: "Átvételi kérés elküldve",
                    description: "Elküldtél egy átvételi kérést {{bottleCount}} palackra itt: {{locationAddress}}"
                },
                pickupRequestAccepted: {
                    title: "Átvételi kérés elfogadva!",
                    description: "Az átvételi kérésedet {{bottleCount}} palackra itt: {{locationAddress}} elfogadták!"
                },
                pickupRequestRejected: {
                    title: "Átvételi kérés elutasítva",
                    description: "Az átvételi kérésedet erre a címre: {{locationAddress}} nem fogadták el"
                },
                pickupRequestCompleted: {
                    title: "Átvétel befejezve",
                    description: "Befejezte az átvételt {{bottleCount}} palackra itt: {{locationAddress}}"
                },
                transactionCompleted: {
                    title: "Tranzakció befejezve",
                    descriptionOwner: "Tranzakció befejezve a hirdetésednél itt: {{locationAddress}}. Kerestél {{ownerAmount}} HUF-ot",
                    descriptionVolunteer: "Tranzakció befejezve! Kerestél {{volunteerAmount}} HUF-ot"
                },
                ratingReceived: {
                    title: "Új értékelés érkezett",
                    description: "Kaptál egy {{ratingValue}} csillagos értékelést tőle: {{raterName}}",
                    descriptionWithComment: "Kaptál egy {{ratingValue}} csillagos értékelést tőle: {{raterName}}: \"{{comment}}\""
                },
                default: {
                    title: "Értesítés",
                    description: "Tevékenység típusa: {{type}}"
                },
                title: "Értesítések",
                markAllRead: "Összes megjelölése olvasottként",
                new: "Új",
                earlier: "Korábbi",
                noActivities: "Még nincsenek értesítések",
                viewAll: "Összes értesítés megtekintése"
            },
            notifications: {
                title: "Értesítések",
                settings: "Értesítési beállítások",
                all: "Összes",
                unread: "Olvasatlan",
                filterByType: "Szűrés típus szerint",
                allTypes: "Minden típus",
                listings: "Hirdetések",
                pickups: "Átvételek",
                transactions: "Tranzakciók",
                ratings: "Értékelések",
                markAsRead: "Megjelölés olvasottként",
                markRead: "Olvasva",
                delete: "Törlés",
                empty: "Nincsenek értesítések",
                emptyDesc: "Minden rendben! Nézz vissza később új értesítésekért."
            },
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
                retry: "Próbáld újra",
                backToHome: "Vissza a főoldalra",
                statisticsUnavailable: "Az adatok átmenetileg nem érhetők el.",
                volunteer: "Önkéntes",
                mapView: "Megtekintés térképen",
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
                title: "Segíts másoknak a palackok visszaváltásával és osztozzatok a hasznon",
                description: "Csatlakozz a közösséghez, és adjátok le együtt a palackokat. Osztozzatok az 50 forintos visszaváltáson, és segíts Magyarországnak hatékonyabban újrahasznosítani.",
                listBottles: "Palackok meghirdetése",
                findBottles: "Közeli palackok keresése",
                getStarted: "Indulás",
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
                    cta: "Készen állsz ma is valami hasznosat csinálni?"
                },
                quickActions: {
                    title: "Gyors menü",
                    primaryCTA: {
                        title: "Hozz létre egy hirdetést",
                        description: "Hirdesd meg a palackjaidat és kapd meg a részedet, amikor az önkéntesek átveszik őket",
                        button: "Palackok meghirdetése"
                    },
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
                        label: "Hirdetéseim kezelése",
                        description: "Palackok kezelése"
                    }
                },
                impact: {
                    title: "A te eredményeid",
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
                },
                activeListings: {
                    title: "Aktív hirdetéseim",
                    description: "Hirdetéseid, amelyek önkéntesekre várnak",
                    emptyDescription: "Nincsenek aktív hirdetéseid",
                    emptyCtaDescription: "Hozz létre első hirdetésed, hogy elkezdhess keresni!",
                    createButton: "Hirdetés létrehozása",
                    viewAll: "Összes megtekintése"
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
                    title: "Segíts elvinni mások palackjait",
                    subtitle: "Segíts másoknak a palackjaik átvételével",
                    count: "{{count}} hirdetés",
                    count_plural: "{{count}} hirdetés",
                    viewAll: "Összes megtekintése",
                    viewMap: "Megtekintés térképen",
                    noBottles: "Jelenleg nincsenek elérhető palackok a közeledben.",
                    checkBack: "Nézz vissza később, vagy fedezd fel a térképet, hogy palackokat találj!"
                },
                pickupTasks: {
                    title: "Átvételi kéréseim",
                    subtitle: "Palackok, amelyeket felajánlottál átvételre",
                    count: "{{count}} feladat",
                    count_plural: "{{count}} feladat",
                    viewAll: "Összes megtekintése",
                    noTasks: "Nincsenek aktív átvételi kéréseid.",
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
            listing: {
                createTitle: "Palackok közzététele",
                createDescription: "Oszd meg a palackjaidat a közösséggel",
                createPageTitle: "Palackok közzététele",
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
                updateButton: "Hirdetés módosítása",
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
                offerToPickUp: "Visszaváltás felajánlása",
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
                yourShare: "A te részesedésed",
                volunteerShare: "Önkéntes része",
                youReceive: "A Te részed ",
                volunteerKeeps: "Az Önkéntes része",
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
                pickupDeadline: "Átvételi határidő",
                pastDeadline: "Lejárt határidő",
                soon: "Hamarosan",
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
            pickupRequests: {
                statusUpdateSuccessTitle: "Kérelem frissítve",
                statusUpdateSuccessDescription: "Az átvételi kérelem állapota: {{status}}.",
                statusUpdateErrorTitle: "Frissítés sikertelen",
                statusUpdateErrorDescription: "Az átvételi kérelem állapotának frissítése nem sikerült."
            },
            myListingsPage: {
                title: "Hirdetéseim",
                subtitle: "Kezeld az összes palackhirdetésedet",
                newListing: "Új hirdetés",
                signInRequired: "Bejelentkezés szükséges",
                signInMessage: "Kérjük, jelentkezz be a hirdetéseid megtekintéséhez.",
                signIn: "Bejelentkezés",
                tabs: {
                    all: "Összes",
                    active: "Aktív",
                    claimed: "Lefoglalt",
                    completed: "Befejezett"
                },
                descriptions: {
                    active: "Átvételi kérelmekre váró hirdetések",
                    claimed: "Elfogadott átvételi kérelmekkel rendelkező hirdetések",
                    completed: "Sikeresen befejezett palackcserék"
                },
                empty: {
                    active: {
                        title: "Nincsenek aktív hirdetések",
                        message: "Hozz létre egy új hirdetést a kezdéshez!",
                        button: "Hirdetés létrehozása"
                    },
                    claimed: {
                        title: "Nincsenek lefoglalt hirdetések",
                        message: "A hirdetések itt jelennek meg, amikor elfogadsz egy átvételi kérelmet."
                    },
                    completed: {
                        title: "Nincsenek befejezett hirdetések",
                        message: "A befejezett cserék itt fognak megjelenni."
                    }
                },
                error: {
                    title: "A hirdetések betöltése sikertelen.",
                    button: "Próbáld újra"
                },
                stats: {
                    totalActive: "Aktív hirdetések",
                    pendingRequests: "Függőben lévő kérelmek",
                    totalEarnings: "Összes bevétel",
                    completedPickups: "Befejezett"
                },
                timeline: {
                    created: "Létrehozva",
                    requests: "Kérelmek",
                    claimed: "Lefoglalt",
                    complete: "Kész"
                },
                emptyWithFilters: "Nincs a szűrőknek megfelelő hirdetés",
                viewRequests: "Kérelmek megtekintése"
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
                    noRecentActivityYet: "Még nincs friss tevékenység. Kezdd el egy hirdetés feladásával, vagy vegyél át palackokat!",
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
                subtitle: "Egyeztess a partneredddel",
                signInRequired: "Jelentkezz be!",
                signInMessage: "Kérjük, jelentkezz be az üzeneteid megtekintéséhez.",
                signIn: "Bejelentkezés",
                conversations: "Beszélgetések",
                activeConversations: "Aktív beszélgetés",
                noConversations: "Nincsenek Beszélgetések",
                noConversationsDescription: "Még nincsenek aktív átvételi kérelmeid.",
                createListingOrRequest: "Hozz létre egy hirdetést vagy kérj átvételt a csevegés megkezdéséhez!",
                selectConversation: "Válassz beszélgetést",
                selectConversationDescription: "Válassz egy beszélgetést a bal oldalon a csevegés megkezdéséhez",
                loadingConversations: "Beszélgetések betöltése...",
                listingOwner: "Hirdetés tulajdonosa",
                volunteer: "Önkéntes",
                user: "Felhasználó",
                typeMessage: "Írj üzenetet...",
                send: "Küldés",
                sending: "Küldés...",
                charactersLeft: "{{count}} karakter maradt",
                characterLimit: "Az üzenet nem lehet hosszabb 1000 karakternél",
                attachImage: "Kép csatolása",
                attachImageTitle: "Kép csatolása",
                delivered: "Kézbesítve",
                read: "Elolvasva {{time}}",
                readAt: "Elolvasva: {{time}}",
                typing: "gépel...",
                typingMultiple: "{{users}} gépelnek...",
                typingOthers: "{{count}} másik személy gépel...",
                you: "Te",
                unknown: "Ismeretlen",
                imageLoadError: "A kép betöltése sikertelen",
                noInitialMessage: "Nincs kezdő üzenet",
                loadingMessages: "Üzenetek betöltése...",
                loadError: "Az üzenetek betöltése sikertelen",
                tryAgain: "Próbáld újra",
                noMessages: "Még nincsenek üzenetek",
                startConversation: "Kezdj beszélgetést {{name}} felhasználóval!",
                conversationEnded: "Ez a beszélgetés már nem aktív",
                messagePlaceholder: "Üzenj neki: {{name}} ",
                enterToSend: "Enter a küldéshez, Shift+Enter az új sorhoz",
                theOtherParty: "a másik fél",
                unreadMessages: "üzenet"
            },
            myPickupTasks: {
                title: "Átvételi feladataim",
                subtitle: "Kezeld az összes átvételi feladatodat",
                signInRequired: "Bejelentkezés szükséges",
                signInMessage: "Kérjük, jelentkezz be az átvételi feladataid megtekintéséhez.",
                signIn: "Bejelentkezés",
                tabs: {
                    all: "Összes",
                    active: "Aktív",
                    completed: "Befejezett"
                },
                descriptions: {
                    active: "Függőben lévő vagy folyamatban lévő átvételi feladatok",
                    completed: "Sikeresen befejezett palackátvételek"
                },
                empty: {
                    active: {
                        title: "Nincsenek aktív átvételi feladatok",
                        message: "Böngéssz az elérhető palackok között az átvétel megkezdéséhez!",
                        button: "Palackok böngészése"
                    },
                    completed: {
                        title: "Nincsenek befejezett átvételi feladatok",
                        message: "A befejezett átvételek itt fognak megjelenni."
                    }
                },
                error: {
                    title: "Az átvételi feladatok betöltése sikertelen.",
                    button: "Próbáld újra"
                }
            },
            rating: {
                title: "Értékeld a tapasztalatot",
                description: "Milyen volt az élményed {{name}} felhasználóval?",
                selectRating: "Kérjük, válassz csillagos értékelést a beküldés előtt.",
                ratingRequired: "Értékelés kötelező",
                transactionDetails: "Tranzakció részletei:",
                totalRefund: "Teljes visszatérítés: {{amount}} Ft",
                commentLabel: "Megjegyzés (nem kötelező)",
                commentPlaceholder: "Oszd meg az élményedet...",
                cancel: "Mégse",
                submit: "Értékelés beküldése",
                submitting: "Beküldés...",
                ratings: {
                    poor: "Gyenge",
                    fair: "Megfelelő",
                    good: "Jó",
                    veryGood: "Nagyon jó",
                    excellent: "Kiváló"
                }
            },
            messageInput: {
                placeholder: "Írj üzenetet...",
                imageTypeError: "Csak PNG, JPEG, JPG és GIF képek engedélyezettek",
                imageSizeError: "A kép mérete nem lehet nagyobb 5 MB-nál",
                enterToSend: "Enter a küldéshez, Shift+Enter az új sorhoz",
                attachImage: "Kép csatolása",
                send: "Küldés"
            },
            readReceipt: {
                sending: "Küldés...",
                sendingMessage: "Az üzenet küldése folyamatban",
                read: "Elolvasva",
                readAt: "Elolvasva: {{time}}",
                delivered: "Kézbesítve"
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
            auth: {
                backToHome: "Vissza a főoldalra",
                welcomeBack: "Üdvözlünk Újra",
                joinBottleBuddy: "Csatlakozz a BottleBuddy-hoz",
                signInSubtitle: "Jelentkezz be az újrahasznosítási utazásod folytatásához",
                signUpSubtitle: "Hozd létre fiókodat, hogy elkezdhess palackokat megosztani és hatást gyakorolni",
                or: "vagy",
                email: "E-mail",
                emailPlaceholder: "te@email.hu",
                password: "Jelszó",
                passwordPlaceholder: "••••••••",
                fullName: "Teljes Név",
                fullNamePlaceholder: "Kovács János",
                optional: "(opcionális)",
                username: "Felhasználónév",
                usernamePlaceholder: "kovacsj",
                usernameHint: "Csak betűk, számok, aláhúzás és kötőjel",
                phone: "Telefon",
                phonePlaceholder: "+36301234567",
                confirmPassword: "Jelszó Megerősítése",
                passwordHint: "Legalább 8 karakter, kis- és nagybetű, valamint szám",
                signIn: "Bejelentkezés",
                signUp: "Regisztráció",
                createAccount: "Fiók létrehozása",
                signingIn: "Bejelentkezés...",
                creatingAccount: "Fiók létrehozása...",
                alreadyHaveAccount: "Már van fiókod?",
                dontHaveAccount: "Nincs még fiókod?",
                signInWithGoogle: "Bejelentkezés Google-lal",
                signUpWithGoogle: "Regisztráció Google-lal",
                // Validációs üzenetek
                emailRequired: "E-mail cím megadása kötelező",
                emailInvalid: "Kérjük, adj meg egy érvényes e-mail címet",
                passwordRequired: "Jelszó megadása kötelező",
                passwordMin: "A jelszónak legalább 8 karakterből kell állnia",
                passwordUppercase: "A jelszónak tartalmaznia kell legalább egy nagybetűt",
                passwordLowercase: "A jelszónak tartalmaznia kell legalább egy kisbetűt",
                passwordNumber: "A jelszónak tartalmaznia kell legalább egy számot",
                passwordsDontMatch: "A jelszavak nem egyeznek",
                fullNameMax: "A teljes név nem lehet hosszabb 100 karakternél",
                usernameMax: "A felhasználónév nem lehet hosszabb 50 karakternél",
                usernameInvalid: "A felhasználónév csak betűket, számokat, aláhúzást és kötőjelet tartalmazhat",
                phoneInvalid: "Kérjük, adj meg egy érvényes telefonszámot",
                // Toast üzenetek
                googleSignInSuccess: "Üdvözlünk!",
                googleSignInSuccessDesc: "Sikeresen bejelentkeztél Google-lal",
                googleSignInError: "Hitelesítés sikertelen",
                googleSignInErrorDesc: "A Google bejelentkezés nem sikerült",
                signInSuccess: "Üdvözlünk vissza!",
                signInSuccessDesc: "Sikeresen bejelentkeztél",
                signInError: "Bejelentkezés sikertelen",
                signUpSuccess: "Fiók létrehozva!",
                signUpSuccessDesc: "Üdvözlünk a BottleBuddy-n",
                signUpError: "Regisztráció sikertelen"
            },
            locationPicker: {
                title: "Válassz Helyet a Térképen",
                subtitle: "Kattints a térképre a palackod helyének kiválasztásához, vagy keress egy címet",
                searchPlaceholder: "Keress címet Magyarországon...",
                search: "Keresés",
                myLocation: "Helyem",
                selectedAddress: "Kiválasztott Cím",
                addressPlaceholder: "A cím itt fog megjelenni, amikor a térképre kattintasz",
                addressHint: "Szükség esetén manuálisan is szerkesztheted a címet",
                latitude: "Szélesség",
                longitude: "Hosszúság",
                tipTitle: "💡 Tipp:",
                tipDescription: "Kattints bárhova a térképen a palackod helyének beállításához. A cím automatikusan kitöltődik.",
                addressLookupFailed: "Cím lekérdezése sikertelen",
                addressLookupFailedDesc: "Kérjük, add meg a címet manuálisan",
                locationFound: "Helyzet megtalálva",
                locationFoundDesc: "Kattints a térképre a módosításhoz, ha szükséges",
                locationNotFound: "Helyzet nem található",
                locationNotFoundDesc: "Próbálj más keresést, vagy kattints a térképre",
                searchFailed: "Keresés sikertelen",
                searchFailedDesc: "Kérjük, próbáld újra vagy kattints a térképre",
                usingYourLocation: "Jelenlegi helyzeted használata",
                locationUnavailable: "A helyzet nem érhető el",
                locationUnavailableDesc: "Kérjük, engedélyezd a helymeghatározási szolgáltatásokat, vagy keress manuálisan"
            },
            map: {
                title: "Térkép",
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
                sortedByDistance: "Távolság szerint rendezve",
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
                madeWithLove: "A fenntarthatóságért",
                subtitle: "Küldetésünk, hogy a palackok visszaváltását könnyebbé, jutalmazóbbá és közösségibbé tegyük. A BottleBuddy összeköti azokat az embereket, akiknek visszaváltható palackjaik vannak, azokkal, akik szívesen visszaviszik őket, mindenki számára előnyös helyzetet teremtve.",
                mission: "Küldetésünk",
                missionText: "Az újrahasznosítás jövedelmezővé és közösség-vezérelté tétele Magyarországon.",
                missionDescription: "Fenntartható jövő létrehozása azáltal, hogy a palackok visszaváltását mindenki számára elérhetővé, közösségivé és jutalmazóvá tesszük. Hiszünk abban, hogy a kis cselekedetek, ha milliók teszik őket, megváltoztathatják a világot.",
                story: "Történetünk",
                storyText: "A BottleBuddy-t azért hoztuk létre, hogy megoldjunk egy egyszerű problémát: Sokan gyűjtenek palackokat, de nincs idejük visszavinni őket. Összekapcsoljuk ezeket az embereket olyan önkéntesekkel, akik szívesen segítenek a visszatérítés megosztása fejében.",
                howWeHelp: "Hogyan segítünk",
                whyChoose: "Miért érdemes a BottleBuddy-t választani?",
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
                    title: "Helyi közösségekre épül",
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
                    getStarted: "Regisztráció",
                    exploreListings: "Hirdetések böngészése",
                    joinToday: "Csatlakozz még ma a BottleBuddy-hoz"
                }
            },
            "terms": {
                "title": "Felhasználási Feltételek",
                "lastUpdated": "Utolsó frissítés",

                "section1": {
                    "title": "Bevezetés",
                    "content": "A BottleBuddy egy közösségi platform, amely összeköti azokat, akik palackokat szeretnének visszaváltani, azokkal, akik szívesen segítenek az átvételben. A Szolgáltatás használatával elfogadod a jelen Felhasználási Feltételeket, és vállalod, hogy azokat betartod.\n\nA BottleBuddy nem szállítási vagy pénzügyi szolgáltatás, és nem vesz részt a felhasználók közötti megállapodásokban. Mi csak megkönnyítjük a kapcsolatfelvételt."
                },

                "section2": {
                    "title": "Fiók és Jogosultság",
                    "content": "A Szolgáltatás használatához legalább 18 évesnek kell lenned, vagy szülői/gyámi hozzájárulással rendelkezned.\n\nA felhasználó felel:\n• a fiókja biztonságáért,\n• a megadott adatok pontosságáért,\n• minden tevékenységért, ami a fiókjához köthető.\n\nFenntartjuk a jogot fiókok felfüggesztésére vagy törlésére, ha visszaélést, csalást vagy a feltételek megsértését tapasztaljuk."
                },

                "section3": {
                    "title": "Szolgáltatás Jellege",
                    "content": "A BottleBuddy egy közvetítő platform. Ennek megfelelően:\n\n• nem veszünk részt a palackcserékben,\n• nem ellenőrizzük a hirdetések valódiságát,\n• nem vállalunk felelősséget a találkozókért, fizetésekért vagy a felhasználók cselekedeteiért.\n\nMinden találkozó, csere és megállapodás a felhasználók saját felelősségére történik."
                },

                "section4": {
                    "title": "Felhasználói Magatartás",
                    "content": "A következő tevékenységek nem megengedettek:\n\n• sértő, megtévesztő vagy illegális tartalom közzététele,\n• zaklatás vagy fenyegetés,\n• a platform biztonsági megkerülése,\n• rosszindulatú fájlok feltöltése,\n• értékelések manipulálása vagy hamis fiókok létrehozása.\n\nA szabályok megsértése a fiók azonnali felfüggesztéséhez vezethet."
                },

                "section5": {
                    "title": "Hirdetések és Cserék",
                    "content": "A BottleBuddy nem vesz részt a tranzakciókban.\n\n• A hirdetésekért teljes mértékben a felhasználók felelnek.\n• A visszatérítés megosztása privát megállapodás.\n• Nem garantáljuk, hogy egy csere létrejön, vagy hogy a felek megjelennek.\n• Nem vállalunk felelősséget károkért, vitákért, félreértésekért vagy bármilyen offline eseményért."
                },

                "section6": {
                    "title": "Üzenetküldés",
                    "content": "Az alkalmazáson belüli üzenetek célja a csere koordinálása.\n\n• Az üzenetek privátak, de visszaélés esetén vizsgálhatók.\n• Tilos zaklatás, spam vagy nem megfelelő tartalom.\n• A képfeltöltéseknek meg kell felelniük a jogszabályoknak és a feltételeknek."
                },

                "section7": {
                    "title": "Adatvédelem és Biztonság",
                    "content": "A BottleBuddy GDPR-kompatibilis módon kezeli az adatokat. Részletek az Adatvédelmi Szabályzatban találhatók.\n\n• Google OAuth és JWT hitelesítést használunk.\n• Jogaid: hozzáférés, javítás, törlés kérése.\n• Biztonsági gyakorlatokat alkalmazunk a felhasználói adatok védelme érdekében."
                },

                "section8": {
                    "title": "Felelősség Korlátozása",
                    "content": "A BottleBuddy \"jelen állapotában\" működik, garanciák nélkül.\n\nNem vállalunk felelősséget:\n• felhasználói cselekedetekért vagy tartalomért,\n• vitákért, károkért vagy veszteségekért,\n• technikai hibákért, leállásért vagy adatvesztésért.\n\nHa nem értesz egyet a feltételekkel, a Szolgáltatás használatát bármikor megszüntetheted."
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
