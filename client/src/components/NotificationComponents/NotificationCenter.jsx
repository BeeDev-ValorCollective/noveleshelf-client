
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, CheckCheck, X } from 'lucide-react';

import { DB_API } from '../../utils/api';
import useAuthStore from '../../store/authStore';
import './notificationCenter.css';

const BASE = `${DB_API}notifications/`;

export default function NotificationCenter() {
    const navigate = useNavigate();
    const accessToken = useAuthStore(s => s.accessToken);
    const isAuthenticated = useAuthStore(s => s.isAuthenticated);

    const [open, setOpen] = useState(false);
    const [items, setItems] = useState([]);
    const [unread, setUnread] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const loadNotifications = useCallback(async () => {
        if (!accessToken || !isAuthenticated) return;

        setLoading(true);
        setError('');

        try {
            const response = await fetch(`${BASE}my-notifications/`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }

            const data = await response.json();
            const notifications = Array.isArray(data)
                ? data
                : data.results ?? data.notifications ?? [];

            setItems(notifications);
            setUnread(
                data.unread_count ??
                notifications.filter(item => !item.is_read).length
            );
        } catch (err) {
            console.error('Notification loading failed:', err);
            setError('Unable to load notifications.');
        } finally {
            setLoading(false);
        }
    }, [accessToken, isAuthenticated]);

    useEffect(() => {
        if (open) loadNotifications();
    }, [open, loadNotifications]);

    useEffect(() => {
        if (!isAuthenticated) {
            setOpen(false);
            setItems([]);
            setUnread(0);
        }
    }, [isAuthenticated]);

    async function markRead(id) {
        const response = await fetch(`${BASE}mark-read/`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ notification_id: id }),
        });

        if (!response.ok) throw new Error('Unable to mark as read');
    }

    async function selectNotification(item) {
        try {
            if (!item.is_read) await markRead(item.id);

            setItems(current =>
                current.map(entry =>
                    entry.id === item.id
                        ? { ...entry, is_read: true }
                        : entry
                )
            );

            if (!item.is_read) {
                setUnread(current => Math.max(0, current - 1));
            }

            setOpen(false);

            if (item.book_id != null) {
                navigate(`/library/book/${item.book_id}`);
            }
        } catch (err) {
            console.error(err);
            setError('Unable to open this notification.');
        }
    }

    async function markAllRead() {
        try {
            const response = await fetch(`${BASE}mark-all-read/`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            if (!response.ok) throw new Error('Request failed');

            setItems(current =>
                current.map(item => ({ ...item, is_read: true }))
            );
            setUnread(0);
        } catch (err) {
            console.error(err);
            setError('Unable to mark all notifications as read.');
        }
    }

    if (!isAuthenticated) return null;

    return (
        <div className="nes-notification-center">
            <button
                type="button"
                className="nes-notification-bell"
                aria-label={`Notifications, ${unread} unread`}
                onClick={() => setOpen(value => !value)}
            >
                <Bell size={23} />
                {unread > 0 && (
                    <span className="nes-notification-count">
                        {unread > 99 ? '99+' : unread}
                    </span>
                )}
            </button>

            {open && (
                <div className="nes-notification-panel">
                    <div className="nes-notification-heading">
                        <h2>Notifications</h2>
                        <button
                            type="button"
                            aria-label="Close notifications"
                            onClick={() => setOpen(false)}
                        >
                            <X size={20} />
                        </button>
                    </div>

                    <div className="nes-notification-actions">
                        <span>{unread} unread</span>
                        <button
                            type="button"
                            disabled={unread === 0}
                            onClick={markAllRead}
                        >
                            <CheckCheck size={16} /> Mark all as read
                        </button>
                    </div>

                    {error && <p role="alert">{error}</p>}
                    {loading && <p>Loading notifications...</p>}

                    {!loading && items.length === 0 && (
                        <p className="nes-notification-empty">
                            No notifications yet.
                        </p>
                    )}

                    <div className="nes-notification-list">
                        {items.map(item => (
                            <button
                                key={item.id}
                                type="button"
                                className={`nes-notification-item ${item.is_read ? 'read' : 'unread'
                                    }`}
                                onClick={() => selectNotification(item)}
                            >
                                <span className="nes-notification-item-title">
                                    {item.title ||
                                        item.notification_type?.label ||
                                        'Notification'}
                                    {!item.is_read && (
                                        <span className="nes-unread-dot" />
                                    )}
                                </span>

                                <span>{item.message}</span>

                                <small>
                                    {new Date(item.created_at).toLocaleString()}
                                </small>
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
