import React from 'react';
import Modal from './Modal';
import { AlertCircle } from 'lucide-react';

interface ModalConfirmacaoProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'info';
  loading?: boolean;
}

export const ModalConfirmacao: React.FC<ModalConfirmacaoProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  type = 'warning',
  loading = false
}) => {
  const colorConfig = {
    danger: {
      bgColor: 'bg-red-100',
      iconColor: 'text-red-600',
      buttonColor: 'bg-red-600 hover:bg-red-700'
    },
    warning: {
      bgColor: 'bg-yellow-100',
      iconColor: 'text-yellow-600',
      buttonColor: 'bg-yellow-600 hover:bg-yellow-700'
    },
    info: {
      bgColor: 'bg-blue-100',
      iconColor: 'text-blue-600',
      buttonColor: 'bg-blue-600 hover:bg-blue-700'
    }
  };

  const config = colorConfig[type];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title=""
      showFooter={false}
      maxWidth="md"
    >
      <div className="space-y-4 py-4">
        {/* Ícone e Título */}
        <div className="flex items-start gap-4">
          <div className={`flex-shrink-0 w-12 h-12 ${config.bgColor} rounded-full flex items-center justify-center`}>
            <AlertCircle className={`w-7 h-7 ${config.iconColor}`} />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {title}
            </h3>
            <p className="text-gray-600 leading-relaxed">
              {message}
            </p>
          </div>
        </div>

        {/* Botões */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-6 py-2.5 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold disabled:opacity-50"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className={`${config.buttonColor} text-white px-6 py-2.5 rounded-lg transition-colors font-semibold shadow-lg hover:shadow-xl disabled:opacity-50 flex items-center gap-2`}
          >
            {loading && (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            )}
            {confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ModalConfirmacao;
