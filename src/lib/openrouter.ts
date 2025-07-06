import { searchWeb, searchGovernmentPrograms, searchSpecificPrograms, searchLatestOpportunities, SearchResult } from './web-search'

// Available FREE models for different use cases (100% free, no cost)
export const AI_MODELS = {
    CHAT: 'meta-llama/llama-3.1-8b-instruct', // Free, excellent for general chat
    FAST: 'microsoft/phi-3-mini-4k-instruct', // Free, very fast responses
    CREATIVE: 'google/gemini-flash-1.5', // Free, good for creative tasks
    SMART: 'anthropic/claude-3-haiku', // Free, very capable reasoning
    PROGRAMMING: 'microsoft/phi-3-mini-4k-instruct', // Free, good for structured tasks
    // Backup models (all free)
    BACKUP1: 'meta-llama/llama-3.1-8b-instruct', // Always reliable
    BACKUP2: 'anthropic/claude-3-haiku', // High quality
    BACKUP3: 'google/gemini-flash-1.5', // Good performance
} as const

export type AIModel = keyof typeof AI_MODELS

// Interface for AI response
export interface AIResponse {
    success: boolean
    message: string
    programs?: any[]
    suggestions?: string[]
    error?: string
}

// Interface for user profile
export interface UserProfile {
    age?: number
    gender?: string
    education?: string
    location?: string
    goals?: string
    income?: string
    occupation?: string
    familySize?: number
    disabilities?: string[]
    languages?: string[]
}

// Simple OpenRouter API call using fetch
async function callOpenRouterAPI(model: string, messages: any[], options: any = {}) {
    try {
        const requestBody = {
            model,
            messages,
            ...options
        }

        console.log('OpenRouter API call:', {
            model,
            messageCount: messages.length,
            hasApiKey: !!process.env.OPENROUTER_API_KEY
        })

        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
                'Content-Type': 'application/json',
                'HTTP-Referer': 'https://sahulat-ai.vercel.app',
                'X-Title': 'Sahulat AI'
            },
            body: JSON.stringify(requestBody)
        })

        if (!response.ok) {
            const errorText = await response.text()
            console.error('OpenRouter API error details:', {
                status: response.status,
                statusText: response.statusText,
                errorText,
                requestBody
            })
            throw new Error(`OpenRouter API error: ${response.status} ${response.statusText} - ${errorText}`)
        }

        return response.json()
    } catch (error) {
        console.error('OpenRouter API call failed:', error)
        throw error
    }
}

// Function to get available models from OpenRouter
async function getAvailableModels(): Promise<string[]> {
    try {
        const response = await fetch('https://openrouter.ai/api/v1/models', {
            headers: {
                'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
                'Content-Type': 'application/json'
            }
        })

        if (!response.ok) {
            console.error('Failed to fetch available models')
            return []
        }

        const data = await response.json()
        return data.data?.map((model: any) => model.id) || []
    } catch (error) {
        console.error('Error fetching available models:', error)
        return []
    }
}

// Function to get a working model, with fallback
async function getWorkingModel(preferredModel: string): Promise<string> {
    try {
        const availableModels = await getAvailableModels()

        // Check if preferred model is available
        if (availableModels.includes(preferredModel)) {
            return preferredModel
        }

        // Try alternative FREE models in order of reliability
        const freeModels = [
            'meta-llama/llama-3.1-8b-instruct', // Most reliable free model
            'anthropic/claude-3-haiku', // High quality free model
            'google/gemini-flash-1.5', // Good performance free model
            'microsoft/phi-3-mini-4k-instruct' // Fast free model
        ]

        for (const model of freeModels) {
            if (availableModels.includes(model)) {
                console.log(`Using free model: ${model} instead of ${preferredModel}`)
                return model
            }
        }

        // Final fallback to the most reliable free model
        console.log('Using fallback free model: meta-llama/llama-3.1-8b-instruct')
        return 'meta-llama/llama-3.1-8b-instruct'
    } catch (error) {
        console.error('Error getting working model:', error)
        return 'meta-llama/llama-3.1-8b-instruct' // Final fallback to reliable free model
    }
}

// Function to generate AI response for program matching
export async function generateProgramMatch(
    userMessage: string,
    userProfile: UserProfile,
    availablePrograms: any[],
    model: AIModel = 'CHAT'
): Promise<AIResponse> {
    try {
        if (!process.env.OPENROUTER_API_KEY) {
            return {
                success: false,
                message: 'AI service is not configured. Please contact support.',
                error: 'Missing API key'
            }
        }

        // Search the web for additional programs
        let webResults: SearchResult[] = []
        try {
            // Extract goals from user profile or message
            const goals = userProfile.goals ? [userProfile.goals] :
                userMessage.toLowerCase().includes('scholarship') ? ['scholarship'] :
                    userMessage.toLowerCase().includes('loan') ? ['loan'] :
                        userMessage.toLowerCase().includes('training') ? ['training'] :
                            userMessage.toLowerCase().includes('job') ? ['employment'] :
                                userMessage.toLowerCase().includes('housing') ? ['housing'] :
                                    userMessage.toLowerCase().includes('health') ? ['healthcare'] : ['government programs']

            const webSearchResult = await searchSpecificPrograms(userProfile, goals)
            if (webSearchResult.success) {
                webResults = webSearchResult.results
            }
        } catch (error) {
            console.error('Web search error:', error)
            // Continue without web results
        }

        // Create context about available programs
        const programsContext = availablePrograms
            .slice(0, 10) // Limit to first 10 for context
            .map(program => ({
                id: program.id,
                title: program.title,
                category: program.category,
                description: program.description,
                eligibility: program.eligibility_criteria,
                benefits: program.benefits,
                requirements: program.requirements,
                funding: program.funding_amount,
                deadline: program.application_deadline
            }))
            .map(p => `- ${p.title} (${p.category}): ${p.description}`)
            .join('\n')

        // Create web search context
        const webContext = webResults.length > 0 ?
            `\n\nAdditional opportunities found online:\n${webResults.map(result =>
                `- ${result.title}: ${result.snippet} (${result.link})`
            ).join('\n')}` : ''

        // Create user profile context
        const profileContext = Object.entries(userProfile)
            .filter(([_, value]) => value !== undefined && value !== null)
            .map(([key, value]) => `${key}: ${value}`)
            .join(', ')

        // Construct the prompt
        const prompt = `You are Sahulat AI, a government program discovery assistant in Pakistan. You have access to ${availablePrograms.length} government programs in our database and ${webResults.length} additional opportunities found online.

Available Programs in Database:
${programsContext}${webContext}

User Profile: ${profileContext || 'Basic profile'}
User Message: "${userMessage}"

YOUR TASK - RECOMMEND PROGRAMS NOW:
1. IMMEDIATELY recommend 2-3 specific programs from the database list above
2. If relevant online opportunities are found, mention 1-2 of them as additional options
3. For each program, explain: what it is, why it's suitable, benefits, requirements, funding amount, deadline
4. Provide specific application steps for each program
5. Only after providing full program details, briefly mention 1-2 missing profile details if needed

EXAMPLE RESPONSE FORMAT:
"Based on your interest in [category], here are specific programs for you:

1. [Program Name] - [Brief description]
   Benefits: [List benefits]
   Requirements: [List requirements] 
   Funding: [Amount]
   Deadline: [Date]
   How to apply: [Steps]

2. [Program Name] - [Brief description]
   [Same details as above]

Additional Online Opportunities:
- [Online Program]: [Brief description] - [Link]

[Brief note about missing info if needed]"

RESPOND IN JSON FORMAT:
{
  "message": "Your detailed program recommendations as shown above",
  "recommendedPrograms": ["program_id_1", "program_id_2"],
  "webResults": ["url_1", "url_2"],
  "suggestions": ["Ask for age", "Ask for education level"],
  "confidence": 0.85
}`

        // Generate AI response using OpenRouter API
        const workingModel = await getWorkingModel(AI_MODELS[model])
        const response = await callOpenRouterAPI(workingModel, [
            {
                role: 'system',
                content: `You are Sahulat AI, a government program discovery assistant in Pakistan. Your PRIMARY goal is to RECOMMEND SPECIFIC PROGRAMS from the available list. 

CRITICAL RULES:
1. ALWAYS recommend 2-3 specific programs from the available list first
2. NEVER just ask questions without providing program recommendations
3. Even with incomplete user profiles, recommend programs based on what you know
4. Provide specific details about each recommended program
5. Only ask for missing information AFTER providing recommendations

You must respond in JSON format with actual program recommendations.`
            },
            {
                role: 'user',
                content: prompt
            }
        ], {
            temperature: 0.3,
            max_tokens: 1000,
            response_format: { type: 'json_object' }
        })

        const aiResponse = response.choices[0]?.message?.content
        if (!aiResponse) {
            throw new Error('No response from AI service')
        }

        // Parse JSON response
        const parsedResponse = JSON.parse(aiResponse)

        // Get recommended programs
        const recommendedPrograms = availablePrograms.filter(program =>
            parsedResponse.recommendedPrograms?.includes(program.id)
        )

        return {
            success: true,
            message: parsedResponse.message,
            programs: recommendedPrograms,
            suggestions: parsedResponse.suggestions || [],
        }

    } catch (error) {
        console.error('AI generation error:', error)

        // Fallback: Provide actual program recommendations without AI
        if (availablePrograms.length > 0) {
            // Get some relevant programs based on basic criteria
            const relevantPrograms = availablePrograms.slice(0, 3)

            const fallbackMessage = `Here are specific government programs available for you in Pakistan:

${relevantPrograms.map(program =>
                `**${program.title}** (${program.category})
${program.description}

**Benefits:** ${program.benefits}
**Requirements:** ${program.requirements}
**Funding Amount:** ${program.funding_amount}
**Application Deadline:** ${program.application_deadline}
**How to Apply:** ${program.application_info || 'Contact the program office for application details'}

---`
            ).join('\n\n')}

These programs are currently available and accepting applications. For more personalized recommendations, you can share your age, education level, location, and specific goals.`

            return {
                success: true,
                message: fallbackMessage,
                programs: relevantPrograms,
                suggestions: [
                    'Share your age for age-specific programs',
                    'Tell us your education level for education programs',
                    'Mention your location for local opportunities',
                    'Describe your specific goals (scholarships, loans, training, etc.)'
                ],
                error: 'AI service temporarily unavailable, showing available programs'
            }
        } else {
            return {
                success: true,
                message: `Here are the main types of government programs available in Pakistan:

**🎓 Scholarships & Education**
• Student scholarships for various education levels
• Merit-based and need-based financial aid
• International study opportunities

**💰 Business & Financial Support**
• Small business loans and grants
• Entrepreneurship development programs
• Agricultural and farming support

**🔧 Skill Development & Training**
• Technical and vocational training
• IT and digital skills programs
• Professional certification courses

**💼 Employment & Jobs**
• Job placement and career services
• Internship programs
• Public sector employment opportunities

**🏠 Housing & Infrastructure**
• Affordable housing schemes
• Home improvement grants
• Rural development programs

**🏥 Healthcare & Medical**
• Health insurance schemes
• Medical treatment support
• Disability assistance programs

To get specific program recommendations, please tell me about your age, education, location, and what type of support you're looking for.`,
                programs: [],
                suggestions: [
                    'Tell us your age',
                    'Share your education level',
                    'Mention your location',
                    'Describe your goals'
                ],
                error: 'No programs in database, providing general information'
            }
        }
    }
}

// Function to generate simple responses for basic queries
export async function generateSimpleResponse(
    userMessage: string,
    model: AIModel = 'FAST'
): Promise<string> {
    try {
        if (!process.env.OPENROUTER_API_KEY) {
            return 'AI service is not configured. Please contact support.'
        }

        const workingModel = await getWorkingModel(AI_MODELS[model])
        const response = await callOpenRouterAPI(workingModel, [
            {
                role: 'system',
                content: 'You are Sahulat AI, a helpful assistant for government program discovery in Pakistan. Keep responses concise and helpful.'
            },
            {
                role: 'user',
                content: userMessage
            }
        ], {
            temperature: 0.7,
            max_tokens: 200
        })

        return response.choices[0]?.message?.content || 'I apologize, but I couldn\'t generate a response. Please try again.'
    } catch (error) {
        console.error('Simple response error:', error)
        return 'I apologize, but I\'m having trouble right now. Please try again in a moment.'
    }
}

// Function to validate and enhance user profile
export async function enhanceUserProfile(
    userMessage: string,
    currentProfile: UserProfile,
    model: AIModel = 'FAST'
): Promise<{ profile: UserProfile; suggestions: string[] }> {
    try {
        if (!process.env.OPENROUTER_API_KEY) {
            return { profile: currentProfile, suggestions: [] }
        }

        const prompt = `Analyze this user message and extract or update profile information. Current profile: ${JSON.stringify(currentProfile)}

User message: "${userMessage}"

Extract any new profile information from the message. Only suggest asking for information if it's completely missing and essential for program matching. Focus on extracting what the user has already shared.

Respond in JSON:
{
  "updatedProfile": { "age": 25, "education": "bachelor" },
  "suggestions": ["Ask for income level", "Ask for occupation"]
}`

        const workingModel = await getWorkingModel(AI_MODELS[model])
        const response = await callOpenRouterAPI(workingModel, [
            {
                role: 'system',
                content: 'You are a profile extraction assistant. Always respond in JSON format.'
            },
            {
                role: 'user',
                content: prompt
            }
        ], {
            temperature: 0.3,
            max_tokens: 300,
            response_format: { type: 'json_object' }
        })

        const aiResponse = response.choices[0]?.message?.content
        if (!aiResponse) {
            return { profile: currentProfile, suggestions: [] }
        }

        const parsed = JSON.parse(aiResponse)
        const updatedProfile = { ...currentProfile, ...parsed.updatedProfile }

        return {
            profile: updatedProfile,
            suggestions: parsed.suggestions || []
        }

    } catch (error) {
        console.error('Profile enhancement error:', error)

        // Fallback: Return current profile with basic suggestions
        const suggestions = []

        // Basic profile suggestions based on current profile
        if (!currentProfile.age) suggestions.push('Please tell us your age')
        if (!currentProfile.education) suggestions.push('What is your education level?')
        if (!currentProfile.location) suggestions.push('Where are you located?')
        if (!currentProfile.goals) suggestions.push('What type of programs are you looking for?')

        return {
            profile: currentProfile,
            suggestions: suggestions.length > 0 ? suggestions : ['Tell us more about yourself to get better recommendations']
        }
    }
} 