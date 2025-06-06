import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ArrowLeft, Mail, MessageSquare, Send, Globe, Users, HelpCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import EnhancedFooter from '@/components/EnhancedFooter';

const ContactPage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name || !formData.email || !formData.message) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    // Simulate form submission
    toast({
      title: "Message Sent!",
      description: "Thank you for contacting us. We'll get back to you soon.",
    });

    // Reset form
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="fixed inset-0 w-full h-full flex flex-col">
      <ScrollArea className="flex-1">
        <div className="min-h-screen bg-gradient-to-br from-sky-400 via-cyan-400 to-blue-500 p-4">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex items-center space-x-4 mb-6 flex-shrink-0">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(-1)}
                className="text-white hover:bg-white/20"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div className="flex items-center space-x-2">
                <Mail className="h-6 w-6 text-white" />
                <h1 className="text-2xl font-bold text-white">Contact Us</h1>
              </div>
            </div>

            {/* Content */}
            <div className="space-y-6 pr-4">
              {/* Contact Form */}
              <Card className="p-6 bg-white/95 backdrop-blur-sm">
                <div className="text-center mb-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-2">Get in Touch</h2>
                  <p className="text-gray-600">We'd love to hear from you! Send us a message.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Name *
                      </label>
                      <Input
                        type="text"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        placeholder="Your name"
                        required
                        className="bg-white border-gray-300 text-gray-900"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email *
                      </label>
                      <Input
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        placeholder="your@email.com"
                        required
                        className="bg-white border-gray-300 text-gray-900"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Subject
                    </label>
                    <Input
                      type="text"
                      value={formData.subject}
                      onChange={(e) => handleInputChange('subject', e.target.value)}
                      placeholder="What's this about?"
                      className="bg-white border-gray-300 text-gray-900"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Message *
                    </label>
                    <Textarea
                      value={formData.message}
                      onChange={(e) => handleInputChange('message', e.target.value)}
                      placeholder="Tell us what's on your mind..."
                      rows={5}
                      required
                      className="bg-white border-gray-300 text-gray-900"
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700"
                  >
                    <Send className="mr-2 h-4 w-4" />
                    Send Message
                  </Button>
                </form>
              </Card>

              {/* Contact Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="p-4 bg-white/90 backdrop-blur-sm">
                  <div className="flex items-center space-x-3">
                    <Mail className="h-6 w-6 text-blue-600" />
                    <div>
                      <h3 className="font-semibold text-gray-800">Email Support</h3>
                      <p className="text-sm text-gray-600">support@mrwain.org</p>
                    </div>
                  </div>
                </Card>

                <Card className="p-4 bg-white/90 backdrop-blur-sm">
                  <div className="flex items-center space-x-3">
                    <Globe className="h-6 w-6 text-green-600" />
                    <div>
                      <h3 className="font-semibold text-gray-800">Website</h3>
                      <p className="text-sm text-gray-600">mrwain.org</p>
                    </div>
                  </div>
                </Card>
              </div>

              {/* FAQ Section */}
              <Card className="p-6 bg-white/95 backdrop-blur-sm">
                <div className="flex items-center space-x-2 mb-4">
                  <HelpCircle className="h-6 w-6 text-blue-600" />
                  <h3 className="text-xl font-bold text-gray-800">Contact FAQ</h3>
                </div>
                
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1" className="border-gray-200">
                    <AccordionTrigger className="text-gray-800">How quickly will you respond to my message?</AccordionTrigger>
                    <AccordionContent className="text-gray-600">
                      We typically respond within 24-48 hours during business days. For urgent technical issues, we aim to respond within 4-6 hours.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-2" className="border-gray-200">
                    <AccordionTrigger className="text-gray-800">What information should I include for bug reports?</AccordionTrigger>
                    <AccordionContent className="text-gray-600">
                      Please include your device type, browser version, a description of what happened, what you expected to happen, and steps to reproduce the issue if possible.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-3" className="border-gray-200">
                    <AccordionTrigger className="text-gray-800">Can you help with Pi Network payment issues?</AccordionTrigger>
                    <AccordionContent className="text-gray-600">
                      We can help with issues within our game, but Pi Network wallet or transaction problems should be directed to Pi Network support first.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-4" className="border-gray-200">
                    <AccordionTrigger className="text-gray-800">Do you offer phone support?</AccordionTrigger>
                    <AccordionContent className="text-gray-600">
                      Currently, we only offer email support. This allows us to better track issues and provide detailed responses with screenshots when needed.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </Card>

              {/* Community Links */}
              <Card className="p-6 bg-white/90 backdrop-blur-sm">
                <div className="text-center">
                  <Users className="h-8 w-8 text-purple-600 mx-auto mb-3" />
                  <h3 className="font-semibold text-gray-800 mb-2">Join Our Community</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Connect with other Flappy Pi players and stay updated on the latest features.
                  </p>
                  <div className="text-xs text-gray-500">
                    Community features coming soon!
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
        
        {/* Enhanced Footer */}
        <EnhancedFooter />
      </ScrollArea>
    </div>
  );
};

export default ContactPage;
