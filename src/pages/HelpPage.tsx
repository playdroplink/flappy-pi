
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Play, Coins, Trophy, HelpCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const HelpPage = () => {
  const faqs = [
    {
      question: "How do I play Flappy Pi?",
      answer: "Tap the screen to make your bird fly. Navigate through the pipes without crashing!"
    },
    {
      question: "How do I earn Pi coins?",
      answer: "Score points in the game, watch ads, or compete in weekly tournaments."
    },
    {
      question: "What are bird skins?",
      answer: "Cosmetic upgrades that change your bird's appearance. Buy them in the shop!"
    },
    {
      question: "How does the leaderboard work?",
      answer: "Your highest score is recorded and compared with other players worldwide."
    },
    {
      question: "Can I play offline?",
      answer: "Yes! You can play offline, but your scores won't be saved to the leaderboard."
    }
  ];

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
        <h1 className="text-2xl font-bold text-white">Help & FAQ</h1>
        <div className="w-16" />
      </div>

      {/* Quick Start Guide */}
      <Card className="mb-6 p-4 bg-white/95 backdrop-blur-sm">
        <h2 className="font-bold text-gray-800 mb-4 flex items-center">
          <Play className="h-5 w-5 mr-2" />
          Quick Start Guide
        </h2>
        <div className="space-y-3 text-sm text-gray-700">
          <div className="flex items-start space-x-2">
            <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">1</span>
            <span>Tap anywhere on the screen to make your bird flap its wings</span>
          </div>
          <div className="flex items-start space-x-2">
            <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">2</span>
            <span>Navigate through the gaps between pipes</span>
          </div>
          <div className="flex items-start space-x-2">
            <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">3</span>
            <span>Score points for each pipe you pass</span>
          </div>
          <div className="flex items-start space-x-2">
            <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">4</span>
            <span>Avoid hitting pipes, ground, or ceiling</span>
          </div>
        </div>
      </Card>

      {/* Game Features */}
      <Card className="mb-6 p-4 bg-white/95 backdrop-blur-sm">
        <h2 className="font-bold text-gray-800 mb-4">Game Features</h2>
        <div className="grid grid-cols-1 gap-3">
          <div className="flex items-center space-x-3">
            <Coins className="h-5 w-5 text-yellow-500" />
            <div>
              <div className="font-semibold text-gray-800">Pi Coins</div>
              <div className="text-sm text-gray-600">Earn and spend in-game currency</div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Trophy className="h-5 w-5 text-blue-500" />
            <div>
              <div className="font-semibold text-gray-800">Leaderboards</div>
              <div className="text-sm text-gray-600">Compete with players worldwide</div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <span className="text-lg">🐦</span>
            <div>
              <div className="font-semibold text-gray-800">Bird Skins</div>
              <div className="text-sm text-gray-600">Customize your bird's appearance</div>
            </div>
          </div>
        </div>
      </Card>

      {/* FAQ */}
      <div className="space-y-3 mb-8">
        <h2 className="text-xl font-bold text-white mb-4">Frequently Asked Questions</h2>
        {faqs.map((faq, index) => (
          <Card key={index} className="p-4 bg-white/95 backdrop-blur-sm">
            <div className="flex items-start space-x-3">
              <HelpCircle className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">{faq.question}</h3>
                <p className="text-sm text-gray-600">{faq.answer}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Contact Support */}
      <Card className="mb-8 p-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white">
        <div className="text-center">
          <h3 className="font-bold mb-2">Still Need Help?</h3>
          <p className="text-sm mb-4">Our support team is here to help!</p>
          <Link to="/contact">
            <Button className="bg-white text-green-600 hover:bg-gray-100">
              Contact Support
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default HelpPage;
