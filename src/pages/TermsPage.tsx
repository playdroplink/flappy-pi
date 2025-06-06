
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';

const TermsPage = () => {
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
        <h1 className="text-2xl font-bold text-white">Terms of Service</h1>
        <div className="w-16" />
      </div>

      {/* Terms Content */}
      <Card className="mb-8 p-6 bg-white/95 backdrop-blur-sm">
        <div className="text-center mb-6">
          <FileText className="h-12 w-12 mx-auto mb-3 text-blue-500" />
          <h2 className="text-xl font-bold text-gray-800">Terms of Service</h2>
          <p className="text-sm text-gray-600">Last updated: January 2025</p>
        </div>

        <div className="space-y-6 text-sm text-gray-700">
          <section>
            <h3 className="font-bold text-gray-800 mb-2">1. Acceptance of Terms</h3>
            <p>
              By playing Flappy Pi, you agree to these Terms of Service and our Privacy Policy. 
              If you don't agree with these terms, please don't use our game.
            </p>
          </section>

          <section>
            <h3 className="font-bold text-gray-800 mb-2">2. Game Rules</h3>
            <ul className="list-disc list-inside space-y-1">
              <li>Play fairly and don't use cheats or hacks</li>
              <li>Don't attempt to manipulate scores or leaderboards</li>
              <li>Respect other players in the community</li>
              <li>Don't share offensive content or usernames</li>
            </ul>
          </section>

          <section>
            <h3 className="font-bold text-gray-800 mb-2">3. Pi Network Integration</h3>
            <p>
              Flappy Pi integrates with Pi Network for authentication and payments. 
              All Pi transactions are subject to Pi Network's terms and conditions.
            </p>
          </section>

          <section>
            <h3 className="font-bold text-gray-800 mb-2">4. Virtual Currency</h3>
            <ul className="list-disc list-inside space-y-1">
              <li>Pi coins earned in-game have no real-world value</li>
              <li>We may adjust game economy balancing as needed</li>
              <li>Virtual purchases are final and non-refundable</li>
              <li>Account closure may result in loss of virtual items</li>
            </ul>
          </section>

          <section>
            <h3 className="font-bold text-gray-800 mb-2">5. Intellectual Property</h3>
            <p>
              Flappy Pi is owned by MRWAIN ORGANIZATION. All game assets, code, and content 
              are protected by copyright and trademark laws.
            </p>
          </section>

          <section>
            <h3 className="font-bold text-gray-800 mb-2">6. Limitation of Liability</h3>
            <p>
              We provide Flappy Pi "as is" without warranties. We're not liable for 
              any damages arising from game use, including device issues or data loss.
            </p>
          </section>

          <section>
            <h3 className="font-bold text-gray-800 mb-2">7. Account Termination</h3>
            <p>
              We may suspend or terminate accounts that violate these terms, 
              engage in cheating, or disrupt the gaming experience for others.
            </p>
          </section>

          <section>
            <h3 className="font-bold text-gray-800 mb-2">8. Updates to Terms</h3>
            <p>
              We may update these terms occasionally. Continued use of the game 
              after updates means you accept the new terms.
            </p>
          </section>

          <section>
            <h3 className="font-bold text-gray-800 mb-2">9. Contact Information</h3>
            <p>
              For questions about these terms, contact us at:
              <br />
              <strong>supportmrwainorganization@gmail.com</strong>
            </p>
          </section>
        </div>
      </Card>

      {/* Contact Support */}
      <Card className="mb-8 p-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-center">
        <h3 className="font-bold mb-2">Need Clarification?</h3>
        <p className="text-sm mb-4">We're happy to explain our terms</p>
        <Link to="/contact">
          <Button className="bg-white text-green-600 hover:bg-gray-100">
            Contact Support
          </Button>
        </Link>
      </Card>
    </div>
  );
};

export default TermsPage;
