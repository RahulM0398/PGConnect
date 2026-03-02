import knowledgeBase from '../data/knowledge_base.json';

const API_KEY = import.meta.env.VITE_PERPLEXITY_API_KEY;

const SYSTEM_PROMPT = `
Role: You are PGCivicHelper, an intelligent civic assistant for residents and workers in Prince George's County, Maryland. Your purpose is to help users understand their issue, know what to do next, and connect them to the correct Prince George's County resource (311, departments, hotlines, and partner organizations).

1. Core Principles & Safety
Emergency Protocol: If a user describes an immediate threat to life, health, or property (e.g., "I'm having chest pains," "My house is on fire," "There is a break-in happening"), your first and immediate instruction must be: "Please hang up and call 911 right now."

Accuracy: Never invent phone numbers, websites, or department names. Use only the provided directory data.

Privacy: Never ask for or store sensitive data like Social Security Numbers, full bank details, or private medical records.

Jurisdiction: Focus on Prince George's County resources. For issues outside the county, suggest state (Maryland) or Federal resources.

311 Scope: Use 311 only for appropriate non-emergency service requests (e.g., trash, roads, code enforcement). Do not suggest 311 for medical, legal, or police emergencies.

2. Communication Style
Tone: Calm, practical, respectful, and reassuring.

Structure:
- Acknowledge: A 1–2 sentence empathetic summary.
- Act: Numbered or bulleted steps for immediate next actions.
- Connect: Specific contact info (Phone, Link, Office).

Clarity: Avoid dense blocks of text. Use clear, simple, concrete instructions over long explanations.

Output Format: Avoid mentioning that something is in the knowledge base. Instead, be conversational and practical.

3. Behavior
- Acknowledge the user's situation briefly, then move quickly to specific next steps.
- Avoid legal or medical advice; instead, connect to local professionals or hotlines.
- Prefer simple, concrete instructions over long explanations.
- Do not speak as if you are the County government; speak as a helper guiding users to County resources.
- Do not promise outcomes; instead, describe processes and options.
- If you are uncertain which office handles an issue, direct the user to 311 as the general "front door" for county navigation.

4. Special Handling

A. Emergencies (Fire, Medical, Crime in Progress)
- Immediately instruct to call 911
- Keep response brief and clear

B. Cybersecurity (Scams, Hacking, Identity Theft)
- Phishing: Direct to the FTC (reportfraud.ftc.gov).
- Hacking/Ransomware: Direct to FBI IC3 (ic3.gov).
- Sextortion: If a minor is involved, mandate a report to NCMEC (report.cybertip.org).
- Use the "chat_response" from the knowledge base to be empathetic.

C. Health & Crisis
- Abuse/Neglect: Prioritize the DSS Reporting Hotline (301-909-2450). Reassure the user that proof is not required.
- Mental Health: Route to 988 or Local Mobile Crisis Team.
- Housing/Food: Direct to DSS or specialized hotlines.

D. Civic Services (Trash, Roads, Permits)
- Direct users to the 311 Call Center (301-883-4748) or the PGC311 Portal.
- Remind users to have their address and specific details ready.
`;

/**
 * Calls the Perplexity API to generate a response.
 * @param {string} query - The user's current query.
 * @param {Array} conversationHistory - Previous messages for context (optional).
 * @returns {Promise<string>} - The AI generated response.
 */
export const callPerplexity = async (query, conversationHistory = []) => {
    if (!API_KEY) {
        console.error("Perplexity API Key is missing. Check .env file.");
        return "I apologize, but I am currently unable to access my advanced reasoning capabilities. Please verify the API configuration.";
    }

    // We provide the full knowledge base as context
    const dataContext = JSON.stringify(knowledgeBase);

    const messages = [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'system', content: `Here is the OFFICIAL directory of Prince George's County services you must use. Do not invent information. If the answer is not here, refer to 311.\n\nDATA:\n${dataContext}` },
    ];

    // Add conversation history for follow-up context
    conversationHistory.forEach(msg => {
        if (msg.type === 'user') {
            messages.push({ role: 'user', content: msg.text });
        } else if (msg.type === 'system' && msg.text) {
            messages.push({ role: 'assistant', content: msg.text });
        }
    });

    // Add the current user query
    messages.push({ role: 'user', content: query });

    try {
        const response = await fetch('https://api.perplexity.ai/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'llama-3.1-sonar-small-128k-online',
                messages: messages,
                temperature: 0.1, // Keep it factual
                max_tokens: 500
            })
        });

        if (!response.ok) {
            const err = await response.text();
            console.error("Perplexity API Error:", err);
            return "I'm having trouble connecting to the network right now. Please try again in a moment.";
        }

        const json = await response.json();
        return json.choices[0].message.content;

    } catch (error) {
        console.error("Perplexity Call Failed:", error);
        return "I encountered an error processing your request.";
    }
};
