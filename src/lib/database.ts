import { supabase } from './supabase'
import { GovernmentProgram, ProgramSearchFilters, ProgramSearchResult } from '@/types/program'

export class DatabaseService {
    // Get all active programs
    static async getAllPrograms(): Promise<GovernmentProgram[]> {
        const { data, error } = await supabase
            .from('government_programs')
            .select('*')
            .eq('is_active', true)
            .order('created_at', { ascending: false })

        if (error) {
            console.error('Error fetching programs:', error)
            return []
        }

        return data || []
    }

    // Search programs based on user profile
    static async searchPrograms(filters: ProgramSearchFilters): Promise<ProgramSearchResult> {
        let query = supabase
            .from('government_programs')
            .select('*')
            .eq('is_active', true)

        // Apply filters
        if (filters.category && filters.category.length > 0) {
            query = query.in('category', filters.category)
        }

        if (filters.age) {
            query = query.or(`age_range->>'min'.lte.${filters.age},age_range->>'max'.gte.${filters.age}`)
        }

        if (filters.education && filters.education.length > 0) {
            query = query.overlaps('education_level', filters.education)
        }

        if (filters.location && filters.location.length > 0) {
            query = query.overlaps('location', filters.location)
        }

        if (filters.income_level && filters.income_level.length > 0) {
            query = query.overlaps('income_level', filters.income_level)
        }

        if (filters.gender && filters.gender !== 'all') {
            query = query.or(`gender.eq.${filters.gender},gender.eq.all`)
        }

        if (filters.disability_friendly) {
            query = query.eq('disability_friendly', true)
        }

        if (filters.keywords && filters.keywords.length > 0) {
            const keywordQuery = filters.keywords.map(keyword =>
                `title.ilike.%${keyword}%,description.ilike.%${keyword}%`
            ).join(',')
            query = query.or(keywordQuery)
        }

        const { data, error, count } = await query.order('created_at', { ascending: false })

        if (error) {
            console.error('Error searching programs:', error)
            return {
                programs: [],
                total_count: 0,
                filters_applied: filters
            }
        }

        return {
            programs: data || [],
            total_count: count || 0,
            filters_applied: filters
        }
    }

    // Get program by ID
    static async getProgramById(id: string): Promise<GovernmentProgram | null> {
        const { data, error } = await supabase
            .from('government_programs')
            .select('*')
            .eq('id', id)
            .single()

        if (error) {
            console.error('Error fetching program:', error)
            return null
        }

        return data
    }

    // Get programs by category
    static async getProgramsByCategory(category: string): Promise<GovernmentProgram[]> {
        const { data, error } = await supabase
            .from('government_programs')
            .select('*')
            .eq('category', category)
            .eq('is_active', true)
            .order('created_at', { ascending: false })

        if (error) {
            console.error('Error fetching programs by category:', error)
            return []
        }

        return data || []
    }

    // Get featured programs (for homepage)
    static async getFeaturedPrograms(limit: number = 5): Promise<GovernmentProgram[]> {
        const { data, error } = await supabase
            .from('government_programs')
            .select('*')
            .eq('is_active', true)
            .order('created_at', { ascending: false })
            .limit(limit)

        if (error) {
            console.error('Error fetching featured programs:', error)
            return []
        }

        return data || []
    }

    // Insert sample data (for development)
    static async insertSampleData(): Promise<void> {
        const { sampleScholarships } = await import('./sample-scholarships')

        const { error } = await supabase
            .from('government_programs')
            .insert(sampleScholarships)

        if (error) {
            console.error('Error inserting sample data:', error)
        } else {
            console.log('Sample data inserted successfully')
        }
    }
} 