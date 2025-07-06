import { NextRequest, NextResponse } from 'next/server'
import { DatabaseService } from '@/lib/database'

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const category = searchParams.get('category')
        const limit = parseInt(searchParams.get('limit') || '10')

        let programs

        if (category) {
            programs = await DatabaseService.getProgramsByCategory(category)
        } else {
            programs = await DatabaseService.getFeaturedPrograms(limit)
        }

        return NextResponse.json({
            success: true,
            data: programs,
            count: programs.length
        })
    } catch (error) {
        console.error('API Error:', error)
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to fetch programs',
                message: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        )
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { action } = body

        if (action === 'insert-sample-data') {
            await DatabaseService.insertSampleData()
            return NextResponse.json({
                success: true,
                message: 'Sample data inserted successfully'
            })
        }

        return NextResponse.json(
            {
                success: false,
                error: 'Invalid action'
            },
            { status: 400 }
        )
    } catch (error) {
        console.error('API Error:', error)
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to process request',
                message: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        )
    }
} 