import { useState, useEffect, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/shared/ui/button";
import { Card } from "@/shared/ui/card";
import { BottomNav } from "@/shared/ui/bottom-nav";
import { ArrowLeft, MessageSquare } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { BottleListing, PickupRequest } from "@/shared/types";
import { ConversationList, ChatBox } from "@/features/messaging/components";
import { useBottleListings } from "@/features/listings/hooks";
import { pickupRequestService, useMyPickupRequests } from "@/features/pickup-requests";
import { useTranslation } from "react-i18next";

const Messages = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(
    searchParams.get("conversation")
  );

  const {
    data: myPickupRequests = [],
    isLoading: isLoadingMyPickupRequests,
  } = useMyPickupRequests({ enabled: !!user });

  const {
    data: allListings = [],
    isLoading: isLoadingListings,
  } = useBottleListings();

  const myListings = useMemo(
    () => allListings.filter((listing) => listing.createdByUserEmail === user?.email),
    [allListings, user?.email]
  );

  const {
    data: ownerPickupRequests = [],
    isLoading: isLoadingOwnerPickupRequests,
  } = useQuery<PickupRequest[]>({
    queryKey: ["ownerPickupRequests", myListings.map((listing) => listing.id)],
    queryFn: async () => {
      const requests = await Promise.all(
        myListings.map((listing) =>
          pickupRequestService.getByListingId(listing.id).catch(() => [])
        )
      );

      return requests.flat();
    },
    enabled: !!user && myListings.length > 0,
  });

  // Combine all pickup requests (remove duplicates by id)
  const allPickupRequests = useMemo(
    () => [
      ...myPickupRequests,
      ...ownerPickupRequests.filter(
        (ownerReq) => !myPickupRequests.some((myReq) => myReq.id === ownerReq.id)
      ),
    ],
    [myPickupRequests, ownerPickupRequests]
  );

  const isLoading = isLoadingMyPickupRequests || isLoadingOwnerPickupRequests || isLoadingListings;

  // Update URL when conversation is selected
  useEffect(() => {
    if (selectedConversationId) {
      setSearchParams({ conversation: selectedConversationId });
    } else {
      setSearchParams({});
    }
  }, [selectedConversationId, setSearchParams]);

  // Auto-select first conversation if none selected and conversations exist
  useEffect(() => {
    const activeConversations = allPickupRequests.filter(
      (req) => req.status === "pending" || req.status === "accepted"
    );

    if (!selectedConversationId && activeConversations.length > 0) {
      setSelectedConversationId(activeConversations[0].id);
    }
  }, [allPickupRequests, selectedConversationId]);

  // Get selected conversation details
  const selectedConversation = allPickupRequests.find(
    (req) => req.id === selectedConversationId
  );

  // Determine other party name
  const getOtherPartyName = () => {
    if (!selectedConversation) return t("messages.user");

    // Find the listing for this pickup request
    const listing = allListings.find((listing) => listing.id === selectedConversation.listingId);

    // If current user is the volunteer, show the listing owner's name
    if (selectedConversation.volunteerId === user?.id) {
      return listing?.createdByUserName || listing?.createdByUserEmail || t("messages.listingOwner");
    }

    // If current user is the owner, show the volunteer's name
    return selectedConversation.volunteerName || selectedConversation.volunteerEmail || t("messages.volunteer");
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center">
        <Card className="max-w-md w-full mx-4 p-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{t("messages.signInRequired")}</h2>
            <p className="text-gray-600 mb-6">{t("messages.signInMessage")}</p>
            <Button onClick={() => navigate("/auth")} className="w-full">
              {t("messages.signIn")}
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-md shadow-sm border-b border-green-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={() => navigate("/")} className="p-2">
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <MessageSquare className="w-6 h-6 text-green-600" />
                  {t("messages.title")}
                </h1>
                <p className="text-sm text-gray-600">{t("messages.subtitle")}</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content - Two Panel Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20 md:pb-8">
        <Card className="overflow-hidden">
          <div className="flex h-[calc(100vh-200px)] md:h-[calc(100vh-200px)]">
            {/* Left Panel - Conversations List */}
            <div className="w-full md:w-1/3 border-r border-gray-200 bg-white">
              {isLoading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-2"></div>
                    <p className="text-sm text-gray-600">{t("messages.loadingConversations")}</p>
                  </div>
                </div>
              ) : (
                <ConversationList
                  pickupRequests={allPickupRequests}
                  listings={allListings}
                  selectedConversationId={selectedConversationId}
                  onSelectConversation={setSelectedConversationId}
                />
              )}
            </div>

            {/* Right Panel - Chat Area */}
            <div className="hidden md:flex md:w-2/3 bg-gray-50">
              {selectedConversationId && selectedConversation ? (
                <div className="w-full">
                  <ChatBox
                    pickupRequestId={selectedConversationId}
                    otherPartyName={getOtherPartyName()}
                    disabled={
                      selectedConversation.status === "completed" ||
                      selectedConversation.status === "rejected" ||
                      selectedConversation.status === "cancelled"
                    }
                  />
                </div>
              ) : (
                <div className="flex items-center justify-center w-full">
                  <div className="text-center p-8">
                    <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {t("messages.selectConversation")}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {t("messages.selectConversationDescription")}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile - Show chat in full screen when selected */}
            {selectedConversationId && selectedConversation && (
              <div className="md:hidden fixed inset-0 bg-white z-50">
                <div className="flex flex-col h-full">
                  <div className="p-4 border-b border-gray-200 flex items-center space-x-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedConversationId(null)}
                    >
                      <ArrowLeft className="w-4 h-4" />
                    </Button>
                    <h2 className="font-semibold text-gray-900">{getOtherPartyName()}</h2>
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <ChatBox
                      pickupRequestId={selectedConversationId}
                      otherPartyName={getOtherPartyName()}
                      disabled={
                        selectedConversation.status === "completed" ||
                        selectedConversation.status === "rejected" ||
                        selectedConversation.status === "cancelled"
                      }
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>
      <BottomNav />
    </div>
  );
};

export default Messages;
