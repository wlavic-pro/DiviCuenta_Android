import type { DinerBill, PayerInfo } from '../types';

export const formatCurrency = (value: number): string => {
    return `$${value.toLocaleString('es-CL')}`;
};

export const generatePlainTextBill = (bill: DinerBill, payerInfo: PayerInfo, forWhatsApp: boolean = false): string => {
    const itemsText = bill.items.map(i =>
        `- ${i.name}${i.sharedWith > 1 ? ` (dividido entre ${i.sharedWith})` : ''}: ${formatCurrency(Math.ceil(i.price))}`
    ).join('\n');

    const bold = forWhatsApp ? '*' : '';

    return `Hola ${bill.diner.name.split(' ')[0]}! ${forWhatsApp ? '👋' : ''} Tu parte de la cuenta es:\n\n` +
        `TUS PRODUCTOS\n${itemsText}\n` +
        `---------------------\n` +
        `Subtotal: ${formatCurrency(bill.subtotal)}\n` +
        `Propina (10%): ${formatCurrency(bill.tip)}\n` +
        `${bold}TOTAL A PAGAR: ${formatCurrency(bill.total)}${bold}\n\n` +
        `---------------------\n` +
        `DATOS PARA TRANSFERIR\n` +
        `${bold}Nombre:${bold} ${payerInfo.name}\n` +
        `${bold}RUT:${bold} ${payerInfo.rut}\n` +
        `${bold}Banco:${bold} ${payerInfo.bank}\n` +
        `${bold}Tipo de Cuenta:${bold} ${payerInfo.accountType}\n` +
        `${bold}N° Cuenta:${bold} ${payerInfo.accountNumber}\n\n` +
        `¡Gracias!`;
};
