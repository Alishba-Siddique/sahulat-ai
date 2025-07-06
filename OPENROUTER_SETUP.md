# OpenRouter Setup Guide for Sahulat AI

## Overview
Sahulat AI uses OpenRouter to access multiple AI models for intelligent program matching, user profile enhancement, and conversational responses. We've configured the system to use **entirely free models** to keep costs at zero.

## Free Models Configuration

### Selected Free Models
Based on the [OpenRouter free models](https://openrouter.ai/models?max_price=0), we've selected the following optimal models:

1. **`meta-llama/llama-3.1-8b-instruct`** (CHAT)
   - **Use Case**: General conversation and program matching
   - **Strengths**: Good reasoning, multilingual support, balanced performance
   - **Cost**: FREE

2. **`microsoft/phi-3-mini-4k-instruct`** (FAST)
   - **Use Case**: Quick responses and profile enhancement
   - **Strengths**: Very fast, good for structured tasks, efficient
   - **Cost**: FREE

3. **`google/gemini-flash-1.5`** (CREATIVE)
   - **Use Case**: Creative responses and detailed explanations
   - **Strengths**: Good for creative tasks, detailed responses
   - **Cost**: FREE

4. **`anthropic/claude-3-haiku`** (SMART)
   - **Use Case**: Complex reasoning and analysis
   - **Strengths**: Very capable, good reasoning, reliable
   - **Cost**: FREE

5. **`microsoft/phi-3-mini-4k-instruct`** (PROGRAMMING)
   - **Use Case**: Structured tasks and JSON responses
   - **Strengths**: Good for programming-like tasks, JSON formatting
   - **Cost**: FREE

## Setup Instructions

### 1. Get OpenRouter API Key
1. Visit [OpenRouter](https://openrouter.ai/)
2. Sign up for a free account
3. Go to your [API Keys page](https://openrouter.ai/keys)
4. Create a new API key
5. Copy the API key

### 2. Configure Environment Variables
Create or update your `.env.local` file:

```bash
# OpenRouter Configuration
OPENROUTER_API_KEY=your_openrouter_api_key_here

# Supabase Configuration (if not already set)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

### 3. Install Dependencies
The required package is already installed:
```bash
npm install @openrouter/ai-sdk-provider
```

### 4. Verify Installation
Check that the package is installed:
```bash
npm list @openrouter/ai-sdk-provider
```

## Model Usage in Sahulat AI

### Automatic Model Selection
The system automatically selects the best model for each task:

- **Program Matching**: Uses `CHAT` model for comprehensive analysis
- **Quick Responses**: Uses `FAST` model for immediate replies
- **Profile Enhancement**: Uses `FAST` model for structured extraction
- **Creative Responses**: Uses `CREATIVE` model for detailed explanations

### Model Performance
All selected models are:
- ✅ **Completely FREE** (no cost per request)
- ✅ **Multilingual** (support English and Urdu)
- ✅ **Reliable** (good uptime and performance)
- ✅ **Fast** (quick response times)

## Testing the Setup

### 1. Test API Connection
You can test the OpenRouter connection by sending a message in the chat interface. The system will:
- Parse your message
- Extract profile information
- Generate AI recommendations
- Display relevant government programs

### 2. Expected Behavior
- **First message**: System will ask for basic profile information
- **Follow-up messages**: System will recommend programs and ask for missing details
- **Language support**: Responds in the same language as your message (English/Urdu)

### 3. Error Handling
If there are issues:
- Check your API key is correct
- Verify environment variables are loaded
- Check the browser console for error messages
- Ensure you have an active internet connection

## Cost Management

### Free Tier Benefits
- **No monthly fees**
- **No per-request charges**
- **Unlimited requests** (within reasonable usage)
- **All selected models are 100% free**

### Usage Monitoring
You can monitor your usage at:
- [OpenRouter Dashboard](https://openrouter.ai/account)
- Check request counts and any potential charges
- All our selected models should show $0.00 cost

## Troubleshooting

### Common Issues

1. **"AI service is not configured"**
   - Check your `OPENROUTER_API_KEY` environment variable
   - Restart your development server after adding the key

2. **"Failed to initialize OpenRouter client"**
   - Verify the API key is valid
   - Check your internet connection
   - Ensure the package is properly installed

3. **Slow responses**
   - This is normal for free models
   - Consider using the `FAST` model for quicker responses

4. **JSON parsing errors**
   - Some models may not always return perfect JSON
   - The system includes fallback error handling

### Support
If you encounter issues:
1. Check the browser console for detailed error messages
2. Verify your environment variables
3. Test with a simple message first
4. Contact support if issues persist

## Model Comparison

| Model | Speed | Quality | Best For | Cost |
|-------|-------|---------|----------|------|
| Llama 3.1 8B | Medium | High | General chat | FREE |
| Phi-3 Mini | Fast | Medium | Quick tasks | FREE |
| Gemini Flash | Medium | High | Creative tasks | FREE |
| Claude Haiku | Medium | Very High | Complex reasoning | FREE |

All models are optimized for the Sahulat AI use case and provide excellent value at zero cost. 