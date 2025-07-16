
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { useBillCalculator } from '../hooks/useBillCalculator';
import { generatePlainTextBill } from '../utils/messaging';
import { PlusIcon } from '../components/icons/PlusIcon';

const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
};

export const AssignDiners: React.FC = () => {
  const navigate = useNavigate();
  const { items, diners, addDiner, assignments, toggleAssignment, payerInfo } = useAppContext();
  const [newDinerName, setNewDinerName] = useState('');
  const [newDinerEmail, setNewDinerEmail] = useState('');
  const [newDinerPhone, setNewDinerPhone] = useState('');
  const [isAddingDiner, setIsAddingDiner] = useState(false);
  const [addDinerError, setAddDinerError] = useState<string | null>(null);
  
  const { dinerBills } = useBillCalculator({ diners, items, assignments });

  const hasAssignments = Object.values(assignments).some(dinerIds => dinerIds.length > 0);

  const handleAddDiner = () => {
    setAddDinerError(null);
    const name = newDinerName.trim();
    const email = newDinerEmail.trim();
    const phone = newDinerPhone.trim();

    if (!name) {
        setAddDinerError("El nombre es obligatorio.");
        return;
    }

    if (!email && !phone) {
        setAddDinerError("Se requiere un email o un teléfono (WhatsApp).");
        return;
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        setAddDinerError("El formato del email es incorrecto.");
        return;
    }

    addDiner(name, { 
        email: email || undefined, 
        phone: phone || undefined 
    });
    
    handleCancelAddDiner();
  };

  const handleCancelAddDiner = () => {
    setIsAddingDiner(false);
    setNewDinerName('');
    setNewDinerEmail('');
    setNewDinerPhone('');
    setAddDinerError(null);
  }

  const handleFinalize = () => {
    dinerBills.forEach(bill => {
        if (bill.diner.email) {
            const subject = encodeURIComponent("Detalle de tu cuenta");
            const body = encodeURIComponent(generatePlainTextBill(bill, payerInfo));
            const mailtoLink = `mailto:${bill.diner.email}?subject=${subject}&body=${body}`;
            window.open(mailtoLink, '_blank');
        }
    });
    navigate('/confirm');
  }

  return (
    <div className="min-h-screen bg-brand-dark text-brand-light p-4 pb-24">
      <div className="max-w-md mx-auto">
        <div className="flex justify-between items-center mb-6 pt-12">
            <button onClick={() => navigate('/edit')} className="text-brand-gray hover:text-white">&larr; Volver</button>
            <h1 className="text-2xl font-bold">Asignar Items</h1>
            <div className="w-12"></div>
        </div>

        {/* Diners Row */}
        <div className="mb-8">
            <h2 className="text-lg font-semibold mb-3">Comensales</h2>
            <div className="flex items-center gap-3 flex-wrap">
                {diners.map(diner => (
                    <div key={diner.id} className="flex flex-col items-center gap-1">
                        <div className="w-12 h-12 rounded-full bg-brand-blue flex items-center justify-center font-bold text-lg">
                            {getInitials(diner.name)}
                        </div>
                        <span className="text-sm text-brand-gray">{diner.name.split(' ')[0]}</span>
                    </div>
                ))}
                
                {!isAddingDiner && (
                    <button 
                        onClick={() => setIsAddingDiner(true)}
                        className="w-12 h-12 rounded-full bg-brand-dark-secondary border-2 border-dashed border-brand-gray flex items-center justify-center hover:bg-gray-700 transition-colors">
                        <PlusIcon className="w-6 h-6 text-brand-gray"/>
                    </button>
                )}
            </div>
        </div>
        
        {/* Add Diner Form */}
        {isAddingDiner && (
            <div className="bg-brand-dark-secondary p-4 rounded-lg mb-8">
                <h3 className="text-lg font-semibold mb-4 text-brand-light">Agregar Nuevo Comensal</h3>
                <div className="space-y-4">
                    <input
                        type="text"
                        placeholder="Nombre completo"
                        value={newDinerName}
                        onChange={(e) => setNewDinerName(e.target.value)}
                        className="w-full bg-gray-700 text-white p-2 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent"
                        autoFocus
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        value={newDinerEmail}
                        onChange={(e) => setNewDinerEmail(e.target.value)}
                        className="w-full bg-gray-700 text-white p-2 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent"
                    />

                    <div className="flex items-center">
                        <span className="inline-flex items-center px-3 text-brand-gray bg-gray-800 rounded-l-lg border-t border-b border-l border-gray-600 h-11">
                            +56
                        </span>
                        <input
                            type="tel"
                            placeholder="9 1234 5678 (WhatsApp)"
                            value={newDinerPhone}
                            onChange={(e) => setNewDinerPhone(e.target.value)}
                            className="w-full bg-gray-700 text-white p-2 rounded-r-lg border-t border-b border-r border-gray-600 focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent"
                        />
                    </div>
                </div>

                {addDinerError ? 
                    <p className="text-red-500 text-sm mt-3">{addDinerError}</p> :
                    <p className="text-xs text-brand-gray mt-3">Es obligatorio agregar un email o un teléfono para poder enviar la cuenta.</p>
                }
                
                <div className="flex justify-end gap-3 mt-4">
                    <button onClick={handleCancelAddDiner} className="font-semibold py-2 px-4 rounded-lg text-brand-gray hover:text-white transition duration-300">
                        Cancelar
                    </button>
                    <button onClick={handleAddDiner} className="bg-brand-blue text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300">
                        Guardar
                    </button>
                </div>
            </div>
        )}

        {/* Items List */}
        <div className="space-y-4">
            <h2 className="text-lg font-semibold mb-3">Productos</h2>
            {items.map(item => (
                <div key={item.id} className="bg-brand-dark-secondary p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-3">
                        <span className="font-semibold">{item.name}</span>
                        <span className="text-brand-gray">${item.price.toLocaleString('es-CL')}</span>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                        {diners.map(diner => (
                            <button
                                key={diner.id}
                                onClick={() => toggleAssignment(item.id, diner.id)}
                                className={`px-3 py-1 text-sm rounded-full transition-colors ${
                                    (assignments[item.id] || []).includes(diner.id)
                                    ? 'bg-brand-blue text-white'
                                    : 'bg-gray-600 text-gray-300'
                                }`}
                            >
                                {diner.name.split(' ')[0]}
                            </button>
                        ))}
                    </div>
                </div>
            ))}
        </div>

         <div className="fixed bottom-0 left-0 right-0 p-4 bg-brand-dark border-t border-brand-dark-secondary">
            <div className="max-w-md mx-auto">
            <button
                onClick={handleFinalize}
                className="w-full bg-brand-blue text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition duration-300 disabled:bg-gray-500"
                disabled={diners.length === 0 || !hasAssignments}
            >
                Finalizar Asignación
            </button>
            </div>
        </div>
      </div>
    </div>
  );
};
