export interface GovernmentProgram {
    id: string
    title: string
    title_urdu?: string
    description: string
    description_urdu?: string
    category: ProgramCategory
    eligibility_criteria: EligibilityCriteria
    benefits: string[]
    benefits_urdu?: string[]
    application_deadline?: string
    application_url?: string
    contact_info?: ContactInfo
    requirements: string[]
    requirements_urdu?: string[]
    funding_amount?: {
        min: number
        max: number
        currency: string
    }
    duration?: string
    location: string[]
    age_range?: {
        min: number
        max: number
    }
    education_level?: string[]
    income_level?: string[]
    gender?: 'male' | 'female' | 'all'
    disability_friendly?: boolean
    created_at: string
    updated_at: string
    is_active: boolean
}

export type ProgramCategory =
    | 'scholarship'
    | 'grant'
    | 'loan'
    | 'skill_training'
    | 'employment'
    | 'business'
    | 'housing'
    | 'health'
    | 'disability'
    | 'women_empowerment'
    | 'youth'
    | 'agriculture'
    | 'technology'

export interface EligibilityCriteria {
    age_min?: number
    age_max?: number
    education_level?: string[]
    income_level?: string[]
    location?: string[]
    gender?: 'male' | 'female' | 'all'
    disability_friendly?: boolean
    family_size_max?: number
    occupation?: string[]
    languages?: string[]
}

export interface ContactInfo {
    phone?: string
    email?: string
    website?: string
    address?: string
    office_hours?: string
}

export interface ProgramSearchFilters {
    category?: ProgramCategory[]
    age?: number
    education?: string[]
    location?: string[]
    income_level?: string[]
    gender?: 'male' | 'female' | 'all'
    disability_friendly?: boolean
    keywords?: string[]
}

export interface ProgramSearchResult {
    programs: GovernmentProgram[]
    total_count: number
    filters_applied: ProgramSearchFilters
} 