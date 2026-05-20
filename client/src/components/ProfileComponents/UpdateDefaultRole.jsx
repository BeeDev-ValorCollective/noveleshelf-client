// components/UpdateDefaultRole/UpdateDefaultRole.jsx

import { useState } from 'react'
import useUser from '../../hooks/useUser'
import useAuthStore from '../../store/authStore'

const DB_API = `${import.meta.env.VITE_DB_API}`

const ROLE_LABELS = {
    reader: 'Reader',
    author: 'Author',
    free_author: 'Free Author',
    moderator: 'Moderator',
    admin: 'Admin',
}

export default function UpdateDefaultRole() {
    const { user, accessToken } = useUser()
    const updateUser = useAuthStore((state) => state.updateUser)
    const [defaultRole, setDefaultRole] = useState(user?.default_login_role || "")
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")

    const availableRoles = user ? [
        'reader',
        user.author_profile ? 'author' : null,
        user.free_author_profile ? 'free_author' : null,
        user.moderator_profile ? 'moderator' : null,
        user.admin_profile ? 'admin' : null,
    ].filter(Boolean) : []

    // Don't render anything if only one role
    if (availableRoles.length <= 1) return null

    const handleRoleUpdate = async () => {
        setError("")
        setSuccess("")
        setIsLoading(true)

        try {
            const res = await fetch(DB_API + "user/default-role/update/", {
                method: "PATCH",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ default_login_role: defaultRole })
            })

            const data = await res.json()

            if (res.ok) {
                updateUser({ ...user, default_login_role: defaultRole })
                setSuccess("Default role updated successfully")
            } else {
                setError(data.error || "Role update failed")
            }
        } catch (err) {
            console.error("Role update error:", err)
            setError("Something went wrong. Please try again.")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="default_role_section">
            <h3>Default Login Role</h3>
            <p>Choose which dashboard loads when you log in.</p>
            <select
                value={defaultRole}
                onChange={(e) => setDefaultRole(e.target.value)}
            >
                {availableRoles.map(role => (
                    <option key={role} value={role}>
                        {ROLE_LABELS[role]}
                    </option>
                ))}
            </select>
            {error && <p className="error">{error}</p>}
            {success && <p className="success">{success}</p>}
            <button onClick={handleRoleUpdate} disabled={isLoading}>
                {isLoading ? 'Saving...' : 'Update Default Role'}
            </button>
        </div>
    )
}