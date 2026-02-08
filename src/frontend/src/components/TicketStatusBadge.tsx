import { Badge } from '@/components/ui/badge';
import { TicketStatus } from '../backend';

interface TicketStatusBadgeProps {
  status: TicketStatus;
}

export default function TicketStatusBadge({ status }: TicketStatusBadgeProps) {
  const getStatusConfig = (status: TicketStatus) => {
    switch (status) {
      case TicketStatus.new_:
        return { label: 'New', variant: 'default' as const };
      case TicketStatus.inProgress:
        return { label: 'In Progress', variant: 'secondary' as const };
      case TicketStatus.waitingForParts:
        return { label: 'Waiting for Parts', variant: 'outline' as const };
      case TicketStatus.ready:
        return { label: 'Ready', variant: 'default' as const };
      case TicketStatus.closed:
        return { label: 'Closed', variant: 'secondary' as const };
      default:
        return { label: 'Unknown', variant: 'outline' as const };
    }
  };

  const config = getStatusConfig(status);

  return <Badge variant={config.variant}>{config.label}</Badge>;
}
