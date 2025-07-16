import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { LogoIcon } from '../components/icons/LogoIcon';

export const Login: React.FC = () => {
    const navigate = useNavigate();
    const { login } = useAppContext();
    const [credentials, setCredentials] = useState({ email: '', password: '' });
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);
        if (!credentials.email || !credentials.password) {
            setError("Email y contraseña son requeridos.");
            setLoading(false);
            return;
        }
        try {
            await login(credentials.email, credentials.password);
            navigate('/dashboard');
        } catch (err: any) {
            setError(err.message || 'Error al iniciar sesión.');
        } finally {
            setLoading(false);
        }
    };
    
    const inputClass = "w-full bg-gray-700 text-white p-3 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent transition-shadow";

    return (
        <div className="min-h-screen bg-brand-dark flex flex-col justify-center items-center p-4">
          <div className="w-full max-w-sm">
            <div className="text-center mb-8">
                <Link to="/" aria-label="Volver a la página de inicio">
                    <LogoIcon className="h-16 w-16 text-brand-blue mx-auto mb-3" />
                </Link>
                <h1 className="text-3xl font-bold text-brand-light">Iniciar Sesión</h1>
                <p className="text-brand-gray">Bienvenido de vuelta.</p>
            </div>
            <form onSubmit={handleSubmit} className="bg-brand-dark-secondary shadow-md rounded-lg p-8 space-y-6">
                <input name="email" type="email" placeholder="Email" value={credentials.email} onChange={handleChange} className={inputClass} autoComplete="email" required autoFocus />
                <input name="password" type="password" placeholder="Contraseña" value={credentials.password} onChange={handleChange} className={inputClass} autoComplete="current-password" required />
                
                {error && <p className="text-red-500 text-sm text-center">{error}</p>}

                <button type="submit" disabled={loading} className="w-full bg-brand-blue text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition duration-300 disabled:bg-gray-500">
                    {loading ? 'Ingresando...' : 'Iniciar Sesión'}
                </button>
            </form>
             <p className="text-center text-brand-gray text-sm mt-6">
                ¿No tienes una cuenta?{' '}
                <Link to="/signup" className="font-semibold text-brand-blue hover:text-blue-400">
                    Regístrate
                </Link>
            </p>
          </div>
        </div>
    );
};
