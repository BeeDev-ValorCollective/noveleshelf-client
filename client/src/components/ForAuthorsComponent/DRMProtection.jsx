import './forAuthors.css'
import { ShieldCheck, Lock } from 'lucide-react'

export default function DRMProtection() {
    return (
        <>
            <section className='drm-protection'>
                <h2>DRM Protection Tools</h2>
                <div className='drm-grid'>
                    <div className='drm-card'>
                        <ShieldCheck className='drm-icon' />
                        <h3>Advanced Encryption</h3>
                        <p>Your work is protected with military-grade encryption. Prevent unauthorized copying, sharing, or distribution of your content.</p>
                    </div>
                    <div className='drm-card'>
                        <Lock className='drm-icon' />
                        <h3>Access Control</h3>
                        <p>Set custom permissions for your books. Control who can read, download, or share your work with granular access settings.</p>
                    </div>
                </div>
            </section>
        </>
    )
}