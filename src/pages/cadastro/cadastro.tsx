import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import clienteService from '../../services/clienteService';
import "../../index.css";
import { Button } from '../../components/button';
import feiraImg from '../../assets/img/Feira.png';

export default function FormCliente() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [cpf, setCPF] = useState('');
  const [telefone, setTelefone] = useState('');
  const [senha, setSenha] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    
    try {
      await clienteService.criar({ cpf, nome, email, telefone, senha });
      
      alert('Cliente cadastrado com sucesso!');
      navigate('/login');
    } catch (error: any) {
      alert(error.message || 'Erro ao cadastrar cliente. Tente novamente.');
    }
  };

  const handleVoltarLogin = () => navigate('/login');

  return (
    <div className="min-h-screen flex">
      {/* Lado da Imagem */}
      <div 
        className="hidden lg:flex lg:w-[70%] relative"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url(${feiraImg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="absolute inset-0 flex items-end p-8">
          <div className="text-white">
            <h2 className="text-3xl font-bold mb-2">Junte-se à nossa comunidade!</h2>
            <p className="text-lg opacity-90">Cadastre-se e faça parte da maior feira livre online da Amazônia</p>
          </div>
        </div>
      </div>

      {/* Lado do Formulário */}
      <div className="w-full lg:w-[30%] flex items-center justify-center px-6 py-12 bg-fundo-claro relative">
        {/* Botão para voltar ao Home */}
        <Link 
          to="/" 
          className="absolute top-4 right-4 text-texto hover:text-verde-escuro transition-colors p-2 rounded-full hover:bg-white/50"
          title="Voltar ao início"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </Link>
        <div className="max-w-md w-full">
          {/* Logo */}
          <div className="text-center mb-8">
            <img
              className="w-16 h-16 mx-auto mb-4"
              alt="Logo Agriconnect"
              src="https://c.animaapp.com/mfyaim5kgxckXx/img/ativo-1-2-1.png"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "https://via.placeholder.com/64x64/1d4510/ffffff?text=Logo";
              }}
            />
            <h1 className="text-2xl font-bold text-verde-escuro">Agriconnect</h1>
            <p className="text-texto text-sm mt-2">Crie sua conta na feira livre online</p>
          </div>

          <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-lg border border-strokes flex flex-col">

        <input
          value={nome}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNome(e.target.value)}
          placeholder="Informe seu nome completo"
          className="w-full mb-3 p-3 border border-strokes rounded-md focus:outline-none focus:ring-2 focus:ring-verde-claro bg-fundo-claro text-texto"
        />

        <input
          value={email}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
          placeholder="Digite seu e-mail"
          type="email"
          className="w-full mb-3 p-3 border border-strokes rounded-md focus:outline-none focus:ring-2 focus:ring-verde-claro bg-fundo-claro text-texto"
        />

        <input
          value={cpf}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCPF(e.target.value)}
          placeholder="Informe seu CPF (apenas números)"
          className="w-full mb-3 p-3 border border-strokes rounded-md focus:outline-none focus:ring-2 focus:ring-verde-claro bg-fundo-claro text-texto"
        />

        <input
          value={telefone}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTelefone(e.target.value)}
          placeholder="Informe seu telefone (DDD + número)"
          className="w-full mb-3 p-3 border border-strokes rounded-md focus:outline-none focus:ring-2 focus:ring-verde-claro bg-fundo-claro text-texto"
        />

        <input
          value={senha}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSenha(e.target.value)}
          placeholder="Crie uma senha"
          type="password"
          className="w-full mb-5 p-3 border border-strokes rounded-md focus:outline-none focus:ring-2 focus:ring-verde-claro bg-fundo-claro text-texto"
        />

        <Button type="submit" className="w-full bg-verde-escuro text-white py-3 rounded-md shadow-sm hover:shadow-md mb-3">
          Cadastrar
        </Button>

        <Button variant="outline" asChild className="w-full">
          <button type="button" onClick={handleVoltarLogin} className="w-full py-3 text-texto">
            Voltar para Login
          </button>
        </Button>

          <div className="mt-6 text-center text-texto text-sm space-y-3">
            <p>Junte-se à comunidade Agriconnect</p>
            <div className="border-t pt-4">
              <p className="mb-2">Ou explore sem se cadastrar:</p>
              <div className="flex flex-col gap-2">
                <Link 
                  to="/" 
                  className="inline-flex items-center justify-center gap-2 text-verde-claro hover:text-verde-escuro transition-colors font-medium"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3" />
                  </svg>
                  Ver produtos da feira
                </Link>
                <Link 
                  to="/associacoes" 
                  className="inline-flex items-center justify-center gap-2 text-verde-claro hover:text-verde-escuro transition-colors font-medium text-sm"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  Conhecer associações
                </Link>
              </div>
            </div>
          </div>
          </form>
        </div>
      </div>
    </div>
  );
}
