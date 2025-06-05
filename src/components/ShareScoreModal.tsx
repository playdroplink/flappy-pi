import React, { useRef, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Share2, Download, Copy, Trophy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';

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
  const isMobile = useIsMobile();

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

    // Responsive canvas size - smaller for mobile
    const canvasWidth = isMobile ? 320 : 400;
    const canvasHeight = isMobile ? 480 : 600;
    
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    // Create gradient background
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#0ea5e9');
    gradient.addColorStop(1, '#0284c7');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Add decorative elements - scaled for mobile
    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
    const circleCount = isMobile ? 4 : 6;
    for (let i = 0; i < circleCount; i++) {
      ctx.beginPath();
      const x = (canvas.width / circleCount) * (i + 0.5);
      const y = 80 + i * (isMobile ? 20 : 30);
      const radius = isMobile ? 15 + i * 3 : 20 + i * 5;
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
    }

    // Title - responsive font size
    ctx.fillStyle = '#ffffff';
    ctx.font = `bold ${isMobile ? '28px' : '36px'} Arial`;
    ctx.textAlign = 'center';
    ctx.fillText('Flappy Pi', canvas.width / 2, isMobile ? 60 : 80);

    // Load and draw bird image
    try {
      const birdImg = new Image();
      birdImg.crossOrigin = 'anonymous';
      
      await new Promise((resolve, reject) => {
        birdImg.onload = resolve;
        birdImg.onerror = reject;
        birdImg.src = getBirdImageUrl(selectedBirdSkin);
      });

      // Draw bird image - scaled for mobile
      const birdSize = isMobile ? 45 : 60;
      const birdY = isMobile ? 85 : 110;
      ctx.drawImage(birdImg, (canvas.width - birdSize) / 2, birdY, birdSize, birdSize);
    } catch (error) {
      console.error('Failed to load bird image:', error);
      // Fallback circle
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.arc(canvas.width / 2, isMobile ? 110 : 140, isMobile ? 22 : 30, 0, Math.PI * 2);
      ctx.fill();
    }

    // Score display - responsive positioning and sizing
    const scoreBoxY = isMobile ? 150 : 200;
    const scoreBoxHeight = isMobile ? 90 : 120;
    const scoreBoxPadding = isMobile ? 30 : 50;
    
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.fillRect(scoreBoxPadding, scoreBoxY, canvas.width - (scoreBoxPadding * 2), scoreBoxHeight);
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 3;
    ctx.strokeRect(scoreBoxPadding, scoreBoxY, canvas.width - (scoreBoxPadding * 2), scoreBoxHeight);

    ctx.fillStyle = '#0284c7';
    ctx.font = `bold ${isMobile ? '18px' : '24px'} Arial`;
    ctx.fillText('Your Score', canvas.width / 2, scoreBoxY + (isMobile ? 25 : 30));

    ctx.font = `bold ${isMobile ? '36px' : '48px'} Arial`;
    ctx.fillStyle = '#1d4ed8';
    ctx.fillText(score.toString(), canvas.width / 2, scoreBoxY + (isMobile ? 65 : 80));

    // Stats - responsive positioning
    const statsBoxY = scoreBoxY + scoreBoxHeight + 20;
    const statsBoxHeight = isMobile ? 110 : 150;
    
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.fillRect(scoreBoxPadding, statsBoxY, canvas.width - (scoreBoxPadding * 2), statsBoxHeight);
    ctx.strokeRect(scoreBoxPadding, statsBoxY, canvas.width - (scoreBoxPadding * 2), statsBoxHeight);

    ctx.fillStyle = '#0284c7';
    ctx.font = `bold ${isMobile ? '16px' : '20px'} Arial`;
    ctx.fillText('Level Reached', canvas.width / 2, statsBoxY + (isMobile ? 25 : 30));
    ctx.font = `bold ${isMobile ? '24px' : '32px'} Arial`;
    ctx.fillStyle = '#16a34a';
    ctx.fillText(level.toString(), canvas.width / 2, statsBoxY + (isMobile ? 50 : 65));

    ctx.fillStyle = '#0284c7';
    ctx.font = `bold ${isMobile ? '16px' : '20px'} Arial`;
    ctx.fillText('Best Score', canvas.width / 2, statsBoxY + (isMobile ? 75 : 100));
    ctx.font = `bold ${isMobile ? '24px' : '32px'} Arial`;
    ctx.fillStyle = '#eab308';
    ctx.fillText(highScore.toString(), canvas.width / 2, statsBoxY + (isMobile ? 100 : 135));

    // Footer - responsive positioning and font size
    const footerY = canvas.height - (isMobile ? 60 : 80);
    ctx.fillStyle = '#ffffff';
    ctx.font = `bold ${isMobile ? '14px' : '18px'} Arial`;
    ctx.fillText('Join the Pi Network gaming revolution!', canvas.width / 2, footerY);
    ctx.font = `${isMobile ? '12px' : '16px'} Arial`;
    ctx.fillText('Powered by mrwain organization', canvas.width / 2, footerY + (isMobile ? 20 : 30));
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
      <DialogContent className={`${isMobile ? 'max-w-[90vw] max-h-[90vh]' : 'max-w-md'} bg-white border-gray-200 overflow-y-auto`}>
        <DialogHeader>
          <DialogTitle className={`text-center ${isMobile ? 'text-xl' : 'text-2xl'} text-gray-800 flex items-center justify-center space-x-2`}>
            <Trophy className={`${isMobile ? 'h-5 w-5' : 'h-6 w-6'} text-yellow-500`} />
            <span>Share Your Score!</span>
          </DialogTitle>
        </DialogHeader>

        <div className={`space-y-${isMobile ? '4' : '6'}`}>
          <Card className={`${isMobile ? 'p-4' : 'p-6'} text-center bg-gradient-to-b from-blue-50 to-blue-100 border-blue-200`}>
            <div className="flex justify-center mb-2">
              <img 
                src={getBirdImageUrl(selectedBirdSkin)} 
                alt={selectedBirdSkin}
                className={`${isMobile ? 'w-10 h-10' : 'w-12 h-12'} object-contain`}
              />
            </div>
            <h3 className={`${isMobile ? 'text-lg' : 'text-xl'} font-bold text-gray-800 mb-2`}>Amazing Score!</h3>
            <div className={`${isMobile ? 'text-2xl' : 'text-3xl'} font-bold text-blue-600 mb-1`}>{score}</div>
            <p className={`text-gray-600 ${isMobile ? 'text-xs' : 'text-sm'}`}>Level {level} • Best: {highScore}</p>
            <p className={`text-gray-500 ${isMobile ? 'text-xs' : 'text-xs'} mt-1`}>Flying with {selectedBirdSkin} bird</p>
          </Card>

          <div className="grid grid-cols-1 gap-3">
            <Button 
              onClick={handleShare}
              disabled={isGenerating}
              className={`w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white ${isMobile ? 'text-sm py-2' : ''}`}
            >
              <Share2 className={`mr-2 ${isMobile ? 'h-3 w-3' : 'h-4 w-4'}`} />
              {isGenerating ? 'Generating...' : 'Share Image'}
            </Button>
            
            <Button 
              onClick={handleDownload}
              disabled={isGenerating}
              variant="outline"
              className={`w-full border-gray-300 text-gray-700 hover:bg-gray-50 ${isMobile ? 'text-sm py-2' : ''}`}
            >
              <Download className={`mr-2 ${isMobile ? 'h-3 w-3' : 'h-4 w-4'}`} />
              Download Image
            </Button>
            
            <Button 
              onClick={handleCopyScore}
              variant="outline"
              className={`w-full border-gray-300 text-gray-700 hover:bg-gray-50 ${isMobile ? 'text-sm py-2' : ''}`}
            >
              <Copy className={`mr-2 ${isMobile ? 'h-3 w-3' : 'h-4 w-4'}`} />
              Copy Score Text
            </Button>
          </div>

          <div className="text-center">
            <p className={`${isMobile ? 'text-xs' : 'text-xs'} text-gray-500`}>
              Show your friends how you're soaring in the Pi Network! 🚀
            </p>
          </div>
        </div>

        <canvas ref={canvasRef} style={{ display: 'none' }} />
      </DialogContent>
    </Dialog>
  );
};

export default ShareScoreModal;
