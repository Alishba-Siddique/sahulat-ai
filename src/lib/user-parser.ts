import { ParsedUserData, ParsingResult, EducationLevel, IncomeLevel } from '@/types/user-profile'

export class UserInputParser {
    private static agePatterns = {
        en: [
            /(\d{1,2})\s*(?:years?\s*old|y\.?o\.?)/i,
            /age\s*(?:is\s*)?(\d{1,2})/i,
            /(\d{1,2})\s*(?:years?)/i
        ],
        ur: [
            /(\d{1,2})\s*(?:سال|سالہ|سالہ\s*ہوں|سالہ\s*ہیں)/i,
            /عمر\s*(?:ہے\s*)?(\d{1,2})/i,
            /(\d{1,2})\s*(?:سالہ)/i
        ]
    }

    private static genderPatterns = {
        en: {
            male: [/male/i, /man/i, /boy/i, /he/i, /his/i],
            female: [/female/i, /woman/i, /girl/i, /she/i, /her/i],
            other: [/other/i, /non-binary/i, /transgender/i]
        },
        ur: {
            male: [/مرد/i, /لڑکا/i, /وہ/i, /اس\s*کا/i],
            female: [/عورت/i, /لڑکی/i, /وہ/i, /اس\s*کی/i],
            other: [/دیگر/i, /غیر\s*ثنائی/i]
        }
    }

    private static educationPatterns = {
        en: {
            none: [/no\s*education/i, /illiterate/i, /never\s*went\s*to\s*school/i],
            primary: [/primary/i, /elementary/i, /grade\s*[1-5]/i],
            secondary: [/secondary/i, /middle\s*school/i, /grade\s*[6-8]/i],
            high_school: [/high\s*school/i, /matric/i, /grade\s*(?:9|10|11|12)/i],
            bachelor: [/bachelor/i, /b\.?s\.?/i, /b\.?a\.?/i, /undergraduate/i],
            master: [/master/i, /m\.?s\.?/i, /m\.?a\.?/i, /graduate/i],
            phd: [/ph\.?d/i, /doctorate/i, /doctor/i],
            vocational: [/vocational/i, /diploma/i, /certificate/i],
            technical: [/technical/i, /polytechnic/i, /engineering/i]
        },
        ur: {
            none: [/کوئی\s*تعلیم\s*نہیں/i, /ان پڑھ/i],
            primary: [/پرائمری/i, /ابتدائی/i, /کلاس\s*[1-5]/i],
            secondary: [/ثانوی/i, /مڈل/i, /کلاس\s*[6-8]/i],
            high_school: [/ہائی\s*اسکول/i, /میٹرک/i, /کلاس\s*(?:9|10|11|12)/i],
            bachelor: [/بیچلر/i, /گریجویٹ/i, /انڈرگریجویٹ/i],
            master: [/ماسٹر/i, /پوسٹ\s*گریجویٹ/i],
            phd: [/پی\s*ایچ\s*ڈی/i, /ڈاکٹریٹ/i],
            vocational: [/ووکیشنل/i, /ڈپلومہ/i, /سرٹیفکیٹ/i],
            technical: [/ٹیکنیکل/i, /انجینئرنگ/i]
        }
    }

    private static locationPatterns = {
        en: [
            /(?:from|in|live\s*in|located\s*in)\s*([A-Za-z\s]+(?:city|province|state|country)?)/i,
            /([A-Za-z\s]+(?:city|province|state|country))/i
        ],
        ur: [
            /(?:سے|میں|رہتا\s*ہوں|رہتی\s*ہوں)\s*([\u0600-\u06FF\s]+)/i,
            /([\u0600-\u06FF\s]+(?:شہر|صوبہ|ملک))/i
        ]
    }

    private static goalPatterns = {
        en: [
            /scholarship/i, /grant/i, /loan/i, /education/i, /study/i, /university/i,
            /skill/i, /training/i, /job/i, /employment/i, /business/i, /startup/i,
            /housing/i, /home/i, /medical/i, /health/i, /disability/i
        ],
        ur: [
            /وظیفہ/i, /گرانٹ/i, /قرضہ/i, /تعلیم/i, /پڑھائی/i, /یونیورسٹی/i,
            /ہنر/i, /تربیت/i, /ملازمت/i, /کاروبار/i, /گھر/i, /صحت/i, /معذوری/i
        ]
    }

    static parseUserInput(text: string, language: 'en' | 'ur' = 'en'): ParsingResult {
        const result: ParsingResult = {
            success: false,
            data: { confidence: 0 },
            errors: [],
            suggestions: []
        }

        try {
            const parsedData = this.extractData(text, language)
            const confidence = this.calculateConfidence(parsedData, text)

            result.data = { ...parsedData, confidence }
            result.success = confidence > 0.3 // Minimum confidence threshold

            // Generate suggestions for missing data
            result.suggestions = this.generateSuggestions(parsedData, language)

            // Validate extracted data
            result.errors = this.validateData(parsedData)

        } catch (error) {
            result.errors.push(`Parsing error: ${error instanceof Error ? error.message : 'Unknown error'}`)
        }

        return result
    }

    private static extractData(text: string, language: 'en' | 'ur'): ParsedUserData {
        const data: ParsedUserData = { confidence: 0 }

        // Extract age
        data.age = this.extractAge(text, language)

        // Extract gender
        data.gender = this.extractGender(text, language)

        // Extract education
        data.education = this.extractEducation(text, language)

        // Extract location
        data.location = this.extractLocation(text, language)

        // Extract goals
        data.goals = this.extractGoals(text, language)

        // Extract income level
        data.income = this.extractIncome(text, language)

        // Extract occupation
        data.occupation = this.extractOccupation(text, language)

        // Extract family size
        data.familySize = this.extractFamilySize(text, language)

        // Extract disabilities
        data.disabilities = this.extractDisabilities(text, language)

        // Extract languages
        data.languages = this.extractLanguages(text, language)

        return data
    }

    private static extractAge(text: string, language: 'en' | 'ur'): number | undefined {
        const patterns = this.agePatterns[language]

        for (const pattern of patterns) {
            const match = text.match(pattern)
            if (match) {
                const age = parseInt(match[1])
                if (age >= 1 && age <= 120) {
                    return age
                }
            }
        }
        return undefined
    }

    private static extractGender(text: string, language: 'en' | 'ur'): 'male' | 'female' | 'other' | undefined {
        const patterns = this.genderPatterns[language]

        for (const [gender, genderPatterns] of Object.entries(patterns)) {
            for (const pattern of genderPatterns) {
                if (pattern.test(text)) {
                    return gender as 'male' | 'female' | 'other'
                }
            }
        }
        return undefined
    }

    private static extractEducation(text: string, language: 'en' | 'ur'): EducationLevel | undefined {
        const patterns = this.educationPatterns[language]

        for (const [level, levelPatterns] of Object.entries(patterns)) {
            for (const pattern of levelPatterns) {
                if (pattern.test(text)) {
                    return level as EducationLevel
                }
            }
        }
        return undefined
    }

    private static extractLocation(text: string, language: 'en' | 'ur'): { city?: string; province?: string; country: string } | undefined {
        const patterns = this.locationPatterns[language]

        for (const pattern of patterns) {
            const match = text.match(pattern)
            if (match) {
                const location = match[1].trim()
                if (location.length > 2) {
                    // Simple parsing - in a real app, you'd use a location API
                    return {
                        city: location,
                        country: 'Pakistan' // Default for this app
                    }
                }
            }
        }
        return undefined
    }

    private static extractGoals(text: string, language: 'en' | 'ur'): string[] {
        const patterns = this.goalPatterns[language]
        const goals: string[] = []

        for (const pattern of patterns) {
            if (pattern.test(text)) {
                const goal = pattern.source.replace(/[\/i]/g, '').replace(/\\s\*/g, ' ')
                if (!goals.includes(goal)) {
                    goals.push(goal)
                }
            }
        }

        return goals
    }

    private static extractIncome(text: string, language: 'en' | 'ur'): IncomeLevel | undefined {
        const incomePatterns = {
            en: {
                low: [/low\s*income/i, /poor/i, /struggling/i, /minimum\s*wage/i],
                medium: [/medium\s*income/i, /average/i, /middle\s*class/i],
                high: [/high\s*income/i, /well\s*off/i, /affluent/i],
                very_high: [/very\s*high\s*income/i, /rich/i, /wealthy/i]
            },
            ur: {
                low: [/کم\s*آمدنی/i, /غریب/i, /مفلس/i],
                medium: [/درمیانی\s*آمدنی/i, /اوسط/i],
                high: [/زیادہ\s*آمدنی/i, /امیر/i],
                very_high: [/بہت\s*زیادہ\s*آمدنی/i, /مالدار/i]
            }
        }

        const patterns = incomePatterns[language]

        for (const [level, levelPatterns] of Object.entries(patterns)) {
            for (const pattern of levelPatterns) {
                if (pattern.test(text)) {
                    return level as IncomeLevel
                }
            }
        }
        return undefined
    }

    private static extractOccupation(text: string, language: 'en' | 'ur'): string | undefined {
        const occupationPatterns = {
            en: [
                /(?:work\s*as|job\s*is|occupation\s*is)\s*([A-Za-z\s]+)/i,
                /(?:am\s*a|is\s*a)\s*([A-Za-z\s]+)/i
            ],
            ur: [
                /(?:کام\s*کرتا\s*ہوں|کام\s*کرتی\s*ہوں|ملازمت\s*ہے)\s*([\u0600-\u06FF\s]+)/i,
                /(?:ہوں|ہیں)\s*([\u0600-\u06FF\s]+)/i
            ]
        }

        const patterns = occupationPatterns[language]

        for (const pattern of patterns) {
            const match = text.match(pattern)
            if (match) {
                const occupation = match[1].trim()
                if (occupation.length > 2) {
                    return occupation
                }
            }
        }
        return undefined
    }

    private static extractFamilySize(text: string, language: 'en' | 'ur'): number | undefined {
        const familyPatterns = {
            en: [
                /(\d+)\s*(?:family\s*members?|people\s*in\s*family|children)/i,
                /family\s*of\s*(\d+)/i
            ],
            ur: [
                /(\d+)\s*(?:خاندان|افراد|بچے)/i,
                /خاندان\s*میں\s*(\d+)/i
            ]
        }

        const patterns = familyPatterns[language]

        for (const pattern of patterns) {
            const match = text.match(pattern)
            if (match) {
                const size = parseInt(match[1])
                if (size >= 1 && size <= 20) {
                    return size
                }
            }
        }
        return undefined
    }

    private static extractDisabilities(text: string, language: 'en' | 'ur'): string[] {
        const disabilityPatterns = {
            en: [/disability/i, /disabled/i, /wheelchair/i, /blind/i, /deaf/i, /mobility/i],
            ur: [/معذوری/i, /معذور/i, /اندھا/i, /بہرا/i, /چلنے\s*میں\s*مشکل/i]
        }

        const patterns = disabilityPatterns[language]
        const disabilities: string[] = []

        for (const pattern of patterns) {
            if (pattern.test(text)) {
                disabilities.push('disability')
                break
            }
        }

        return disabilities
    }

    private static extractLanguages(text: string, language: 'en' | 'ur'): string[] {
        const languages: string[] = []

        // Detect language from input
        if (language === 'ur') {
            languages.push('urdu')
        }
        if (language === 'en' || /[a-zA-Z]/.test(text)) {
            languages.push('english')
        }

        return languages
    }

    private static calculateConfidence(data: ParsedUserData, text: string): number {
        let confidence = 0
        let totalFields = 0

        // Check each field and add confidence
        if (data.age) { confidence += 0.15; totalFields++ }
        if (data.gender) { confidence += 0.1; totalFields++ }
        if (data.education) { confidence += 0.15; totalFields++ }
        if (data.location) { confidence += 0.15; totalFields++ }
        if (data.goals && data.goals.length > 0) { confidence += 0.2; totalFields++ }
        if (data.income) { confidence += 0.1; totalFields++ }
        if (data.occupation) { confidence += 0.1; totalFields++ }
        if (data.familySize) { confidence += 0.05; totalFields++ }

        // Bonus for having multiple fields
        if (totalFields >= 3) confidence += 0.1
        if (totalFields >= 5) confidence += 0.1

        return Math.min(confidence, 1)
    }

    private static generateSuggestions(data: ParsedUserData, language: 'en' | 'ur'): string[] {
        const suggestions: string[] = []

        if (!data.age) {
            suggestions.push(language === 'en' ? 'Please provide your age' : 'براہ کرم اپنی عمر بتائیں')
        }
        if (!data.education) {
            suggestions.push(language === 'en' ? 'Please mention your education level' : 'براہ کرم اپنی تعلیمی سطح بتائیں')
        }
        if (!data.location) {
            suggestions.push(language === 'en' ? 'Please provide your location' : 'براہ کرم اپنا مقام بتائیں')
        }
        if (!data.goals || data.goals.length === 0) {
            suggestions.push(language === 'en' ? 'Please mention your goals (scholarship, job, etc.)' : 'براہ کرم اپنے اہداف بتائیں (وظیفہ، ملازمت، وغیرہ)')
        }

        return suggestions
    }

    private static validateData(data: ParsedUserData): string[] {
        const errors: string[] = []

        if (data.age && (data.age < 1 || data.age > 120)) {
            errors.push('Invalid age detected')
        }

        if (data.familySize && (data.familySize < 1 || data.familySize > 20)) {
            errors.push('Invalid family size detected')
        }

        return errors
    }
} 