import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { LogoIcon } from '../components/icons/LogoIcon';
import type { User } from '../types';

export const SignUp: React.FC = () => {
  const navigate = useNavigate();
  const { signUp } = useAppContext();
  const [formData, setFormData] = useState<Omit<User, 'id'>>({
    rut: '',
    name: '',
    email: '',
    phone: '',
    bank: '',
    accountType: '',
    accountNumber: '',
    password: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (Object.values(formData).some(value => !value)) {
        setError('Todos los campos son obligatorios.');
        setLoading(false);
        return;
    }

    try {
      await signUp(formData);
      navigate('/login');
    } catch (err: any) {
      setError(err.message || 'Ocurrió un error al crear la cuenta.');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full bg-gray-700 text-white p-3 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent transition-shadow";

  return (
    <div className="min-h-screen bg-brand-dark flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
            <Link to="/" aria-label="Volver a la página de inicio">
                <LogoIcon className="h-16 w-16 text-brand-blue mx-auto mb-3" />
            </Link>
            <h1 className="text-3xl font-bold text-brand-light">Crear Cuenta</h1>
            <p className="text-brand-gray">Ingresa tus datos para registrarte.</p>
        </div>
        <form onSubmit={handleSubmit} className="bg-brand-dark-secondary shadow-md rounded-lg p-6 sm:p-8 space-y-4">
            <input name="name" placeholder="Nombre Completo" value={formData.name} onChange={handleChange} className={inputClass} autoComplete="name" required />
            <input name="email" type="email" placeholder="Email" value={formData.email} onChange={handleChange} className={inputClass} autoComplete="email" required />
            <input name="password" type="password" placeholder="Contraseña" value={formData.password} onChange={handleChange} className={inputClass} autoComplete="new-password" required />
            <div className="border-t border-gray-700 my-4"></div>
            <p className="text-sm text-brand-gray pb-2">Datos para transferencia</p>
            <input name="rut" placeholder="RUT" value={formData.rut} onChange={handleChange} className={inputClass} required />
            <input name="phone" placeholder="Teléfono" value={formData.phone} onChange={handleChange} className={inputClass} autoComplete="tel" required />
            <input name="bank" placeholder="Banco" value={formData.bank} onChange={handleChange} className={inputClass} required />
            <input name="accountType" placeholder="Tipo de Cuenta (Ej: Corriente, Vista)" value={formData.accountType} onChange={handleChange} className={inputClass} required />
            <input name="accountNumber" placeholder="Número de Cuenta" value={formData.accountNumber} onChange={handleChange} className={inputClass} required />
            
            {error && <p className="text-red-500 text-sm text-center pt-2">{error}</p>}

            <button type="submit" disabled={loading} className="w-full bg-brand-blue text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition duration-300 disabled:bg-gray-500 mt-4">
              {loading ? 'Creando...' : 'Crear Cuenta'}
            </button>
        </form>
        <p className="text-center text-brand-gray text-sm mt-6">
          ¿Ya tienes una cuenta?{' '}
          <Link to="/login" className="font-semibold text-brand-blue hover:text-blue-400">
            Inicia Sesión
          </Link>
        </p>
      </div>
    </div>
  );
};
