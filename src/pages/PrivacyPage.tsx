
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

const PrivacyPage = () => {
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
        <h1 className="text-2xl font-bold text-white">Privacy Policy</h1>
        <div className="w-16" />
      </div>

      {/* Privacy Content */}
      <Card className="mb-8 p-6 bg-white/95 backdrop-blur-sm">
        <div className="text-center mb-6">
          <Shield className="h-12 w-12 mx-auto mb-3 text-blue-500" />
          <h2 className="text-xl font-bold text-gray-800">Your Privacy Matters</h2>
          <p className="text-sm text-gray-600">Last updated: January 2025</p>
        </div>

        <div className="space-y-6 text-sm text-gray-700">
          <section>
            <h3 className="font-bold text-gray-800 mb-2">Information We Collect</h3>
            <ul className="list-disc list-inside space-y-1">
              <li>Game scores and statistics</li>
              <li>Pi Network user ID (when connected)</li>
              <li>Device information for optimal gameplay</li>
              <li>Usage analytics to improve the game</li>
            </ul>
          </section>

          <section>
            <h3 className="font-bold text-gray-800 mb-2">How We Use Your Information</h3>
            <ul className="list-disc list-inside space-y-1">
              <li>Provide and improve game features</li>
              <li>Maintain leaderboards and statistics</li>
              <li>Process Pi Network transactions</li>
              <li>Send important game updates</li>
            </ul>
          </section>

          <section>
            <h3 className="font-bold text-gray-800 mb-2">Data Security</h3>
            <p>
              We implement industry-standard security measures to protect your data. 
              All Pi Network transactions are processed securely through Pi's official APIs.
            </p>
          </section>

          <section>
            <h3 className="font-bold text-gray-800 mb-2">Third-Party Services</h3>
            <ul className="list-disc list-inside space-y-1">
              <li>Pi Network for authentication and payments</li>
              <li>Analytics services for game improvement</li>
              <li>Ad networks for optional rewarded ads</li>
            </ul>
          </section>

          <section>
            <h3 className="font-bold text-gray-800 mb-2">Your Rights</h3>
            <ul className="list-disc list-inside space-y-1">
              <li>Access your personal data</li>
              <li>Request data deletion</li>
              <li>Opt out of analytics</li>
              <li>Contact us with privacy concerns</li>
            </ul>
          </section>

          <section>
            <h3 className="font-bold text-gray-800 mb-2">Contact Us</h3>
            <p>
              If you have questions about this Privacy Policy, please contact us at:
              <br />
              <strong>supportmrwainorganization@gmail.com</strong>
            </p>
          </section>
        </div>
      </Card>

      {/* Contact Support */}
      <Card className="mb-8 p-4 bg-gradient-to-r from-blue-500 to-cyan-600 text-white text-center">
        <h3 className="font-bold mb-2">Questions About Privacy?</h3>
        <p className="text-sm mb-4">We're here to help protect your data</p>
        <Link to="/contact">
          <Button className="bg-white text-blue-600 hover:bg-gray-100">
            Contact Support
          </Button>
        </Link>
      </Card>
    </div>
  );
};

export default PrivacyPage;
