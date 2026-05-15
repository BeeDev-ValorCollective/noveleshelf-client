import useUser from '../../hooks/useUser'
import useAuthStore from '../../store/authStore'
import { useState, useEffect } from 'react'
import { getMediaUrl } from '../../utils/mediaUrl'
import useFileInput from '../../hooks/useFileInput'

const DB_API = `${import.meta.env.VITE_DB_API}`;

export default function UpdateFreeAuthorProfile() {
    const { user, accessToken } = useUser();
    const updateUser = useAuthStore((state) => state.updateUser)
    const profile = user?.free_author_profile
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [author_username, setAuthorUsername] = useState("");
    const [pen_name, setPenName] = useState("")
    const [bio, setBio] = useState("")
    const [first_name, setFirstName] = useState("")
    const [last_name, setLastName] = useState("")
    const [show_real_name, setShowRealName] = useState(false)
    const [is_publicly_visible, setIsPubliclyVisible] = useState(false)
    const [avatar_url, setAvatarUrl] = useState(null)
    const [avatarPreview, setAvatarPreview] = useState(null)

    const { file: avatar_url, error: avatarError, handleChange: handleAvatarChange } = useFileInput(2)

    useEffect(() => {
        if (profile) {
            setAuthorUsername(profile.author_username || "")
            setPenName(profile.pen_name || "")
            setBio(profile.bio || "")
            setFirstName(profile.first_name || "")
            setLastName(profile.last_name || "")
            setShowRealName(profile.show_real_name || false)
            setIsPubliclyVisible(profile.is_publicly_visible || false)
        }
    }, [profile])

    useEffect(() => {
        if (avatar_url) {
            const url = URL.createObjectURL(avatar_url)
            setAvatarPreview(url)
            return () => URL.revokeObjectURL(url) // clean up blob url on unmount/change
        }
    }, [avatar_url])

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (avatarError) return
        setError("");
        setSuccess("");
        setIsLoading(true);

        try {
            const formData = new FormData()
            formData.append('author_username', author_username)
            formData.append('pen_name', pen_name)
            formData.append('bio', bio)
            formData.append('first_name', first_name)
            formData.append('last_name', last_name)
            formData.append('show_real_name', show_real_name)
            formData.append('is_publicly_visible', is_publicly_visible)
            if (avatar_url) formData.append('avatar_url', avatar_url)

            const res = await fetch(DB_API + "user/free-author-profile/update/", {
                method: "PATCH",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                body: formData
            })

            const data = await res.json()

            if (res.ok) {
                updateUser({ ...user, free_author_profile: data.free_author_profile })
                setSuccess("Free author profile updated successfully")
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
                <label>Author Username</label>
                <input
                    type="text"
                    value={author_username}
                    onChange={(e) => setAuthorUsername(e.target.value)}
                />
            </div>
            <div>
                <label>Pen Name</label>
                <input
                    type="text"
                    value={pen_name}
                    onChange={(e) => setPenName(e.target.value)}
                />
            </div>
            <div>
                <label>First Name</label>
                <input
                    type="text"
                    value={first_name}
                    onChange={(e) => setFirstName(e.target.value)}
                />
            </div>
            <div>
                <label>Last Name</label>
                <input
                    type="text"
                    value={last_name}
                    onChange={(e) => setLastName(e.target.value)}
                />
            </div>
            <div>
                <label>Bio</label>
                <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                />
            </div>
            <div>
                <label>
                    <input
                        type="checkbox"
                        checked={show_real_name}
                        onChange={(e) => setShowRealName(e.target.checked)}
                    />
                    Show Real Name
                </label>
            </div>
            <div>
                <label>
                    <input
                        type="checkbox"
                        checked={is_publicly_visible}
                        onChange={(e) => setIsPubliclyVisible(e.target.checked)}
                    />
                    Publicly Visible
                </label>
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