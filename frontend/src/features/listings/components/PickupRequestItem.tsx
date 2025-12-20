import { Button } from '@/shared/ui/button';
import { Badge } from '@/shared/ui/badge';
import {
  CheckCircle,
  Users,
  XCircle,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { PickupRequest } from '@/shared/types';

interface PickupRequestItemProps {
  request: PickupRequest;
  onAccept: (requestId: string) => void;
  onReject: (requestId: string) => void;
  isUpdating: boolean;
}

export const PickupRequestItem = ({
  request,
  onAccept,
  onReject,
  isUpdating,
}: PickupRequestItemProps) => {
  const { t } = useTranslation();

  return (
    <div className="bg-gray-50 rounded-lg p-3 space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Users className="w-4 h-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-900">
            {request.volunteerName || request.volunteerEmail}
          </span>
        </div>
        <Badge
          variant={
            request.status === 'pending'
              ? 'default'
              : request.status === 'accepted'
              ? 'secondary'
              : 'outline'
          }
          className={
            request.status === 'pending'
              ? 'bg-yellow-100 text-yellow-800'
              : request.status === 'accepted'
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          }
        >
          {t(`listing.${request.status}`)}
        </Badge>
      </div>

      {request.message && (
        <p className="text-xs text-gray-600 italic">"{request.message}"</p>
      )}

      {request.status === 'pending' && (
        <div className="flex gap-2 pt-2">
          <Button
            size="sm"
            className="flex-1 bg-green-600 hover:bg-green-700"
            onClick={() => onAccept(request.id)}
            disabled={isUpdating}
          >
            <CheckCircle className="w-3 h-3 mr-1" />
            {t('listing.accept')}
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="flex-1 border-red-300 text-red-700 hover:bg-red-50"
            onClick={() => onReject(request.id)}
            disabled={isUpdating}
          >
            <XCircle className="w-3 h-3 mr-1" />
            {t('listing.reject')}
          </Button>
        </div>
      )}
    </div>
  );
};
