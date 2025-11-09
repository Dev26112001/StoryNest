
import React, { useState } from 'react';
import { generateStory } from '../services/geminiService';
import type { Story } from '../types';
import { ChevronLeftIcon } from './Icons';

interface StoryCreatorProps {
  onStoryCreated: (story: Story) => void;
  onBack: () => void;
}

const StoryCreator: React.FC<StoryCreatorProps> = ({ onStoryCreated, onBack }) => {
  const [childName, setChildName] = useState('');
  const [character, setCharacter] = useState('');
  const [theme, setTheme] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!childName || !character || !theme) {
      setError('Please fill in all the magic ingredients!');
      return;
    }
    setError('');
    setIsLoading(true);
    try {
      const newStory = await generateStory(childName, character, theme);
      onStoryCreated(newStory);
    } catch (err) {
      setError('A sleepy dragon blocked the story path. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-4">
        <button onClick={onBack} className="flex items-center text-slate-600 hover:text-slate-800 mb-6 transition-colors">
            <ChevronLeftIcon />
            <span className="ml-2">Back to Home</span>
        </button>
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg p-8">
        <h2 className="text-3xl font-bold text-center text-purple-700 mb-2">Create a Magical Story</h2>
        <p className="text-center text-slate-600 mb-8">Add your own ingredients for a unique tale!</p>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="childName" className="block text-sm font-bold text-slate-700 mb-2">Child's Name:</label>
            <input
              id="childName"
              type="text"
              value={childName}
              onChange={(e) => setChildName(e.target.value)}
              placeholder="e.g., Lily"
              className="w-full px-4 py-3 bg-purple-50 rounded-xl border-2 border-transparent focus:border-purple-400 focus:ring-0 transition"
            />
          </div>
          <div>
            <label htmlFor="character" className="block text-sm font-bold text-slate-700 mb-2">Main Character:</label>
            <input
              id="character"
              type="text"
              value={character}
              onChange={(e) => setCharacter(e.target.value)}
              placeholder="e.g., a brave little firefly"
              className="w-full px-4 py-3 bg-purple-50 rounded-xl border-2 border-transparent focus:border-purple-400 focus:ring-0 transition"
            />
          </div>
          <div>
            <label htmlFor="theme" className="block text-sm font-bold text-slate-700 mb-2">Story About:</label>
            <input
              id="theme"
              type="text"
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              placeholder="e.g., finding a hidden treasure"
              className="w-full px-4 py-3 bg-purple-50 rounded-xl border-2 border-transparent focus:border-purple-400 focus:ring-0 transition"
            />
          </div>
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-pink-500 text-white font-bold py-4 px-6 rounded-xl shadow-md hover:bg-pink-600 transition-all transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-pink-300 disabled:bg-slate-400 disabled:cursor-not-allowed"
          >
            {isLoading ? (
                <div className="flex justify-center items-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                    <span>Weaving magic...</span>
                </div>
            ) : "Create Story!"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default StoryCreator;
