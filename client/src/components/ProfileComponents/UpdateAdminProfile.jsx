import useUser from '../../hooks/useUser'
import useAuthStore from '../../store/authStore'
import { useState, useEffect } from 'react'
import { getMediaUrl } from '../../utils/mediaUrl'

const DB_API = `${import.meta.env.VITE_DB_API}`;

export default function UpdateAdminProfile() {
    const { user, accessToken } = useUser();
    const updateUser = useAuthStore((state) => state.updateUser)
    const profile = user?.admin_profile
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [admin_username, setAdminUsername] = useState("");
    const [avatar_url, setAvatarUrl] = useState(null)
    const [avatarPreview, setAvatarPreview] = useState(null)

    useEffect(() => {
        if (profile) {
            setAdminUsername(profile.admin_username || "")
        }
    }, [profile])

    const handleAvatarChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            setAvatarUrl(file)
            setAvatarPreview(URL.createObjectURL(file))
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError("");
        setSuccess("");
        setIsLoading(true);

        try {
            const formData = new FormData()
            formData.append('admin_username', admin_username)
            if (avatar_url) formData.append('avatar_url', avatar_url)

            const res = await fetch(DB_API + "user/admin-profile/update/", {
                method: "PATCH",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                body: formData
            })

            const data = await res.json()

            if (res.ok) {
                updateUser({ ...user, admin_profile: data.admin_profile })
                setSuccess("Admin profile updated successfully")
            } else {
                setError(data.error || "Update failed")
            }
        } catch (err) {
            console.error("Update error:", err)
            setError("Something went wrong. Please try again.")
        } finally {
            setIsLoading(false)
        }
    }

    if (!user) return <p>Loading...</p>

    return(
        <>
        <form onSubmit={handleSubmit}>
            <div>
                <label>Avatar</label>
                {avatarPreview
                    ? <img src={avatarPreview} alt="Avatar preview" width={150} height={150} />
                    : profile?.avatar_url && <img src={getMediaUrl(profile.avatar_url)} alt="Current avatar" width={150} height={150} />
                }
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                />
            </div>
            <div>
                <label>Admin Username</label>
                <input
                    type="text"
                    value={admin_username}
                    onChange={(e) => setAdminUsername(e.target.value)}
                />
            </div>
            {error && <p className="error">{error}</p>}
            {success && <p className="success">{success}</p>}
            <button type="submit" disabled={isLoading}>
                {isLoading ? 'Saving...' : 'Save Changes'}
            </button>
        </form>
        </>
    )
}