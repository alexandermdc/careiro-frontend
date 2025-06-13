import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // importa useNavigate
import api from '../../services/api';
import "../../index.css";

export default function FormCliente() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [cpf, setCPF] = useState('');
  const [telefone, setTelefone] = useState('');
  const [senha, setSenha] = useState('');
  const navigate = useNavigate(); // inicializa o navigate

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/clientes', { cpf, nome, email, telefone, senha });
      alert('Cliente cadastrado!');
      navigate('/login'); // redireciona para página de login
    } catch (error) {
      alert('Erro ao cadastrar cliente. Tente novamente.');
      console.error(error);
    }
  };

  const handleVoltarLogin = () => {
    navigate('/login'); // redireciona para login ao clicar no botão
  };

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-gradient-to-br from-green-200 via-yellow-100 to-green-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-md border-2 border-green-300 flex flex-col justify-center items-center"
      >
        <h2 className="text-3xl font-extrabold mb-8 text-center text-green-700">
          Cadastro de Feira Livre
        </h2>
        <input
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          placeholder="Informe seu nome completo"
          className="w-full mb-5 p-4 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 bg-green-50 placeholder-gray-600 text-green-900"
        />
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Digite seu e-mail (ex: exemplo@email.com)"
          type="email"
          className="w-full mb-5 p-4 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 bg-green-50 placeholder-gray-600 text-green-900"
        />
        <input
          value={cpf}
          onChange={(e) => setCPF(e.target.value)}
          placeholder="Informe seu CPF (apenas números)"
          className="w-full mb-5 p-4 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 bg-green-50 placeholder-gray-600 text-green-900"
        />
        <input
          value={telefone}
          onChange={(e) => setTelefone(e.target.value)}
          placeholder="Informe seu telefone (DDD + número)"
          className="w-full mb-5 p-4 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 bg-green-50 placeholder-gray-600 text-green-900"
        />
        <input
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          placeholder="Crie uma senha"
          type="password"
          className="w-full mb-7 p-4 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 bg-green-50 placeholder-gray-600 text-green-900"
        />
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-green-400 to-yellow-400 hover:from-green-500 hover:to-yellow-500 text-white font-bold py-4 rounded-lg transition text-lg shadow-md mb-4"
        >
          Cadastrar
        </button>

        <button
          type="button"
          onClick={handleVoltarLogin}
          className="w-full border border-green-400 text-green-700 font-semibold py-3 rounded-lg hover:bg-green-100 transition text-lg"
        >
          Voltar para Login
        </button>
      </form>
    </div>
  );
}
