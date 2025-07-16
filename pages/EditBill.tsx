
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { PlusIcon } from '../components/icons/PlusIcon';
import { TrashIcon } from '../components/icons/TrashIcon';

export const EditBill: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { items, updateItem, deleteItem, addItem, currentBillInfo, updateCurrentBillInfo } = useAppContext();

  const isManualEntry = location.state?.manualEntry === true;
  const pageTitle = isManualEntry ? 'Ingresar Cuenta Manual' : 'Revisar Boleta';

  const handleAddItem = () => {
    addItem('Nuevo Producto', 0);
  };
  
  const handlePriceChange = (id: string, value: string) => {
    const sanitizedValue = value.replace(/[^0-9]/g, '');
    const price = parseInt(sanitizedValue, 10);
    updateItem(id, { price: isNaN(price) ? 0 : price });
  }

  return (
    <div className="min-h-screen bg-brand-dark text-brand-light p-4 pb-24">
      <div className="max-w-md mx-auto">
        <div className="flex justify-between items-center mb-6 pt-12">
            <button onClick={() => navigate('/scan')} className="text-brand-gray hover:text-white">&larr; Volver</button>
            <h1 className="text-2xl font-bold">{pageTitle}</h1>
            <div className="w-12"></div>
        </div>

        <div className="mb-6">
            <label htmlFor="restaurantName" className="block text-sm font-medium text-brand-gray mb-2">Nombre del Restaurante (opcional)</label>
            <input
                id="restaurantName"
                type="text"
                placeholder="Ej: La Pizzería"
                value={currentBillInfo.restaurant}
                onChange={e => updateCurrentBillInfo({ restaurant: e.target.value })}
                className="w-full bg-brand-dark-secondary p-3 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-blue"
              />
        </div>

        <div className="space-y-3 mb-6">
          {items.map(item => (
            <div key={item.id} className="bg-brand-dark-secondary p-3 rounded-lg flex items-center gap-3">
              <input
                type="text"
                value={item.name}
                onChange={e => updateItem(item.id, { name: e.target.value })}
                className="flex-grow bg-transparent focus:outline-none"
              />
              <span className="text-brand-gray">$</span>
              <input
                type="text"
                inputMode="numeric"
                value={item.price.toLocaleString('es-CL')}
                onChange={e => handlePriceChange(item.id, e.target.value)}
                placeholder="0"
                className="w-24 bg-transparent text-right focus:outline-none"
              />
              <button onClick={() => deleteItem(item.id)} className="text-brand-gray hover:text-red-500">
                <TrashIcon className="w-5 h-5"/>
              </button>
            </div>
          ))}
        </div>
        
        <button 
          onClick={handleAddItem}
          className="w-full flex justify-center items-center gap-2 border-2 border-dashed border-brand-gray text-brand-gray font-semibold py-3 px-4 rounded-lg hover:bg-brand-dark-secondary hover:text-white transition duration-300"
        >
          <PlusIcon className="w-5 h-5"/>
          Agregar Item Manualmente
        </button>

        <div className="fixed bottom-0 left-0 right-0 p-4 bg-brand-dark border-t border-brand-dark-secondary">
          <div className="max-w-md mx-auto">
            <button
              onClick={() => navigate('/assign')}
              className="w-full bg-brand-blue text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition duration-300 disabled:bg-gray-500"
              disabled={items.length === 0}
            >
              Confirmar y Asignar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
