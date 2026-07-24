import React from 'react';

export default function FAQSearch({ 
    searchQuery, 
    setSearchQuery, 
    activeAudience, 
    setActiveAudience,
    activeSection, 
    setActiveSection, 
    availableSections 
}) {
    return (
        <div className="faq-search-container">
            {/* Top Audience Tabs */}
            <div className="faq-audience-tabs">
                <button 
                    className={`faq-tab ${activeAudience === 'all' ? 'active' : ''}`}
                    onClick={() => { setActiveAudience('all'); setActiveSection('all'); }}
                >
                    All FAQs
                </button>
                <button 
                    className={`faq-tab ${activeAudience === 'readerFaq' ? 'active' : ''}`}
                    onClick={() => { setActiveAudience('readerFaq'); setActiveSection('all'); }}
                >
                    For Readers
                </button>
                <button 
                    className={`faq-tab ${activeAudience === 'authorFaq' ? 'active' : ''}`}
                    onClick={() => { setActiveAudience('authorFaq'); setActiveSection('all'); }}
                >
                    For Authors
                </button>
                <button 
                    className={`faq-tab ${activeAudience === 'platformFaq' ? 'active' : ''}`}
                    onClick={() => { setActiveAudience('platformFaq'); setActiveSection('all'); }}
                >
                    Platform & Support
                </button>
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
                <button
                    className={`faq-pill ${activeSection === 'all' ? 'active' : ''}`}
                    onClick={() => setActiveSection('all')}
                >
                    All Topics
                </button>
                {availableSections.map((sec) => (
                    <button
                        key={sec.sectionId}
                        className={`faq-pill ${activeSection === sec.sectionId ? 'active' : ''}`}
                        onClick={() => setActiveSection(sec.sectionId)}
                    >
                        {sec.sectionTitle}
                    </button>
                ))}
            </div>
        </div>
    );
}