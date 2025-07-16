import React, { useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { useBillCalculator } from '../hooks/useBillCalculator';
import { generatePlainTextBill, formatCurrency } from '../utils/messaging';
import { WhatsAppIcon } from '../components/icons/WhatsAppIcon';

export const Confirmation: React.FC = () => {
    const navigate = useNavigate();
    const { diners, items, assignments, payerInfo, addHistoryEntry, currentBillInfo } = useAppContext();
    const { dinerBills, totalBill } = useBillCalculator({ diners, items, assignments });

    useEffect(() => {
        // Redirect if there's no data to confirm
        if (items.length === 0 || diners.length === 0) {
            navigate('/scan', { replace: true });
        }
    }, [items, diners, navigate]);
    
    const handleFinalizeAndSave = useCallback(() => {
        addHistoryEntry({
            restaurant: currentBillInfo.restaurant || 'Cuenta sin nombre',
            total: totalBill,
            items,
            diners,
            assignments
        });
        // State is reset when a new bill is started, so we just navigate.
        // This fixes a bug that caused a redirect to /scan instead of /dashboard.
        navigate('/dashboard');
    }, [navigate, addHistoryEntry, items, diners, assignments, totalBill, currentBillInfo.restaurant]);

    const generateWhatsAppMessage = (bill: any): string => {
        const plainText = generatePlainTextBill(bill, payerInfo, true);
        return encodeURIComponent(plainText);
    }
    
    const formatPhoneNumber = (phone: string): string => {
        return `56${phone.replace(/[^0-9]/g, '')}`;
    }

    return (
        <div className="min-h-screen bg-brand-dark flex flex-col justify-center items-center p-4">
            <div className="text-center w-full max-w-md">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-500 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <h1 className="text-3xl font-bold text-brand-light mb-2">¡Cuentas Calculadas!</h1>
                <p className="text-brand-gray mb-8">
                    Revisa los totales y notifica a cada comensal. Al finalizar, la cuenta se guardará en tu historial.
                </p>
                
                <div className="space-y-4 text-left bg-brand-dark-secondary p-4 rounded-lg mb-8">
                    {dinerBills.map((bill) => (
                        <div key={bill.diner.id} className="flex justify-between items-center pb-3 border-b border-gray-700 last:border-b-0 last:pb-0">
                           <div>
                             <span className="text-brand-light font-semibold">{bill.diner.name}</span>
                             <p className="text-brand-gray font-mono text-sm">{formatCurrency(bill.total)}</p>
                           </div>
                            <div className="flex items-center gap-4">
                                {bill.diner.phone && (
                                     <a 
                                        href={`https://wa.me/${formatPhoneNumber(bill.diner.phone)}?text=${generateWhatsAppMessage(bill)}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-brand-gray hover:text-green-500 transition-colors"
                                        aria-label={`Enviar detalles por WhatsApp a ${bill.diner.name}`}
                                    >
                                        <WhatsAppIcon className="w-6 h-6"/>
                                     </a>
                                )}
                                 <Link 
                                    to={`/bill/${bill.diner.id}`} 
                                    className="text-brand-blue hover:underline text-sm font-semibold"
                                    aria-label={`Ver detalle de la cuenta de ${bill.diner.name}`}
                                 >
                                    Ver
                                 </Link>
                            </div>
                        </div>
                    ))}
                    {dinerBills.length === 0 && <p className="text-brand-gray text-center">No se asignó a ningún comensal.</p>}
                </div>
                
                <button 
                    onClick={handleFinalizeAndSave}
                    className="w-full bg-brand-blue text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition duration-300"
                >
                    Finalizar y Guardar en Historial
                </button>
            </div>
        </div>
    );
};