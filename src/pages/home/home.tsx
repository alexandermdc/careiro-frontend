import { useEffect, useState } from 'react';
import api from '../../services/api';

interface Cliente {
  id: number;
  nome: string;
  email: string;
  cpf: string;
  telefone: string;
}

export default function Home() {
  const [clientes, setClientes] = useState<Cliente[]>([]);

  useEffect(() => {
    api.get('/clientes').then((res) => setClientes(res.data));
  }, []);

  return (
    <div>
      <h1>Clientes</h1>
      <ul>
        {clientes.map((cliente, index) => (
          <li key={index}>{cliente.nome} - {cliente.email} - {cliente.cpf} - {cliente.telefone}</li>
        ))}
      </ul>
    </div> 
  );
}
