import React from 'react';
import { CheckCircleIcon } from './icons/CheckCircleIcon';

export const Toast: React.FC<{ message: string; show: boolean }> = ({ message, show }) => {
    return (
        <div 
            aria-live="assertive"
            className={`fixed inset-0 flex items-end justify-center px-4 py-6 pointer-events-none sm:p-6 sm:items-start sm:justify-end z-50 transition-all duration-300 ease-in-out ${
                show ? 'opacity-100' : 'opacity-0'
            }`}
        >
            <div className={`transform transition-all duration-300 ease-in-out ${show ? 'translate-y-0 sm:translate-x-0' : 'translate-y-10 sm:translate-y-0 sm:translate-x-full'}`}>
                <div className="max-w-sm w-full bg-brand-dark-secondary shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden">
                    <div className="p-4">
                        <div className="flex items-start">
                            <div className="flex-shrink-0">
                                <CheckCircleIcon className="h-6 w-6 text-green-400" aria-hidden="true" />
                            </div>
                            <div className="ml-3 w-0 flex-1 pt-0.5">
                                <p className="text-sm font-medium text-brand-light">
                                    ¡Éxito!
                                </p>
                                <p className="mt-1 text-sm text-brand-gray">
                                    {message}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};