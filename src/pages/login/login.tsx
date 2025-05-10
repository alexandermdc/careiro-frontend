import { useState } from 'react';
import api from '../../services/api';

export default function FormCliente() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [cpf, setCPF] = useState('');
  const [telefone, setTelefone] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await api.post('/clientes', { cpf, nome, email, telefone });
    alert('Cliente cadastrado!');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Nome" />
      <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
      <input value={cpf} onChange={(e) => setCPF(e.target.value)} placeholder="CPF" />
      <input value={telefone} onChange={(e) => setTelefone(e.target.value)} placeholder="Telefoneeee" />
      <button type="submit">Cadastrar</button>
    </form>
  );
}
