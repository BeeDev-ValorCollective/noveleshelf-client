import { useNavigate } from 'react-router-dom'
import useUser from '../../hooks/useUser'
import useAuthStore from '../../store/authStore'
import { useState, useEffect } from 'react'
import { getMediaUrl } from '../../utils/api'
import useFileInput from '../../hooks/useFileInput'
import UpdateDefaultRole from './UpdateDefaultRole'
import { DB_API, ENDPOINTS } from '../../utils/api'

import './updateProfile.css'


export default function UpdateReaderProfile() {
    const navigate = useNavigate()
    const { user, accessToken } = useUser();
    const updateUser = useAuthStore((state) => state.updateUser)
    const profile = user?.profile
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [username, setUsername] = useState("");
    const [first_name, setFirstName] = useState("")
    const [last_name, setLastName] = useState("")
    const [bio, setBio] = useState("")
    const [avatarPreview, setAvatarPreview] = useState(null)

    const { file: avatar_url, error: avatarError, handleChange: handleAvatarChange } = useFileInput(2)

    useEffect(() => {
        if (profile) {
            setUsername(profile.username || "")
            setBio(profile.bio || "")
            setFirstName(profile.first_name || "")
            setLastName(profile.last_name || "")
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
            formData.append('username', username)
            formData.append('first_name', first_name)
            formData.append('last_name', last_name)
            formData.append('bio', bio)
            if (avatar_url) formData.append('avatar_url', avatar_url)

            const res = await fetch(`${DB_API}${ENDPOINTS.updateProfile}`, {
                method: "PATCH",
                headers: {
                    Authorization: `Bearer ${accessToken}`,

                },
                body: formData
            })

            const data = await res.json()

            if (res.ok) {
                // update the store with new user data
                updateUser({ ...user, profile: data.profile })
                setSuccess("Profile updated successfully")
            } else {
                setError(data.error || "Update failed")
            }
        } catch (err) {
            if (import.meta.env.DEV) {
                console.error("Update error:", err)
            }
            setError("Something went wrong. Please try again.")
        } finally {
            setIsLoading(false)
        }
    }

    if (!user) return <p>Loading...</p>

    return (
        <>
            <form className='update_form' onSubmit={handleSubmit}>
                <div className="form">
                    <div className='form_left'>
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
                    <div className="form_right">
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
                            <label>Username</label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>
                        <div>
                            <label>Bio</label>
                            <textarea
                                value={bio}
                                onChange={(e) => setBio(e.target.value)}
                            />
                        </div>
                    </div>
                </div>


                {error && <p className="error">{error}</p>}
                {success && <p className="success">{success}</p>}
                <div className="form_buttons">
                    <button type="submit" disabled={isLoading}>
                        {isLoading ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button type="button" onClick={() => navigate('/dashboard')}>
                        Cancel
                    </button>
                </div>
            </form>
            <UpdateDefaultRole />
        </>
    )
}