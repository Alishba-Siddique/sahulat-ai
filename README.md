# Sahulat AI - Government Program Discovery Assistant

Sahulat AI is an intelligent assistant that helps users discover government programs in Pakistan, including scholarships, loans, skill training, and employment opportunities. The AI searches both a local database and the internet to provide comprehensive, real-time recommendations.

## 🌟 Features

### 🤖 **AI-Powered Program Matching**
- **Intelligent Recommendations**: Uses advanced AI to match users with relevant government programs
- **Profile-Based Matching**: Considers age, education, location, occupation, and goals
- **Real-Time Web Search**: Searches the internet for latest opportunities beyond the database
- **Multi-Language Support**: Works in both English and Urdu
- **Conversational Interface**: Natural language processing for easy interaction

### 🔍 **Comprehensive Search**
- **Database Programs**: Curated government programs with detailed information
- **Web Search Integration**: Real-time internet search for latest opportunities
- **Multiple Sources**: Combines local database with online results
- **Smart Filtering**: Category-based filtering (scholarships, loans, training, etc.)

### 📊 **Program Categories**
- **Scholarships**: Educational funding and academic opportunities
- **Loans**: Business, personal, and agricultural loan programs
- **Training**: Skill development and vocational training programs
- **Employment**: Government jobs and employment assistance
- **Housing**: Affordable housing schemes and assistance
- **Healthcare**: Medical programs and health insurance schemes

### 🎯 **User Experience**
- **Smart Profile Building**: Automatically extracts user information from conversations
- **Confidence Scoring**: Shows AI confidence in recommendations
- **Direct Links**: One-click access to program applications
- **Progress Tracking**: Saves conversation history and recommendations
- **Mobile Responsive**: Works seamlessly on all devices

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account (free tier)
- OpenRouter API key (free tier)
- Serper API key (optional, for enhanced web search)

### 1. Clone and Install
```bash
git clone https://github.com/yourusername/sahulat-ai.git
cd sahulat-ai
npm install
```

### 2. Environment Setup
Create a `.env.local` file in the root directory:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# OpenRouter AI (Free Tier)
OPENROUTER_API_KEY=your_openrouter_api_key

# Web Search (Optional - Free Tiers Available)
SERPER_API_KEY=your_serper_api_key  # 100 free searches/month
```

### 3. Database Setup
Run the database setup to create tables and sample data:

```bash
npm run dev
# Visit http://localhost:3000/api/setup-db to initialize database
```

### 4. Start Development
```bash
npm run dev
```

Visit `http://localhost:3000` to start using Sahulat AI!

## 🔧 API Setup Guide

### OpenRouter AI (Free)
1. Visit [OpenRouter](https://openrouter.ai/)
2. Sign up for a free account
3. Get your API key from the dashboard
4. Add to `.env.local`: `OPENROUTER_API_KEY=your_key`

### Serper Web Search (Free Tier)
1. Visit [Serper.dev](https://serper.dev/)
2. Sign up for free tier (100 searches/month)
3. Get your API key
4. Add to `.env.local`: `SERPER_API_KEY=your_key`

### Supabase Database (Free)
1. Visit [Supabase](https://supabase.com/)
2. Create a new project
3. Get your project URL and keys
4. Add to `.env.local`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   ```

## 🏗️ Architecture

### Frontend
- **Next.js 15**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Modern styling
- **Shadcn/ui**: Beautiful UI components
- **Lucide Icons**: Consistent iconography

### Backend
- **Next.js API Routes**: Serverless API endpoints
- **Supabase**: PostgreSQL database with real-time features
- **OpenRouter**: AI model integration (free models)
- **Web Search**: Internet search for real-time opportunities

### AI Integration
- **Multiple Models**: Uses different AI models for different tasks
- **Fallback System**: Automatic fallback if primary model fails
- **Web Search**: Combines database results with internet search
- **Profile Enhancement**: AI-powered user profile building

### Database Schema
```sql
-- Government programs table
CREATE TABLE government_programs (
  id UUID PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  eligibility_criteria TEXT,
  benefits TEXT,
  requirements TEXT,
  funding_amount TEXT,
  application_deadline DATE,
  application_link TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- User profiles table
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY,
  age INTEGER,
  gender TEXT,
  education TEXT,
  location TEXT,
  goals TEXT,
  income TEXT,
  occupation TEXT,
  family_size INTEGER,
  disabilities TEXT,
  languages TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Chat messages table
CREATE TABLE chat_messages (
  id UUID PRIMARY KEY,
  user_id TEXT,
  message TEXT NOT NULL,
  response TEXT NOT NULL,
  recommended_programs TEXT[],
  web_results TEXT[],
  confidence DECIMAL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## 🎯 Usage Examples

### Finding Scholarships
```
User: "I'm a 22-year-old student looking for scholarships for computer science"
AI: Recommends relevant scholarships with eligibility, benefits, and application steps
```

### Business Loans
```
User: "I need a loan to start a small business in Lahore"
AI: Finds government loan programs with requirements and application process
```

### Skill Training
```
User: "I want to learn digital marketing skills"
AI: Suggests government training programs and online opportunities
```

## 🚀 Deployment

### Vercel (Recommended)
1. Push code to GitHub
2. Connect repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically

### Environment Variables for Production
```env
NEXT_PUBLIC_SUPABASE_URL=your_production_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_production_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_production_service_role_key
OPENROUTER_API_KEY=your_openrouter_api_key
SERPER_API_KEY=your_serper_api_key
```

## 🔒 Security & Privacy

- **No Data Storage**: User conversations are not permanently stored
- **Anonymous Users**: No personal information required
- **Secure APIs**: All API keys are server-side only
- **HTTPS Only**: All communications are encrypted

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **OpenRouter**: Free AI model access
- **Supabase**: Database and backend services
- **Serper**: Web search capabilities
- **Next.js**: React framework
- **Shadcn/ui**: UI components

## 📞 Support

For support, email support@sahulat-ai.com or create an issue on GitHub.

---

**Sahulat AI** - Making government programs accessible to everyone in Pakistan 🇵🇰
