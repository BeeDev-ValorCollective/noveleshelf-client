// views/ErrorPage.jsx
import { Link } from 'react-router-dom'
import './views.css'

const ERROR_CONFIGS = {
    unauthorized: {
        code: '403',
        title: 'Access Denied',
        message: "You don't have permission (or need to change current role) to view this page.",
    },
    notFound: {
        code: '404',
        title: 'Page Not Found',
        message: "The page you're looking for doesn't exist.",
    },
}

export default function ErrorPage({ type = 'notFound' }) {
    const { code, title, message } = ERROR_CONFIGS[type] ?? ERROR_CONFIGS.notFound

    return (
        <div className='error-page'>
            <h1>{code}</h1>
            <h2>{title}</h2>
            <p>{message}</p>
            <Link to='/dashboard'>Go to Dashboard</Link>
        </div>
    )
}