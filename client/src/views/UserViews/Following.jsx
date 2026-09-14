import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { UserRound, UserRoundMinus } from 'lucide-react'

import useAuthStore from '../../store/authStore'
import {
    DB_API,
    ENDPOINTS,
    getMediaUrl,
} from '../../utils/api'

import './following.css'


export default function Following() {
    const navigate = useNavigate()

    const accessToken = useAuthStore(
        (state) => state.accessToken
    )

    const [following, setFollowing] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [unfollowingId, setUnfollowingId] =
        useState(null)


    const fetchFollowing = useCallback(async () => {
        if (!accessToken) {
            setFollowing([])
            setLoading(false)
            return
        }

        setLoading(true)
        setError('')

        try {
            const response = await fetch(
                `${DB_API}${ENDPOINTS.follow.list}`,
                {
                    headers: {
                        Authorization:
                            `Bearer ${accessToken}`,
                    },
                }
            )

            const data = await response
                .json()
                .catch(() => [])

            if (!response.ok) {
                console.error(
                    'Unable to load followed authors:',
                    data
                )

                setError(
                    'Unable to load your followed authors.'
                )
                setFollowing([])
                return
            }

            setFollowing(
                Array.isArray(data) ? data : []
            )
        } catch (error) {
            console.error(
                'Following request failed:',
                error
            )

            setError(
                'Unable to load your followed authors.'
            )
            setFollowing([])
        } finally {
            setLoading(false)
        }
    }, [accessToken])


    useEffect(() => {
        fetchFollowing()
    }, [fetchFollowing])


    const handleAuthorClick = (author) => {
        if (!author.author_username) {
            return
        }

        navigate(
            `/library/author/${author.author_username}`
        )
    }


    const handleUnfollow = async (
        event,
        author
    ) => {
        event.stopPropagation()

        if (
            !accessToken ||
            !author.follow_id ||
            unfollowingId
        ) {
            return
        }

        setUnfollowingId(author.follow_id)

        try {
            const response = await fetch(
                `${DB_API}${
                    ENDPOINTS.follow.unfollow(
                        author.follow_id
                    )
                }`,
                {
                    method: 'DELETE',
                    headers: {
                        Authorization:
                            `Bearer ${accessToken}`,
                    },
                }
            )

            if (!response.ok) {
                const data = await response
                    .json()
                    .catch(() => ({}))

                console.error(
                    'Unable to unfollow author:',
                    data
                )

                return
            }

            setFollowing((current) =>
                current.filter(
                    (item) =>
                        item.follow_id !==
                        author.follow_id
                )
            )
        } catch (error) {
            console.error(
                'Unfollow request failed:',
                error
            )
        } finally {
            setUnfollowingId(null)
        }
    }


    if (loading) {
        return (
            <div className="following-page">
                <p className="following-status">
                    Loading followed authors...
                </p>
            </div>
        )
    }


    return (
        <div className="following-page">

            <section className="following-header">
                <div>
                    <p className="following-eyebrow">
                        Your Library
                    </p>

                    <h1>
                        Following
                    </h1>

                    <p className="following-description">
                        Authors you follow will appear
                        here for quick access to their
                        profiles and published works.
                    </p>
                </div>
            </section>

            {error && (
                <p className="following-error">
                    {error}
                </p>
            )}

            {!error && following.length === 0 && (
                <section className="following-empty">
                    <UserRound size={42} />

                    <h2>
                        You aren't following any
                        authors yet.
                    </h2>

                    <p>
                        Follow authors from their books
                        to find them here later.
                    </p>
                </section>
            )}

            <section className="following-grid">
                {following.map((author) => {
                    const displayName =
                        author.pen_name ||
                        author.author_username ||
                        'Author'

                    const avatarUrl =
                        getMediaUrl(
                            author.avatar_url
                        )

                    const isUnfollowing =
                        unfollowingId ===
                        author.follow_id

                    return (
                        <article
                            key={author.follow_id}
                            className="following-card"
                        >
                            <button
                                type="button"
                                className="following-author"
                                onClick={() =>
                                    handleAuthorClick(
                                        author
                                    )
                                }
                            >
                                <div className="following-avatar">
                                    {avatarUrl ? (
                                        <img
                                            src={avatarUrl}
                                            alt={
                                                displayName
                                            }
                                        />
                                    ) : (
                                        <UserRound
                                            size={38}
                                        />
                                    )}
                                </div>

                                <div className="following-info">
                                    <h2>
                                        {displayName}
                                    </h2>

                                    {author.author_username && (
                                        <p className="following-username">
                                            @
                                            {
                                                author.author_username
                                            }
                                        </p>
                                    )}

                                    {author.bio && (
                                        <p className="following-bio">
                                            {author.bio}
                                        </p>
                                    )}
                                </div>
                            </button>

                            <button
                                type="button"
                                className="following-unfollow"
                                onClick={(event) =>
                                    handleUnfollow(
                                        event,
                                        author
                                    )
                                }
                                disabled={
                                    isUnfollowing
                                }
                            >
                                <UserRoundMinus
                                    size={18}
                                />

                                {isUnfollowing
                                    ? 'Unfollowing...'
                                    : 'Unfollow'}
                            </button>
                        </article>
                    )
                })}
            </section>

        </div>
    )
}