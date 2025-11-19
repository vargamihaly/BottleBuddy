import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";
import { Button } from "@/shared/ui/button";
import { Textarea } from "@/shared/ui/textarea";
import { Star } from "lucide-react";
import { useToast } from "@/shared/hooks/use-toast";
import { Transaction } from "@/shared/types";
import { useCreateRating } from "@/features/dashboard/hooks";
import { useTranslation } from "react-i18next";

interface RatingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  transaction: Transaction;
  otherPartyName?: string;
}

export const RatingDialog = ({ open, onOpenChange, transaction, otherPartyName }: RatingDialogProps) => {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState("");
  const { toast } = useToast();
  const { t } = useTranslation();

  const createRatingMutation = useCreateRating();

  const handleSubmit = () => {
    if (rating === 0) {
      toast({
        title: t("rating.ratingRequired"),
        description: t("rating.selectRating"),
        variant: "destructive",
      });
      return;
    }

    createRatingMutation.mutate(
      {
        transactionId: transaction.id,
        value: rating,
        comment: comment.trim() || undefined,
      },
      {
        onSuccess: () => {
          onOpenChange(false);
          setRating(0);
          setComment("");
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t("rating.title")}</DialogTitle>
          <DialogDescription>
            {t("rating.description", { name: otherPartyName || "the other party" })}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Star Rating */}
          <div className="flex flex-col items-center space-y-2">
            <div className="flex space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="focus:outline-none transition-transform hover:scale-110"
                >
                  <Star
                    className={`w-10 h-10 ${
                      star <= (hoveredRating || rating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                </button>
              ))}
            </div>
            {rating > 0 && (
              <p className="text-sm text-gray-600">
                {rating === 1 && t("rating.ratings.poor")}
                {rating === 2 && t("rating.ratings.fair")}
                {rating === 3 && t("rating.ratings.good")}
                {rating === 4 && t("rating.ratings.veryGood")}
                {rating === 5 && t("rating.ratings.excellent")}
              </p>
            )}
          </div>

          {/* Transaction Details */}
          <div className="bg-gray-50 rounded-lg p-3 space-y-1">
            <p className="text-sm text-gray-600">{t("rating.transactionDetails")}</p>
            <p className="text-sm font-medium">{transaction.listingTitle || `${transaction.bottleCount} bottles`}</p>
            <p className="text-xs text-gray-500">
              {t("rating.totalRefund", { amount: transaction.totalRefund })}
            </p>
          </div>

          {/* Comment */}
          <div className="space-y-2">
            <label className="text-sm font-medium">
              {t("rating.commentLabel")}
            </label>
            <Textarea
              placeholder={t("rating.commentPlaceholder")}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={3}
              maxLength={500}
            />
            <p className="text-xs text-gray-500 text-right">
              {comment.length}/500
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={createRatingMutation.isPending}
          >
            {t("rating.cancel")}
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={createRatingMutation.isPending || rating === 0}
            className="bg-gradient-to-r from-green-600 to-emerald-600"
          >
            {createRatingMutation.isPending ? t("rating.submitting") : t("rating.submit")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
