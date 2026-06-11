export default function NoticeContent({ entry, icon, ...props }) {
  const now = Date.now()
  const isUpcoming = entry.maint_at && now < new Date(entry.maint_at).getTime()
  const displayMsg = isUpcoming && entry.pre_message ? entry.pre_message : entry.message

  return (
    <span className="maint-notice__segment" {...props}>
      <span className="maint-notice__icon" aria-hidden="true">{icon}</span>
      <span className="maint-notice__message">{displayMsg}</span>
      {entry.showEstimatedReturn && entry.estimatedReturn && (
        <span className="maint-notice__eta">
          Expected return: {entry.estimatedReturn}
        </span>
      )}
      <span className="maint-notice__spacer" aria-hidden="true">•••</span>
    </span>
  )
}