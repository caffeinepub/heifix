import { StatusLog } from '../backend';
import TicketStatusBadge from './TicketStatusBadge';
import { format } from 'date-fns';

interface StatusHistoryTimelineProps {
  history: StatusLog[];
}

export default function StatusHistoryTimeline({ history }: StatusHistoryTimelineProps) {
  // Sort by timestamp descending (newest first)
  const sortedHistory = [...history].sort((a, b) => Number(b.timestamp - a.timestamp));

  return (
    <div className="space-y-4">
      {sortedHistory.map((log, index) => {
        const date = new Date(Number(log.timestamp) / 1000000); // Convert nanoseconds to milliseconds
        
        return (
          <div key={index} className="flex gap-4">
            <div className="flex flex-col items-center">
              <div className="w-3 h-3 rounded-full bg-primary" />
              {index < sortedHistory.length - 1 && (
                <div className="w-0.5 h-full bg-border mt-2" />
              )}
            </div>
            <div className="flex-1 pb-6">
              <div className="flex items-center gap-2 mb-1">
                <TicketStatusBadge status={log.status} />
                <span className="text-sm text-muted-foreground">
                  {format(date, 'MMM d, yyyy h:mm a')}
                </span>
              </div>
              {log.notes && (
                <p className="text-sm text-muted-foreground mt-2">{log.notes}</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
