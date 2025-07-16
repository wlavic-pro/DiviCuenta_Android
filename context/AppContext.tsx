import React, { createContext, useState, useContext, ReactNode, useCallback, useMemo } from 'react';
import type { Item, Diner, Assignment, PayerInfo, User, HistoryEntry } from '../types';

interface AppContextType {
  items: Item[];
  setItems: React.Dispatch<React.SetStateAction<Item[]>>;
  diners: Diner[];
  addDiner: (name: string, contact: { email?: string, phone?: string }) => Diner;
  assignments: Assignment;
  toggleAssignment: (itemId: string, dinerId: string) => void;
  getDinersAssignedToItem: (itemId: string) => Diner[];
  payerInfo: PayerInfo;
  updateItem: (id: string, updates: Partial<Pick<Item, 'name' | 'price'>>) => void;
  deleteItem: (id: string) => void;
  addItem: (name: string, price: number) => void;
  resetState: () => void;
  // Auth
  currentUser: User | null;
  signUp: (userData: Omit<User, 'id'>) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  // History
  history: HistoryEntry[];
  addHistoryEntry: (billData: Omit<HistoryEntry, 'id' | 'date' | 'payments'>) => void;
  updatePaymentStatus: (historyId: string, dinerId: string, isPaid: boolean) => void;
  // Current Bill Temp Info
  currentBillInfo: { restaurant: string };
  updateCurrentBillInfo: (info: Partial<{ restaurant: string }>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const initialPayerInfo: PayerInfo = {
    name: "Juan Perez (Invitado)",
    rut: "12.345.678-9",
    bank: "Banco Estado",
    accountType: "Cuenta Corriente",
    accountNumber: "1234567890",
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<Item[]>([]);
  const [diners, setDiners] = useState<Diner[]>([]);
  const [assignments, setAssignments] = useState<Assignment>({});
  const [currentBillInfo, setCurrentBillInfo] = useState({ restaurant: '' });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
        const storedUser = localStorage.getItem('divicuenta_currentUser');
        return storedUser ? JSON.parse(storedUser) : null;
    } catch { return null; }
  });

  const [history, setHistory] = useState<HistoryEntry[]>(() => {
    try {
        const storedHistory = localStorage.getItem('divicuenta_history');
        return storedHistory ? JSON.parse(storedHistory) : [];
    } catch { return []; }
  });

  const resetState = useCallback(() => {
    setItems([]);
    setDiners([]);
    setAssignments({});
    setCurrentBillInfo({ restaurant: '' });
  }, []);
  
  const signUp = useCallback(async (userData: Omit<User, 'id'>) => {
    const users: User[] = JSON.parse(localStorage.getItem('divicuenta_users') || '[]');
    const existingUser = users.find(u => u.email === userData.email);
    if (existingUser) throw new Error('El email ya está registrado.');
    const newUser: User = { ...userData, id: `user-${Date.now()}` };
    users.push(newUser);
    localStorage.setItem('divicuenta_users', JSON.stringify(users));
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const users: User[] = JSON.parse(localStorage.getItem('divicuenta_users') || '[]');
    const foundUser = users.find(u => u.email === email && u.password === password);
    if (foundUser) {
        const { password, ...userToStore } = foundUser;
        localStorage.setItem('divicuenta_currentUser', JSON.stringify(userToStore));
        setCurrentUser(userToStore as User);
    } else {
        throw new Error('Email o contraseña incorrectos.');
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('divicuenta_currentUser');
    setCurrentUser(null);
  }, []);

  const payerInfo = useMemo((): PayerInfo => {
    if (currentUser) {
        return {
            name: currentUser.name,
            rut: currentUser.rut,
            bank: currentUser.bank,
            accountType: currentUser.accountType,
            accountNumber: currentUser.accountNumber,
        };
    }
    return initialPayerInfo;
  }, [currentUser]);

  const addDiner = (name: string, contact: { email?: string, phone?: string }): Diner => {
    const newDiner = { id: `diner-${Date.now()}`, name, ...contact };
    setDiners(prev => [...prev, newDiner]);
    return newDiner;
  };

  const toggleAssignment = (itemId: string, dinerId: string) => {
    setAssignments(prev => {
      const currentDiners = prev[itemId] || [];
      const isAssigned = currentDiners.includes(dinerId);
      const newDiners = isAssigned 
        ? currentDiners.filter(id => id !== dinerId)
        : [...currentDiners, dinerId];
      return { ...prev, [itemId]: newDiners };
    });
  };

  const getDinersAssignedToItem = (itemId: string): Diner[] => {
    const dinerIds = assignments[itemId] || [];
    return diners.filter(diner => dinerIds.includes(diner.id));
  }

  const updateItem = (id: string, updates: Partial<Pick<Item, 'name' | 'price'>>) => {
    setItems(prev => prev.map(item => item.id === id ? { ...item, ...updates } : item));
  };
  
  const deleteItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
    setAssignments(prev => {
        const newAssignments = {...prev};
        delete newAssignments[id];
        return newAssignments;
    })
  };

  const addItem = (name: string, price: number) => {
    const newItem = { id: `item-${Date.now()}`, name, price };
    setItems(prev => [...prev, newItem]);
  };
  
  const updateCurrentBillInfo = (info: Partial<{ restaurant: string }>) => {
    setCurrentBillInfo(prev => ({...prev, ...info}));
  };

  const addHistoryEntry = useCallback((billData: Omit<HistoryEntry, 'id' | 'date' | 'payments'>) => {
    setHistory(prevHistory => {
        const newEntry: HistoryEntry = {
            ...billData,
            id: `hist-${Date.now()}`,
            date: new Date().toISOString(),
            payments: billData.diners.reduce((acc, diner) => {
                acc[diner.id] = false; // Initialize all as unpaid
                return acc;
            }, {} as { [dinerId: string]: boolean })
        };
        const updatedHistory = [newEntry, ...prevHistory];
        localStorage.setItem('divicuenta_history', JSON.stringify(updatedHistory));
        return updatedHistory;
    });
  }, []);

  const updatePaymentStatus = useCallback((historyId: string, dinerId: string, isPaid: boolean) => {
    setHistory(prevHistory => {
        const updatedHistory = prevHistory.map(entry => {
            if (entry.id === historyId) {
                const updatedPayments = { ...entry.payments, [dinerId]: isPaid };
                return { ...entry, payments: updatedPayments };
            }
            return entry;
        });
        localStorage.setItem('divicuenta_history', JSON.stringify(updatedHistory));
        return updatedHistory;
    });
  }, []);

  return (
    <AppContext.Provider value={{ 
        items, setItems, 
        diners, addDiner, 
        assignments, toggleAssignment, getDinersAssignedToItem,
        payerInfo,
        updateItem, deleteItem, addItem,
        resetState,
        currentUser, signUp, login, logout,
        history, addHistoryEntry, updatePaymentStatus,
        currentBillInfo, updateCurrentBillInfo,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};