'use client';

import { useState } from 'react';
import { Download, FileImage } from 'lucide-react';

interface TemplateCardProps {
  title: string;
  imageUrl: string;
  figmaUrl: string;
}

export default function TemplateCard({ title, imageUrl, figmaUrl }: TemplateCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleDownload = () => {
    window.open(figmaUrl, '_blank');
  };

  return (
    <div
      className="relative group cursor-pointer overflow-hidden rounded-lg border border-slate-200 dark:border-slate-800 transition-all duration-300 hover:shadow-lg"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative aspect-[9/16] overflow-hidden bg-slate-100 dark:bg-slate-900">
        {imageError ? (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-900 dark:to-slate-800">
            <FileImage className="w-16 h-16 text-slate-400 dark:text-slate-600" />
          </div>
        ) : (
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={() => setImageError(true)}
          />
        )}
        
        {/* Figma Icon Badge */}
        <div className="absolute top-2 right-2 bg-black/80 backdrop-blur-sm rounded-lg p-2 shadow-lg">
          <svg 
            width="20" 
            height="20" 
            viewBox="0 0 24 24" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M8 24C10.2091 24 12 22.2091 12 20V16H8C5.79086 16 4 17.7909 4 20C4 22.2091 5.79086 24 8 24Z" fill="#0ACF83"/>
            <path d="M4 12C4 9.79086 5.79086 8 8 8H12V16H8C5.79086 16 4 14.2091 4 12Z" fill="#A259FF"/>
            <path d="M4 4C4 1.79086 5.79086 0 8 0H12V8H8C5.79086 8 4 6.20914 4 4Z" fill="#F24E1E"/>
            <path d="M12 0H16C18.2091 0 20 1.79086 20 4C20 6.20914 18.2091 8 16 8H12V0Z" fill="#FF7262"/>
            <path d="M20 12C20 14.2091 18.2091 16 16 16C13.7909 16 12 14.2091 12 12C12 9.79086 13.7909 8 16 8C18.2091 8 20 9.79086 20 12Z" fill="#1ABCFE"/>
          </svg>
        </div>
        
        {/* Overlay on hover */}
        <div
          className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 flex items-center justify-center ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <button
            onClick={handleDownload}
            className="px-6 py-3 bg-[#0080FF] text-white rounded-lg font-medium text-sm flex items-center gap-2 hover:bg-[#0070E0] transition-colors"
          >
            <Download className="w-4 h-4" />
            Download
          </button>
        </div>
      </div>
      
      <div className="p-4 bg-white dark:bg-slate-950">
        <h3 className="text-sm font-medium text-slate-900 dark:text-white line-clamp-2">
          {title}
        </h3>
      </div>
    </div>
  );
}

