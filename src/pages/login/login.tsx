import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/button';

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !password) {
            setError('Por favor, preencha todos os campos.');
            return;
        }
        setError('');
        alert('Login realizado com sucesso!');
    };

        return (
            <div className="w-screen min-h-screen flex items-center justify-center bg-cinza px-4 py-12">
                <div className="max-w-md w-full bg-white rounded-2xl shadow-sm p-8 border border-strokes">
                    <header className="mb-6 text-center">
                        <h1 className="text-2xl font-bold text-verde-escuro">Agriconnect</h1>
                        <p className="text-texto text-sm">Feira Livre Online - Conectando você ao campo</p>
                    </header>

                    <form onSubmit={handleSubmit} aria-label="Formulário de login Agriconect">
                        <label htmlFor="email" className="block text-texto font-medium mb-2">
                            E-mail
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full mb-4 p-3 border border-strokes rounded-md focus:outline-none focus:ring-2 focus:ring-verde-claro bg-fundo-claro text-texto"
                            placeholder="Digite seu e-mail"
                            aria-required="true"
                        />

                        <label htmlFor="password" className="block text-texto font-medium mb-2">
                            Senha
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full mb-4 p-3 border border-strokes rounded-md focus:outline-none focus:ring-2 focus:ring-verde-claro bg-fundo-claro text-texto"
                            placeholder="Digite sua senha"
                            aria-required="true"
                        />

                        {error && (
                            <div role="alert" className="mb-4 text-red-700 bg-red-100 border border-red-400 rounded p-3 font-medium text-center">
                                {error}
                            </div>
                        )}

                        <Button type="submit" variant="outline" className="w-full border-verde-claro text-verde-escuro py-3 rounded-md shadow-sm hover:shadow-md mb-3">
                            Entrar
                        </Button>

                        <div className="text-center">
                            <p className="mt-2 text-texto">
                                Não tem uma conta?{' '}
                                <Link to="/cadastro" className="text-verde-escuro font-medium underline">
                                    Cadastre-se aqui
                                </Link>
                            </p>
                        </div>
                    </form>

                    <footer className="mt-6 text-center text-texto text-sm">Seja bem-vindo(a) à Agriconnect</footer>
                </div>
            </div>
        );
};

export default Login;
