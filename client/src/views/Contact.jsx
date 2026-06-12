import ContactHeader from '../components/ContactComponents/ContactHeader'
import ContactForm from '../components/ContactComponents/ContactForm'
import ContactIssues from '../components/ContactComponents/ContactIssues'
import '../components/ContactComponents/contact.css'


export default function Contact() {

    return (
        <>
        <ContactHeader />
        <ContactIssues />
        <ContactForm />
        </>
    )
}