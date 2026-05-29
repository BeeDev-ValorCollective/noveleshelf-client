

// IMPORT IMAGES
// import Email_Icon from '../../../assets/images/email_icon.png'

export default function ContactHeader() {
    
    // IMPORT ENV DATA
    const PhoneLink = import.meta.env.VITE_LINK_PHONE;
    const PhoneDisplay = import.meta.env.VITE_DISPLAY_PHONE;
    const EmailLink = import.meta.env.VITE_INFO_EMAIL;
    
    return(
        <>
            <div className='contact_header'>

                <div className='contact_methods'>
                    <div className='contact_type'>
                        <img src="" alt="Email Us" />
                        <h4>Email Us</h4>
                        <a href={`mailto:${ EmailLink }?subject=Request%20For%20Tax%20Services&body=Hello,%0A%0AI%20would%20like%20to%20inquire%20about...`}>
                            <h5>{ EmailLink }</h5>
                        </a>
                    </div>
                </div>
            </div>
            <div className="message_hr">
                <hr />
                <p>
                    Or send us a message
                </p>
                <p>(To make sure you don’t miss any messages, please add us to your email contacts. That way, our emails will drive straight into your inbox!)</p>
            </div>
        </>
    );
};