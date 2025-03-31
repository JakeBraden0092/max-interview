import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

// Question types
interface Question {
  id: string;
  text: string;
  type: 'multiple-choice' | 'slider' | 'checkbox';
  options?: { value: string; label: string }[];
  min?: number;
  max?: number;
  step?: number;
}

// Survey questions
const surveyQuestions: Question[] = [
  {
    id: 'age',
    text: 'What is your age group?',
    type: 'multiple-choice',
    options: [
      { value: '18-24', label: '18-24 years' },
      { value: '25-34', label: '25-34 years' },
      { value: '35-44', label: '35-44 years' },
      { value: '45-54', label: '45-54 years' },
      { value: '55-64', label: '55-64 years' },
      { value: '65+', label: '65 years or older' },
    ],
  },
  {
    id: 'activity',
    text: 'How would you describe your physical activity level?',
    type: 'multiple-choice',
    options: [
      { value: 'sedentary', label: 'Sedentary (little to no exercise)' },
      { value: 'light', label: 'Lightly active (light exercise 1-3 days/week)' },
      { value: 'moderate', label: 'Moderately active (moderate exercise 3-5 days/week)' },
      { value: 'active', label: 'Very active (hard exercise 6-7 days/week)' },
      { value: 'extreme', label: 'Extremely active (very hard exercise, physical job, or training twice/day)' },
    ],
  },
  {
    id: 'health_goals',
    text: 'What are your health goals? (Select all that apply)',
    type: 'checkbox',
    options: [
      { value: 'weight_loss', label: 'Weight loss' },
      { value: 'muscle_gain', label: 'Muscle gain' },
      { value: 'energy', label: 'Increase energy' },
      { value: 'sleep', label: 'Improve sleep' },
      { value: 'stress', label: 'Reduce stress' },
      { value: 'immunity', label: 'Boost immunity' },
      { value: 'general', label: 'General wellness' },
    ],
  },
  {
    id: 'sleep',
    text: 'On average, how many hours of sleep do you get per night?',
    type: 'slider',
    min: 3,
    max: 12,
    step: 0.5,
  },
  {
    id: 'stress',
    text: 'How would you rate your stress level on a typical day?',
    type: 'slider',
    min: 1,
    max: 10,
    step: 1,
  },
  {
    id: 'diet',
    text: 'How would you describe your dietary preferences?',
    type: 'multiple-choice',
    options: [
      { value: 'omnivore', label: 'Omnivore (eat everything)' },
      { value: 'pescatarian', label: 'Pescatarian (vegetarian + fish)' },
      { value: 'vegetarian', label: 'Vegetarian' },
      { value: 'vegan', label: 'Vegan' },
      { value: 'keto', label: 'Keto / Low-carb' },
      { value: 'paleo', label: 'Paleo' },
      { value: 'gluten_free', label: 'Gluten-free' },
      { value: 'other', label: 'Other dietary restriction' },
    ],
  },
  {
    id: 'allergies',
    text: 'Do you have any allergies or sensitivities? (Select all that apply)',
    type: 'checkbox',
    options: [
      { value: 'none', label: 'No known allergies' },
      { value: 'dairy', label: 'Dairy' },
      { value: 'nuts', label: 'Nuts' },
      { value: 'gluten', label: 'Gluten' },
      { value: 'soy', label: 'Soy' },
      { value: 'shellfish', label: 'Shellfish' },
      { value: 'eggs', label: 'Eggs' },
      { value: 'other', label: 'Other' },
    ],
  },
];

const SurveyWizard: React.FC = () => {
  const { updateUser } = useAuth();
  const navigate = useNavigate();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const currentQuestion = surveyQuestions[currentQuestionIndex];
  
  // Handle single-select answers
  const handleSingleAnswer = (value: string) => {
    setAnswers({
      ...answers,
      [currentQuestion.id]: value,
    });
  };
  
  // Handle multi-select answers
  const handleMultiAnswer = (value: string, checked: boolean) => {
    const currentValues = answers[currentQuestion.id] || [];
    
    if (checked) {
      // Add value if it's checked
      setAnswers({
        ...answers,
        [currentQuestion.id]: [...currentValues, value],
      });
    } else {
      // Remove value if it's unchecked
      setAnswers({
        ...answers,
        [currentQuestion.id]: currentValues.filter((v: string) => v !== value),
      });
    }
  };
  
  // Handle slider answers
  const handleSliderAnswer = (value: number) => {
    setAnswers({
      ...answers,
      [currentQuestion.id]: value,
    });
  };
  
  // Navigate to next question
  const goToNextQuestion = () => {
    if (currentQuestionIndex < surveyQuestions.length - 1) {
      // Always allow moving to the next question
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      window.scrollTo(0, 0);
    } else {
      // Submit survey
      handleSubmit();
    }
  };
  
  // Navigate to previous question
  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      window.scrollTo(0, 0);
    }
  };
  
  // Submit survey
  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update user survey completed status
      updateUser({
        surveyCompleted: true,
      });
      
      // Navigate to the products page
      navigate('/products');
    } catch (error) {
      console.error('Error submitting survey:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Render the current question based on its type
  const renderQuestion = () => {
    switch (currentQuestion.type) {
      case 'multiple-choice':
        return (
          <div className="mt-4 space-y-4" data-cy="multiple-choice-question">
            {currentQuestion.options?.map((option) => (
              <div key={option.value} className="flex items-center">
                <input
                  id={option.value}
                  name={currentQuestion.id}
                  type="radio"
                  className="h-4 w-4 border-gray-300 text-primary-600 focus:ring-primary-500"
                  value={option.value}
                  checked={answers[currentQuestion.id] === option.value}
                  onChange={() => handleSingleAnswer(option.value)}
                  data-cy={`option-${option.value}`}
                />
                <label htmlFor={option.value} className="ml-3 block text-sm font-medium text-gray-700">
                  {option.label}
                </label>
              </div>
            ))}
          </div>
        );
      
      case 'checkbox':
        return (
          <div className="mt-4 space-y-4" data-cy="checkbox-question">
            {currentQuestion.options?.map((option) => (
              <div key={option.value} className="flex items-center">
                <input
                  id={option.value}
                  name={currentQuestion.id}
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  value={option.value}
                  checked={(answers[currentQuestion.id] || []).includes(option.value)}
                  onChange={(e) => handleMultiAnswer(option.value, e.target.checked)}
                  data-cy={`option-${option.value}`}
                />
                <label htmlFor={option.value} className="ml-3 block text-sm font-medium text-gray-700">
                  {option.label}
                </label>
              </div>
            ))}
          </div>
        );
      
      case 'slider':
        return (
          <div className="mt-4" data-cy="slider-question">
            <div className="flex justify-between text-xs text-gray-600">
              <span>{currentQuestion.min}</span>
              <span>{currentQuestion.max}</span>
            </div>
            <input
              type="range"
              min={currentQuestion.min}
              max={currentQuestion.max}
              step={currentQuestion.step}
              value={answers[currentQuestion.id] || (currentQuestion.min || 0)}
              onChange={(e) => handleSliderAnswer(parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer mt-2"
              data-cy="slider-input"
            />
            <div className="mt-2 text-center">
              <span className="text-lg font-medium">
                {answers[currentQuestion.id] !== undefined ? answers[currentQuestion.id] : (currentQuestion.min || 0)}
              </span>
              {currentQuestion.id === 'sleep' && <span className="ml-1 text-sm text-gray-500">hours</span>}
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };
  
  return (
    <div className="bg-white shadow sm:rounded-lg" data-cy="survey-wizard">
      <div className="px-4 py-5 sm:p-6">
        <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:tracking-tight">
          Health Profile Survey
        </h2>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">
          Help us understand your health needs so we can recommend the best products for you.
        </p>
        
        {/* Progress indicator */}
        <div className="mt-8">
          <div className="relative">
            <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200">
              <div 
                style={{ width: `${((currentQuestionIndex + 1) / surveyQuestions.length) * 100}%` }}
                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-primary-500"
                data-cy="progress-bar"
              ></div>
            </div>
            <div className="mt-2 text-xs text-gray-500 text-right">
              Question {currentQuestionIndex + 1} of {surveyQuestions.length}
            </div>
          </div>
        </div>
        
        {/* Question */}
        <div className="mt-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900" data-cy="question-text">
            {currentQuestion.text}
          </h3>
          
          {renderQuestion()}
        </div>
        
        {/* Navigation */}
        <div className="mt-8 flex justify-between">
          <button
            type="button"
            onClick={goToPreviousQuestion}
            disabled={currentQuestionIndex === 0}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              currentQuestionIndex === 0
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500'
            }`}
            data-cy="previous-button"
          >
            Previous
          </button>
          
          <button
            type="button"
            onClick={goToNextQuestion}
            disabled={isSubmitting}
            className="ml-3 inline-flex justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
            data-cy="next-button"
          >
            {currentQuestionIndex === surveyQuestions.length - 1 ? (
              isSubmitting ? (
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                'Complete Survey'
              )
            ) : (
              'Next'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SurveyWizard;