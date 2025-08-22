import OpenAI from 'openai';

interface RawInsight {
  type?: string;
  title?: string;
  message?: string;
  action?: string;
  confidence?: number;
}

const openai = new OpenAI({
  baseURL: 'https://api.novita.ai/openai',
  apiKey: process.env.DEEPSEEK_API_KEY || process.env.OPENAI_API_KEY,
  defaultHeaders: {
    'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    'X-Title': 'ExpenseTracker AI',
  },
});

export interface ExpenseRecord {
  id: string;
  amount: number;
  category: string;
  description: string;
  date: string;
}

export interface AIInsight {
  id: string;
  type: 'warning' | 'info' | 'success' | 'tip';
  title: string;
  message: string;
  action?: string;
  confidence: number;
}

export async function generateExpenseInsights(
  expenses: ExpenseRecord[]
): Promise<AIInsight[]> {
  try {
    console.log('🤖 generateExpenseInsights: Starting AI analysis...');
    console.log(`📊 generateExpenseInsights: Analyzing ${expenses.length} expense records`);
    
    // Prepare expense data for AI analysis
    const expensesSummary = expenses.map((expense) => ({
      amount: expense.amount,
      category: expense.category,
      description: expense.description,
      date: expense.date,
    }));

    const prompt = `Analyze the following expense data and provide 3-4 actionable financial insights. 
    Return a JSON array of insights with this structure:
    {
      "type": "warning|info|success|tip",
      "title": "Brief title",
      "message": "Detailed insight message with specific numbers when possible",
      "action": "Actionable suggestion",
      "confidence": 0.8
    }

    Expense Data:
    ${JSON.stringify(expensesSummary, null, 2)}

    Focus on:
    1. Spending patterns (day of week, categories)
    2. Budget alerts (high spending areas)
    3. Money-saving opportunities
    4. Positive reinforcement for good habits

    Return only valid JSON array, no additional text.`;

    console.log('🤖 generateExpenseInsights: Sending request to AI API...');
    
    const completion = await openai.chat.completions.create({
      model: 'deepseek/deepseek-v3.1',
      messages: [
        {
          role: 'system',
          content:
            'You are a financial advisor AI that analyzes spending patterns and provides actionable insights. Always respond with valid JSON only.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    console.log('✅ generateExpenseInsights: Received response from AI API');

    const response = completion.choices[0].message.content;
    if (!response) {
      console.error('❌ generateExpenseInsights: No response content from AI API');
      throw new Error('No response from AI');
    }

    // Clean the response by removing markdown code blocks if present
    let cleanedResponse = response.trim();
    if (cleanedResponse.startsWith('```json')) {
      cleanedResponse = cleanedResponse
        .replace(/^```json\s*/, '')
        .replace(/\s*```$/, '');
    } else if (cleanedResponse.startsWith('```')) {
      cleanedResponse = cleanedResponse
        .replace(/^```\s*/, '')
        .replace(/\s*```$/, '');
    }

    console.log('🔧 generateExpenseInsights: Parsing AI response...');
    
    try {
      const rawInsights: RawInsight[] = JSON.parse(cleanedResponse);
      
      if (!Array.isArray(rawInsights)) {
        console.error('❌ generateExpenseInsights: AI response is not an array:', rawInsights);
        throw new Error('Invalid response format: expected array');
      }

      console.log(`✅ generateExpenseInsights: Successfully parsed ${rawInsights.length} insights`);

      // Validate and transform insights
      const validatedInsights: AIInsight[] = rawInsights
        .filter((insight) => {
          const isValid = insight.title && insight.message && insight.type;
          if (!isValid) {
            console.warn('⚠️ generateExpenseInsights: Skipping invalid insight:', insight);
          }
          return isValid;
        })
        .map((insight, index) => ({
          id: `ai-insight-${Date.now()}-${index}`,
          type: (insight.type as 'warning' | 'info' | 'success' | 'tip') || 'info',
          title: insight.title || 'Financial Insight',
          message: insight.message || 'No message provided',
          action: insight.action,
          confidence: insight.confidence || 0.8,
        }));

      console.log(`✅ generateExpenseInsights: Generated ${validatedInsights.length} valid insights`);
      return validatedInsights;
    } catch (parseError) {
      console.error('❌ generateExpenseInsights: Failed to parse AI response:', parseError);
      console.error('📄 generateExpenseInsights: Raw response:', cleanedResponse);
      throw new Error('Failed to parse AI response');
    }
  } catch (error) {
    console.error('❌ generateExpenseInsights: Error generating insights:', error);
    
    // Return fallback insights
    return [
      {
        id: 'fallback-1',
        type: 'info',
        title: 'AI Analysis Unavailable',
        message: 'Unable to analyze your expenses at the moment. Please try again later.',
        action: 'Retry analysis',
        confidence: 0.5,
      },
      {
        id: 'fallback-2',
        type: 'tip',
        title: 'Manual Tracking',
        message: 'Continue tracking your expenses manually. We\'ll analyze them when the AI is available.',
        action: 'Keep tracking',
        confidence: 1.0,
      },
    ];
  }
}

export async function categorizeExpense(description: string): Promise<string> {
  try {
    console.log('🏷️ categorizeExpense: Starting expense categorization...');
    console.log(`📝 categorizeExpense: Analyzing description: "${description}"`);

    if (!description || description.trim().length < 2) {
      console.log('⚠️ categorizeExpense: Description too short for analysis');
      return 'Other';
    }

    const prompt = `Categorize this expense description into one of these categories:
    - Food (restaurants, groceries, dining out)
    - Transportation (gas, public transport, rideshare, car maintenance)
    - Shopping (clothing, electronics, general retail)
    - Entertainment (movies, games, hobbies, events)
    - Bills (utilities, rent, subscriptions, insurance)
    - Healthcare (medical, pharmacy, fitness)
    - Other (anything else)

    Description: "${description.trim()}"
    
    Respond with only the category name, nothing else.`;

    console.log('🤖 categorizeExpense: Sending categorization request to AI...');

    const completion = await openai.chat.completions.create({
      model: 'deepseek/deepseek-v3.1',
      messages: [
        {
          role: 'system',
          content: 'You are an expense categorization AI. Respond with only the category name.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.3,
      max_tokens: 50,
    });

    const response = completion.choices[0].message.content;
    if (!response) {
      console.error('❌ categorizeExpense: No response from AI API');
      return 'Other';
    }

    const category = response.trim();
    console.log(`✅ categorizeExpense: AI suggested category: "${category}"`);
    return category;
  } catch (error) {
    console.error('❌ categorizeExpense: Error categorizing expense:', error);
    return 'Other';
  }
}

export async function generateAIAnswer(
  question: string,
  expenses: ExpenseRecord[]
): Promise<string> {
  try {
    console.log('🤖 generateAIAnswer: Starting AI answer generation...');
    console.log(`❓ generateAIAnswer: Question: "${question}"`);
    console.log(`📊 generateAIAnswer: Analyzing ${expenses.length} expense records`);

    if (!question || question.trim().length < 3) {
      console.log('⚠️ generateAIAnswer: Question too short');
      return 'Please provide a more detailed question for better analysis.';
    }

    const expensesSummary = expenses.map((expense) => ({
      amount: expense.amount,
      category: expense.category,
      description: expense.description,
      date: expense.date,
    }));

    const prompt = `Based on the following expense data, answer this question: "${question}"

    Expense Data:
    ${JSON.stringify(expensesSummary, null, 2)}

    Provide a helpful, detailed answer with specific insights from the data.`;

    console.log('🤖 generateAIAnswer: Sending question to AI API...');

    const completion = await openai.chat.completions.create({
      model: 'deepseek/deepseek-v3.1',
      messages: [
        {
          role: 'system',
          content: 'You are a financial advisor AI that helps users understand their spending patterns. Provide detailed, actionable insights.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    const response = completion.choices[0].message.content;
    if (!response) {
      console.error('❌ generateAIAnswer: No response from AI API');
      return 'I was unable to generate an answer at this time. Please try again.';
    }

    console.log('✅ generateAIAnswer: Successfully generated AI answer');
    return response.trim();
  } catch (error) {
    console.error('❌ generateAIAnswer: Error generating AI answer:', error);
    return 'I encountered an error while analyzing your question. Please try again later.';
  }
}