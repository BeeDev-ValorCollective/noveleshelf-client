import { Moon, Sun, EyeOff } from 'lucide-react'
import './forReaders.css'

export default function ReadingModes() {
    return (
        <>
            <section className='reading-modes'>
                <h2>Reading Modes</h2>
                <div className='modes-grid'>
                    <div className='mode-card'>
                        <Moon className='mode-icon' />
                        <h3>Night Mode</h3>
                        <p>Easy on the eyes with warm tones and reduced blue light for comfortable late-night reading.</p>
                    </div>
                    <div className='mode-card'>
                        <Sun className='mode-icon' />
                            <h3>Day Mode</h3>
                            <p>Crisp, clear text on bright backgrounds optimized for daytime reading in any lighting condition.</p>
                    </div>
                    <div className='mode-card'>
                        <EyeOff className='mode-icon' />
                        <h3>Immersive Mode</h3>
                        <p>Hide all distractions and lose yourself in the story with our fullscreen, distraction-free reading mode.</p>
                    </div>
                </div>
            </section>
        </>
    )
}