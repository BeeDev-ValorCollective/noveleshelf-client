import './authorBook.css';

export default function BookFormFields({ formData, onChange, contentRatings, isLoading, disabled, coverPreview, onCoverChange, coverError }) {
    return (
        <div className="book-form-fields">

            <div className="bff-field">
                <label className="bff-label" htmlFor="cover_image">Cover Image</label>
                {coverPreview && (
                    <img
                        src={coverPreview}
                        alt="Cover preview"
                        className="bff-cover-preview"
                    />
                )}
                <input
                    id="cover_image"
                    type="file"
                    className="bff-input"
                    accept="image/*"
                    onChange={onCoverChange}
                    disabled={disabled}
                />
                {coverError && <p className="bff-error">{coverError}</p>}
                <p className="bff-hint">Leave blank to keep the current cover. Max 5MB.</p>
            </div>

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
                <p className="bff-hint">
                    If you are unsure which rating to select, err on the side of caution or contact admin for clarification.
                </p>
            </div>
        </div>
    )
}