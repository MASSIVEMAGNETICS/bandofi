import React, { useState, useRef, useEffect } from 'react';
import Logger from '../utils/Logger';

interface GeneratedImage {
  id: string;
  url: string;
  prompt: string;
  timestamp: Date;
  settings: {
    width: number;
    height: number;
    steps: number;
    guidance: number;
  };
}

const ImageGenerator: React.FC = () => {
  const [prompt, setPrompt] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [settings, setSettings] = useState({
    width: 512,
    height: 512,
    steps: 20,
    guidance: 7.5
  });
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load previous images from localStorage on mount
  useEffect(() => {
    try {
      const savedImages = localStorage.getItem('bandoFiGeneratedImages');
      if (savedImages) {
        const parsedImages = JSON.parse(savedImages);
        setGeneratedImages(parsedImages.map((img: any) => ({
          ...img,
          timestamp: new Date(img.timestamp)
        })));
      }
    } catch (e) {
      Logger.error('Failed to load generated images from localStorage', { error: e });
    }
  }, []);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('Please enter a prompt');
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      Logger.info('Starting image generation', { prompt, settings });

      // Simulate API call with timeout
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Create a mock image URL (in a real app, this would come from an API)
      const mockImageUrl = `https://picsum.photos/${settings.width}/${settings.height}?random=${Date.now()}`;
      
      const newImage: GeneratedImage = {
        id: `img_${Date.now()}`,
        url: mockImageUrl,
        prompt,
        timestamp: new Date(),
        settings: { ...settings }
      };

      const updatedImages = [newImage, ...generatedImages];
      setGeneratedImages(updatedImages);

      // Save to localStorage
      try {
        localStorage.setItem('bandoFiGeneratedImages', JSON.stringify(updatedImages));
      } catch (e) {
        Logger.warn('Failed to save generated image to localStorage', { error: e });
      }

      Logger.info('Image generation completed successfully', { imageId: newImage.id });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      Logger.error('Image generation failed', { error: errorMessage, prompt });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = (imageUrl: string, index: number) => {
    try {
      const link = document.createElement('a');
      link.href = imageUrl;
      link.download = `bando-fi-generated-${index + 1}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      Logger.info('Image downloaded', { imageUrl });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to download image';
      setError(errorMessage);
      Logger.error('Download failed', { error: errorMessage, imageUrl });
    }
  };

  const handleClearHistory = () => {
    setGeneratedImages([]);
    try {
      localStorage.removeItem('bandoFiGeneratedImages');
      Logger.info('Generation history cleared');
    } catch (e) {
      Logger.error('Failed to clear generation history from localStorage', { error: e });
    }
  };

  return (
    <div className="image-generator-container w-full max-w-6xl">
      <div className="panel">
        <h2 className="glow-green mb-4">Image Generation Studio</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="input-section">
            <div className="mb-4">
              <label className="block text-neon-pink mb-2">Prompt</label>
              <textarea
                className="input-field h-32"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe the image you want to generate..."
                disabled={isGenerating}
              />
            </div>
            
            <div className="settings-section mb-4">
              <h3 className="glow-pink mb-2">Generation Settings</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-neon-pink mb-1">Width: {settings.width}px</label>
                  <input
                    type="range"
                    min="256"
                    max="1024"
                    step="64"
                    value={settings.width}
                    onChange={(e) => setSettings({...settings, width: parseInt(e.target.value)})}
                    className="w-full"
                    disabled={isGenerating}
                  />
                </div>
                
                <div>
                  <label className="block text-neon-pink mb-1">Height: {settings.height}px</label>
                  <input
                    type="range"
                    min="256"
                    max="1024"
                    step="64"
                    value={settings.height}
                    onChange={(e) => setSettings({...settings, height: parseInt(e.target.value)})}
                    className="w-full"
                    disabled={isGenerating}
                  />
                </div>
                
                <div>
                  <label className="block text-neon-pink mb-1">Steps: {settings.steps}</label>
                  <input
                    type="range"
                    min="10"
                    max="50"
                    value={settings.steps}
                    onChange={(e) => setSettings({...settings, steps: parseInt(e.target.value)})}
                    className="w-full"
                    disabled={isGenerating}
                  />
                </div>
                
                <div>
                  <label className="block text-neon-pink mb-1">Guidance: {settings.guidance}</label>
                  <input
                    type="range"
                    min="1"
                    max="20"
                    step="0.5"
                    value={settings.guidance}
                    onChange={(e) => setSettings({...settings, guidance: parseFloat(e.target.value)})}
                    className="w-full"
                    disabled={isGenerating}
                  />
                </div>
              </div>
            </div>
            
            <div className="flex gap-4">
              <button
                className={`btn btn-primary ${isGenerating ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={handleGenerate}
                disabled={isGenerating}
              >
                {isGenerating ? 'Generating...' : 'Generate Image'}
              </button>
              
              <button
                className="btn btn-outline"
                onClick={handleClearHistory}
              >
                Clear History
              </button>
            </div>
            
            {error && (
              <div className="mt-4 p-3 bg-red-900/30 border border-red-500 rounded text-red-200">
                Error: {error}
              </div>
            )}
          </div>
          
          <div className="preview-section">
            <h3 className="glow-pink mb-4">Generated Images</h3>
            
            {generatedImages.length === 0 ? (
              <div className="flex items-center justify-center h-64 border-2 border-dashed border-gray-600 rounded-lg">
                <p className="text-gray-400">No images generated yet</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 max-h-96 overflow-y-auto">
                {generatedImages.map((image, index) => (
                  <div key={image.id} className="generated-image-card p-3 border border-gray-700 rounded">
                    <div className="flex items-start gap-3">
                      <img 
                        src={image.url} 
                        alt={`Generated: ${image.prompt}`}
                        className="w-16 h-16 object-cover rounded border border-green-500/30"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm truncate">{image.prompt}</p>
                        <p className="text-xs text-gray-400">
                          {image.timestamp.toLocaleString()} | {image.settings.width}x{image.settings.height}
                        </p>
                      </div>
                      <button
                        className="btn btn-secondary text-xs"
                        onClick={() => handleDownload(image.url, index)}
                      >
                        Download
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="panel mt-6">
        <h3 className="glow-green mb-4">Generation History</h3>
        <div className="history-stats">
          <div className="flex justify-between">
            <div>
              <span className="text-neon-pink">Total Images:</span> {generatedImages.length}
            </div>
            <div>
              <span className="text-neon-pink">Last Generated:</span> 
              {generatedImages.length > 0 
                ? new Date(generatedImages[0].timestamp).toLocaleString() 
                : 'None'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageGenerator;