import { NextRequest, NextResponse } from 'next/server'
import { generateProgramMatch, generateSimpleResponse, UserProfile } from '@/lib/openrouter'
import { DatabaseService } from '@/lib/database'
import { UserInputParser } from '@/lib/user-parser'
import { supabase } from '@/lib/supabase'

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

        // Generate AI response
        const aiResponse = await generateProgramMatch(
            message,
            userProfile,
            programs
        )

        if (!aiResponse.success) {
            return NextResponse.json({
                success: false,
                message: aiResponse.message,
                error: aiResponse.error
            }, { status: 500 })
        }

        // Parse AI response to extract program IDs and web results
        let recommendedProgramIds: string[] = []
        let webResults: string[] = []
        let suggestions: string[] = []
        let confidence = 0.8

        try {
            // Try to parse JSON response
            const jsonMatch = aiResponse.message.match(/\{[\s\S]*\}/)
            if (jsonMatch) {
                const parsed = JSON.parse(jsonMatch[0])
                recommendedProgramIds = parsed.recommendedPrograms || []
                webResults = parsed.webResults || []
                suggestions = parsed.suggestions || []
                confidence = parsed.confidence || 0.8
            }
        } catch (_error) {
            console.log('Could not parse AI response as JSON, using full message')
        }

        // Get recommended programs from database
        const recommendedPrograms = programs.filter(program =>
            recommendedProgramIds.includes(program.id)
        )

        // Save chat message (optional - for analytics)
        let chatId = null
        try {
            const { data: chatData, error: chatError } = await supabase
                .from('chat_messages')
                .insert({
                    user_id: 'anonymous', // Temporary user ID
                    message: message,
                    response: aiResponse.message,
                    recommended_programs: recommendedProgramIds,
                    web_results: webResults,
                    confidence: confidence
                })
                .select()
                .single()

            if (chatError) {
                console.error('Error saving chat message:', chatError)
            } else {
                chatId = chatData?.id
            }
        } catch (error) {
            console.error('Could not save chat message:', error)
        }

        return NextResponse.json({
            success: true,
            message: aiResponse.message,
            recommendedPrograms,
            webResults,
            suggestions,
            confidence,
            chatId: chatId
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