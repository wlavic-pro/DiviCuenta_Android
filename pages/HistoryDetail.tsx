import React, { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { useBillCalculator } from '../hooks/useBillCalculator';
import { formatCurrency } from '../utils/messaging';
import { CheckCircleIcon } from '../components/icons/CheckCircleIcon';

export const HistoryDetail: React.FC = () => {
    const { historyId } = useParams<{ historyId: string }>();
    const navigate = useNavigate();
    const { history, updatePaymentStatus } = useAppContext();

    const historyEntry = useMemo(() => {
        return history.find(entry => entry.id === historyId);
    }, [history, historyId]);

    const { dinerBills } = useBillCalculator({
        diners: historyEntry?.diners || [],
        items: historyEntry?.items || [],
        assignments: historyEntry?.assignments || {},
    });

    const paymentSummary = useMemo(() => {
        if (!historyEntry) return { paidAmount: 0, remainingAmount: 0, isFullyPaid: false };
        
        const paidAmount = dinerBills.reduce((acc, bill) => {
            return historyEntry.payments[bill.diner.id] ? acc + bill.total : acc;
        }, 0);

        const remainingAmount = historyEntry.total - paidAmount;
        const isFullyPaid = remainingAmount <= 0;

        return { paidAmount, remainingAmount, isFullyPaid };

    }, [historyEntry, dinerBills]);


    if (!historyEntry) {
        return (
            <div className="min-h-screen bg-brand-dark flex flex-col justify-center items-center p-4">
                <h1 className="text-xl text-brand-gray">Entrada de historial no encontrada.</h1>
                <button onClick={() => navigate('/dashboard')} className="mt-4 text-brand-blue">Volver al Dashboard</button>
            </div>
        );
    }
    
    const { restaurant, date, total } = historyEntry;
    const { paidAmount, remainingAmount, isFullyPaid } = paymentSummary;

    return (
        <div className="min-h-screen bg-brand-dark text-brand-light p-4 pb-24">
            <div className="max-w-md mx-auto">
                <div className="flex justify-start items-center pt-12 pb-8 relative">
                    <button onClick={() => navigate('/dashboard')} className="absolute left-0 text-brand-gray hover:text-white">&larr; Dashboard</button>
                    <div className="text-center w-full">
                        <h1 className="text-3xl font-bold">{restaurant}</h1>
                        <p className="text-brand-gray">{new Date(date).toLocaleDateString('es-CL', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    </div>
                </div>

                {/* Financial Summary */}
                <div className="grid grid-cols-3 gap-4 mb-8 text-center">
                    <div>
                        <p className="text-sm text-brand-gray">Total Cuenta</p>
                        <p className="text-xl font-bold">{formatCurrency(total)}</p>
                    </div>
                    <div>
                        <p className="text-sm text-brand-gray">Pagado</p>
                        <p className="text-xl font-bold text-green-400">{formatCurrency(paidAmount)}</p>
                    </div>
                    <div>
                        <p className="text-sm text-brand-gray">Restante</p>
                        <p className={`text-xl font-bold ${isFullyPaid ? 'text-brand-gray' : 'text-yellow-400'}`}>{formatCurrency(remainingAmount)}</p>
                    </div>
                </div>
                
                {isFullyPaid && (
                    <div className="bg-green-500/20 text-green-300 p-4 rounded-lg mb-6 flex items-center justify-center gap-3">
                       <CheckCircleIcon className="w-6 h-6"/>
                       <span className="font-bold">¡Cuenta Saldada!</span>
                    </div>
                )}

                {/* Diners List */}
                <div className="space-y-3">
                    <h2 className="text-lg font-semibold text-brand-gray mb-2">Pagos de Comensales</h2>
                    {dinerBills.map(bill => {
                        const isPaid = historyEntry.payments[bill.diner.id];
                        return (
                             <div key={bill.diner.id} className="bg-brand-dark-secondary p-4 rounded-lg flex justify-between items-center">
                                <div>
                                    <p className="font-semibold">{bill.diner.name}</p>
                                    <p className={`text-sm font-mono ${isPaid ? 'text-green-400' : 'text-brand-light'}`}>{formatCurrency(bill.total)}</p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className={`text-xs font-bold py-1 px-2 rounded-full ${isPaid ? 'bg-green-500/20 text-green-300' : 'bg-yellow-500/20 text-yellow-300'}`}>
                                        {isPaid ? 'Pagado' : 'Pendiente'}
                                    </span>
                                    {!isPaid && !isFullyPaid && (
                                        <button 
                                            onClick={() => updatePaymentStatus(historyEntry.id, bill.diner.id, true)}
                                            className="text-brand-blue hover:underline text-sm font-semibold"
                                        >
                                            Marcar Pagado
                                        </button>
                                    )}
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    );
};