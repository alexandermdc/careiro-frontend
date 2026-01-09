import React from 'react';
import Modal from './Modal';
import { AlertCircle, Trash2 } from 'lucide-react';

interface ModalConfirmacaoExclusaoProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  titulo: string;
  nomeItem: string;
  mensagemAviso?: string;
  loading?: boolean;
}

export const ModalConfirmacaoExclusao: React.FC<ModalConfirmacaoExclusaoProps> = ({
  isOpen,
  onClose,
  onConfirm,
  titulo,
  nomeItem,
  mensagemAviso,
  loading = false
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Confirmar Exclusão"
      showFooter={false}
    >
      <div className="space-y-4">
        <div className="flex items-start gap-3 p-4 bg-red-50 rounded-lg">
          <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-red-900 mb-1">
              Tem certeza que deseja deletar {titulo}?
            </p>
            <p className="text-sm text-red-700">
              Esta ação não pode ser desfeita. {titulo}{' '}
              <strong>"{nomeItem}"</strong> será permanentemente removido.
            </p>
            {mensagemAviso && (
              <p className="text-sm text-red-700 mt-2">
                ⚠️ {mensagemAviso}
              </p>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-6 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Deletando...
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4" />
                Deletar {titulo}
              </>
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ModalConfirmacaoExclusao;
