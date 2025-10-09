import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../../components/button';
import { useAuth } from '../../contexts/AuthContext';
import feiraImg from '../../assets/img/LoginCadastro.png';

const Login: React.FC = () => {
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
        <div className="min-h-screen flex flex-col">
            <div className="flex flex-1">
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
                            <h2 className="text-3xl font-bold mb-2">Bem-vindo de volta!</h2>
                            <p className="text-lg opacity-90">Conecte-se à maior feira livre online da Amazônia</p>
                        </div>
                    </div>
                </div>

                {/* Lado do Formulário */}
                <div className="w-full lg:w-[30%] flex items-center justify-center px-6 py-12 bg-fundo-claro">
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
                            <p className="text-texto text-sm mt-2">Faça login para acessar sua conta</p>
                        </div>

                        {/* Formulário */}
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {error && (
                                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
                                    {error}
                                </div>
                            )}

                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-texto mb-2">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-verde-claro focus:border-transparent"
                                    placeholder="seu@email.com"
                                />
                            </div>

                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-texto mb-2">
                                    Senha
                                </label>
                                <input
                                    type="password"
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-verde-claro focus:border-transparent"
                                    placeholder="Sua senha"
                                />
                            </div>

                            <Button 
                                type="submit" 
                                disabled={isLoading}
                                className="w-full bg-verde-escuro hover:bg-verde-claro text-white py-2 px-4 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? 'Entrando...' : 'Entrar'}
                            </Button>
                        </form>

                        {/* Links */}
                        <div className="mt-6 text-center space-y-4">
                            <p className="text-sm text-texto">
                                Não tem uma conta?{' '}
                                <Link to="/cadastro" className="text-verde-claro hover:text-verde-escuro font-medium">
                                    Cadastre-se
                                </Link>
                            </p>
                            
                            <div className="pt-4 border-t border-gray-200">
                                <p className="text-sm text-texto mb-3">
                                    É vendedor?{' '}
                                    <Link to="/login/vendedor" className="text-green-600 hover:text-green-700 font-medium">
                                        Fazer login como vendedor
                                    </Link>
                                </p>
                            </div>
                            
                            <div className="pt-4 border-t border-gray-200">
                                <p className="text-sm text-texto mb-3">Ou explore sem cadastro:</p>
                                <Link 
                                    to="/" 
                                    className="inline-flex items-center gap-2 text-verde-claro hover:text-verde-escuro transition-colors font-medium mr-4"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3" />
                                    </svg>
                                    Início
                                </Link>
                                <Link 
                                    to="/associacao" 
                                    className="inline-flex items-center gap-2 text-verde-claro hover:text-verde-escuro transition-colors font-medium"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3" />
                                    </svg>
                                    Ir para a feira livre
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;