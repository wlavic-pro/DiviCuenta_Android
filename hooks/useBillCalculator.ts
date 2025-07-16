import { useMemo } from 'react';
import type { Diner, Item, Assignment, DinerBill } from '../types';

interface UseBillCalculatorProps {
    diners: Diner[];
    items: Item[];
    assignments: Assignment;
}

interface BillCalculatorResult {
    dinerBills: DinerBill[];
    totalBill: number;
}

export const useBillCalculator = ({ diners, items, assignments }: UseBillCalculatorProps): BillCalculatorResult => {
    const result = useMemo((): BillCalculatorResult => {
        let totalBillSubtotal = 0;

        const dinerBills = diners.map(diner => {
            const bill: DinerBill = {
                diner,
                items: [],
                subtotal: 0,
                tip: 0,
                total: 0
            };

            for (const itemId in assignments) {
                const assignedDinerIds = assignments[itemId];
                if (assignedDinerIds.includes(diner.id)) {
                    const item = items.find(i => i.id === itemId);
                    if (item) {
                        const sharedWithCount = assignedDinerIds.length;
                        const pricePerPerson = item.price / sharedWithCount;
                        bill.items.push({
                            name: item.name,
                            price: pricePerPerson,
                            sharedWith: sharedWithCount
                        });
                        bill.subtotal += pricePerPerson;
                    }
                }
            }

            bill.subtotal = Math.ceil(bill.subtotal);
            bill.tip = Math.ceil(bill.subtotal * 0.1);
            bill.total = bill.subtotal + bill.tip;

            return bill;
        });

        // Calculate total bill for the history entry
        items.forEach(item => {
            totalBillSubtotal += item.price;
        });
        
        const totalTip = Math.ceil(totalBillSubtotal * 0.1);
        const totalBill = totalBillSubtotal + totalTip;

        return { dinerBills, totalBill };
    }, [diners, items, assignments]);

    return result;
};