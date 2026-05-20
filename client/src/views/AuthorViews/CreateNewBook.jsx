import useAuthStore from '../../store/authStore'
import useBookReferenceData from '../../hooks/useBookReferenceData'


export default function CreateNewBook() {
    const user = useAuthStore((state) => state.user)
    const currentProfile = useAuthStore((state) => state.currentProfile)
    const currentRole = useAuthStore((state) => state.currentRole)
    const { genres, keywords, relationship_tags, content_ratings, isLoading, error } = useBookReferenceData()

    console.log(genres)
    return(
        <>
        </>
    )
}