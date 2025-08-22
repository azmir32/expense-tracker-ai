import getRecords from '../actions/getRecords';
import BarChart from './BarChart';

const RecordChart = async () => {
  try {
    console.log('📊 RecordChart: Starting chart data fetch...');
    
    const { records, error } = await getRecords();

    if (error) {
      console.error('❌ RecordChart: Error fetching records:', error);
      return (
        <div className='bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-4 sm:p-6 rounded-2xl shadow-xl border border-gray-100/50 dark:border-gray-700/50 hover:shadow-2xl'>
          <div className='flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6'>
            <div className='w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-emerald-500 via-green-500 to-teal-500 rounded-xl flex items-center justify-center shadow-lg'>
              <span className='text-white text-sm sm:text-lg'>📊</span>
            </div>
            <div>
              <h3 className='text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100'>
                Expense Chart
              </h3>
              <p className='text-xs text-gray-500 dark:text-gray-400 mt-0.5'>
                Visual representation of your spending
              </p>
            </div>
          </div>
          <div className='bg-red-50/80 dark:bg-red-900/20 backdrop-blur-sm p-3 sm:p-4 rounded-xl border-l-4 border-l-red-500'>
            <div className='flex items-center gap-2 mb-2'>
              <div className='w-6 h-6 bg-red-100 dark:bg-red-800 rounded-full flex items-center justify-center'>
                <span className='text-sm'>⚠️</span>
              </div>
              <p className='text-red-800 dark:text-red-300 font-semibold text-sm'>
                Error loading chart data
              </p>
            </div>
            <p className='text-red-700 dark:text-red-400 text-xs ml-8'>{error}</p>
          </div>
        </div>
      );
    }

    console.log(`📊 RecordChart: Successfully fetched ${records?.length || 0} records`);

    if (!records || records.length === 0) {
      console.log('📊 RecordChart: No records found, showing empty state');
      return (
        <div className='bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-4 sm:p-6 rounded-2xl shadow-xl border border-gray-100/50 dark:border-gray-700/50 hover:shadow-2xl'>
          <div className='flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6'>
            <div className='w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-emerald-500 via-green-500 to-teal-500 rounded-xl flex items-center justify-center shadow-lg'>
              <span className='text-white text-sm sm:text-lg'>📊</span>
            </div>
            <div>
              <h3 className='text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100'>
                Expense Chart
              </h3>
              <p className='text-xs text-gray-500 dark:text-gray-400 mt-0.5'>
                Visual representation of your spending
              </p>
            </div>
          </div>
          <div className='text-center py-6 sm:py-8'>
            <div className='w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg'>
              <span className='text-2xl sm:text-3xl'>📈</span>
            </div>
            <h4 className='text-base sm:text-lg font-bold text-gray-800 dark:text-gray-200 mb-2'>
              No Data to Display
            </h4>
            <p className='text-gray-600 dark:text-gray-400 max-w-md mx-auto leading-relaxed text-sm'>
              Start tracking your expenses to see your spending patterns
              visualized in this chart.
            </p>
          </div>
        </div>
      );
    }

    console.log('📊 RecordChart: Rendering chart with data...');
    
    // Transform records for chart component
    const chartData = records.map((record) => ({
      ...record,
      date: String(record.date),
    }));

    console.log(`📊 RecordChart: Chart data prepared - ${chartData.length} records`);

    return (
      <div className='bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-4 sm:p-6 rounded-2xl shadow-xl border border-gray-100/50 dark:border-gray-700/50 hover:shadow-2xl'>
        <div className='flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6'>
          <div className='w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-emerald-500 via-green-500 to-teal-500 rounded-xl flex items-center justify-center shadow-lg'>
            <span className='text-white text-sm sm:text-lg'>📊</span>
          </div>
          <div>
            <h3 className='text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100'>
              Expense Chart
            </h3>
            <p className='text-xs text-gray-500 dark:text-gray-400 mt-0.5'>
              Visual representation of your spending
            </p>
          </div>
        </div>
        <div className='overflow-x-auto'>
          <BarChart records={chartData} />
        </div>
      </div>
    );
  } catch (error) {
    console.error('❌ RecordChart: Critical error during chart rendering:', error);
    
    return (
      <div className='bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-4 sm:p-6 rounded-2xl shadow-xl border border-gray-100/50 dark:border-gray-700/50 hover:shadow-2xl'>
        <div className='flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6'>
          <div className='w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-red-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg'>
            <span className='text-white text-sm sm:text-lg'>⚠️</span>
          </div>
          <div>
            <h3 className='text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100'>
              Expense Chart
            </h3>
            <p className='text-xs text-gray-500 dark:text-gray-400 mt-0.5'>
              Visual representation of your spending
            </p>
          </div>
        </div>
        <div className='bg-red-50/80 dark:bg-red-900/20 backdrop-blur-sm p-3 sm:p-4 rounded-xl border-l-4 border-l-red-500'>
          <div className='flex items-center gap-2 mb-2'>
            <div className='w-6 h-6 bg-red-100 dark:bg-red-800 rounded-full flex items-center justify-center'>
              <span className='text-sm'>⚠️</span>
            </div>
            <p className='text-red-800 dark:text-red-300 font-semibold text-sm'>
              Chart temporarily unavailable
            </p>
          </div>
          <p className='text-red-700 dark:text-red-400 text-xs ml-8'>
            We encountered an error while loading the chart. Please try refreshing the page.
          </p>
        </div>
      </div>
    );
  }
};

export default RecordChart;