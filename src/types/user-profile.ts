export interface UserProfile {
    id: string
    age?: number
    gender?: 'male' | 'female' | 'other'
    education?: EducationLevel
    location?: {
        city?: string
        province?: string
        country: string
    }
    goals?: string[]
    income?: IncomeLevel
    occupation?: string
    familySize?: number
    disabilities?: string[]
    languages?: string[]
    createdAt: Date
    updatedAt: Date
}

export type EducationLevel =
    | 'none'
    | 'primary'
    | 'secondary'
    | 'high_school'
    | 'bachelor'
    | 'master'
    | 'phd'
    | 'vocational'
    | 'technical'

export type IncomeLevel =
    | 'low'
    | 'medium'
    | 'high'
    | 'very_high'

export interface ParsedUserData {
    age?: number
    gender?: 'male' | 'female' | 'other'
    education?: EducationLevel
    location?: {
        city?: string
        province?: string
        country: string
    }
    goals?: string[]
    income?: IncomeLevel
    occupation?: string
    familySize?: number
    disabilities?: string[]
    languages?: string[]
    confidence: number // 0-1, how confident we are in the parsed data
}

export interface ParsingResult {
    success: boolean
    data: ParsedUserData
    errors: string[]
    suggestions: string[]
} 