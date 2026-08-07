import React, { useState, useRef, useEffect } from 'react';
import { X, ZoomIn, ZoomOut, RotateCw, Check, Upload } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface ImageCropperModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCropComplete: (base64Image: string) => void;
  initialImageSrc?: string | null;
}

export const ImageCropperModal: React.FC<ImageCropperModalProps> = ({
  isOpen,
  onClose,
  onCropComplete,
  initialImageSrc
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [imageSrc, setImageSrc] = useState<string | null>(initialImageSrc || null);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (initialImageSrc) {
      setImageSrc(initialImageSrc);
    }
  }, [initialImageSrc]);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImageSrc(reader.result as string);
        setZoom(1);
        setRotation(0);
        setPosition({ x: 0, y: 0 });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleCropSave = () => {
    if (!imageSrc) return;

    const canvas = document.createElement('canvas');
    const size = 256; // 256x256 px high quality avatar
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    if (imageSrc.startsWith('http')) {
      img.crossOrigin = 'anonymous';
    }

    img.onload = () => {
      // White background fallback
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(0, 0, size, size);

      ctx.save();

      // Circular clip mask
      ctx.beginPath();
      ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
      ctx.closePath();
      ctx.clip();

      // Position, rotate & scale
      ctx.translate(size / 2 + position.x, size / 2 + position.y);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.scale(zoom, zoom);

      // Fit aspect ratio cleanly
      const aspect = img.width / img.height;
      let drawW = size;
      let drawH = size;
      if (aspect > 1) {
        drawW = size * aspect;
      } else {
        drawH = size / aspect;
      }

      ctx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH);
      ctx.restore();

      // High-quality compressed JPEG base64 data URL
      const croppedBase64 = canvas.toDataURL('image/jpeg', 0.90);
      onCropComplete(croppedBase64);
      onClose();
    };

    img.src = imageSrc;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className={`w-full max-w-lg border rounded-3xl p-6 sm:p-8 shadow-2xl relative transition-all ${
        isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
      }`}>
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-xl font-extrabold mb-1">Crop & Edit Profile Picture</h2>
        <p className="text-xs text-slate-400 mb-6">Select an image from your device, drag to position, scale, and crop.</p>

        {/* Upload / Preview Box */}
        {!imageSrc ? (
          <div
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-3xl p-10 flex flex-col items-center justify-center text-center cursor-pointer transition ${
              isDark ? 'border-slate-800 hover:border-emerald-500/50 bg-slate-950/50' : 'border-slate-300 hover:border-green-500 bg-slate-50'
            }`}
          >
            <div className="p-4 rounded-full bg-green-500/10 text-green-500 mb-3">
              <Upload className="w-8 h-8" />
            </div>
            <p className="text-sm font-bold mb-1">Click to Upload Image from Device</p>
            <p className="text-xs text-slate-400">Supports JPG, PNG, WEBP (Max 5MB)</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Interactive Canvas Drag & Crop Area */}
            <div
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              className="relative w-64 h-64 mx-auto rounded-full overflow-hidden border-4 border-green-500 shadow-2xl cursor-grab active:cursor-grabbing select-none bg-slate-950"
            >
              <div
                style={{
                  transform: `translate(${position.x}px, ${position.y}px) scale(${zoom}) rotate(${rotation}deg)`,
                  transformOrigin: 'center center',
                  transition: isDragging ? 'none' : 'transform 0.1s ease-out',
                }}
                className="w-full h-full flex items-center justify-center pointer-events-none"
              >
                <img
                  src={imageSrc}
                  alt="Crop preview"
                  className="max-w-none w-full h-full object-cover"
                />
              </div>

              {/* Circular Overlay Mask */}
              <div className="absolute inset-0 pointer-events-none border-[10px] border-slate-950/40 rounded-full"></div>
            </div>

            {/* Controls Bar: Zoom & Rotation */}
            <div className="space-y-3 px-4">
              <div className="flex items-center gap-3">
                <ZoomOut className="w-4 h-4 text-slate-400" />
                <input
                  type="range"
                  min="0.5"
                  max="3"
                  step="0.05"
                  value={zoom}
                  onChange={(e) => setZoom(parseFloat(e.target.value))}
                  className="w-full accent-green-600 cursor-pointer"
                />
                <ZoomIn className="w-4 h-4 text-slate-400" />
              </div>

              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setRotation((r) => (r + 90) % 360)}
                  className="px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 hover:bg-slate-800 transition"
                >
                  <RotateCw className="w-3.5 h-3.5 text-green-500" /> Rotate 90°
                </button>

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-xs text-green-500 font-bold hover:underline"
                >
                  Change Image
                </button>
              </div>
            </div>

            {/* Save & Apply Button */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={handleCropSave}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white font-extrabold py-3 rounded-2xl text-xs flex items-center justify-center gap-2 transition shadow-lg shadow-green-600/20"
              >
                <Check className="w-4 h-4" /> Save & Apply Profile Image
              </button>
            </div>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>
    </div>
  );
};
