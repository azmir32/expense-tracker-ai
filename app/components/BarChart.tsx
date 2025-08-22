'use client';

import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { useTheme } from '../../contexts/ThemeContext';
import { useState, useEffect } from 'react';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// Define the type for a record
interface Record {
  date: string; // ISO date string
  amount: number; // Amount spent
  category: string; // Expense category
}

const BarChart = ({ records }: { records: Record[] }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [windowWidth, setWindowWidth] = useState(1024); // Default to desktop width
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      console.log('📊 BarChart: Initializing chart component...');
      console.log(`📊 BarChart: Received ${records?.length || 0} records`);
      
      // Set initial window width
      setWindowWidth(window.innerWidth);

      // Add resize listener
      const handleResize = () => {
        setWindowWidth(window.innerWidth);
      };

      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    } catch (error) {
      console.error('❌ BarChart: Error during component initialization:', error);
      setError('Failed to initialize chart');
    }
  }, [records]);

  const isMobile = windowWidth < 640;

  // Aggregate expenses by date
  const aggregateByDate = (records: Record[]) => {
    try {
      console.log('📊 BarChart: Starting data aggregation...');
      
      if (!records || records.length === 0) {
        console.log('📊 BarChart: No records to aggregate');
        return [];
      }

      const dateMap = new Map<
        string,
        { total: number; categories: string[]; originalDate: string }
      >();

      records.forEach((record, index) => {
        try {
          // Validate record data
          if (!record.date || typeof record.amount !== 'number' || !record.category) {
            console.warn(`⚠️ BarChart: Invalid record at index ${index}:`, record);
            return;
          }

          // Parse the date string properly and extract just the date part (YYYY-MM-DD)
          const dateObj = new Date(record.date);
          
          // Check if date is valid
          if (isNaN(dateObj.getTime())) {
            console.warn(`⚠️ BarChart: Invalid date in record at index ${index}:`, record.date);
            return;
          }
          
          // Use UTC methods to avoid timezone issues
          const year = dateObj.getUTCFullYear();
          const month = String(dateObj.getUTCMonth() + 1).padStart(2, '0');
          const day = String(dateObj.getUTCDate()).padStart(2, '0');
          const dateKey = `${year}-${month}-${day}`;
          const existing = dateMap.get(dateKey);

          if (existing) {
            existing.total += record.amount;
            if (!existing.categories.includes(record.category)) {
              existing.categories.push(record.category);
            }
          } else {
            dateMap.set(dateKey, {
              total: record.amount,
              categories: [record.category],
              originalDate: record.date, // Keep original ISO date for sorting
            });
          }
        } catch (recordError) {
          console.error(`❌ BarChart: Error processing record at index ${index}:`, recordError, record);
        }
      });

      // Convert to array and sort by date (oldest to newest)
      const aggregatedData = Array.from(dateMap.entries())
        .map(([date, data]) => ({
          date,
          amount: data.total,
          categories: data.categories,
          originalDate: data.originalDate,
        }))
        .sort(
          (a, b) =>
            new Date(a.originalDate).getTime() -
            new Date(b.originalDate).getTime()
        );

      console.log(`📊 BarChart: Successfully aggregated data into ${aggregatedData.length} date groups`);
      return aggregatedData;
    } catch (error) {
      console.error('❌ BarChart: Error during data aggregation:', error);
      setError('Failed to process chart data');
      return [];
    }
  };

  const aggregatedData = aggregateByDate(records);

  // Prepare chart data
  const chartData = {
    labels: aggregatedData.map((item) => {
      try {
        const date = new Date(item.date);
        return isMobile
          ? date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
          : date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      } catch (error) {
        console.error('❌ BarChart: Error formatting date label:', error, item.date);
        return 'Invalid Date';
      }
    }),
    datasets: [
      {
        label: 'Daily Spending',
        data: aggregatedData.map((item) => {
          try {
            return Math.round(item.amount * 100) / 100; // Round to 2 decimal places
          } catch (error) {
            console.error('❌ BarChart: Error processing amount:', error, item.amount);
            return 0;
          }
        }),
        backgroundColor: isDark
          ? 'rgba(34, 197, 94, 0.8)' // Green with transparency for dark theme
          : 'rgba(34, 197, 94, 0.6)', // Green with transparency for light theme
        borderColor: isDark
          ? 'rgba(34, 197, 94, 1)' // Solid green for dark theme
          : 'rgba(34, 197, 94, 0.8)', // Green with transparency for light theme
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false, // Hide legend since we only have one dataset
      },
      tooltip: {
        backgroundColor: isDark ? 'rgba(0, 0, 0, 0.9)' : 'rgba(255, 255, 255, 0.95)',
        titleColor: isDark ? '#ffffff' : '#000000',
        bodyColor: isDark ? '#ffffff' : '#000000',
        borderColor: isDark ? '#374151' : '#e5e7eb',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: false,
        callbacks: {
          title: (context: unknown) => {
            try {
              const ctx = context as { [0]: { label: string } };
              return `Date: ${ctx[0].label}`;
            } catch (error) {
              console.error('❌ BarChart: Error in tooltip title callback:', error);
              return 'Date: Unknown';
            }
          },
          label: (context: unknown) => {
            try {
              const ctx = context as { parsed: { y: number } };
              return `Amount: $${ctx.parsed.y.toFixed(2)}`;
            } catch (error) {
              console.error('❌ BarChart: Error in tooltip label callback:', error);
              return 'Amount: $0.00';
            }
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          color: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          color: isDark ? '#9ca3af' : '#6b7280',
          font: {
            size: isMobile ? 10 : 12,
          },
        },
      },
      y: {
        grid: {
          color: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          color: isDark ? '#9ca3af' : '#6b7280',
          font: {
            size: isMobile ? 10 : 12,
          },
          callback: (value: unknown) => {
            try {
              const val = value as number;
              return `$${val}`;
            } catch (error) {
              console.error('❌ BarChart: Error in y-axis tick callback:', error);
              return '$0';
            }
          },
        },
      },
    },
  };

  // Show error state if there's an error
  if (error) {
    return (
      <div className='flex items-center justify-center h-64 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800'>
        <div className='text-center'>
          <div className='w-12 h-12 bg-red-100 dark:bg-red-800 rounded-full flex items-center justify-center mx-auto mb-3'>
            <span className='text-xl'>⚠️</span>
          </div>
          <p className='text-red-700 dark:text-red-300 text-sm font-medium'>Chart Error</p>
          <p className='text-red-600 dark:text-red-400 text-xs mt-1'>{error}</p>
        </div>
      </div>
    );
  }

  // Show empty state if no data
  if (!aggregatedData || aggregatedData.length === 0) {
    return (
      <div className='flex items-center justify-center h-64 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700'>
        <div className='text-center'>
          <div className='w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-3'>
            <span className='text-xl'>📊</span>
          </div>
          <p className='text-gray-600 dark:text-gray-400 text-sm font-medium'>No Data Available</p>
          <p className='text-gray-500 dark:text-gray-500 text-xs mt-1'>Add some expenses to see the chart</p>
        </div>
      </div>
    );
  }

  try {
    console.log('📊 BarChart: Rendering chart with processed data...');
    return (
      <div className='relative h-64 sm:h-80'>
        <Bar data={chartData} options={options} />
      </div>
    );
  } catch (error) {
    console.error('❌ BarChart: Error rendering chart:', error);
    return (
      <div className='flex items-center justify-center h-64 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800'>
        <div className='text-center'>
          <div className='w-12 h-12 bg-red-100 dark:bg-red-800 rounded-full flex items-center justify-center mx-auto mb-3'>
            <span className='text-xl'>⚠️</span>
          </div>
          <p className='text-red-700 dark:text-red-300 text-sm font-medium'>Chart Rendering Error</p>
          <p className='text-red-600 dark:text-red-400 text-xs mt-1'>Failed to display chart</p>
        </div>
      </div>
    );
  }
};

export default BarChart;