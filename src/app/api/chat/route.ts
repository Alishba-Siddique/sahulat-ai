import { NextRequest, NextResponse } from 'next/server'
import { generateProgramMatch, generateSimpleResponse, enhanceUserProfile, UserProfile } from '@/lib/openrouter'
import { DatabaseService } from '@/lib/database'
import { UserInputParser } from '@/lib/user-parser'

export async function POST(request: NextRequest) {
    try {
        const { message, userProfile = {} } = await request.json()

        if (!message || typeof message !== 'string') {
            return NextResponse.json({
                success: false,
                error: 'Message is required'
            })
        }

        // Parse user message for profile information
        const parsedResult = UserInputParser.parseUserInput(message)
        const parsedData = parsedResult.data

        // Merge parsed data with existing profile
        const enhancedProfile: UserProfile = {
            ...userProfile,
            age: parsedData.age,
            gender: parsedData.gender,
            education: parsedData.education,
            location: parsedData.location?.city || parsedData.location?.province,
            goals: parsedData.goals?.join(', '),
            income: parsedData.income,
            occupation: parsedData.occupation,
            familySize: parsedData.familySize,
            disabilities: parsedData.disabilities,
            languages: parsedData.languages
        }

        // Get available programs from database
        const programs = await DatabaseService.getAllPrograms()

        if (!programs || programs.length === 0) {
            // If no programs available, provide a simple response
            const simpleResponse = await generateSimpleResponse(message)
            return NextResponse.json({
                success: true,
                message: simpleResponse,
                profile: enhancedProfile,
                suggestions: ['Set up database with government programs']
            })
        }

        // Generate AI response with program matching
        const aiResponse = await generateProgramMatch(
            message,
            enhancedProfile,
            programs
        )

        // Enhance user profile with AI
        const { profile: finalProfile, suggestions: profileSuggestions } = await enhanceUserProfile(
            message,
            enhancedProfile
        )

        // Combine suggestions
        const allSuggestions = [
            ...(aiResponse.suggestions || []),
            ...profileSuggestions,
            ...parsedResult.suggestions
        ].filter((suggestion, index, array) => array.indexOf(suggestion) === index) // Remove duplicates

        return NextResponse.json({
            success: aiResponse.success,
            message: aiResponse.message,
            programs: aiResponse.programs || [],
            profile: finalProfile,
            suggestions: allSuggestions,
            confidence: parsedData.confidence || 0,
            error: aiResponse.error
        })

    } catch (error) {
        console.error('Chat API error:', error)

        return NextResponse.json({
            success: false,
            message: 'I apologize, but I\'m having trouble processing your request right now. Please try again in a moment.',
            error: error instanceof Error ? error.message : 'Unknown error'
        })
    }
}

// Handle GET requests for testing
export async function GET() {
    return NextResponse.json({
        success: true,
        message: 'Chat API is working. Send a POST request with a message to get AI responses.',
        endpoints: {
            chat: 'POST /api/chat',
            programs: 'GET /api/programs',
            setup: 'POST /api/setup-db'
        }
    })
} 