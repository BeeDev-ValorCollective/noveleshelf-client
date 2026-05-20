// import './BookFormFields.css'

export default function BookFormFields({ formData, onChange, contentRatings, isLoading, disabled }) {
    return (
        <div className="book-form-fields">
            <div className="bff-field">
                <label className="bff-label" htmlFor="title">Title <span className="bff-required">*</span></label>
                <input
                    id="title"
                    type="text"
                    className="bff-input"
                    value={formData.title}
                    onChange={(e) => onChange('title', e.target.value)}
                    placeholder="Enter book title"
                    maxLength={200}
                    disabled={disabled}
                />
            </div>

            <div className="bff-field">
                <label className="bff-label" htmlFor="description">Description</label>
                <textarea
                    id="description"
                    className="bff-textarea"
                    value={formData.description}
                    onChange={(e) => onChange('description', e.target.value)}
                    placeholder="Tell readers what your book is about"
                    rows={5}
                    disabled={disabled}
                />
            </div>

            <div className="bff-field">
                <label className="bff-label" htmlFor="content_rating">Content Rating</label>
                {isLoading ? (
                    <p className="bff-loading">Loading ratings...</p>
                ) : (
                    <select
                        id="content_rating"
                        className="bff-select"
                        value={formData.content_rating_id}
                        onChange={(e) => onChange('content_rating_id', e.target.value)}
                        disabled={disabled}
                    >
                        <option value="">Select a content rating</option>
                        {contentRatings.map((rating) => (
                            <option key={rating.id} value={rating.id}>
                                {rating.code} — {rating.name}
                            </option>
                        ))}
                    </select>
                )}
                {formData.content_rating_id && contentRatings.length > 0 && (
                    <p className="bff-hint">
                        {contentRatings.find(r => String(r.id) === String(formData.content_rating_id))?.description}
                    </p>
                )}
            </div>
        </div>
    )
}