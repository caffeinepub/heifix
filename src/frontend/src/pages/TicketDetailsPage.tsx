import { useParams, useNavigate } from '@tanstack/react-router';
import AuthGate from '../components/AuthGate';
import { useGetTicketDetails } from '../hooks/useTickets';
import TicketStatusBadge from '../components/TicketStatusBadge';
import StatusHistoryTimeline from '../components/StatusHistoryTimeline';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';
import { ArrowLeft, Loader2 } from 'lucide-react';

export default function TicketDetailsPage() {
  const { ticketId } = useParams({ from: '/ticket/$ticketId' });
  const navigate = useNavigate();
  const { data: ticket, isLoading, error } = useGetTicketDetails(ticketId ? BigInt(ticketId) : null);

  return (
    <AuthGate>
      <div className="container mx-auto px-4 py-12">
        <Button
          variant="ghost"
          onClick={() => navigate({ to: '/my-tickets' })}
          className="mb-6"
        >
          <ArrowLeft size={16} className="mr-2" />
          Back to My Tickets
        </Button>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="animate-spin text-primary" size={32} />
          </div>
        ) : error ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-destructive">Failed to load ticket details. Please try again.</p>
            </CardContent>
          </Card>
        ) : !ticket ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">Ticket not found.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Main Details */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-2xl">Ticket #{ticket.id.toString()}</CardTitle>
                      <CardDescription>
                        Created {format(new Date(Number(ticket.createdAt) / 1000000), 'MMMM d, yyyy')}
                      </CardDescription>
                    </div>
                    <TicketStatusBadge status={ticket.currentStatus} />
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Customer</h3>
                    <p className="text-foreground">{ticket.customerName}</p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Contact</h3>
                    <p className="text-foreground">{ticket.contactInfo}</p>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Device</h3>
                    <p className="text-foreground">
                      {ticket.deviceBrand} {ticket.deviceModel}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Issue Description</h3>
                    <p className="text-foreground">{ticket.issueDescription}</p>
                  </div>

                  {ticket.priceEstimate !== undefined && (
                    <>
                      <Separator />
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-1">Price Estimate</h3>
                        <p className="text-2xl font-bold text-foreground">
                          ${ticket.priceEstimate.toFixed(2)}
                        </p>
                      </div>
                    </>
                  )}

                  {ticket.technicianNotes && (
                    <>
                      <Separator />
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-1">Technician Notes</h3>
                        <p className="text-foreground">{ticket.technicianNotes}</p>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Status History */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Status History</CardTitle>
                  <CardDescription>Track your repair progress</CardDescription>
                </CardHeader>
                <CardContent>
                  <StatusHistoryTimeline history={ticket.statusHistory} />
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </AuthGate>
  );
}
