import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import clienteService from '../../services/clienteService';
import "../../index.css";
import { validarCPF, aplicarMascaraCPF, limparCPF } from '../../utils/cpfValidator';

export default function FormCliente() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [cpf, setCPF] = useState('');
  const [telefone, setTelefone] = useState('');
  const [senha, setSenha] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleCPFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const masked = aplicarMascaraCPF(e.target.value);
    if (masked.length <= 14) {
      setCPF(masked);
    }
  };

  const aplicarMascaraTelefone = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 11);
    if (digits.length <= 2) return `(${digits}`;
    if (digits.length <= 6) return `(${digits.slice(0,2)}) ${digits.slice(2)}`;
    if (digits.length <= 10) return `(${digits.slice(0,2)}) ${digits.slice(2,6)}-${digits.slice(6)}`;
    return `(${digits.slice(0,2)}) ${digits.slice(2,7)}-${digits.slice(7)}`;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTelefone(aplicarMascaraTelefone(e.target.value));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isSubmitting) return;

    const cpfLimpo = limparCPF(cpf);
    if (!validarCPF(cpfLimpo)) {
      alert('CPF inválido! Por favor, verifique o CPF digitado.');
      return;
    }

    try {
      setIsSubmitting(true);

      const payload = {
        nome,
        email,
        cpf: cpfLimpo,
        telefone: telefone.replace(/\D/g, ''),
        senha,
      };

      await clienteService.criar(payload);
      alert('Cadastro realizado com sucesso!');
      navigate('/login');
    } catch (err) {
      console.error('Erro ao cadastrar cliente:', err);
      alert('Ocorreu um erro ao processar seu cadastro. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="min-h-screen w-full bg-cover bg-center flex items-center justify-center"
      style={{ backgroundImage: `url(/img/Feira.png)` }}
    >
      <div className="absolute inset-0 bg-black/40" />

      <div className="relative z-10 w-full max-w-3xl px-4 py-12">
        <div className="mx-auto max-w-xl relative">
          <img
            src="/img/logoagriconect.svg"
            alt="Agriconnect"
            className="w-36 h-auto absolute left-1/2 -translate-x-1/2 -top-16 bg-white rounded-full p-3"
          />
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden pt-10">
            <div className="p-8 pt-6 relative">
              <div className="mt-4 text-center mb-6">
                <p className="text-sm text-gray-500 mt-1">Crie uma conta no Agriconnect</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Nome completo</label>
                  <input
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    placeholder="Digite seu nome completo"
                    className="w-full p-3 border border-strokes rounded-md focus:outline-none focus:ring-2 focus:ring-verde-claro"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-700 mb-1">CPF</label>
                  <input
                    value={cpf}
                    onChange={handleCPFChange}
                    placeholder="Digite seu CPF (000.000.000-00)"
                    maxLength={14}
                    className="w-full p-3 border border-strokes rounded-md focus:outline-none focus:ring-2 focus:ring-verde-claro"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-700 mb-1">Telefone</label>
                  <input
                    value={telefone}
                    onChange={handlePhoneChange}
                    placeholder="(XX) 9XXXX-XXXX"
                    className="w-full p-3 border border-strokes rounded-md focus:outline-none focus:ring-2 focus:ring-verde-claro"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-700 mb-1">Email</label>
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Digite aqui seu melhor email"
                    type="email"
                    className="w-full p-3 border border-strokes rounded-md focus:outline-none focus:ring-2 focus:ring-verde-claro"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-700 mb-1">Senha</label>
                  <input
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    placeholder="Crie uma senha"
                    type="password"
                    className="w-full p-3 border border-strokes rounded-md focus:outline-none focus:ring-2 focus:ring-verde-claro"
                  />
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-verde-escuro text-white py-3 rounded-full font-semibold shadow-md transition-transform transition-colors duration-150 hover:bg-verde-claro active:scale-[0.99] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-verde-claro focus-visible:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:bg-verde-escuro"
                  >
                    {isSubmitting ? 'Finalizando cadastro...' : 'Fazer Cadastro'}
                  </button>
                </div>

                <div className="text-center text-sm text-gray-600">
                  Já tem uma conta? <Link to="/login" className="text-verde-claro font-medium">Faça login</Link>
                </div>
              </form>
            </div>
            <div className="border-t bg-white/90 px-8 py-4">
              <div className="text-center text-sm text-gray-600">Ou explore sem se cadastrar:</div>
              <div className="mt-3 flex justify-center gap-6 text-verde-escuro">
                <Link to="/" className="text-sm hover:underline">Ver produtos da feira</Link>
                <Link to="/associacoes" className="text-sm hover:underline">Conhecer associações</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
