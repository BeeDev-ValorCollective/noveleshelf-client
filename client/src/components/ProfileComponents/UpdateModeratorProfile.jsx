import { useNavigate } from 'react-router-dom'
import useUser from '../../hooks/useUser'
import useAuthStore from '../../store/authStore'
import { useState, useEffect } from 'react'
import { getMediaUrl } from '../../utils/api'
import useFileInput from '../../hooks/useFileInput'
import UpdateDefaultRole from './UpdateDefaultRole'
import { DB_API, ENDPOINTS } from '../../utils/api'
import Button from '../ui/Button'

export default function UpdateModeratorProfile() {
    const navigate = useNavigate()
    const { user, accessToken } = useUser();
    const updateUser = useAuthStore((state) => state.updateUser)
    const profile = user?.moderator_profile
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [mod_username, setModUsername] = useState("");
    // const [avatar_url, setAvatarUrl] = useState(null)
    const [avatarPreview, setAvatarPreview] = useState(null)

    const { file: avatar_url, error: avatarError, handleChange: handleAvatarChange } = useFileInput(2)

    useEffect(() => {
        if (profile) {
            setModUsername(profile.mod_username || "")
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
            formData.append('mod_username', mod_username)
            if (avatar_url) formData.append('avatar_url', avatar_url)

            const res = await fetch(`${DB_API}${ENDPOINTS.login}`, {
                method: "PATCH",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                body: formData
            })

            const data = await res.json()

            if (res.ok) {
                updateUser({ ...user, moderator_profile: data.moderator_profile })
                setSuccess("Moderator profile updated successfully")
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
                <div className='form'>
                    <div className="form_left">
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
                    <div className='form_right'>
                        <div>
                            <label>Moderator Username</label>
                            <input
                                type="text"
                                value={mod_username}
                                onChange={(e) => setModUsername(e.target.value)}
                                />
                        </div>
                    </div>
                </div>
                {error && <p className="error">{error}</p>}
                {success && <p className="success">{success}</p>}
                <div className="form_buttons">
                    <Button
                        variant='primary'
                        size='lg'
                        type='submit'
                        disabled={isLoading}
                    >
                        {isLoading ? 'Saving...' : 'Save Changes'}
                    </Button>
                    <Button
                        variant='secondary'
                        size='lg'
                        type='button'
                        onClick={() => navigate('/dashboard')}
                    >
                        Cancel
                    </Button>
                </div>
            </form>
            <UpdateDefaultRole />
        </>
    )
}