import React, { useState, useMemo, useEffect } from 'react';
import FAQSearch from '../components/FAQ/FAQSearch';
import FAQAccordion from '../components/FAQ/FAQAccordion';
import { faqData } from '../data/faq/faqIndex'; // Imports readerFaq, authorFaq, platformFaq, highImpactFaq
import '../components/FAQ/FAQTeaser.css';

export default function FAQPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeAudience, setActiveAudience] = useState('all'); // 'all' | 'readerFaq' | 'authorFaq' | 'platformFaq'
    const [activeSection, setActiveSection] = useState('all');

    // Scroll to top on page mount
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    // 1. Combine data sets based on selected audience tab
    const sourceData = useMemo(() => {
        if (activeAudience === 'readerFaq') return faqData.readerFaq;
        if (activeAudience === 'authorFaq') return faqData.authorFaq;
        if (activeAudience === 'platformFaq') return faqData.platformFaq;
        
        // 'all': Combine reader, author, and platform datasets
        return [
            ...faqData.readerFaq,
            ...faqData.authorFaq,
            ...faqData.platformFaq
        ];
    }, [activeAudience]);

    // 2. Extract available section titles/IDs for category pills
    const availableSections = useMemo(() => {
        return sourceData.map(group => ({
            sectionId: group.sectionId,
            sectionTitle: group.sectionTitle
        }));
    }, [sourceData]);

    // 3. Filter logic matching sectionId, sectionTitle, and question items
    const filteredFaqGroups = useMemo(() => {
        const query = searchQuery.toLowerCase().trim();

        return sourceData
            .map((group) => {
                // Filter by Section Pill selection
                if (activeSection !== 'all' && group.sectionId !== activeSection) {
                    return null;
                }

                // Filter items inside section by search query
                const matchingItems = group.items.filter((item) => {
                    const qMatch = item.question.toLowerCase().includes(query);
                    const aMatch = item.answer.toLowerCase().includes(query);
                    return qMatch || aMatch;
                });

                if (matchingItems.length === 0) return null;

                return {
                    ...group,
                    items: matchingItems
                };
            })
            .filter(Boolean); // Clean out null entries
    }, [sourceData, searchQuery, activeSection]);

    const handleClearFilters = () => {
        setSearchQuery('');
        setActiveAudience('all');
        setActiveSection('all');
    };

    return (
        <main className="faq-page-container">
            {/* Header Hero */}
            <div className="faq-header-section">
                <h1 className="faq-teaser-title">Help Center & FAQs</h1>
                <p className="faq-teaser-subtitle">
                    Find instant answers for readers, authors, and platform policies.
                </p>
            </div>

            {/* Search & Tabs Controls */}
            <FAQSearch 
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                activeAudience={activeAudience}
                setActiveAudience={setActiveAudience}
                activeSection={activeSection}
                setActiveSection={setActiveSection}
                availableSections={availableSections}
            />

            {/* Accordion Content Groups */}
            <section className="faq-content-body">
                {filteredFaqGroups.length > 0 ? (
                    filteredFaqGroups.map((group) => (
                        <div key={group.sectionId} className="faq-category-group">
                            <h3 className="faq-section-heading">{group.sectionTitle}</h3>
                            <FAQAccordion items={group.items} />
                        </div>
                    ))
                ) : (
                    <div className="faq-no-results">
                        <p>No questions found matching "{searchQuery}".</p>
                        <button className="faq-cta-btn" onClick={handleClearFilters}>
                            Clear Filters
                        </button>
                    </div>
                )}
            </section>
        </main>
    );
}