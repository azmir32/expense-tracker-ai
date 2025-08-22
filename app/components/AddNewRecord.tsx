'use client';
import { useRef, useState } from 'react';
import addExpenseRecord from '../actions/addExpenseRecord';
import { suggestCategory } from '../actions/suggestCategory';

const AddRecord = () => {
  const formRef = useRef<HTMLFormElement>(null);
  const [amount, setAmount] = useState(50); // Default value for expense amount
  const [alertMessage, setAlertMessage] = useState<string | null>(null); // State for alert message
  const [alertType, setAlertType] = useState<'success' | 'error' | null>(null); // State for alert type
  const [isLoading, setIsLoading] = useState(false); // State for loading spinner
  const [category, setCategory] = useState(''); // State for selected expense category
  const [description, setDescription] = useState(''); // State for expense description
  const [isCategorizingAI, setIsCategorizingAI] = useState(false); // State for AI categorization loading

  const clientAction = async (formData: FormData) => {
    try {
      console.log('📝 AddNewRecord: Starting expense record submission...');
      setIsLoading(true); // Show spinner
      setAlertMessage(null); // Clear previous messages

      // Validate form data
      const textValue = formData.get('text');
      const dateValue = formData.get('date');
      
      if (!textValue || !dateValue) {
        console.error('❌ AddNewRecord: Missing required form fields');
        setAlertMessage('Please fill in all required fields');
        setAlertType('error');
        return;
      }

      console.log(`📝 AddNewRecord: Form data - Text: "${textValue}", Amount: ${amount}, Category: "${category}", Date: "${dateValue}"`);

      formData.set('amount', amount.toString()); // Add the amount value to the form data
      formData.set('category', category); // Add the selected category to the form data

      console.log('📝 AddNewRecord: Calling addExpenseRecord server action...');
      const { error } = await addExpenseRecord(formData); // Removed `data` since it's unused

      if (error) {
        console.error('❌ AddNewRecord: Server action returned error:', error);
        setAlertMessage(`Error: ${error}`);
        setAlertType('error'); // Set alert type to error
      } else {
        console.log('✅ AddNewRecord: Expense record added successfully');
        setAlertMessage('Expense record added successfully!');
        setAlertType('success'); // Set alert type to success
        formRef.current?.reset();
        setAmount(50); // Reset the amount to the default value
        setCategory(''); // Reset the category
        setDescription(''); // Reset the description
      }
    } catch (error) {
      console.error('❌ AddNewRecord: Unexpected error during form submission:', error);
      setAlertMessage('An unexpected error occurred. Please try again.');
      setAlertType('error');
    } finally {
      setIsLoading(false); // Hide spinner
    }
  };

  const handleAISuggestCategory = async () => {
    try {
      console.log('🤖 AddNewRecord: Starting AI category suggestion...');
      
      if (!description.trim()) {
        console.log('⚠️ AddNewRecord: No description provided for AI categorization');
        setAlertMessage('Please enter a description first');
        setAlertType('error');
        return;
      }

      console.log(`🤖 AddNewRecord: Requesting AI categorization for: "${description}"`);
      setIsCategorizingAI(true);
      setAlertMessage(null);

      const result = await suggestCategory(description);
      
      if (result.error) {
        console.error('❌ AddNewRecord: AI suggestion returned error:', result.error);
        setAlertMessage(`AI Suggestion: ${result.error}`);
        setAlertType('error');
      } else {
        console.log(`✅ AddNewRecord: AI suggested category: "${result.category}"`);
        setCategory(result.category);
        setAlertMessage(`AI suggested category: ${result.category}`);
        setAlertType('success');
      }
    } catch (error) {
      console.error('❌ AddNewRecord: Error during AI category suggestion:', error);
      setAlertMessage('Failed to get AI category suggestion');
      setAlertType('error');
    } finally {
      setIsCategorizingAI(false);
    }
  };

  return (
    <div className='bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-4 sm:p-6 rounded-2xl shadow-xl border border-gray-100/50 dark:border-gray-700/50 hover:shadow-2xl'>
      <div className='flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6'>
        <div className='w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-emerald-500 via-green-500 to-teal-500 rounded-xl flex items-center justify-center shadow-lg'>
          <span className='text-white text-sm sm:text-lg'>💳</span>
        </div>
        <div>
          <h3 className='text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100 leading-tight'>
            Add New Expense
          </h3>
          <p className='text-xs text-gray-500 dark:text-gray-400 mt-0.5'>
            Track your spending with AI assistance
          </p>
        </div>
      </div>
      <form
        ref={formRef}
        onSubmit={(e) => {
          e.preventDefault();
          console.log('📝 AddNewRecord: Form submitted, calling clientAction...');
          const formData = new FormData(formRef.current!);
          clientAction(formData);
        }}
        className='space-y-6 sm:space-y-8'
      >
        {/* Expense Description and Date */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 p-3 sm:p-4 bg-gradient-to-r from-emerald-50/50 to-green-50/50 dark:from-emerald-900/10 dark:to-green-900/10 rounded-xl border border-emerald-100/50 dark:border-emerald-800/50'>
          {/* Expense Description */}
          <div className='space-y-1.5'>
            <label
              htmlFor='text'
              className='flex items-center gap-2 text-xs font-semibold text-gray-700 dark:text-gray-300 tracking-wide'
            >
              <span className='w-1.5 h-1.5 bg-emerald-500 rounded-full'></span>
              Description
              <span className='text-xs text-gray-400 dark:text-gray-500 ml-2 font-normal hidden sm:inline'>
                What did you spend money on?
              </span>
            </label>
            <div className='relative'>
              <input
                type='text'
                name='text'
                id='text'
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className='w-full px-3 py-2.5 bg-white/70 dark:bg-gray-800/70 border-2 border-gray-200/80 dark:border-gray-600/80 rounded-xl focus:ring-2 focus:ring-emerald-500/30 focus:bg-white dark:focus:bg-gray-700/90 focus:border-emerald-400 dark:focus:border-emerald-400 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 text-sm font-semibold shadow-sm hover:shadow-md transition-all duration-200'
                placeholder='e.g., Coffee at Starbucks'
                required
              />
              <button
                type='button'
                onClick={handleAISuggestCategory}
                disabled={isCategorizingAI || !description.trim()}
                className='absolute right-2 top-1/2 -translate-y-1/2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 disabled:from-gray-300 disabled:to-gray-400 text-white px-2 py-1 rounded-lg text-xs font-medium shadow-sm hover:shadow-md transition-all duration-200 disabled:cursor-not-allowed'
              >
                {isCategorizingAI ? (
                  <div className='w-3 h-3 border border-white/30 border-t-white rounded-full animate-spin'></div>
                ) : (
                  '🤖 AI'
                )}
              </button>
            </div>
          </div>

          {/* Date */}
          <div className='space-y-1.5'>
            <label
              htmlFor='date'
              className='flex items-center gap-2 text-xs font-semibold text-gray-700 dark:text-gray-300 tracking-wide'
            >
              <span className='w-1.5 h-1.5 bg-green-500 rounded-full'></span>
              Date
              <span className='text-xs text-gray-400 dark:text-gray-500 ml-2 font-normal hidden sm:inline'>
                When did this expense occur?
              </span>
            </label>
            <input
              type='date'
              name='date'
              id='date'
              defaultValue={new Date().toISOString().split('T')[0]}
              className='w-full px-3 py-2.5 bg-white/70 dark:bg-gray-800/70 border-2 border-gray-200/80 dark:border-gray-600/80 rounded-xl focus:ring-2 focus:ring-emerald-500/30 focus:bg-white dark:focus:bg-gray-700/90 focus:border-emerald-400 dark:focus:border-emerald-400 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 text-sm font-semibold shadow-sm hover:shadow-md transition-all duration-200'
              required
            />
          </div>
        </div>

        {/* Category and Amount */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 p-3 sm:p-4 bg-gradient-to-r from-blue-50/50 to-purple-50/50 dark:from-blue-900/10 dark:to-purple-900/10 rounded-xl border border-blue-100/50 dark:border-blue-800/50'>
          {/* Category */}
          <div className='space-y-1.5'>
            <label
              htmlFor='category'
              className='flex items-center gap-2 text-xs font-semibold text-gray-700 dark:text-gray-300 tracking-wide'
            >
              <span className='w-1.5 h-1.5 bg-blue-500 rounded-full'></span>
              Category
              <span className='text-xs text-gray-400 dark:text-gray-500 ml-2 font-normal hidden sm:inline'>
                Select or let AI suggest
              </span>
            </label>
            <select
              name='category'
              id='category'
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className='w-full px-3 py-2.5 bg-white/70 dark:bg-gray-800/70 border-2 border-gray-200/80 dark:border-gray-600/80 rounded-xl focus:ring-2 focus:ring-emerald-500/30 focus:bg-white dark:focus:bg-gray-700/90 focus:border-emerald-400 dark:focus:border-emerald-400 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 text-sm font-semibold shadow-sm hover:shadow-md transition-all duration-200'
              required
            >
              <option value='' className='text-gray-900 dark:text-gray-100'>
                Select Category
              </option>
              <option
                value='Food'
                className='text-gray-900 dark:text-gray-100'
              >
                🍕 Food & Dining
              </option>
              <option
                value='Transportation'
                className='text-gray-900 dark:text-gray-100'
              >
                🚗 Transportation
              </option>
              <option
                value='Shopping'
                className='text-gray-900 dark:text-gray-100'
              >
                🛍️ Shopping
              </option>
              <option
                value='Entertainment'
                className='text-gray-900 dark:text-gray-100'
              >
                🎬 Entertainment
              </option>
              <option
                value='Bills'
                className='text-gray-900 dark:text-gray-100'
              >
                💡 Bills & Utilities
              </option>
              <option
                value='Healthcare'
                className='text-gray-900 dark:text-gray-100'
              >
                🏥 Healthcare
              </option>
              <option
                value='Other'
                className='text-gray-900 dark:text-gray-100'
              >
                📦 Other
              </option>
            </select>
          </div>

          {/* Amount */}
          <div className='space-y-1.5'>
            <label
              htmlFor='amount'
              className='flex items-center gap-2 text-xs font-semibold text-gray-700 dark:text-gray-300 tracking-wide'
            >
              <span className='w-1.5 h-1.5 bg-green-500 rounded-full'></span>
              Amount
              <span className='text-xs text-gray-400 dark:text-gray-500 ml-2 font-normal hidden sm:inline'>
                Enter amount between $0 and $1,000
              </span>
            </label>
            <div className='relative'>
              <span className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 font-medium text-sm'>
                $
              </span>
              <input
                type='number'
                name='amount'
                id='amount'
                min='0'
                max='1000'
                step='0.01'
                value={amount}
                onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                className='w-full pl-6 pr-3 py-2.5 bg-white/70 dark:bg-gray-800/70 border-2 border-gray-200/80 dark:border-gray-600/80 rounded-xl focus:ring-2 focus:ring-emerald-500/30 focus:bg-white dark:focus:bg-gray-700/90 focus:border-emerald-400 dark:focus:border-emerald-400 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 text-sm font-semibold shadow-sm hover:shadow-md transition-all duration-200'
                placeholder='0.00'
                required
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type='submit'
          className='w-full relative overflow-hidden bg-gradient-to-r from-emerald-600 via-green-500 to-teal-500 hover:from-emerald-700 hover:via-green-600 hover:to-teal-600 text-white px-4 py-3 sm:px-5 sm:py-4 rounded-xl font-semibold shadow-xl hover:shadow-2xl group transition-all duration-300 border-2 border-transparent hover:border-white/20 text-sm sm:text-base'
          disabled={isLoading}
        >
          <div className='relative flex items-center justify-center gap-2'>
            {isLoading ? (
              <>
                <div className='w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin'></div>
                <span>Processing...</span>
              </>
            ) : (
              <>
                <span className='text-lg'>💫</span>
                <span>Add Expense</span>
              </>
            )}
          </div>
        </button>
      </form>

      {/* Alert Message */}
      {alertMessage && (
        <div
          className={`mt-4 p-3 rounded-xl border-l-4 backdrop-blur-sm ${
            alertType === 'success'
              ? 'bg-green-50/80 dark:bg-green-900/20 border-l-green-500 text-green-800 dark:text-green-200'
              : 'bg-red-50/80 dark:bg-red-900/20 border-l-red-500 text-red-800 dark:text-red-200'
          }`}
        >
          <div className='flex items-center gap-2'>
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center ${
                alertType === 'success'
                  ? 'bg-green-100 dark:bg-green-800'
                  : 'bg-red-100 dark:bg-red-800'
              }`}
            >
              <span className='text-sm'>
                {alertType === 'success' ? '✅' : '⚠️'}
              </span>
            </div>
            <p className='font-medium text-sm'>{alertMessage}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddRecord;