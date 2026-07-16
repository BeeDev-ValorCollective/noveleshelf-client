import { Mail, Wrench } from 'lucide-react'

export default function ContactHeader() {

    const PhoneLink = import.meta.env.VITE_LINK_PHONE;
    const PhoneDisplay = import.meta.env.VITE_DISPLAY_PHONE;
    const EmailLink = import.meta.env.VITE_INFO_EMAIL;

    return (
        <>
            <div className='contact_header'>

                <div className='contact_methods'>
                    <div className='contact_grid'>
                        <div className='contact_card'>
                            <Mail />
                            <div className="contact">
                                <h4>Email Us</h4>
                                <a href={`mailto:${EmailLink}?subject=Request%20For%20Tax%20Services&body=Hello,%0A%0AI%20would%20like%20to%20inquire%20about...`}>{EmailLink}</a>
                            </div>
                        </div>
                        <div className='contact_card'>
                            <Wrench />
                            <div className="contact">
                                <h4>Report Issues</h4>
                                <a href="https://status.httphive.com/report" target='_blank'>Report or check on an issue</a>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </>
    );
};