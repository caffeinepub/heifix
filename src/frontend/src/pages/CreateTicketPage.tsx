import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import AuthGate from '../components/AuthGate';
import { useCreateTicket } from '../hooks/useTickets';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2 } from 'lucide-react';

export default function CreateTicketPage() {
  const navigate = useNavigate();
  const createTicket = useCreateTicket();
  const [formData, setFormData] = useState({
    customerName: '',
    contactInfo: '',
    deviceBrand: '',
    deviceModel: '',
    issueDescription: '',
  });
  const [createdTicketId, setCreatedTicketId] = useState<bigint | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.customerName.trim()) {
      alert('Please enter your name');
      return;
    }
    if (!formData.contactInfo.trim()) {
      alert('Please enter your contact information');
      return;
    }
    if (!formData.deviceBrand.trim()) {
      alert('Please enter the device brand');
      return;
    }
    if (!formData.deviceModel.trim()) {
      alert('Please enter the device model');
      return;
    }
    if (!formData.issueDescription.trim()) {
      alert('Please describe the issue');
      return;
    }

    try {
      const ticketId = await createTicket.mutateAsync(formData);
      setCreatedTicketId(ticketId);
    } catch (error) {
      console.error('Failed to create ticket:', error);
      alert('Failed to create repair request. Please try again.');
    }
  };

  if (createdTicketId !== null) {
    return (
      <AuthGate>
        <div className="container mx-auto px-4 py-12">
          <Card className="max-w-2xl mx-auto">
            <CardHeader className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="text-primary" size={32} />
              </div>
              <CardTitle className="text-2xl">Repair Request Created!</CardTitle>
              <CardDescription>
                Your ticket has been successfully submitted
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-muted rounded-lg p-4 text-center">
                <p className="text-sm text-muted-foreground mb-1">Ticket ID</p>
                <p className="text-2xl font-bold text-foreground">#{createdTicketId.toString()}</p>
              </div>
              <p className="text-sm text-muted-foreground text-center">
                We'll review your request and contact you shortly with an estimate.
                You can track the status of your repair in "My Tickets".
              </p>
              <div className="flex gap-3 justify-center pt-4">
                <Button variant="outline" onClick={() => navigate({ to: '/my-tickets' })}>
                  View My Tickets
                </Button>
                <Button onClick={() => {
                  setCreatedTicketId(null);
                  setFormData({
                    customerName: '',
                    contactInfo: '',
                    deviceBrand: '',
                    deviceModel: '',
                    issueDescription: '',
                  });
                }}>
                  Create Another
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </AuthGate>
    );
  }

  return (
    <AuthGate>
      <div className="container mx-auto px-4 py-12">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl">New Repair Request</CardTitle>
            <CardDescription>
              Fill out the form below to submit your device for repair
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="customerName">Your Name *</Label>
                <Input
                  id="customerName"
                  value={formData.customerName}
                  onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                  placeholder="John Doe"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contactInfo">Contact Information *</Label>
                <Input
                  id="contactInfo"
                  value={formData.contactInfo}
                  onChange={(e) => setFormData({ ...formData, contactInfo: e.target.value })}
                  placeholder="Email or phone number"
                  required
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="deviceBrand">Device Brand *</Label>
                  <Input
                    id="deviceBrand"
                    value={formData.deviceBrand}
                    onChange={(e) => setFormData({ ...formData, deviceBrand: e.target.value })}
                    placeholder="e.g., Apple, Samsung"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="deviceModel">Device Model *</Label>
                  <Input
                    id="deviceModel"
                    value={formData.deviceModel}
                    onChange={(e) => setFormData({ ...formData, deviceModel: e.target.value })}
                    placeholder="e.g., iPhone 14, Galaxy S23"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="issueDescription">Issue Description *</Label>
                <Textarea
                  id="issueDescription"
                  value={formData.issueDescription}
                  onChange={(e) => setFormData({ ...formData, issueDescription: e.target.value })}
                  placeholder="Describe the problem with your device..."
                  rows={5}
                  required
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate({ to: '/' })}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={createTicket.isPending}
                  className="flex-1"
                >
                  {createTicket.isPending ? 'Submitting...' : 'Submit Request'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </AuthGate>
  );
}
