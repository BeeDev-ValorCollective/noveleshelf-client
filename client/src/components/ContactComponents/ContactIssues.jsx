
import { Wrench } from 'lucide-react'


export default function ContactIssues() {


    return (
        <div className='contact_header'>
            <div className="contact_methods">
                <Wrench />
                <div className="contact">
                    <a href="https://status.httphive.com/report" target='_blank'>Report or check on an issue</a>
                </div>
            </div>

        </div>
    )
}