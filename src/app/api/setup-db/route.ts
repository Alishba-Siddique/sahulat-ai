import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST() {
    try {
        // Create the government_programs table
        const { error: createError } = await supabase.rpc('create_government_programs_table')

        if (createError) {
            console.error('Error creating table:', createError)
            return NextResponse.json({
                success: false,
                error: 'Failed to create table',
                details: createError.message
            })
        }

        // Insert sample data
        const { sampleScholarships } = await import('@/lib/sample-scholarships')

        const { error: insertError } = await supabase
            .from('government_programs')
            .insert(sampleScholarships)

        if (insertError) {
            console.error('Error inserting sample data:', insertError)
            return NextResponse.json({
                success: false,
                error: 'Failed to insert sample data',
                details: insertError.message
            })
        }

        return NextResponse.json({
            success: true,
            message: 'Database setup completed successfully',
            programsCount: sampleScholarships.length
        })

    } catch (error) {
        console.error('Setup error:', error)
        return NextResponse.json({
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error'
        })
    }
} 