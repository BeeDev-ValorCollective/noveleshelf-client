import { Link } from 'react-router-dom';
import { useState } from 'react';
import Button from '../ui/Button';
import Select from '../ui/Select';

import useUnsubValidation from '../../hooks/useUnsubValidation'
import useUnsubSubmission from '../../hooks/useUnsubSubmission'

const UNSUB_REASONS = [
    { value: '', label: 'Please select a reason' },
    { value: 'Too many emails', label: 'Too many emails' },
    { value: 'Content not relevant', label: 'Content not relevant' },
    { value: 'Found what I needed', label: 'Found what I needed' },
    { value: 'Privacy concerns', label: 'Privacy concerns' },
    { value: 'Other', label: 'Other' },
]

export default function UnsubscribeForm() {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [userName, setUserName] = useState('');
    const [contact, setContact] = useState('');
    const [reason, setReason] = useState('');
    const [success, setSuccess] = useState('');
    const [mailError, setMailError] = useState('');
    const [errorCount, setErrorCount] = useState(0);
    const [mailFail, setMailFail] = useState(false);
    const [isButtonVisible, setIsButtonVisible] = useState(true);
    const SupportEmail = import.meta.env.VITE_SUPPORT_EMAIL;

    const isFormValid = useUnsubValidation({ contact, reason })

    const { sendUnsub, isSubmitting } = useUnsubSubmission({
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
    });

    return (
        <div className="contact_container">
            <form onSubmit={sendUnsub}>
                <h2>Unsubscribe</h2>
                <p>Enter your email to unsubscribe from future communications.</p>

                {/* FIRST NAME */}
                <div className="entry_area">
                    <input
                        name="firstName"
                        type="text"
                        id="firstName"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder=""
                    />
                    <label htmlFor="firstName" className="label_line">First Name: <span>(optional)</span></label>
                </div>

                {/* LAST NAME */}
                <div className="entry_area">
                    <input
                        name="lastName"
                        type="text"
                        id="lastName"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder=""
                    />
                    <label htmlFor="lastName" className="label_line">Last Name: <span>(optional)</span></label>
                </div>

                {/* USERNAME */}
                <div className="entry_area">
                    <input
                        name="userName"
                        type="text"
                        id="userName"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        placeholder=""
                    />
                    <label htmlFor="userName" className="label_line">Username: <span>(optional)</span></label>
                </div>

                {/* EMAIL */}
                <div className="entry_area">
                    <input
                        name="contact"
                        type="email"
                        id="contact"
                        required
                        value={contact}
                        onChange={(e) => setContact(e.target.value)}
                        placeholder=""
                    />
                    <label htmlFor="contact" className="label_line">Email:</label>
                </div>

                {/* REASON */}
                <div className="entry_area">
                    <Select
                        variant='bare'
                        name="reason"
                        id="reason"
                        required
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                    >
                        {UNSUB_REASONS.map(({ value, label }) => (
                            <option key={value} value={value}>{label}</option>
                        ))}
                    </Select>

                </div>

                {/* SUBMIT */}
                {isSubmitting ? (
                    <div className="form_button_box">
                        {!mailError && !mailFail && !success ? (
                            <img src='' alt="Spinner Icon" className="spinner"/>
                        ) : (
                            <>&nbsp;</>
                        )}
                    </div>
                ) : null}
                {!isSubmitting && (
                    <div className="form_button_box">
                        <Button
                            variant='primary'
                            size='lg'
                            hidden={!isButtonVisible}
                            type="submit"
                            disabled={!isFormValid}
                        >
                            UNSUBSCRIBE
                        </Button>
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
                            <Button
                                variant='primary'
                                size='md'
                                href={`mailto:${SupportEmail}?subject=Unsubscribe%20Request&body=Hello,%0A%0AI%20would%20like%20to%20unsubscribe%20from%20future%20emails.`}
                            >
                                <b>{SupportEmail}</b>
                            </Button>
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
    )
}