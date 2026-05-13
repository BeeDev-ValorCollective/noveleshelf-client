import useUser from '../../hooks/useUser'
import useAuthStore from '../../store/authStore'
import { useState, useEffect } from 'react'
import { getMediaUrl } from '../../utils/mediaUrl'

import './updateProfile.css'

const DB_API = `${import.meta.env.VITE_DB_API}`;

export default function UpdateReaderProfile() {
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
    const [avatar_url, setAvatarUrl] = useState(null)
    const [avatarPreview, setAvatarPreview] = useState(null)

    useEffect(() => {
        if (profile) {
            setUsername(profile.username || "")
            setBio(profile.bio || "")
            setFirstName(profile.first_name || "")
            setLastName(profile.last_name || "")
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
            formData.append('username', username)
            formData.append('first_name', first_name)
            formData.append('last_name', last_name)
            formData.append('bio', bio)
            if (avatar_url) formData.append('avatar_url', avatar_url)

            const res = await fetch(DB_API + "user/profile/update/", {
                method: "PATCH",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    // note: do NOT set Content-Type here
                    // browser sets it automatically with the correct boundary for FormData
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
            console.error("Update error:", err)
            setError("Something went wrong. Please try again.")
        } finally {
            setIsLoading(false)
        }
    }

    if (!user) return <p>Loading...</p>

    return(
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
            <button type="submit" disabled={isLoading}>
                {isLoading ? 'Saving...' : 'Save Changes'}
            </button>
        </form>
        </>
    )
}