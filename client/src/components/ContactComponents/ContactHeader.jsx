

// IMPORT IMAGES
import { Mail } from 'lucide-react'
export default function ContactHeader() {

    // IMPORT ENV DATA
    const PhoneLink = import.meta.env.VITE_LINK_PHONE;
    const PhoneDisplay = import.meta.env.VITE_DISPLAY_PHONE;
    const EmailLink = import.meta.env.VITE_INFO_EMAIL;

    return (
        <>
            <div className='contact_header'>

                <div className='contact_methods'>
                    <Mail />
                    <div className="contactEmail">
                        <h4>Email Us</h4>
                        <a href={`mailto:${EmailLink}?subject=Request%20For%20Tax%20Services&body=Hello,%0A%0AI%20would%20like%20to%20inquire%20about...`}>
                            <h5>{EmailLink}</h5>
                        </a>
                    </div>
                </div>
            </div>

        </>
    );
};