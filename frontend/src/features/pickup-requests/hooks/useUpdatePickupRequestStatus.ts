import { useMutation, useQueryClient } from '@tanstack/react-query';
import { pickupRequestService } from '@/features/pickup-requests/api';
import { useToast } from '@/shared/ui/use-toast';
import { t } from 'i18next';

export const useUpdatePickupRequestStatus = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({
      requestId,
      status,
    }: {
      requestId: string;
      status: 'accepted' | 'rejected' | 'completed' | 'cancelled';
    }) => pickupRequestService.updateStatus(requestId, status),
    onSuccess: (_, variables) => {
      // Invalidate queries to refetch data
      queryClient.invalidateQueries({ queryKey: ['pickupRequests'] });
      queryClient.invalidateQueries({ queryKey: ['bottleListings'] });
      queryClient.invalidateQueries({ queryKey: ['my-listings'] });
      
      toast({
        title: t('pickupRequests.statusUpdateSuccessTitle'),
        description: t('pickupRequests.statusUpdateSuccessDescription', { status: variables.status }),
      });
    },
    onError: (error: any) => {
      toast({
        title: t('pickupRequests.statusUpdateErrorTitle'),
        description: error.message || t('pickupRequests.statusUpdateErrorDescription'),
        variant: 'destructive',
      });
    },
  });
};
