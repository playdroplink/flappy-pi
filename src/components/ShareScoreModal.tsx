
import React, { useRef, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Share2, Download, Copy, X, Trophy, Star } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ShareScoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  score: number;
  level: number;
  highScore: number;
  selectedBirdSkin: string;
}

const ShareScoreModal: React.FC<ShareScoreModalProps> = ({
  isOpen,
  onClose,
  score,
  level,
  highScore,
  selectedBirdSkin
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const getBirdImageUrl = (skinId: string) => {
    const birdSkins = {
      default: '/lovable-uploads/3a780914-6faf-4deb-81ab-ce1f4b059984.png',
      gold: '/lovable-uploads/5a55528e-3d0c-4cd3-91d9-6b8cff953b06.png',
      diamond: '/lovable-uploads/616a87a7-bd9c-414f-a05b-09c6f7a38ef9.png',
      rainbow: '/lovable-uploads/8ad9f53d-d0aa-4231-9042-d1890a6f997f.png',
      cosmic: '/lovable-uploads/b2ccab90-dff7-4e09-9564-3cdd075c6793.png'
    };
    return birdSkins[skinId as keyof typeof birdSkins] || birdSkins.default;
  };

  const generateScoreImage = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = 400;
    canvas.height = 600;

    // Create gradient background
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#0ea5e9');
    gradient.addColorStop(1, '#0284c7');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Add decorative elements
    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
    for (let i = 0; i < 6; i++) {
      ctx.beginPath();
      ctx.arc(50 + i * 60, 100 + i * 30, 20 + i * 5, 0, Math.PI * 2);
      ctx.fill();
    }

    // Title
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 36px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Flappy Pi', canvas.width / 2, 80);

    // Load and draw bird image
    try {
      const birdImg = new Image();
      birdImg.crossOrigin = 'anonymous';
      
      await new Promise((resolve, reject) => {
        birdImg.onload = resolve;
        birdImg.onerror = reject;
        birdImg.src = getBirdImageUrl(selectedBirdSkin);
      });

      // Draw bird image in top section
      const birdSize = 60;
      ctx.drawImage(birdImg, (canvas.width - birdSize) / 2, 110, birdSize, birdSize);
    } catch (error) {
      console.error('Failed to load bird image:', error);
      // Draw a simple circle as fallback
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.arc(canvas.width / 2, 140, 30, 0, Math.PI * 2);
      ctx.fill();
    }

    // Score display
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.fillRect(50, 200, canvas.width - 100, 120);
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 3;
    ctx.strokeRect(50, 200, canvas.width - 100, 120);

    ctx.fillStyle = '#0284c7';
    ctx.font = 'bold 24px Arial';
    ctx.fillText('Your Score', canvas.width / 2, 230);

    ctx.font = 'bold 48px Arial';
    ctx.fillStyle = '#1d4ed8';
    ctx.fillText(score.toString(), canvas.width / 2, 280);

    // Stats
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.fillRect(50, 350, canvas.width - 100, 150);
    ctx.strokeRect(50, 350, canvas.width - 100, 150);

    ctx.fillStyle = '#0284c7';
    ctx.font = 'bold 20px Arial';
    ctx.fillText('Level Reached', canvas.width / 2, 380);
    ctx.font = 'bold 32px Arial';
    ctx.fillStyle = '#16a34a';
    ctx.fillText(level.toString(), canvas.width / 2, 415);

    ctx.fillStyle = '#0284c7';
    ctx.font = 'bold 20px Arial';
    ctx.fillText('Best Score', canvas.width / 2, 450);
    ctx.font = 'bold 32px Arial';
    ctx.fillStyle = '#eab308';
    ctx.fillText(highScore.toString(), canvas.width / 2, 485);

    // Footer
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 18px Arial';
    ctx.fillText('Join the Pi Network gaming revolution!', canvas.width / 2, 540);
    ctx.font = '16px Arial';
    ctx.fillText('Powered by mrwain organization', canvas.width / 2, 570);
  };

  const handleShare = async () => {
    setIsGenerating(true);
    await generateScoreImage();
    
    const canvas = canvasRef.current;
    if (!canvas) return;

    try {
      canvas.toBlob(async (blob) => {
        if (blob && navigator.share) {
          const file = new File([blob], 'flappy-pi-score.png', { type: 'image/png' });
          await navigator.share({
            title: `I scored ${score} points in Flappy Pi!`,
            text: `Just scored ${score} points in Flappy Pi with my ${selectedBirdSkin} bird! Can you beat my score? 🎮`,
            files: [file]
          });
        } else {
          // Fallback for browsers without Web Share API
          const url = canvas.toDataURL();
          const link = document.createElement('a');
          link.download = 'flappy-pi-score.png';
          link.href = url;
          link.click();
        }
      }, 'image/png');
      
      toast({
        title: "Score Shared! 🎉",
        description: "Your amazing score has been shared!"
      });
    } catch (error) {
      console.error('Share failed:', error);
      toast({
        title: "Share Failed",
        description: "Couldn't share your score. Try downloading instead."
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = async () => {
    setIsGenerating(true);
    await generateScoreImage();
    
    const canvas = canvasRef.current;
    if (!canvas) return;

    const url = canvas.toDataURL();
    const link = document.createElement('a');
    link.download = 'flappy-pi-score.png';
    link.href = url;
    link.click();
    
    setIsGenerating(false);
    toast({
      title: "Downloaded! 📱",
      description: "Your score image has been saved to your device."
    });
  };

  const handleCopyScore = () => {
    const scoreText = `I just scored ${score} points in Flappy Pi with my ${selectedBirdSkin} bird! Reached level ${level}. Can you beat my score? 🎮 #FlappyPi #PiNetwork`;
    navigator.clipboard.writeText(scoreText);
    toast({
      title: "Copied! 📋",
      description: "Score text copied to clipboard!"
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-white border-gray-200">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl text-gray-800 flex items-center justify-center space-x-2">
            <Trophy className="h-6 w-6 text-yellow-500" />
            <span>Share Your Score!</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <Card className="p-6 text-center bg-gradient-to-b from-blue-50 to-blue-100 border-blue-200">
            <div className="flex justify-center mb-2">
              <img 
                src={getBirdImageUrl(selectedBirdSkin)} 
                alt={selectedBirdSkin}
                className="w-12 h-12 object-contain"
              />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Amazing Score!</h3>
            <div className="text-3xl font-bold text-blue-600 mb-1">{score}</div>
            <p className="text-gray-600 text-sm">Level {level} • Best: {highScore}</p>
            <p className="text-gray-500 text-xs mt-1">Flying with {selectedBirdSkin} bird</p>
          </Card>

          <div className="grid grid-cols-1 gap-3">
            <Button 
              onClick={handleShare}
              disabled={isGenerating}
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white"
            >
              <Share2 className="mr-2 h-4 w-4" />
              {isGenerating ? 'Generating...' : 'Share Image'}
            </Button>
            
            <Button 
              onClick={handleDownload}
              disabled={isGenerating}
              variant="outline"
              className="w-full border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              <Download className="mr-2 h-4 w-4" />
              Download Image
            </Button>
            
            <Button 
              onClick={handleCopyScore}
              variant="outline"
              className="w-full border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              <Copy className="mr-2 h-4 w-4" />
              Copy Score Text
            </Button>
          </div>

          <div className="text-center">
            <p className="text-xs text-gray-500">
              Show your friends how you're soaring in the Pi Network! 🚀
            </p>
          </div>
        </div>

        {/* Hidden canvas for generating score image */}
        <canvas ref={canvasRef} style={{ display: 'none' }} />
      </DialogContent>
    </Dialog>
  );
};

export default ShareScoreModal;
