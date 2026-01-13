import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "../../components/button";
import { useAuth } from "../../contexts/AuthContext";

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !password) {
            setError('Por favor, preencha todos os campos.');
            return;
        }

        setError('');
        setIsLoading(true);

        try {
            await login(email, password);
            navigate('/'); // Redireciona para a página inicial após login
        } catch (error: any) {
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div
            className="min-h-screen w-full bg-cover bg-center flex items-center justify-center"
            style={{
                backgroundImage: `url(/img/LoginCadastro.png)`,
            }}
        >
            <div className="absolute inset-0 bg-black/40" />

            <div className="relative z-10 w-full max-w-2xl px-6 py-12">
                <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl mx-auto max-w-lg w-full">
                    <div className="p-8">
                        <div className="text-center mb-6">
                                <img
                                    src="/img/logoagriconect.svg"
                                    alt="Agriconnect"
                                    className="w-36 h-auto absolute left-1/2 -translate-x-1/2 -top-16 bg-white rounded-full p-3"
                                />
                            <p className="text-sm text-gray-600 mt-2">Acesse a sua conta</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            {error && (
                                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
                                    {error}
                                </div>
                            )}

                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-verde-claro"
                                    placeholder="Digite aqui seu melhor email"
                                />
                            </div>

                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">Senha</label>
                                <input
                                    type="password"
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-verde-claro"
                                    placeholder="Digite sua senha"
                                />
                            </div>

                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-verde-escuro hover:bg-verde-claro text-white py-3 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-lg"
                            >
                                {isLoading ? 'Entrando...' : 'Entrar'}
                            </Button>
                        </form>

                        <div className="mt-6 text-center">
                            <p className="text-sm text-gray-600">Não tem uma conta? <Link to="/cadastro" className="text-verde-claro font-medium">Cadastre-se</Link></p>
                        </div>

                        <div className="mt-6 pt-6 border-t border-gray-100">
                            <div className="text-center">
                                <p className="text-sm text-gray-600 mb-3">Você é vendedor?</p>
                                <Link to="/login/vendedor" className="inline-flex items-center gap-2 px-4 py-2 bg-verde-claro text-white rounded-lg hover:bg-verde-escuro transition-colors font-medium">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                    </svg>
                                    Login como Vendedor
                                </Link>
                                <div className="mt-3">
                                    <Link to="/" className="inline-flex items-center gap-2 text-verde-claro hover:text-verde-escuro transition-colors font-medium">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3" />
                                        </svg>
                                        Início
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;