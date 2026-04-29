import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import { ArrowLeft, Mail, Send, Ticket } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

const AskExpert = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-6 py-8">
        <Link to="/">
          <Button variant="ghost" size="sm" className="gap-2 mb-4">
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Button>
        </Link>
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-foreground mb-2">Ask An Expert</h1>
          <p className="text-muted-foreground">Get help and support from the AI team</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Mail className="w-5 h-5 text-primary" />
                Contact AI Team
              </CardTitle>
              <CardDescription>
                Send a message directly to our AI experts
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input id="subject" placeholder="What do you need help with?" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea id="message" placeholder="Describe your question or issue..." rows={5} />
              </div>
              <Button className="w-full gap-2">
                <Send className="w-4 h-4" />
                Send Message
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Ticket className="w-5 h-5 text-accent" />
                Create Support Ticket
              </CardTitle>
              <CardDescription>
                Generate a support ticket for tracking
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="ticket-title">Ticket Title</Label>
                <Input id="ticket-title" placeholder="Brief description of the issue" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ticket-description">Description</Label>
                <Textarea id="ticket-description" placeholder="Provide detailed information..." rows={5} />
              </div>
              <Button variant="secondary" className="w-full gap-2">
                <Ticket className="w-4 h-4" />
                Create Ticket
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default AskExpert;
