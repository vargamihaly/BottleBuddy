import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BottleListing } from "@/types";
import { ArrowRight, Package, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

interface MyActiveListingsWidgetProps {
  listings: BottleListing[];
  isLoading: boolean;
}

export const MyActiveListingsWidget = ({ listings, isLoading }: MyActiveListingsWidgetProps) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Package className="w-5 h-5 text-green-600" />
            {t("dashboard.activeListings.title")}
          </CardTitle>
          <CardDescription>{t("dashboard.activeListings.description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="border rounded-lg p-3 animate-pulse">
              <div className="h-16 bg-gray-200 rounded"></div>
            </div>
            <div className="border rounded-lg p-3 animate-pulse">
              <div className="h-16 bg-gray-200 rounded"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (listings.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Package className="w-5 h-5 text-green-600" />
            {t("dashboard.activeListings.title")}
          </CardTitle>
          <CardDescription>{t("dashboard.activeListings.emptyDescription")}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-sm text-gray-600 mb-4">
              {t("dashboard.activeListings.emptyCtaDescription")}
            </p>
            <Button
              onClick={() => navigate("/create-listing")}
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              {t("dashboard.activeListings.createButton")}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              <Package className="w-5 h-5 text-green-600" />
              {t("dashboard.activeListings.title")}
            </CardTitle>
            <CardDescription>{t("dashboard.activeListings.description")}</CardDescription>
          </div>
          <Badge variant="secondary" className="bg-green-100 text-green-700">
            {listings.length}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {listings.slice(0, 2).map((listing) => (
            <div
              key={listing.id}
              className="border rounded-lg p-3 hover:bg-gray-50 transition-colors cursor-pointer"
              onClick={() => navigate("/my-listings")}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                    {listing.bottleCount}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-sm text-gray-900 truncate">
                      {listing.title || `${listing.bottleCount} ${t("common.bottles")}`}
                    </h4>
                    <p className="text-xs text-gray-600 truncate mt-1">
                      {listing.locationAddress}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="secondary" className="bg-green-100 text-green-700 text-xs">
                        {t(`listing.${listing.status}`)}
                      </Badge>
                      <span className="text-xs text-gray-500">
                        {t("listing.estimatedRefund")}: {listing.estimatedRefund} HUF
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        {listings.length > 2 && (
          <div className="mt-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/my-listings")}
              className="w-full text-green-600 hover:text-green-700"
            >
              {t("dashboard.activeListings.viewAll")} ({listings.length})
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

