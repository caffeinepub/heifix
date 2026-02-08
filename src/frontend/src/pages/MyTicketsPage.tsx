import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import AuthGate from '../components/AuthGate';
import { useGetMyTickets } from '../hooks/useTickets';
import TicketStatusBadge from '../components/TicketStatusBadge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { format } from 'date-fns';
import { ArrowUpDown, Loader2 } from 'lucide-react';

export default function MyTicketsPage() {
  const navigate = useNavigate();
  const { data: tickets, isLoading } = useGetMyTickets();
  const [sortField, setSortField] = useState<'id' | 'createdAt'>('createdAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const handleSort = (field: 'id' | 'createdAt') => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const sortedTickets = tickets ? [...tickets].sort((a, b) => {
    const aVal = sortField === 'id' ? Number(a.id) : Number(a.createdAt);
    const bVal = sortField === 'id' ? Number(b.id) : Number(b.createdAt);
    return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
  }) : [];

  return (
    <AuthGate>
      <div className="container mx-auto px-4 py-12">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">My Repair Tickets</CardTitle>
            <CardDescription>
              View and track all your repair requests
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="animate-spin text-primary" size={32} />
              </div>
            ) : !tickets || tickets.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">You haven't created any repair requests yet.</p>
                <Button onClick={() => navigate({ to: '/create' })}>
                  Create Your First Request
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>
                        <button
                          onClick={() => handleSort('id')}
                          className="flex items-center gap-1 hover:text-foreground"
                        >
                          Ticket ID
                          <ArrowUpDown size={14} />
                        </button>
                      </TableHead>
                      <TableHead>Device</TableHead>
                      <TableHead>Issue</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>
                        <button
                          onClick={() => handleSort('createdAt')}
                          className="flex items-center gap-1 hover:text-foreground"
                        >
                          Created
                          <ArrowUpDown size={14} />
                        </button>
                      </TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedTickets.map((ticket) => {
                      const date = new Date(Number(ticket.createdAt) / 1000000);
                      return (
                        <TableRow key={ticket.id.toString()}>
                          <TableCell className="font-medium">#{ticket.id.toString()}</TableCell>
                          <TableCell>
                            {ticket.deviceBrand} {ticket.deviceModel}
                          </TableCell>
                          <TableCell className="max-w-xs truncate">
                            {ticket.issueDescription}
                          </TableCell>
                          <TableCell>
                            <TicketStatusBadge status={ticket.currentStatus} />
                          </TableCell>
                          <TableCell>{format(date, 'MMM d, yyyy')}</TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => navigate({ to: '/ticket/$ticketId', params: { ticketId: ticket.id.toString() } })}
                            >
                              View Details
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AuthGate>
  );
}
