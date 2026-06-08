import useAuthStore from '../../store/authStore'
import FreeAuthorUpgrade from './FreeAuthorUpgrade'
import PaidAuthorRequest from './PaidAuthorRequest'

export default function AuthorUpgradeSection({ user, currentRole, onUpgradeSuccess }) {
    const accessToken = useAuthStore((state) => state.accessToken)

    const hasPaidAuthor = !!user?.author_profile
    const hasFreeAuthor = !!user?.free_author_profile

    if (hasPaidAuthor && hasFreeAuthor) return null

    return (
        <div className='author-upgrade-section'>
            {!hasFreeAuthor && (
                <FreeAuthorUpgrade
                    accessToken={accessToken}
                    hasPaidAuthor={hasPaidAuthor}
                    onUpgradeSuccess={onUpgradeSuccess}
                />
            )}
            {!hasPaidAuthor && (
                <PaidAuthorRequest accessToken={accessToken} user={user} />
            )}
        </div>
    )
}