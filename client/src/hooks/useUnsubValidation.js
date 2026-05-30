import { useEffect, useState } from 'react';

export default function useUnsubValidation({ contact, reason }) {
    
    const [isFormValid, setIsFormValid] = useState(false);
    
    useEffect(() => {
        const emailValid = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(contact);
        const reasonValid = !!reason;
        
        setIsFormValid(emailValid && reasonValid);
    }, [contact, reason]);
    
    return isFormValid;
}