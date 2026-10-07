import React from 'react';
import Button from '../ui/Button';

export default function FAQSearch({ 
    searchQuery, 
    setSearchQuery, 
    setActiveAudience,
    setActiveSection, 
    availableSections 
}) {
    return (
        <div className="faq-search-container">
            {/* Top Audience Tabs */}
            <div className="faq-audience-tabs">
                <Button
                    variant='primary'
                    size='md'
                    onClick={() => { setActiveAudience('all'); setActiveSection('all'); }}
                >
                    All FAQs
                </Button>
                <Button
                    variant='primary'
                    size='md'
                    onClick={() => { setActiveAudience('readerFaq'); setActiveSection('all'); }}
                >
                    For Readers
                </Button>
                <Button
                    variant='primary'
                    size='md'
                    onClick={() => { setActiveAudience('authorFaq'); setActiveSection('all'); }}
                >
                    For Authors
                </Button>
                <Button
                    variant='primary'
                    size='md'
                    onClick={() => { setActiveAudience('platformFaq'); setActiveSection('all'); }}
                >
                    Platform & Support
                </Button>
            </div>

            {/* Search Bar Input */}
            <div className="faq-search-input-wrapper">
                <input
                    type="text"
                    placeholder="Search 70+ questions (e.g., royalties, ink drops, upload)..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="faq-search-input"
                />
            </div>

            {/* Section Pills (Dynamic based on selected audience tab) */}
            <div className="faq-category-pills">
                <Button
                    variant='secondary'
                    size='sm'
                    onClick={() => setActiveSection('all')}
                >
                    All Topics
                </Button>
                {availableSections.map((sec) => (
                    <Button
                        key={sec.sectionId}
                        variant='secondary'
                        size='sm'
                        onClick={() => setActiveSection(sec.sectionId)}
                    >
                        {sec.sectionTitle}
                    </Button>
                ))}
            </div>
        </div>
    );
}