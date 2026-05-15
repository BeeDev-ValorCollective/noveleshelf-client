// hooks/useFileInput.js
import { useState } from 'react';

const useFileInput = (maxMB = 2) => {
    const [file, setFile] = useState(null);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        const selected = e.target.files[0];
        if (!selected) return;

        if (selected.size > maxMB * 1024 * 1024) {
            setError(`File must be under ${maxMB}MB`);
            setFile(null);
            e.target.value = '';
            return;
        }

        setError(null);
        setFile(selected);
    };

    return { file, error, handleChange };
};

export default useFileInput;