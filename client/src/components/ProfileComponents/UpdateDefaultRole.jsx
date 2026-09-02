// components/UpdateDefaultRole/UpdateDefaultRole.jsx

import { useState } from 'react'
import useUser from '../../hooks/useUser'
import useAuthStore from '../../store/authStore'
import { ROLE_LABELS } from '../../utils/auth'
import { DB_API, ENDPOINTS } from '../../utils/api'

import Button from '../ui/Button'
import Select from '../ui/Select'

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
            const res = await fetch(`${DB_API}${ENDPOINTS.defaultRoleUpdate}`, {
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
            if (import.meta.env.DEV) {
                console.error("Role update error:", err)
            }
            setError("Something went wrong. Please try again.")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="default_role_card">
            <div className="default_role_section">
                <h3>Default Login Role</h3>
                <p>Choose which dashboard loads when you log in.</p>
                <Select
                    variant='inline'
                    value={defaultRole}
                    onChange={(e) => setDefaultRole(e.target.value)}
                >
                    {availableRoles.map(role => (
                        <option key={role} value={role}>
                            {ROLE_LABELS[role]}
                        </option>
                    ))}
                </Select>
                {error && <p className="error">{error}</p>}
                {success && <p className="success">{success}</p>}
                <Button
                    variant='primary'
                    size='md'
                    onClick={handleRoleUpdate}
                    disabled={isLoading}
                >
                    {isLoading ? 'Saving...' : 'Update Default Role'}
                </Button>
            </div>
        </div>
    )
}