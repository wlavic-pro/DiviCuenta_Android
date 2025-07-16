export interface Item {
  id: string;
  name: string;
  price: number;
}

export interface Diner {
  id:string;
  name: string;
  email?: string;
  phone?: string;
}

export interface Assignment {
  [itemId: string]: string[]; // itemId -> array of dinerIds
}

export interface PayerInfo {
  name: string;
  rut: string;
  bank: string;
  accountType: string;
  accountNumber: string;
}

export interface User extends PayerInfo {
  id: string;
  email: string;
  phone: string;
  password?: string;
}

export interface HistoryEntry {
  id: string;
  date: string; // ISO Date string
  restaurant: string;
  total: number;
  items: Item[];
  diners: Diner[];
  assignments: Assignment;
  payments: { [dinerId: string]: boolean }; // dinerId -> paid status
}

export interface DinerBill {
    diner: Diner;
    items: {
        name: string;
        price: number;
        sharedWith: number;
    }[];
    subtotal: number;
    tip: number;
    total: number;
}