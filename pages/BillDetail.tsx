import React, { useMemo, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { generatePlainTextBill, formatCurrency } from '../utils/messaging';
import { ShareIcon } from '../components/icons/ShareIcon';
import { Toast } from '../components/Toast';

export const BillDetail: React.FC = () => {
    const { dinerId } = useParams<{ dinerId: string }>();
    const navigate = useNavigate();
    const { items, diners, assignments, payerInfo } = useAppContext();
    const [toastMessage, setToastMessage] = useState('');

    useEffect(() => {
        if (toastMessage) {
            const timer = setTimeout(() => setToastMessage(''), 3000);
            return () => clearTimeout(timer);
        }
    }, [toastMessage]);

    const billDetails = useMemo(() => {
        const currentDiner = diners.find(d => d.id === dinerId);
        if (!currentDiner) return null;

        let subtotal = 0;
        const dinerItems = [];

        for (const itemId in assignments) {
            const assignedDinerIds = assignments[itemId];
            if (assignedDinerIds.includes(currentDiner.id)) {
                const item = items.find(i => i.id === itemId);
                if (item) {
                    const sharedWithCount = assignedDinerIds.length;
                    const pricePerPerson = Math.ceil(item.price / sharedWithCount);
                    dinerItems.push({ name: item.name, price: pricePerPerson, sharedWith: sharedWithCount });
                    subtotal += pricePerPerson;
                }
            }
        }
        
        subtotal = Math.ceil(subtotal);
        const tip = Math.ceil(subtotal * 0.1);
        const total = subtotal + tip;

        return {
            diner: currentDiner,
            items: dinerItems,
            subtotal,
            tip,
            total
        };
    }, [diners, dinerId, items, assignments]);

    const handleShare = async () => {
        if (!billDetails) return;
        
        const billObjectForMessage = {
            diner: billDetails.diner,
            items: billDetails.items.map(i => ({...i, price: i.price / i.sharedWith})), // Use original fraction for calc
            subtotal: billDetails.subtotal,
            tip: billDetails.tip,
            total: billDetails.total
        };

        const shareText = generatePlainTextBill(billObjectForMessage, payerInfo);

        if (navigator.share) {
            try {
                await navigator.share({
                    title: `Tu cuenta - ${billDetails.diner.name}`,
                    text: shareText,
                });
            } catch (error) {
                console.error('Error al compartir:', error);
            }
        } else {
            try {
                await navigator.clipboard.writeText(shareText);
                setToastMessage('Detalles de la cuenta copiados al portapapeles.');
            } catch (error) {
                console.error('Error al copiar al portapapeles:', error);
                setToastMessage('No se pudo copiar. Inténtalo manualmente.');
            }
        }
    };

    if (!billDetails) {
        return (
            <div className="min-h-screen bg-brand-dark flex flex-col justify-center items-center p-4">
                <h1 className="text-xl text-brand-gray">Comensal no encontrado.</h1>
                <button onClick={() => navigate('/confirm')} className="mt-4 text-brand-blue">Volver</button>
            </div>
        );
    }

    const { diner, items: dinerItems, subtotal, tip, total } = billDetails;

    return (
        <div className="min-h-screen bg-brand-dark-secondary text-brand-light p-4 pb-24">
             <Toast message={toastMessage} show={!!toastMessage} />
            <div className="max-w-md mx-auto">
                <div className="flex justify-start items-center pt-12 pb-8 relative">
                     <button onClick={() => navigate(-1)} className="absolute left-0 text-brand-gray hover:text-white">&larr; Volver</button>
                    <div className="text-center w-full">
                        <h1 className="text-3xl font-bold">Hola, {diner.name.split(' ')[0]}!</h1>
                        <p className="text-brand-gray">Este es tu detalle de la cuenta.</p>
                    </div>
                </div>
                
                <div className="bg-brand-dark p-4 rounded-lg mb-4">
                    <h2 className="font-semibold mb-3 text-lg">Tus productos</h2>
                    <div className="space-y-2">
                        {dinerItems.map((dItem, index) => (
                            <div key={index} className="flex justify-between items-center">
                                <div>
                                    <span>{dItem.name}</span>
                                    {dItem.sharedWith > 1 && <span className="text-xs text-brand-gray ml-2">(compartido entre {dItem.sharedWith})</span>}
                                </div>
                                <span className="font-mono">{formatCurrency(dItem.price)}</span>
                            </div>
                        ))}
                    </div>
                    <div className="border-t border-brand-dark-secondary my-3"></div>
                    <div className="flex justify-between font-bold text-lg">
                        <span>Subtotal</span>
                        <span className="font-mono">{formatCurrency(subtotal)}</span>
                    </div>
                </div>

                 <div className="bg-brand-dark p-4 rounded-lg mb-6">
                    <div className="flex justify-between items-center text-brand-gray">
                        <span>Subtotal</span>
                        <span>{formatCurrency(subtotal)}</span>
                    </div>
                    <div className="flex justify-between items-center text-brand-gray">
                        <span>Propina sugerida (10%)</span>
                        <span>{formatCurrency(tip)}</span>
                    </div>
                    <div className="border-t border-brand-dark-secondary my-3"></div>
                    <div className="flex justify-between font-bold text-2xl text-brand-blue">
                        <span>Total a Pagar</span>
                        <span>{formatCurrency(total)}</span>
                    </div>
                 </div>

                <div className="bg-brand-dark p-4 rounded-lg">
                    <h2 className="font-semibold mb-3 text-lg">Datos para transferir</h2>
                    <div className="space-y-2 text-brand-gray">
                        <div className="flex justify-between"><span>Nombre:</span> <span className="font-mono text-brand-light">{payerInfo.name}</span></div>
                        <div className="flex justify-between"><span>RUT:</span> <span className="font-mono text-brand-light">{payerInfo.rut}</span></div>
                        <div className="flex justify-between"><span>Banco:</span> <span className="font-mono text-brand-light">{payerInfo.bank}</span></div>
                        <div className="flex justify-between"><span>Tipo Cuenta:</span> <span className="font-mono text-brand-light">{payerInfo.accountType}</span></div>
                        <div className="flex justify-between"><span>N° Cuenta:</span> <span className="font-mono text-brand-light">{payerInfo.accountNumber}</span></div>
                    </div>
                </div>

                 <button 
                    onClick={handleShare}
                    className="w-full mt-6 bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition duration-300 flex items-center justify-center gap-2">
                    <ShareIcon className="w-5 h-5" />
                    Compartir Detalle
                </button>
            </div>
        </div>
    );
};