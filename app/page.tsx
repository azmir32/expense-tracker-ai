import AddNewRecord from './components/AddNewRecord';
import Insights from './components/Insights';
import ExpenseStats from './components/ExpenseStats';
import Guest from './components/Guest';
import RecordChart from './components/RecordChart';
import RecordHistory from './components/RecordHistory';
import { currentUser } from '@clerk/nextjs/server';
import { checkUser } from '../lib/checkUser';
import Image from 'next/image';

// Force dynamic rendering since we use currentUser()
export const dynamic = 'force-dynamic';

export default async function HomePage() {
  try {
    console.log('🏠 HomePage: Starting page load...');
    
    const user = await currentUser();
    if (!user) {
      console.log('👤 HomePage: No authenticated user, showing guest component');
      return <Guest />;
    }

    console.log(`✅ HomePage: User authenticated - ${user.firstName} ${user.lastName}`);

    // Sync user to database
    try {
      console.log('🔄 HomePage: Syncing user to database...');
      await checkUser();
      console.log('✅ HomePage: User successfully synced to database');
    } catch (syncError) {
      console.error('❌ HomePage: Failed to sync user to database:', syncError);
      // Continue rendering the page even if sync fails
    }

    console.log('🎨 HomePage: Rendering authenticated user interface...');

    return (
      <main className='bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 font-sans min-h-screen transition-colors duration-300'>
        {/* Mobile-optimized container with responsive padding */}
        <div className='max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8'>
          {/* Mobile-first responsive grid */}
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6'>
            {/* Left Column - Stacked on mobile */}
            <div className='space-y-4 sm:space-y-6'>
              {/* Welcome section with improved mobile layout */}
              <div className='bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-4 sm:p-6 lg:p-8 rounded-2xl shadow-xl border border-gray-100/50 dark:border-gray-700/50 hover:shadow-2xl flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6'>
                {/* User Image - responsive sizing */}
                <div className='relative flex-shrink-0'>
                  <Image
                    src={user.imageUrl}
                    alt={`${user.firstName}'s profile`}
                    width={80}
                    height={80}
                    className='w-16 h-16 sm:w-20 sm:h-20 rounded-2xl border-2 border-white dark:border-gray-600 shadow-lg'
                  />
                  <div className='absolute -bottom-1 -right-1 w-5 h-5 sm:w-6 sm:h-6 bg-gradient-to-r from-green-400 to-green-500 rounded-full border-2 border-white dark:border-gray-800 flex items-center justify-center'>
                    <span className='text-white text-xs'>✓</span>
                  </div>
                </div>

                {/* User Details - responsive text and layout */}
                <div className='flex-1 text-center sm:text-left'>
                  <div className='flex flex-col sm:flex-row items-center sm:items-start justify-center sm:justify-start gap-2 sm:gap-3 mb-3'>
                    <div className='w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-emerald-500 via-green-500 to-teal-500 rounded-xl flex items-center justify-center shadow-lg'>
                      <span className='text-white text-sm sm:text-lg'>👋</span>
                    </div>
                    <h2 className='text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-gray-100'>
                      Welcome Back, {user.firstName}!
                    </h2>
                  </div>
                  <p className='text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-4 sm:mb-6 max-w-md mx-auto sm:mx-0'>
                    Here&#39;s a quick overview of your recent expense activity.
                    Track your spending, analyze patterns, and manage your budget
                    efficiently!
                  </p>
                  {/* Mobile-optimized badge grid */}
                  <div className='flex flex-col sm:flex-row gap-2 sm:gap-3 justify-center sm:justify-start'>
                    <div className='bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/30 dark:to-green-900/30 border border-emerald-100 dark:border-emerald-800 px-3 py-2 rounded-xl flex items-center gap-2 justify-center sm:justify-start'>
                      <div className='w-5 h-5 sm:w-6 sm:h-6 bg-gradient-to-r from-emerald-500 to-green-500 rounded-lg flex items-center justify-center flex-shrink-0'>
                        <span className='text-white text-xs'>📅</span>
                      </div>
                      <div className='text-center sm:text-left'>
                        <span className='text-xs font-medium text-gray-500 dark:text-gray-400 block'>
                          Joined
                        </span>
                        <span className='text-sm font-semibold text-gray-800 dark:text-gray-200'>
                          {new Date(user.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className='bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 border border-green-100 dark:border-green-800 px-3 py-2 rounded-xl flex items-center gap-2 justify-center sm:justify-start'>
                      <div className='w-5 h-5 sm:w-6 sm:h-6 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center flex-shrink-0'>
                        <span className='text-white text-xs'>⚡</span>
                      </div>
                      <div className='text-center sm:text-left'>
                        <span className='text-xs font-medium text-gray-500 dark:text-gray-400 block'>
                          Last Active
                        </span>
                        <span className='text-sm font-semibold text-gray-800 dark:text-gray-200'>
                          {user.lastActiveAt
                            ? new Date(user.lastActiveAt).toLocaleDateString()
                            : 'Today'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Add New Expense */}
              <AddNewRecord />
            </div>

            {/* Right Column - Stacked below on mobile */}
            <div className='space-y-4 sm:space-y-6'>
              {/* Expense Analytics */}
              <RecordChart />
              <ExpenseStats />
              <RecordHistory />
              <Insights />
            </div>
          </div>
        </div>
      </main>
    );
  } catch (error) {
    console.error('❌ HomePage: Critical error during page load:', error);
    
    // Return a fallback UI for critical errors
    return (
      <main className='bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 font-sans min-h-screen transition-colors duration-300'>
        <div className='max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8'>
          <div className='bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-gray-100/50 dark:border-gray-700/50'>
            <div className='text-center'>
              <div className='w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-red-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6'>
                <span className='text-2xl sm:text-3xl'>⚠️</span>
              </div>
              <h1 className='text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4'>
                Something went wrong
              </h1>
              <p className='text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto'>
                We encountered an error while loading your dashboard. Please try refreshing the page or contact support if the problem persists.
              </p>
              <button
                onClick={() => window.location.reload()}
                className='bg-gradient-to-r from-emerald-600 via-green-500 to-teal-500 hover:from-emerald-700 hover:via-green-600 hover:to-teal-600 text-white px-6 py-3 rounded-xl font-semibold shadow-xl hover:shadow-2xl transition-all duration-300'
              >
                Refresh Page
              </button>
            </div>
          </div>
        </div>
      </main>
    );
  }
}