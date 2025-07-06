# Sahulat AI - Government Program Discovery Assistant

Sahulat AI is an intelligent assistant that helps users discover government programs, scholarships, loans, skill training, and employment opportunities in Pakistan. Built with Next.js, TypeScript, and powered by free AI models from OpenRouter.

## 🌟 Features

### 🤖 Intelligent AI Assistant
- **Multilingual Support**: English and Urdu language support
- **Smart Program Matching**: AI-powered recommendations based on user profiles
- **Free AI Models**: Uses 100% free models from OpenRouter (zero cost)
- **Contextual Responses**: Understands user intent and provides relevant suggestions

### 🎯 Program Categories
- **🎓 Scholarships & Education**: Student scholarships, merit-based aid, international opportunities
- **💰 Business & Financial**: Small business loans, entrepreneurship programs, agricultural support
- **🔧 Skill Development**: Technical training, IT programs, vocational courses
- **💼 Employment & Jobs**: Job placement, internships, public sector opportunities
- **🏠 Housing & Infrastructure**: Affordable housing, home improvement grants
- **🏥 Healthcare & Medical**: Health insurance, medical support, disability assistance

### 💬 Interactive Chat Interface
- **Quick Filter Buttons**: One-click access to specific program categories
- **Voice Input**: Speech recognition for hands-free interaction
- **Real-time Responses**: Instant AI-powered recommendations
- **User Profile Tracking**: Remembers user information for personalized suggestions

### 🔧 Technical Features
- **TypeScript**: Full type safety and better development experience
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Database Integration**: PostgreSQL with Supabase for program storage
- **Error Handling**: Graceful fallbacks when AI service is unavailable

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account (free tier)
- OpenRouter account (free tier)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd sahulat-ai
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file:
   ```bash
   # Supabase Configuration
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

   # OpenRouter Configuration (Free AI Models)
   OPENROUTER_API_KEY=your_openrouter_api_key
   ```

4. **Set up the database**
   - Follow the [Supabase Setup Guide](SUPABASE_SETUP.md)
   - Run the database schema setup
   - Insert sample government programs

5. **Start the development server**
```bash
npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🛠️ Setup Guides

### Supabase Database Setup
See [SUPABASE_SETUP.md](SUPABASE_SETUP.md) for detailed instructions on:
- Creating a Supabase project
- Setting up the database schema
- Inserting sample government programs
- Configuring authentication

### OpenRouter AI Setup
See [OPENROUTER_SETUP.md](OPENROUTER_SETUP.md) for:
- Getting free API access
- Configuring AI models
- Understanding the free tier benefits
- Troubleshooting AI integration

## 💡 Usage

### Getting Started
1. **Open the chat interface** at [http://localhost:3000](http://localhost:3000)
2. **Choose your language** (English or Urdu)
3. **Use quick filters** or type your request
4. **Get personalized recommendations** based on your profile

### Quick Filter Buttons
Click any category button to get instant recommendations:
- **Scholarships**: Educational opportunities and financial support
- **Loans**: Business loans and financial assistance
- **Training**: Skill development and vocational courses
- **Jobs**: Employment opportunities and job placement
- **Housing**: Housing assistance and affordable housing
- **Healthcare**: Healthcare support and medical assistance

### Voice Input
- Click the microphone button
- Speak your request in English or Urdu
- The system will transcribe and process your request

### Profile Building
The system automatically extracts and remembers:
- Age and gender
- Education level
- Location
- Goals and interests
- Income level
- Occupation
- Family size
- Disabilities
- Languages spoken

## 🏗️ Architecture

### Frontend
- **Next.js 15**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first styling
- **Lucide Icons**: Beautiful icon library
- **shadcn/ui**: Modern component library

### Backend
- **Next.js API Routes**: Serverless API endpoints
- **Supabase**: PostgreSQL database and authentication
- **OpenRouter**: Free AI model integration
- **User Input Parser**: Intelligent profile extraction

### AI Integration
- **Free Models**: 100% free AI models from OpenRouter
- **Smart Fallbacks**: Works even when AI is unavailable
- **Multilingual**: Supports English and Urdu
- **Context Awareness**: Understands user intent and profile

## 📊 Database Schema

The system includes comprehensive government program data:
- Program titles and descriptions (bilingual)
- Eligibility criteria
- Benefits and requirements
- Funding amounts and deadlines
- Application information
- Categories and tags

## 🔒 Privacy & Security

- **No data storage**: User profiles are session-based
- **Secure API calls**: All external calls use HTTPS
- **Environment variables**: Sensitive data is properly secured
- **Free tier usage**: No cost for AI model usage

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically

### Other Platforms
The app can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🆘 Support

If you encounter any issues:
1. Check the setup guides for your specific service
2. Review the console for error messages
3. Ensure all environment variables are set correctly
4. Verify database connectivity and AI service status

## 🎯 Roadmap

- [ ] Add more government programs
- [ ] Implement program application tracking
- [ ] Add notification system for deadlines
- [ ] Create admin dashboard for program management
- [ ] Add program rating and review system
- [ ] Implement advanced search and filtering
- [ ] Add program comparison features
- [ ] Create mobile app version

---

**Sahulat AI** - Making government programs accessible to everyone in Pakistan 🇵🇰
