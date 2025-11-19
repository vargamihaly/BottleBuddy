import {UserActivityType} from '@/shared/types';
import {TFunction} from 'i18next';

interface ActivityMessage {
  title: string;
  description: string;
}

export function getActivityMessage(
  type: UserActivityType,
  templateData: Record<string, unknown>,
  t: TFunction
): ActivityMessage {
  const activityKey = type.toString();

  switch (type) {
    // Listing activities
    case UserActivityType.ListingCreated:
      return {
        title: t('activities.listingCreated.title'),
        description: t('activities.listingCreated.description', {
          bottleCount: templateData.bottleCount,
          locationAddress: templateData.locationAddress
        })
      };

    case UserActivityType.ListingDeleted:
      return {
        title: t('activities.listingDeleted.title'),
        description: t('activities.listingDeleted.description', {
          bottleCount: templateData.bottleCount,
          locationAddress: templateData.locationAddress
        })
      };

    // Pickup request activities - Owner perspective
    case UserActivityType.PickupRequestReceived:
      return {
        title: t('activities.pickupRequestReceived.title'),
        description: t('activities.pickupRequestReceived.description', {
          volunteerName: templateData.volunteerName,
          bottleCount: templateData.bottleCount,
          locationAddress: templateData.locationAddress
        })
      };

    case UserActivityType.PickupRequestAcceptedByOwner:
      return {
        title: t('activities.pickupRequestAcceptedByOwner.title'),
        description: t('activities.pickupRequestAcceptedByOwner.description', {
          volunteerName: templateData.volunteerName,
          bottleCount: templateData.bottleCount
        })
      };

    case UserActivityType.PickupRequestRejectedByOwner:
      return {
        title: t('activities.pickupRequestRejectedByOwner.title'),
        description: t('activities.pickupRequestRejectedByOwner.description', {
          volunteerName: templateData.volunteerName
        })
      };

    case UserActivityType.PickupRequestCompletedByOwner:
      return {
        title: t('activities.pickupRequestCompletedByOwner.title'),
        description: t('activities.pickupRequestCompletedByOwner.description', {
          locationAddress: templateData.locationAddress
        })
      };

    // Pickup request activities - Volunteer perspective
    case UserActivityType.PickupRequestCreated:
      return {
        title: t('activities.pickupRequestCreated.title'),
        description: t('activities.pickupRequestCreated.description', {
          bottleCount: templateData.bottleCount,
          locationAddress: templateData.locationAddress
        })
      };

    case UserActivityType.PickupRequestAccepted:
      return {
        title: t('activities.pickupRequestAccepted.title'),
        description: t('activities.pickupRequestAccepted.description', {
          bottleCount: templateData.bottleCount,
          locationAddress: templateData.locationAddress
        })
      };

    case UserActivityType.PickupRequestRejected:
      return {
        title: t('activities.pickupRequestRejected.title'),
        description: t('activities.pickupRequestRejected.description', {
          locationAddress: templateData.locationAddress
        })
      };

    case UserActivityType.PickupRequestCompleted:
      return {
        title: t('activities.pickupRequestCompleted.title'),
        description: t('activities.pickupRequestCompleted.description', {
          bottleCount: templateData.bottleCount,
          locationAddress: templateData.locationAddress
        })
      };

    // Transaction activities
    case UserActivityType.TransactionCompleted:
      // Role-based message selection
      if (templateData.role === 'owner') {
        return {
          title: t('activities.transactionCompleted.title'),
          description: t('activities.transactionCompleted.descriptionOwner', {
            locationAddress: templateData.locationAddress,
            ownerAmount: templateData.ownerAmount
          })
        };
      } else {
        return {
          title: t('activities.transactionCompleted.title'),
          description: t('activities.transactionCompleted.descriptionVolunteer', {
            volunteerAmount: templateData.volunteerAmount
          })
        };
      }

    // Rating activities
    case UserActivityType.RatingReceived:
      // Conditional description based on comment presence
      if (templateData.comment) {
        return {
          title: t('activities.ratingReceived.title'),
          description: t('activities.ratingReceived.descriptionWithComment', {
            ratingValue: templateData.ratingValue,
            raterName: templateData.raterName,
            comment: templateData.comment
          })
        };
      } else {
        return {
          title: t('activities.ratingReceived.title'),
          description: t('activities.ratingReceived.description', {
            ratingValue: templateData.ratingValue,
            raterName: templateData.raterName
          })
        };
      }

    // Fallback for unimplemented types
    default:
      return {
        title: t('activities.default.title'),
        description: t('activities.default.description', { type: activityKey })
      };
  }
}
