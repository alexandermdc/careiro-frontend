import React, { useRef, useState } from 'react';
import { Upload, X } from 'lucide-react';

interface ImageUploadProps {
  value: File | string;
  onChange: (file: File | string) => void;
  onError?: (error: string) => void;
  preview?: string;
  onPreviewChange?: (preview: string) => void;
  disabled?: boolean;
  error?: string;
  maxSize?: number; // em MB, padrão 2MB
  acceptedFormats?: string[]; // padrão: ['image/jpeg', 'image/png', 'image/webp', 'image/jpg']
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  value,
  onChange,
  onError,
  preview,
  onPreviewChange,
  disabled = false,
  error,
  maxSize = 2,
  acceptedFormats = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg']
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar tipo de arquivo
    if (!acceptedFormats.includes(file.type)) {
      const errorMsg = `Formato inválido. Use: ${acceptedFormats.map(f => f.split('/')[1].toUpperCase()).join(', ')}`;
      onError?.(errorMsg);
      return;
    }

    // Validar tamanho
    const maxSizeBytes = maxSize * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      onError?.(`A imagem deve ter no máximo ${maxSize}MB`);
      return;
    }

    setIsUploading(true);

    try {
      // Criar preview
      const reader = new FileReader();
      reader.onloadend = () => {
        onPreviewChange?.(reader.result as string);
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
      
      // Atualizar valor
      onChange(file);
    } catch (err) {
      onError?.('Erro ao processar imagem');
      setIsUploading(false);
    }
  };

  const handleRemove = () => {
    onChange('');
    onPreviewChange?.('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-3">
      <input
        ref={fileInputRef}
        type="file"
        id="image-upload"
        accept={acceptedFormats.join(',')}
        onChange={handleFileSelect}
        className="hidden"
        disabled={disabled || isUploading}
      />

      {preview ? (
        <div className="relative">
          <div className="relative group">
            <img
              src={preview}
              alt="Preview"
              className="w-full h-64 object-cover rounded-lg border-2 border-gray-200"
            />
            {!disabled && (
              <button
                type="button"
                onClick={handleRemove}
                className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <p className="text-sm text-gray-500 mt-2 text-center">
            {value instanceof File ? value.name : 'Imagem carregada'}
          </p>
        </div>
      ) : (
        <button
          type="button"
          onClick={handleClick}
          disabled={disabled || isUploading}
          className={`w-full h-64 border-2 border-dashed rounded-lg flex flex-col items-center justify-center gap-3 transition-all ${
            error
              ? 'border-red-300 bg-red-50'
              : 'border-gray-300 hover:border-green-500 hover:bg-green-50'
          } ${disabled || isUploading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        >
          {isUploading ? (
            <>
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
              <p className="text-sm text-gray-600">Processando imagem...</p>
            </>
          ) : (
            <>
              <div className={`p-4 rounded-full ${error ? 'bg-red-100' : 'bg-gray-100'}`}>
                <Upload className={`w-8 h-8 ${error ? 'text-red-600' : 'text-gray-600'}`} />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-gray-900">
                  Clique para fazer upload
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  PNG, JPG, WEBP até {maxSize}MB
                </p>
              </div>
            </>
          )}
        </button>
      )}

      {error && (
        <p className="text-sm text-red-600 flex items-center gap-1">
          <span className="font-medium">⚠️</span> {error}
        </p>
      )}
    </div>
  );
};

export default ImageUpload;
