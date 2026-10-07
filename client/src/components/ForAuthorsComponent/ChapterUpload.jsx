import './forAuthors.css'
import { UploadCloud } from 'lucide-react'
import Button from '../ui/Button'

export default function ChapterUpload() {
    return (
        <>
            <section className='chapter-upload'>
                <h2>Chapter Upload Process</h2>
                <div className='upload-box'>
                    <UploadCloud className='upload-icon' />
                    <p className='upload-text'>Drag and drop your manuscript files here</p>
                    <Button
                        variant='primary'
                        size='md'
                        disabled
                    >
                        Browse Files
                    </Button>
                </div>
                <div className='upload-file-list'>
                    <div className='upload-file-item'>
                        <p>Chapter_01_Introduction.docx</p>
                        <span className='upload-status uploaded'>Uploaded</span>
                    </div>
                    <div className='upload-file-item'>
                        <p>Chapter_02_The_Beginning.docx</p>
                        <span className='upload-status uploaded'>Uploaded</span>
                    </div>
                    <div className='upload-file-item'>
                        <p>Chapter_03_Discovery.docx</p>
                        <span className='upload-status processing'>Processing...</span>
                    </div>
                </div>
            </section>
        </>
    )
}