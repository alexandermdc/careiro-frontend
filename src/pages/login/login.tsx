import React, { useState } from 'react';

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
        <div className="min-h-screen w-screen flex flex-col justify-center items-center bg-green-50 px-4">
            <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-10">
                {/* Cabeçalho com identidade da feira */}
                <header className="mb-8 text-center">
                    <h1 className="text-4xl font-extrabold text-green-800 mb-2">
                        Agriconect
                    </h1>
                    <p className="text-green-700 font-semibold text-lg">
                        Feira Livre Online - Conectando você ao campo!
                    </p>
                </header>

                <form onSubmit={handleSubmit} aria-label="Formulário de login Agriconect">
                    <div className="mb-6">
                        <label
                            htmlFor="email"
                            className="block text-green-900 font-semibold mb-2"
                        >
                            E-mail
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            className="w-full px-4 py-3 border border-green-300 rounded focus:outline-none focus:ring-4 focus:ring-green-400"
                            placeholder="Digite seu e-mail"
                            aria-required="true"
                            aria-describedby="emailHelp"
                        />
                        <small id="emailHelp" className="text-green-600">
                            Exemplo: usuario@exemplo.com
                        </small>
                    </div>

                    <div className="mb-6">
                        <label
                            htmlFor="password"
                            className="block text-green-900 font-semibold mb-2"
                        >
                            Senha
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            className="w-full px-4 py-3 border border-green-300 rounded focus:outline-none focus:ring-4 focus:ring-green-400"
                            placeholder="Digite sua senha"
                            aria-required="true"
                        />
                    </div>

                    {error && (
                        <div
                            role="alert"
                            className="mb-6 text-red-700 bg-red-100 border border-red-400 rounded p-3 font-semibold text-center"
                        >
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded transition duration-200 focus:outline-none focus:ring-4 focus:ring-green-500"
                    >
                        Entrar
                    </button>

                    {/* Linha para cadastro */}
                    <p className="mt-4 text-center text-green-800 font-medium">
                        Não tem uma conta?{' '}
                        <a
                            href="/cadastro"
                            className="text-green-600 hover:text-green-900 font-bold underline"
                        >
                            Cadastre-se aqui
                        </a>
                    </p>
                </form>
            </div>

            {/* Rodapé com mensagem acolhedora */}
            <footer className="mt-8 text-center text-green-800 font-medium">
                Seja bem-vindo(a) à Agriconect — a sua feira livre digital!
            </footer>
        </div>
    );
};

export default Login;
