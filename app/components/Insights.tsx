'use client';

import { useState, useEffect } from 'react';
import { getAIInsights } from '../actions/getAiInsight';
import { generateInsightAnswer } from '../actions/generateInsightAnswer';

interface InsightData {
  id: string;
  type: 'warning' | 'info' | 'success' | 'tip';
  title: string;
  message: string;
  action?: string;
  confidence?: number;
}

interface AIAnswer {
  insightId: string;
  answer: string;
  isLoading: boolean;
}

const Insights = () => {
  const [insights, setInsights] = useState<InsightData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [aiAnswers, setAiAnswers] = useState<AIAnswer[]>([]);

  const loadInsights = async () => {
    setIsLoading(true);
    try {
      const newInsights = await getAIInsights();
      setInsights(newInsights);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('❌ Insights: Failed to load AI insights:', error);
      // Fallback to mock data if AI fails
      setInsights([
        {
          id: 'fallback-1',
          type: 'info',
          title: 'AI Temporarily Unavailable',
          message:
            "We're working to restore AI insights. Please check back soon.",
          action: 'Try again later',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleActionClick = async (insight: InsightData) => {
    if (!insight.action) return;

    // Check if answer is already loading or exists
    const existingAnswer = aiAnswers.find((a) => a.insightId === insight.id);
    if (existingAnswer) {
      // Remove the answer if it already exists (toggle functionality)
      setAiAnswers((prev) => prev.filter((a) => a.insightId !== insight.id));
      return;
    }

    // Add loading state
    setAiAnswers((prev) => [
      ...prev,
      {
        insightId: insight.id,
        answer: '',
        isLoading: true,
      },
    ]);

    try {
      // Generate question based on insight title and action
      const question = `${insight.title}: ${insight.action}`;

      // Use server action to generate AI answer
      const answer = await generateInsightAnswer(question);

      setAiAnswers((prev) =>
        prev.map((a) =>
          a.insightId === insight.id ? { ...a, answer, isLoading: false } : a
        )
      );
    } catch (error) {
      console.error('❌ Failed to generate AI answer:', error);
      setAiAnswers((prev) =>
        prev.map((a) =>
          a.insightId === insight.id
            ? {
                ...a,
                answer:
                  'Sorry, I was unable to generate a detailed answer. Please try again.',
                isLoading: false,
              }
            : a
        )
      );
    }
  };

  useEffect(() => {
    loadInsights();
  }, []);

  const getTypeStyles = (type: string) => {
    switch (type) {
      case 'warning':
        return 'bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 border-l-red-500';
      case 'success':
        return 'bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-l-green-500';
      case 'tip':
        return 'bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-l-blue-500';
      default:
        return 'bg-gradient-to-r from-gray-50 to-slate-50 dark:from-gray-900/20 dark:to-slate-900/20 border-l-gray-500';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'warning':
        return '⚠️';
      case 'success':
        return '✅';
      case 'tip':
        return '💡';
      default:
        return 'ℹ️';
    }
  };

  return (
    <div className='bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-4 sm:p-6 rounded-2xl shadow-xl border border-gray-100/50 dark:border-gray-700/50 hover:shadow-2xl'>
      <div className='flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6'>
        <div className='w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg'>
          <span className='text-white text-sm sm:text-lg'>🤖</span>
        </div>
        <div>
          <h3 className='text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100'>
            AI Insights
          </h3>
          <p className='text-xs text-gray-500 dark:text-gray-400 mt-0.5'>
            Smart analysis of your spending
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className='space-y-3'>
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className='animate-pulse bg-gray-200 dark:bg-gray-700 rounded-xl p-4 h-20'
            />
          ))}
        </div>
      ) : (
        <div className='space-y-3 sm:space-y-4'>
          {insights.map((insight) => (
            <div
              key={insight.id}
              className={`${getTypeStyles(
                insight.type
              )} border-l-4 p-3 sm:p-4 rounded-xl transition-all duration-200 hover:shadow-md`}
            >
              <div className='flex items-start gap-3'>
                <div className='flex-shrink-0 text-lg'>{getTypeIcon(insight.type)}</div>
                <div className='flex-1 min-w-0'>
                  <h4 className='font-semibold text-gray-900 dark:text-gray-100 text-sm sm:text-base mb-1'>
                    {insight.title}
                  </h4>
                  <p className='text-gray-600 dark:text-gray-300 text-xs sm:text-sm mb-2'>
                    {insight.message}
                  </p>
                  {insight.action && (
                    <button
                      onClick={() => handleActionClick(insight)}
                      className='text-xs sm:text-sm font-medium text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors duration-200'
                    >
                      {insight.action} →
                    </button>
                  )}
                  {aiAnswers.find((a) => a.insightId === insight.id) && (
                    <div className='mt-3 p-3 bg-white/50 dark:bg-gray-700/50 rounded-lg border border-gray-200/50 dark:border-gray-600/50'>
                      {aiAnswers.find((a) => a.insightId === insight.id)?.isLoading ? (
                        <div className='flex items-center gap-2'>
                          <div className='w-4 h-4 border-2 border-purple-500 border-t-transparent rounded-full animate-spin'></div>
                          <span className='text-xs text-gray-600 dark:text-gray-400'>
                            Generating AI response...
                          </span>
                        </div>
                      ) : (
                        <p className='text-xs text-gray-700 dark:text-gray-300'>
                          {aiAnswers.find((a) => a.insightId === insight.id)?.answer}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {lastUpdated && (
        <div className='mt-4 pt-3 border-t border-gray-200/50 dark:border-gray-600/50'>
          <p className='text-xs text-gray-500 dark:text-gray-400 text-center'>
            Last updated: {lastUpdated.toLocaleTimeString()}
          </p>
        </div>
      )}
    </div>
  );
};

export default Insights;
