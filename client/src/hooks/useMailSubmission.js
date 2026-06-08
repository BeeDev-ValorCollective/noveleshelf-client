import { useState } from 'react';
import axios from 'axios';

export default function useMailSubmission({
    message,
    contact,
    userName,
    contactType,
    captchaId,
    captchaAnswer,
    website,
    setSuccess,
    setMailError,
    setErrorCount,
    setMailFail,
    setIsButtonVisible,
    setMessage,
    setContact,
    setUserName,
    setCaptchaAnswer,
    setContactType,
}) {

    const EmailURL = import.meta.env.VITE_EMAIL_URL + '/sendContactMail';

    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const sendMail = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setIsButtonVisible(false);
        
        try {
            const response = await axios.post(EmailURL, {
                message,
                contact,
                userName,
                contactType,
                captchaId,
                captchaAnswer,
                website,
            });
            
            const { status } = response;
            const data = response.data || {};

            if (response.status === 200) {
                setSuccess(data.message || 'Your message was successfully sent!')
                setMailError('');
                setErrorCount(0);
                setMailFail(false);
                setMessage('');
                setContact('');
                setUserName('');
                setContactType('');
                setCaptchaAnswer('')

                setTimeout(() => {
                    window.location.href = '/';
                }, 4000);
            } else {
                const msg = data.message || 'An error has occurred, please try again.';
                handleFailure(msg);
            }
        } catch (error) {
            console.error('Error sending mail:', error);
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
        setSuccess('')
        setErrorCount((prev) => {
            const next = prev + 1
            if (next < 3) {
                setIsButtonVisible(true)
            } else {
                setMailFail(true)
            }
            return next
        })
    };
    
    return { sendMail, isSubmitting };
}