import { useState } from 'react';
import axios from 'axios';

export default function useUnsubSubmission({
    firstName,
    lastName,
    userName,
    contact,
    reason,
    setSuccess,
    setMailError,
    setErrorCount,
    setMailFail,
    setIsButtonVisible,
    setFirstName,
    setLastName,
    setUserName,
    setContact,
    setReason,
}) {

    const UnsubURL = import.meta.env.VITE_EMAIL_URL + '/sendUnsubMail';

    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const sendUnsub = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setIsButtonVisible(false);
        
        try {
            const response = await axios.post(UnsubURL, {
                firstName,
                lastName,
                userName,
                contact,
                reason,
            });
            
            const data = response.data || {};

            if (response.status === 200) {
                setSuccess(data.message || 'You have been successfully unsubscribed!')
                setMailError('');
                setErrorCount(0);
                setMailFail(false);
                setFirstName('');
                setLastName('');
                setUserName('');
                setContact('');
                setReason('');

                setTimeout(() => {
                    window.location.href = '/';
                }, 4000);
            } else {
                handleFailure(data.message || 'An error has occurred, please try again.');
            }
        } catch (error) {
            console.error('Error sending unsubscribe request:', error);
            const serverMsg =
                error.response?.data?.message ||
                'An error has occurred, please try again.';
            handleFailure(serverMsg);
        } finally {
            setIsSubmitting(false);
        }
    };
    
    const handleFailure = (message) => {
        setMailError(message);
        setSuccess('');
        setErrorCount((prev) => {
            const next = prev + 1;
            if (next < 3) {
                setIsButtonVisible(true);
            } else {
                setMailFail(true);
            }
            return next;
        });
    };
    
    return { sendUnsub, isSubmitting };
}