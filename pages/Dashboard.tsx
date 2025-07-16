import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { PlusIcon } from '../components/icons/PlusIcon';
import { useAppContext } from '../context/AppContext';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser, logout, history } = useAppContext();

  const handleLogout = () => {
    logout();
    navigate('/');
  }
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-CL', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    });
  }

  return (
    <div className="min-h-screen bg-brand-dark text-brand-light p-4 pt-16">
      <div className="max-w-md mx-auto">
        <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Hola, {currentUser?.name.split(' ')[0] || 'Invitado'}!</h1>
            {currentUser && (
                <button 
                    onClick={handleLogout} 
                    className="text-sm font-semibold text-brand-gray hover:text-white bg-brand-dark-secondary px-3 py-1 rounded-md transition-colors"
                >
                    Cerrar Sesión
                </button>
            )}
        </div>
        
        <h2 className="text-xl font-semibold text-brand-gray mb-4">Historial de Cuentas</h2>
        
        {history.length > 0 ? (
          <div className="space-y-3">
            {history.map(entry => (
              <Link to={`/history/${entry.id}`} key={entry.id} className="bg-brand-dark-secondary p-4 rounded-lg flex justify-between items-center hover:bg-gray-700 transition-colors duration-200">
                <div>
                  <p className="font-semibold">{entry.restaurant || "Cuenta sin nombre"}</p>
                  <p className="text-sm text-brand-gray">{formatDate(entry.date)}</p>
                </div>
                <p className="font-bold text-lg">${entry.total.toLocaleString('es-CL')}</p>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 px-4 bg-brand-dark-secondary rounded-lg">
            <p className="text-brand-gray">No tienes cuentas divididas aún.</p>
            <p className="text-brand-gray">¡Crea una para empezar!</p>
          </div>
        )}
      </div>

      <button
        onClick={() => navigate('/scan')}
        className="fixed bottom-6 right-6 bg-brand-blue text-white rounded-full p-4 shadow-lg hover:bg-blue-700 transition-transform transform hover:scale-110"
        aria-label="Crear nueva cuenta"
      >
        <PlusIcon className="h-8 w-8" />
      </button>
    </div>
  );
};