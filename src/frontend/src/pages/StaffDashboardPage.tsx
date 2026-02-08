import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import AuthGate from '../components/AuthGate';
import { useGetAllTickets, useUpdateTicketStatus } from '../hooks/useTickets';
import { useIsCallerAdmin } from '../hooks/useRole';
import TicketStatusBadge from '../components/TicketStatusBadge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { format } from 'date-fns';
import { Loader2, AlertCircle } from 'lucide-react';
import { TicketStatus, RepairTicket } from '../backend';

export default function StaffDashboardPage() {
  const navigate = useNavigate();
  const { data: isAdmin, isLoading: isLoadingAdmin } = useIsCallerAdmin();
  const { data: tickets, isLoading: isLoadingTickets } = useGetAllTickets();
  const updateTicket = useUpdateTicketStatus();

  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [editingTicket, setEditingTicket] = useState<RepairTicket | null>(null);
  const [updateForm, setUpdateForm] = useState({
    status: '' as TicketStatus | '',
    notes: '',
    priceEstimate: '',
  });

  const handleEditClick = (ticket: RepairTicket) => {
    setEditingTicket(ticket);
    setUpdateForm({
      status: ticket.currentStatus,
      notes: ticket.technicianNotes || '',
      priceEstimate: ticket.priceEstimate?.toString() || '',
    });
  };

  const handleUpdateSubmit = async () => {
    if (!editingTicket || !updateForm.status) return;

    try {
      await updateTicket.mutateAsync({
        ticketId: editingTicket.id,
        newStatus: updateForm.status,
        notes: updateForm.notes.trim() || null,
        priceEstimate: updateForm.priceEstimate ? parseFloat(updateForm.priceEstimate) : null,
      });
      setEditingTicket(null);
    } catch (error) {
      console.error('Failed to update ticket:', error);
      alert('Failed to update ticket. Please try again.');
    }
  };

  const filteredTickets = tickets
    ? tickets.filter((ticket) => filterStatus === 'all' || ticket.currentStatus === filterStatus)
    : [];

  if (isLoadingAdmin) {
    return (
      <AuthGate>
        <div className="container mx-auto px-4 py-12">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="animate-spin text-primary" size={32} />
          </div>
        </div>
      </AuthGate>
    );
  }

  if (!isAdmin) {
    return (
      <AuthGate>
        <div className="container mx-auto px-4 py-12">
          <Card className="max-w-md mx-auto">
            <CardContent className="py-12 text-center">
              <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="text-destructive" size={32} />
              </div>
              <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
              <p className="text-muted-foreground mb-6">
                You don't have permission to access the staff dashboard.
              </p>
              <Button onClick={() => navigate({ to: '/' })}>
                Return to Home
              </Button>
            </CardContent>
          </Card>
        </div>
      </AuthGate>
    );
  }

  return (
    <AuthGate>
      <div className="container mx-auto px-4 py-12">
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-2xl">Staff Dashboard</CardTitle>
                <CardDescription>Manage all repair tickets</CardDescription>
              </div>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Tickets</SelectItem>
                  <SelectItem value={TicketStatus.new_}>New</SelectItem>
                  <SelectItem value={TicketStatus.inProgress}>In Progress</SelectItem>
                  <SelectItem value={TicketStatus.waitingForParts}>Waiting for Parts</SelectItem>
                  <SelectItem value={TicketStatus.ready}>Ready</SelectItem>
                  <SelectItem value={TicketStatus.closed}>Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            {isLoadingTickets ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="animate-spin text-primary" size={32} />
              </div>
            ) : !tickets || tickets.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No tickets found.</p>
              </div>
            ) : filteredTickets.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No tickets match the selected filter.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Device</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Estimate</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTickets.map((ticket) => {
                      const date = new Date(Number(ticket.createdAt) / 1000000);
                      return (
                        <TableRow key={ticket.id.toString()}>
                          <TableCell className="font-medium">#{ticket.id.toString()}</TableCell>
                          <TableCell>{ticket.customerName}</TableCell>
                          <TableCell>
                            {ticket.deviceBrand} {ticket.deviceModel}
                          </TableCell>
                          <TableCell>
                            <TicketStatusBadge status={ticket.currentStatus} />
                          </TableCell>
                          <TableCell>{format(date, 'MMM d, yyyy')}</TableCell>
                          <TableCell>
                            {ticket.priceEstimate ? `$${ticket.priceEstimate.toFixed(2)}` : '-'}
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => navigate({ to: '/ticket/$ticketId', params: { ticketId: ticket.id.toString() } })}
                              >
                                View
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEditClick(ticket)}
                              >
                                Update
                              </Button>
                            </div>
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

        {/* Update Dialog */}
        <Dialog open={!!editingTicket} onOpenChange={(open) => !open && setEditingTicket(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Update Ticket #{editingTicket?.id.toString()}</DialogTitle>
              <DialogDescription>
                Update the status, estimate, and notes for this repair ticket
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={updateForm.status}
                  onValueChange={(value) => setUpdateForm({ ...updateForm, status: value as TicketStatus })}
                >
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={TicketStatus.new_}>New</SelectItem>
                    <SelectItem value={TicketStatus.inProgress}>In Progress</SelectItem>
                    <SelectItem value={TicketStatus.waitingForParts}>Waiting for Parts</SelectItem>
                    <SelectItem value={TicketStatus.ready}>Ready</SelectItem>
                    <SelectItem value={TicketStatus.closed}>Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="priceEstimate">Price Estimate ($)</Label>
                <Input
                  id="priceEstimate"
                  type="number"
                  step="0.01"
                  value={updateForm.priceEstimate}
                  onChange={(e) => setUpdateForm({ ...updateForm, priceEstimate: e.target.value })}
                  placeholder="0.00"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Technician Notes</Label>
                <Textarea
                  id="notes"
                  value={updateForm.notes}
                  onChange={(e) => setUpdateForm({ ...updateForm, notes: e.target.value })}
                  placeholder="Add notes about the repair..."
                  rows={4}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditingTicket(null)}>
                Cancel
              </Button>
              <Button onClick={handleUpdateSubmit} disabled={updateTicket.isPending || !updateForm.status}>
                {updateTicket.isPending ? 'Updating...' : 'Update Ticket'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AuthGate>
  );
}
