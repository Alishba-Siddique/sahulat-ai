import axios from 'axios'

// Web search service for finding government programs and opportunities
export interface SearchResult {
    title: string
    link: string
    snippet: string
    source: string
    date?: string
}

export interface WebSearchResponse {
    success: boolean
    results: SearchResult[]
    error?: string
}

// Serper.dev API (Free tier: 100 searches/month)
async function searchWithSerper(query: string): Promise<WebSearchResponse> {
    try {
        if (!process.env.SERPER_API_KEY) {
            throw new Error('Serper API key not configured')
        }

        const response = await axios.post('https://google.serper.dev/search', {
            q: query,
            num: 10
        }, {
            headers: {
                'X-API-KEY': process.env.SERPER_API_KEY,
                'Content-Type': 'application/json'
            }
        })

        const results = response.data.organic?.map((result: any) => ({
            title: result.title,
            link: result.link,
            snippet: result.snippet,
            source: 'Google Search',
            date: result.date
        })) || []

        return {
            success: true,
            results
        }
    } catch (error) {
        console.error('Serper search error:', error)
        return {
            success: false,
            results: [],
            error: error instanceof Error ? error.message : 'Search failed'
        }
    }
}

// DuckDuckGo Instant Answer API (Free, no limits)
async function searchWithDuckDuckGo(query: string): Promise<WebSearchResponse> {
    try {
        const response = await axios.get(`https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_html=1&skip_disambig=1`)

        const results: SearchResult[] = []

        // Add instant answer if available
        if (response.data.Abstract) {
            results.push({
                title: response.data.AbstractSource,
                link: response.data.AbstractURL,
                snippet: response.data.Abstract,
                source: 'DuckDuckGo Instant Answer'
            })
        }

        // Add related topics
        if (response.data.RelatedTopics) {
            response.data.RelatedTopics.slice(0, 5).forEach((topic: any) => {
                if (topic.Text) {
                    results.push({
                        title: topic.Text.split(' - ')[0],
                        link: topic.FirstURL || '',
                        snippet: topic.Text,
                        source: 'DuckDuckGo Related'
                    })
                }
            })
        }

        return {
            success: true,
            results
        }
    } catch (error) {
        console.error('DuckDuckGo search error:', error)
        return {
            success: false,
            results: [],
            error: error instanceof Error ? error.message : 'Search failed'
        }
    }
}

// Main web search function with fallbacks
export async function searchWeb(query: string): Promise<WebSearchResponse> {
    // Try Serper first (better results)
    const serperResult = await searchWithSerper(query)
    if (serperResult.success && serperResult.results.length > 0) {
        return serperResult
    }

    // Fallback to DuckDuckGo (free, no limits)
    const duckDuckGoResult = await searchWithDuckDuckGo(query)
    if (duckDuckGoResult.success && duckDuckGoResult.results.length > 0) {
        return duckDuckGoResult
    }

    // Final fallback
    return {
        success: false,
        results: [],
        error: 'No search providers available'
    }
}

// Specialized search functions for government programs
export async function searchGovernmentPrograms(category: string, location: string = 'Pakistan'): Promise<WebSearchResponse> {
    const queries = [
        `${category} government programs ${location} 2024`,
        `${category} opportunities ${location} official website`,
        `${category} grants ${location} government portal`,
        `${category} scholarships ${location} latest`
    ]

    const allResults: SearchResult[] = []

    for (const query of queries) {
        const result = await searchWeb(query)
        if (result.success) {
            allResults.push(...result.results)
        }
    }

    // Remove duplicates based on URL
    const uniqueResults = allResults.filter((result, index, self) =>
        index === self.findIndex(r => r.link === result.link)
    )

    return {
        success: uniqueResults.length > 0,
        results: uniqueResults.slice(0, 10)
    }
}

// Search for specific program types
export async function searchSpecificPrograms(userProfile: any, goals: string[]): Promise<WebSearchResponse> {
    const { age, education, location, occupation } = userProfile

    let searchTerms = goals.join(' ')
    if (age) searchTerms += ` age ${age}`
    if (education) searchTerms += ` ${education} education`
    if (location) searchTerms += ` ${location}`
    if (occupation) searchTerms += ` ${occupation}`

    const query = `${searchTerms} government programs Pakistan 2024 official website`
    return await searchWeb(query)
}

// Search for latest opportunities
export async function searchLatestOpportunities(): Promise<WebSearchResponse> {
    const queries = [
        'latest government programs Pakistan 2024',
        'new scholarships Pakistan official website',
        'recent government grants Pakistan',
        'government opportunities Pakistan this month'
    ]

    const allResults: SearchResult[] = []

    for (const query of queries) {
        const result = await searchWeb(query)
        if (result.success) {
            allResults.push(...result.results)
        }
    }

    // Remove duplicates and sort by relevance
    const uniqueResults = allResults.filter((result, index, self) =>
        index === self.findIndex(r => r.link === result.link)
    )

    return {
        success: uniqueResults.length > 0,
        results: uniqueResults.slice(0, 8)
    }
} 