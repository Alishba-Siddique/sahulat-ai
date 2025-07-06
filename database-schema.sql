-- Create government_programs table
CREATE TABLE government_programs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    title_urdu TEXT,
    description TEXT NOT NULL,
    description_urdu TEXT,
    category TEXT NOT NULL CHECK (category IN (
        'scholarship', 'grant', 'loan', 'skill_training', 'employment', 
        'business', 'housing', 'health', 'disability', 'women_empowerment', 
        'youth', 'agriculture', 'technology'
    )),
    eligibility_criteria JSONB,
    benefits TEXT[],
    benefits_urdu TEXT[],
    application_deadline DATE,
    application_url TEXT,
    contact_info JSONB,
    requirements TEXT[],
    requirements_urdu TEXT[],
    funding_amount JSONB,
    duration TEXT,
    location TEXT[],
    age_range JSONB,
    education_level TEXT[],
    income_level TEXT[],
    gender TEXT CHECK (gender IN ('male', 'female', 'all')),
    disability_friendly BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true
);

-- Create indexes for better performance
CREATE INDEX idx_programs_category ON government_programs(category);
CREATE INDEX idx_programs_active ON government_programs(is_active);
CREATE INDEX idx_programs_created_at ON government_programs(created_at DESC);
CREATE INDEX idx_programs_gender ON government_programs(gender);
CREATE INDEX idx_programs_disability_friendly ON government_programs(disability_friendly);

-- Create GIN indexes for array and JSONB columns
CREATE INDEX idx_programs_education_level ON government_programs USING GIN(education_level);
CREATE INDEX idx_programs_income_level ON government_programs USING GIN(income_level);
CREATE INDEX idx_programs_location ON government_programs USING GIN(location);
CREATE INDEX idx_programs_eligibility_criteria ON government_programs USING GIN(eligibility_criteria);

-- Enable Row Level Security (RLS)
ALTER TABLE government_programs ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access to active programs
CREATE POLICY "Allow public read access to active programs" ON government_programs
    FOR SELECT USING (is_active = true);

-- Create policy to allow authenticated users to insert (for admin purposes)
CREATE POLICY "Allow authenticated users to insert programs" ON government_programs
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Create policy to allow authenticated users to update
CREATE POLICY "Allow authenticated users to update programs" ON government_programs
    FOR UPDATE USING (auth.role() = 'authenticated');

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_government_programs_updated_at 
    BEFORE UPDATE ON government_programs 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create a view for easier querying
CREATE VIEW active_programs AS
SELECT 
    id,
    title,
    title_urdu,
    description,
    description_urdu,
    category,
    eligibility_criteria,
    benefits,
    benefits_urdu,
    application_deadline,
    application_url,
    contact_info,
    requirements,
    requirements_urdu,
    funding_amount,
    duration,
    location,
    age_range,
    education_level,
    income_level,
    gender,
    disability_friendly,
    created_at,
    updated_at
FROM government_programs
WHERE is_active = true; 