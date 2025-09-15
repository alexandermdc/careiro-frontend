import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import "../../index.css";
import { Button } from '../../components/button';

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
      await api.post('/clientes', { cpf, nome, email, telefone, senha });
      alert('Cliente cadastrado!');
      navigate('/login');
    } catch (error) {
      console.error(error);
      alert('Erro ao cadastrar cliente. Tente novamente.');
    }
  };

  const handleVoltarLogin = () => navigate('/login');

  return (
    <div className="w-screen min-h-screen flex items-center justify-center bg-cinza px-4 py-12">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-sm w-full max-w-md border border-strokes flex flex-col">
        <h2 className="text-2xl font-bold mb-4 text-verde-escuro text-center">Cadastro de Feira Livre</h2>

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
      </form>
    </div>
  );
}
