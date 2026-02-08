import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { RepairTicket, TicketStatus } from '../backend';

export function useCreateTicket() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      customerName: string;
      contactInfo: string;
      deviceBrand: string;
      deviceModel: string;
      issueDescription: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createTicket(
        data.customerName,
        data.contactInfo,
        data.deviceBrand,
        data.deviceModel,
        data.issueDescription
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myTickets'] });
      queryClient.invalidateQueries({ queryKey: ['allTickets'] });
    },
  });
}

export function useGetMyTickets() {
  const { actor, isFetching } = useActor();

  return useQuery<RepairTicket[]>({
    queryKey: ['myTickets'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getMyTickets();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetTicketDetails(ticketId: bigint | null) {
  const { actor, isFetching } = useActor();

  return useQuery<RepairTicket>({
    queryKey: ['ticketDetails', ticketId?.toString()],
    queryFn: async () => {
      if (!actor || ticketId === null) throw new Error('Actor or ticket ID not available');
      return actor.getTicketDetails(ticketId);
    },
    enabled: !!actor && !isFetching && ticketId !== null,
  });
}

export function useGetAllTickets() {
  const { actor, isFetching } = useActor();

  return useQuery<RepairTicket[]>({
    queryKey: ['allTickets'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getAllTickets();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useUpdateTicketStatus() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      ticketId: bigint;
      newStatus: TicketStatus;
      notes: string | null;
      priceEstimate: number | null;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateTicketStatus(
        data.ticketId,
        data.newStatus,
        data.notes,
        data.priceEstimate
      );
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['ticketDetails', variables.ticketId.toString()] });
      queryClient.invalidateQueries({ queryKey: ['allTickets'] });
      queryClient.invalidateQueries({ queryKey: ['myTickets'] });
    },
  });
}
