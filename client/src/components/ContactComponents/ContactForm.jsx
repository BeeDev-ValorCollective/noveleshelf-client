import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

import useFormValidation from '../../hooks/useFormValidation'
import useMailSubmission from '../../hooks/useMailSubmission'

const CONTACT_TYPES = [
    { value: '', label: 'What can we help you with?' },
    { value: 'account', label: 'My Account' },
    { value: 'book_reading', label: 'Book / Reading Issue' },
    { value: 'author_support', label: 'Author Support' },
    { value: 'technical', label: 'Technical Issue' },
    { value: 'partnership', label: 'Partnership / Business' },
    { value: 'other', label: 'Other' },
]

export default function ContactUs() {
    const [message, setMessage] = useState('');
    const [contact, setContact] = useState('');
    const [userName, setUserName] = useState('');
    const [contactType, setContactType] = useState('');
    const [success, setSuccess] = useState('');
    const [mailError, setMailError] = useState('');
    const [errorCount, setErrorCount] = useState(0);
    const [mailFail, setMailFail] = useState(false);
    const [isButtonVisible, setIsButtonVisible] = useState(true);
    const SupportEmail = import.meta.env.VITE_SUPPORT_EMAIL;

    const [captchaQuestion, setCaptchaQuestion] = useState('');
    const [captchaId, setCaptchaId] = useState('');
    const [captchaAnswer, setCaptchaAnswer] = useState('');
    const [isCaptchaLoading, setIsCaptchaLoading] = useState(false);
    const [captchaLoadError, setCaptchaLoadError] = useState('');
    const [website, setWebsite] = useState('')

    const isFormValid = useFormValidation({ userName, message, contact, contactType })

    const { sendMail, isSubmitting } = useMailSubmission({
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
        setContactType,
        setCaptchaAnswer,
    });

    useEffect(() => {
        const fetchCaptcha = async () => {
            try {
                setIsCaptchaLoading(true);
                setCaptchaLoadError('');
                const apiBase = import.meta.env.VITE_EMAIL_URL || '';
                const response = await fetch(`${apiBase}/captcha`);
                if (!response.ok) throw new Error('Failed to load captcha');
                const data = await response.json();
                setCaptchaId(data.id);
                setCaptchaQuestion(data.question);
                setCaptchaAnswer('');
            } catch (err) {
                console.error('Error loading captcha:', err);
                setCaptchaLoadError('Unable to load spam protection. Please try again.');
            } finally {
                setIsCaptchaLoading(false);
            }
        };
        fetchCaptcha();
    }, []);

    return (
        <div className="contact_container">
            <div className="message_hr">
                <hr />
                <p>
                    Or send us a message
                </p>
                <p>(To make sure you don’t miss any messages, please add us to your email contacts. That way, our emails will drive straight into your inbox!)</p>
            </div>
            <h2>Send us a Message</h2>
            <form onSubmit={sendMail} className='contact_form'>
                <div className="contact_inputs">
                    <div className="contact_left">
                        {/* CONTACT TYPE */}
                        <div className="entry_area">
                            <select
                                name="contactType"
                                id="contactType"
                                required
                                value={contactType}
                                onChange={(e) => setContactType(e.target.value)}
                            >
                                {CONTACT_TYPES.map(({ value, label }) => (
                                    <option key={value} value={value}>{label}</option>
                                ))}
                            </select>
                        </div>

                        {/* NAME */}
                        <div className="entry_area">
                            <label htmlFor="userName" className="label_line">Name:</label>
                            <input
                                name="userName"
                                type="text"
                                id="userName"
                                required
                                minLength={3}
                                value={userName}
                                onChange={(e) => setUserName(e.target.value)}
                                placeholder=""
                            />
                        </div>

                        {/* EMAIL */}
                        <div className="entry_area">
                            <label htmlFor="contact" className="label_line">Email:</label>
                            <input
                                name="contact"
                                type="email"
                                id="contact"
                                required
                                value={contact}
                                onChange={(e) => setContact(e.target.value)}
                                placeholder=""
                            />
                        </div>
                    </div>
                    <div className="contact_right">
                        {/* MESSAGE */}
                        <div className="entry_area">
                            <label htmlFor="description" className="label_line">Message:</label>
                            <textarea
                                name="description"
                                id="description"
                                required
                                minLength={5}
                                cols={30}
                                rows={10}
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder=""
                            />
                        </div>
                    </div>
                </div>





                {/* HONEYPOT */}
                <input
                    type="text"
                    name="website"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    autoComplete="off"
                    style={{ display: 'none' }}
                    tabIndex={-1}
                />

                {/* CAPTCHA */}
                <div className="entry_area captcha">
                    <label className="label_line" htmlFor="captchaAnswer">
                        {isCaptchaLoading
                            ? 'Loading spam protection...'
                            : captchaQuestion || 'Spam protection'}
                    </label>
                    <input
                        name="captchaAnswer"
                        type="text"
                        id="captchaAnswer"
                        required
                        value={captchaAnswer}
                        onChange={(e) => setCaptchaAnswer(e.target.value)}
                        placeholder=""
                        disabled={isCaptchaLoading || !captchaId}
                    />
                    {captchaLoadError && (
                        <p className="captcha_error">{captchaLoadError}</p>
                    )}
                </div>

                {/* SUBMIT */}
                {isSubmitting ? (
                    <div className="form_button_box">
                        {!mailError && !mailFail && !success ? (
                            <img src='' alt="Spinner Icon" className="spinner" />
                        ) : (
                            <>&nbsp;</>
                        )}
                    </div>
                ) : null}
                {!isSubmitting && (
                    <div className="form_button_box">
                        <button hidden={!isButtonVisible} type="submit" disabled={!isFormValid}>
                            SUBMIT
                        </button>
                    </div>
                )}

                {/* MESSAGES */}
                <div>
                    {mailError && !mailFail && (
                        <div className="mailer_messages">
                            <h3>{mailError}</h3>
                            <p>Please try again</p>
                        </div>
                    )}
                    {mailFail && (
                        <div className="mailer_messages failure">
                            <h3>We are experiencing technical problems</h3>
                            <p>Please contact us directly at —</p>
                            <a href={`mailto:${SupportEmail}?subject=Customer%20Contact%20Support&body=Hello,%0A%0AI%20would%20like%20to%20inquire%20about`}>
                                <b>{SupportEmail}</b>
                            </a>
                        </div>
                    )}
                    {success && (
                        <div className="mailer_messages success">
                            <h2>{success}</h2>
                            <p>Redirecting you home...</p>
                            <p>Click <Link to="/">HERE</Link> if you are not redirected</p>
                        </div>
                    )}
                </div>
            </form>
        </div>
    );
}