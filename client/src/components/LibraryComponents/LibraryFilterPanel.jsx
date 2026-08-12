import Button from '../ui/Button'

export default function LibraryFilterPanel({
    view,
    referenceData,
    pendingFilters,
    setPendingFilters,
    onApply,
    onClear,
    onClose,
}) {
    const toggleChip = (filterKey, id) => {
        setPendingFilters((prev) => ({
            ...prev,
            [filterKey]: prev[filterKey] === id ? null : id,
        }))
    }

    const toggleBool = (filterKey) => {
        setPendingFilters((prev) => ({ ...prev, [filterKey]: !prev[filterKey] }))
    }

    const renderChipSection = (title, items, filterKey, labelKey = 'name') => (
        <div className='library-filter-section'>
            <h4>{title}</h4>
            <div className='library-filter-chips'>
                {items?.map((item) => (
                    <Button
                        key={item.id}
                        variant='secondary'
                        size='sm'
                        onClick={() => toggleChip(filterKey, item.id)}
                    >
                        {item[labelKey]}
                    </Button>
                ))}
            </div>
        </div>
    )

    const renderToggle = (label, filterKey) => (
        <label className='library-filter-toggle'>
            <input
                type='checkbox'
                checked={!!pendingFilters[filterKey]}
                onChange={() => toggleBool(filterKey)}
            />
            <span>{label}</span>
        </label>
    )

    return (
        <div className='library-filter-overlay' onClick={(e) => e.target === e.currentTarget && onClose()}>
            <div className='library-filter-panel'>
                <div className='library-filter-header'>
                    <h3>{view === 'authors' ? 'Filter authors' : 'Filter the shelf'}</h3>
                    <Button
                        variant='secondary'
                        size='md'
                        onClick={onClose}
                    >
                        ✕
                    </Button>
                </div>

                <div className='library-filter-body'>
                    {view === 'authors' ? (
                        <div className='library-filter-section'>
                            <h4>Show</h4>
                            {renderToggle('Featured authors', 'is_featured')}
                            {renderToggle('Founding authors', 'is_founding_author')}
                        </div>
                    ) : (
                        <>
                            {renderChipSection('Genre', referenceData?.genres, 'genre')}
                            {renderChipSection('Content rating', referenceData?.content_ratings, 'content_rating', 'code')}
                            {renderChipSection('Relationship', referenceData?.relationship_tags, 'relationship_tag')}
                            {renderChipSection('Keywords', referenceData?.keywords, 'keyword')}
                            <div className='library-filter-section'>
                                <h4>Status</h4>
                                {renderToggle('New releases', 'is_new')}
                                {renderToggle('Complete', 'is_complete')}
                                {renderToggle('Featured', 'is_featured')}
                            </div>
                        </>
                    )}
                </div>

                <div className='library-filter-footer'>
                    <Button
                        variant='secondary'
                        size='lg'
                        onClick={onClear}
                    >
                        Clear All
                    </Button>
                    <Button
                        variant='primary'
                        size='lg'
                        onClick={onApply}
                    >
                        Apply Filters
                    </Button>
                    {/* <button className='library-filter-clear' onClick={onClear}>Clear all</button>
                    <button className='library-filter-apply' onClick={onApply}>Apply filters</button> */}
                </div>
            </div>
        </div>
    )
}