import React, { useEffect, useRef } from 'react';

const DistortedCaptcha = ({ captchaText, onRefresh }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (canvasRef.current && captchaText) {
      drawCaptcha();
    }
  }, [captchaText]);

  const drawCaptcha = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Background with noise
    ctx.fillStyle = '#f0f0f0';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Add noise dots
    for (let i = 0; i < 100; i++) {
      ctx.fillStyle = `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.3)`;
      ctx.fillRect(
        Math.random() * canvas.width,
        Math.random() * canvas.height,
        2,
        2
      );
    }
    
    // Add random lines
    for (let i = 0; i < 5; i++) {
      ctx.strokeStyle = `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.4)`;
      ctx.lineWidth = 1 + Math.random() * 2;
      ctx.beginPath();
      ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height);
      ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height);
      ctx.stroke();
    }
    
    // Draw distorted text
    ctx.font = 'bold 32px Arial';
    ctx.textBaseline = 'middle';
    
    const chars = captchaText.split('');
    const spacing = canvas.width / (chars.length + 1);
    
    chars.forEach((char, index) => {
      ctx.save();
      
      // Random position offset
      const x = spacing * (index + 1) + (Math.random() - 0.5) * 10;
      const y = canvas.height / 2 + (Math.random() - 0.5) * 10;
      
      // Random rotation
      const rotation = (Math.random() - 0.5) * 0.4;
      ctx.translate(x, y);
      ctx.rotate(rotation);
      
      // Random color
      const colors = ['#1a1a1a', '#2d3748', '#4a5568', '#0f766e', '#0d9488'];
      ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)];
      
      // Draw character with shadow
      ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
      ctx.shadowBlur = 2;
      ctx.shadowOffsetX = 1;
      ctx.shadowOffsetY = 1;
      
      ctx.fillText(char, 0, 0);
      
      ctx.restore();
    });
    
    // Add more distortion lines on top
    for (let i = 0; i < 3; i++) {
      ctx.strokeStyle = `rgba(0, 0, 0, 0.1)`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, Math.random() * canvas.height);
      ctx.lineTo(canvas.width, Math.random() * canvas.height);
      ctx.stroke();
    }
  };

  return (
    <div className="flex items-center gap-3">
      <canvas
        ref={canvasRef}
        width={200}
        height={60}
        className="border-2 border-gray-300 rounded-lg bg-gray-50"
      />
      <button
        type="button"
        onClick={onRefresh}
        className="text-primary hover:text-teal-700 text-sm font-medium px-3 py-2 border border-primary rounded-lg hover:bg-primary hover:text-white transition-colors"
        title="Generate new CAPTCHA"
      >
        🔄 Refresh
      </button>
    </div>
  );
};

export default DistortedCaptcha;
