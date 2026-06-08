import { useEffect, useState } from 'react';

export default function useFormValidation({ userName, message, contact, contactType }) {
    
    const [isFormValid, setIsFormValid] = useState(false);
    
    useEffect(() => {
        const nameValid = userName.length >= 3;
        const messageValid = message.length >= 5;
        const emailValid = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(contact);
        const contactTypeValid = !!contactType;
        
        setIsFormValid(nameValid && messageValid && emailValid && contactTypeValid);
    }, [userName, message, contact, contactType]);
    
    return isFormValid;
}