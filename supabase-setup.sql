-- Create the government_programs table
CREATE TABLE IF NOT EXISTS government_programs (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    title_urdu TEXT,
    description TEXT NOT NULL,
    description_urdu TEXT,
    category TEXT NOT NULL,
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
    gender TEXT DEFAULT 'all',
    disability_friendly BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_government_programs_category ON government_programs(category);
CREATE INDEX IF NOT EXISTS idx_government_programs_location ON government_programs USING GIN(location);
CREATE INDEX IF NOT EXISTS idx_government_programs_education_level ON government_programs USING GIN(education_level);
CREATE INDEX IF NOT EXISTS idx_government_programs_income_level ON government_programs USING GIN(income_level);
CREATE INDEX IF NOT EXISTS idx_government_programs_gender ON government_programs(gender);
CREATE INDEX IF NOT EXISTS idx_government_programs_disability_friendly ON government_programs(disability_friendly);
CREATE INDEX IF NOT EXISTS idx_government_programs_is_active ON government_programs(is_active);
CREATE INDEX IF NOT EXISTS idx_government_programs_application_deadline ON government_programs(application_deadline);

-- Enable Row Level Security (RLS)
ALTER TABLE government_programs ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all authenticated and anonymous users to read
CREATE POLICY "Allow public read access" ON government_programs
    FOR SELECT USING (true);

-- Create policy to allow authenticated users to insert (for admin purposes)
CREATE POLICY "Allow authenticated insert" ON government_programs
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Create policy to allow authenticated users to update (for admin purposes)
CREATE POLICY "Allow authenticated update" ON government_programs
    FOR UPDATE USING (auth.role() = 'authenticated');

-- Create policy to allow authenticated users to delete (for admin purposes)
CREATE POLICY "Allow authenticated delete" ON government_programs
    FOR DELETE USING (auth.role() = 'authenticated');

-- Create a function to update the updated_at timestamp
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
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data (first 10 programs)
INSERT INTO government_programs (
    id, title, title_urdu, description, description_urdu, category, 
    eligibility_criteria, benefits, benefits_urdu, application_deadline, 
    application_url, contact_info, requirements, requirements_urdu, 
    funding_amount, duration, location, age_range, education_level, 
    income_level, gender, disability_friendly, created_at, updated_at, is_active
) VALUES 
(
    'sch-1',
    'HEC Need-Based Scholarship Program',
    'ایچ ای سی ضرورت پر مبنی وظیفہ پروگرام',
    'Scholarships for deserving students from low-income families to pursue higher education.',
    'کم آمدنی والے خاندانوں کے مستحق طلباء کے لیے اعلیٰ تعلیم کے لیے وظائف۔',
    'scholarship',
    '{"age_min": 17, "age_max": 25, "education_level": ["high_school"], "income_level": ["low"]}',
    ARRAY['Full tuition fee coverage', 'Monthly stipend', 'Book allowance', 'Hostel accommodation'],
    ARRAY['مکمل فیس کی ادائیگی', 'ماہانہ وظیفہ', 'کتابوں کا الاؤنس', 'ہاسٹل کی سہولت'],
    '2024-08-15',
    'https://hec.gov.pk',
    '{"website": "https://hec.gov.pk"}',
    ARRAY['Matriculation certificate', 'Income certificate', 'Domicile certificate', 'Character certificate'],
    ARRAY['میٹرک کا سرٹیفکیٹ', 'آمدنی کا سرٹیفکیٹ', 'ڈومیسائل سرٹیفکیٹ', 'کردار کا سرٹیفکیٹ'],
    '{"min": 50000, "max": 200000, "currency": "PKR"}',
    '4 years',
    ARRAY['Pakistan'],
    '{"min": 17, "max": 25}',
    ARRAY['high_school'],
    ARRAY['low'],
    'all',
    true,
    NOW(),
    NOW(),
    true
),
(
    'sch-2',
    'Prime Minister''s Youth Business Loan Scheme',
    'وزیر اعظم یوتھ بزنس لون اسکیم',
    'Interest-free loans for young entrepreneurs to start their own businesses.',
    'نوجوان کاروباریوں کے لیے سود سے پاک قرضے اپنا کاروبار شروع کرنے کے لیے۔',
    'loan',
    '{"age_min": 21, "age_max": 45, "education_level": ["high_school", "bachelor", "master"], "income_level": ["low", "medium"]}',
    ARRAY['Interest-free loan up to Rs. 2 million', 'Business training and mentorship', 'Technical support and guidance'],
    ARRAY['2 لاکھ روپے تک سود سے پاک قرضہ', 'کاروباری تربیت اور رہنمائی', 'تکنیکی مدد اور رہنمائی'],
    '2024-12-31',
    'https://pmyp.gov.pk',
    '{"website": "https://pmyp.gov.pk"}',
    ARRAY['Valid CNIC', 'Business plan', 'Educational certificates', 'Income certificate'],
    ARRAY['درست شناختی کارڈ', 'کاروباری منصوبہ', 'تعلیمی سرٹیفکیٹ', 'آمدنی کا سرٹیفکیٹ'],
    '{"min": 100000, "max": 2000000, "currency": "PKR"}',
    '5 years',
    ARRAY['Pakistan'],
    '{"min": 21, "max": 45}',
    ARRAY['high_school', 'bachelor', 'master'],
    ARRAY['low', 'medium'],
    'all',
    true,
    NOW(),
    NOW(),
    true
);

-- You can continue adding more programs here or use the API to insert them 