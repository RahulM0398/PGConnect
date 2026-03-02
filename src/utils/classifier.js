import knowledgeBase from '../data/knowledge_base.json';

/**
 * Normalizes text for better matching (lowercase, remove punctuation)
 */
const normalize = (text) => {
    return text.toLowerCase().replace(/[^\w\s]/g, '');
};

/**
 * Classifies a user query and returns the best matching service action card.
 * @param {string} query - The user's input/question.
 * @returns {object|null} - The matching service object or null if no match found.
 */
export const classifyQuery = (query) => {
    if (!query) return null;

    const normalizedQuery = normalize(query);
    const words = normalizedQuery.split(/\s+/);

    let bestMatch = null;
    let maxScore = 0;

    knowledgeBase.forEach((service) => {
        let score = 0;

        // Check keywords
        service.keywords.forEach((keyword) => {
            const normalizedKeyword = normalize(keyword);

            // Exact phrase match in query (strongest)
            if (normalizedQuery.includes(normalizedKeyword)) {
                score += 5;
            }
            // Word match (weaker, but helps if phrase is broken)
            else {
                const keywordWords = normalizedKeyword.split(/\s+/);
                // Check if ALL words of the keyword are present in the query (unordered)
                const allWordsPresent = keywordWords.every(kw => words.includes(kw));
                if (allWordsPresent) {
                    score += 3;
                } else if (words.includes(normalizedKeyword)) {
                    // Single word keyword match
                    score += 1;
                }
            }
        });

        // Check title (approximate) - give it high weight
        const normalizedTitle = normalize(service.title);
        if (normalizedQuery.includes(normalizedTitle)) score += 10;

        // Check description match
        if (service.description) {
            const normalizedDesc = normalize(service.description);
            // If a significant chunk of description matches
            if (normalizedQuery.includes(normalizedDesc)) score += 5;
        }

        if (score > maxScore) {
            maxScore = score;
            bestMatch = service;
        }
    });

    // Threshold to avoid weak matches, but for cybersecurity we want to be sensitive
    return maxScore > 0 ? bestMatch : null;
};
