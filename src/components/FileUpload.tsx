import React, { useRef } from 'react';
import { Upload, FileAudio } from 'lucide-react';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  };

  return (
    <div className="space-y-4">
      <button
        onClick={handleClick}
        className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors group"
      >
        <div className="flex flex-col items-center space-y-2">
          <div className="flex items-center space-x-2">
            <Upload className="h-6 w-6 text-gray-400 group-hover:text-blue-500" />
            <FileAudio className="h-6 w-6 text-gray-400 group-hover:text-blue-500" />
          </div>
          <p className="text-gray-600 group-hover:text-blue-600">
            Upload Audio File
          </p>
          <p className="text-sm text-gray-500">
            Supports MP3, WAV, OGG, M4A
          </p>
        </div>
      </button>

      <input
        ref={fileInputRef}
        type="file"
        accept="audio/*"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
};

export default FileUpload;