import React from 'react';

interface MockInfoProps {
  onClose: () => void;
}

export const MockInfo: React.FC<MockInfoProps> = ({ onClose }) => {
  return (
    <div className="fixed top-4 right-4 z-50 max-w-md">
      <div className="bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded-lg shadow-lg">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold text-sm mb-1">Modo de Desenvolvimento</h3>
            <p className="text-xs mb-2">
              O backend não está conectado. Use estas credenciais para testar:
            </p>
            <div className="text-xs font-mono bg-blue-100 p-2 rounded mb-2">
              <div><strong>Email:</strong> teste@agriconnect.com</div>
              <div><strong>Senha:</strong> 123456</div>
            </div>
            <p className="text-xs">
              Para usar o backend real, altere MOCK_MODE para false no authService.ts
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-blue-600 hover:text-blue-800 ml-2"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
};