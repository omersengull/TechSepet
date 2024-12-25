"use client"
import { createContext, useContext, useState, ReactNode } from "react";
import React from "react"
// Spinner context ve hook
interface SpinnerContextType {
    isLoading: boolean;
    setIsLoading: (isLoading: boolean) => void;
}

const SpinnerContext = createContext<SpinnerContextType | undefined>(undefined);

export const useSpinner = (): SpinnerContextType => {
    const context = useContext(SpinnerContext);
    if (!context) {
        throw new Error("useSpinner must be used within a SpinnerProvider");
    }
    return context;
};

interface SpinnerProviderProps {
    children: ReactNode;
}

export const SpinnerProvider = ({ children }: SpinnerProviderProps) => {
    const [isLoading, setIsLoading] = useState<boolean>(false);

    return (
        <SpinnerContext.Provider value={{ isLoading, setIsLoading }}>
            {children}
        </SpinnerContext.Provider>
    );
};
