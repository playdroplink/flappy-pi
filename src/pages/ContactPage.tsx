
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Mail, MessageCircle, Send } from 'lucide-react';
import { Link } from 'react-router-dom';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Contact form submitted:', formData);
  };

  return (
    <div className="min-h-screen p-4 pt-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <Link to="/home">
          <Button variant="ghost" size="sm" className="text-white hover:text-white hover:bg-white/20">
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back
          </Button>
        </Link>
        <h1 className="text-2xl font-bold text-white">Contact Us</h1>
        <div className="w-16" />
      </div>

      {/* Contact Info */}
      <Card className="mb-6 p-4 bg-white/95 backdrop-blur-sm">
        <div className="text-center mb-4">
          <Mail className="h-8 w-8 mx-auto mb-2 text-blue-500" />
          <h2 className="font-bold text-gray-800">Get in Touch</h2>
          <p className="text-sm text-gray-600">We'd love to hear from you!</p>
        </div>
        
        <div className="space-y-3 text-sm">
          <div className="flex items-center space-x-3">
            <Mail className="h-4 w-4 text-gray-500" />
            <span className="text-gray-700">supportmrwainorganization@gmail.com</span>
          </div>
          <div className="flex items-center space-x-3">
            <MessageCircle className="h-4 w-4 text-gray-500" />
            <span className="text-gray-700">Pi Network DM: @flappypi</span>
          </div>
        </div>
      </Card>

      {/* Contact Form */}
      <Card className="mb-8 p-4 bg-white/95 backdrop-blur-sm">
        <h3 className="font-bold text-gray-800 mb-4">Send us a Message</h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <Input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({...prev, name: e.target.value}))}
              placeholder="Your name"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({...prev, email: e.target.value}))}
              placeholder="your.email@example.com"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Subject
            </label>
            <Input
              type="text"
              value={formData.subject}
              onChange={(e) => setFormData(prev => ({...prev, subject: e.target.value}))}
              placeholder="What's this about?"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Message
            </label>
            <Textarea
              value={formData.message}
              onChange={(e) => setFormData(prev => ({...prev, message: e.target.value}))}
              placeholder="Tell us more..."
              rows={5}
              required
            />
          </div>
          
          <Button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white">
            <Send className="h-4 w-4 mr-2" />
            Send Message
          </Button>
        </form>
      </Card>

      {/* Quick Links */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <Link to="/help">
          <Card className="p-4 bg-white/95 backdrop-blur-sm text-center hover:shadow-lg transition-shadow">
            <div className="text-2xl mb-2">❓</div>
            <div className="font-semibold text-gray-800 text-sm">FAQ</div>
          </Card>
        </Link>
        <Link to="/terms">
          <Card className="p-4 bg-white/95 backdrop-blur-sm text-center hover:shadow-lg transition-shadow">
            <div className="text-2xl mb-2">📋</div>
            <div className="font-semibold text-gray-800 text-sm">Terms</div>
          </Card>
        </Link>
      </div>
    </div>
  );
};

export default ContactPage;
