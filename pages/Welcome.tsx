import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LogoIcon } from '../components/icons/LogoIcon';

export const Welcome: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-brand-dark flex flex-col justify-center items-center p-4">
      <div className="text-center w-full max-w-sm">
        <LogoIcon className="h-24 w-24 text-brand-blue mx-auto mb-4" />
        <h1 className="text-4xl font-bold text-brand-light mb-2">DiviCuenta</h1>
        <p className="text-brand-gray mb-10">Divide la cuenta, no la amistad.</p>
        
        <div className="space-y-4">
          <button 
            onClick={() => navigate('/signup')}
            className="w-full bg-brand-blue text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition duration-300"
          >
            Crear Cuenta
          </button>
          <button 
            onClick={() => navigate('/login')}
            className="w-full bg-brand-dark-secondary text-white font-bold py-3 px-4 rounded-lg hover:bg-gray-700 transition duration-300"
          >
            Iniciar Sesión
          </button>
          <button 
            onClick={() => navigate('/scan')}
            className="w-full text-brand-gray font-semibold py-3 px-4 rounded-lg hover:text-white transition duration-300"
          >
            Probar sin registrarse
          </button>
        </div>
      </div>
    </div>
  );
};