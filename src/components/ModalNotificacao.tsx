import React from 'react';
import Modal from './Modal';
import { CheckCircle, XCircle, Info, AlertTriangle } from 'lucide-react';

type NotificationType = 'success' | 'error' | 'warning' | 'info';

interface ModalNotificacaoProps {
  isOpen: boolean;
  onClose: () => void;
  type: NotificationType;
  title: string;
  message: string;
  confirmText?: string;
  onConfirm?: () => void;
}

const iconsConfig = {
  success: {
    Icon: CheckCircle,
    bgColor: 'bg-green-100',
    iconColor: 'text-green-600',
    borderColor: 'border-green-200',
    buttonColor: 'bg-green-600 hover:bg-green-700'
  },
  error: {
    Icon: XCircle,
    bgColor: 'bg-red-100',
    iconColor: 'text-red-600',
    borderColor: 'border-red-200',
    buttonColor: 'bg-red-600 hover:bg-red-700'
  },
  warning: {
    Icon: AlertTriangle,
    bgColor: 'bg-yellow-100',
    iconColor: 'text-yellow-600',
    borderColor: 'border-yellow-200',
    buttonColor: 'bg-yellow-600 hover:bg-yellow-700'
  },
  info: {
    Icon: Info,
    bgColor: 'bg-blue-100',
    iconColor: 'text-blue-600',
    borderColor: 'border-blue-200',
    buttonColor: 'bg-blue-600 hover:bg-blue-700'
  }
};

export const ModalNotificacao: React.FC<ModalNotificacaoProps> = ({
  isOpen,
  onClose,
  type,
  title,
  message,
  confirmText = 'OK',
  onConfirm
}) => {
  const config = iconsConfig[type];
  const { Icon, bgColor, iconColor, buttonColor } = config;

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    }
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title=""
      showFooter={false}
      maxWidth="md"
    >
      <div className="text-center space-y-4 py-4">
        {/* Ícone */}
        <div className={`mx-auto w-16 h-16 ${bgColor} rounded-full flex items-center justify-center`}>
          <Icon className={`w-10 h-10 ${iconColor}`} />
        </div>

        {/* Título */}
        <h3 className="text-2xl font-bold text-gray-900">
          {title}
        </h3>

        {/* Mensagem */}
        <p className="text-gray-600 text-base leading-relaxed px-4">
          {message}
        </p>

        {/* Botão */}
        <div className="pt-4">
          <button
            onClick={handleConfirm}
            className={`${buttonColor} text-white px-8 py-3 rounded-lg font-semibold transition-colors shadow-lg hover:shadow-xl`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ModalNotificacao;
