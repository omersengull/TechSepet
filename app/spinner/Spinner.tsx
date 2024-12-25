import { useSpinner } from './SpinnerContext';
import { HashLoader } from 'react-spinners';
import React from "react"
const Spinner = () => {
    const { isLoading } = useSpinner();

    return (
        isLoading ? (
            <div className="fixed top-0 left-0 right-0 bottom-0 flex justify-center items-center bg-gray-800 bg-opacity-50 z-50">
                <HashLoader color="#007bff" size={50} />
            </div>
        ) : null
    );
};

export default Spinner;
