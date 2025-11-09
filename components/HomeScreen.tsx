import React, { useState, useEffect, useCallback } from 'react';
import type { StoryIdea } from '../types';
import { generateStoryIdeas } from '../services/geminiService';
import { MagicWandIcon, RefreshCwIcon, PlusIcon } from './Icons';

interface HomeScreenProps {
    onStartCreating: () => void;
    onSelectIdea: (idea: StoryIdea) => void;
}

const StoryIdeaCard: React.FC<{idea: StoryIdea, onClick: () => void}> = ({ idea, onClick }) => (
    <div 
        onClick={onClick} 
        className="bg-white/60 p-6 rounded-2xl shadow-md hover:shadow-xl hover:scale-105 transition-all cursor-pointer text-left"
    >
        <h4 className="font-bold text-purple-700 text-lg">{idea.title}</h4>
        <p className="text-slate-600 text-sm mt-2">{idea.premise}</p>
    </div>
);

const SkeletonCard: React.FC = () => (
     <div className="bg-white/50 p-6 rounded-2xl shadow-md">
        <div className="h-5 bg-slate-200 rounded w-3/4 mb-3 animate-pulse"></div>
        <div className="h-4 bg-slate-200 rounded w-full animate-pulse"></div>
        <div className="h-4 bg-slate-200 rounded w-5/6 mt-1 animate-pulse"></div>
    </div>
)

const HomeScreen: React.FC<HomeScreenProps> = ({ onStartCreating, onSelectIdea }) => {
    const [ideas, setIdeas] = useState<StoryIdea[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isAppending, setIsAppending] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchIdeas = useCallback(async (replace = false) => {
        setError(null);
        if (replace) {
            setIsLoading(true);
            setIdeas([]);
        } else {
            setIsAppending(true);
        }

        try {
            const newIdeas = await generateStoryIdeas();
            if (replace) {
                setIdeas(newIdeas);
            } else {
                setIdeas(prevIdeas => [...prevIdeas, ...newIdeas]);
            }
        } catch (err) {
            setError("The story fairies are sleeping! Couldn't fetch new ideas.");
            console.error(err);
        } finally {
            setIsLoading(false);
            setIsAppending(false);
        }
    }, []);

    useEffect(() => {
        fetchIdeas(true);
    }, [fetchIdeas]);

    return (
        <div className="text-center p-4 w-full max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold text-purple-800 mb-4">
                Welcome to <span className="text-pink-500">StoryNest</span>
            </h1>
            <p className="text-slate-600 max-w-2xl mx-auto mb-12 text-lg">
                Your magical corner for wonderful bedtime stories. Create your own or discover a new adventure below.
            </p>
            <div className="flex flex-col md:flex-row items-center justify-center gap-6 mb-16">
                <button
                    onClick={onStartCreating}
                    className="flex items-center justify-center w-full md:w-auto bg-pink-500 text-white font-bold py-4 px-8 rounded-full shadow-lg hover:bg-pink-600 transition-all transform hover:scale-105"
                >
                    <MagicWandIcon className="mr-3" />
                    Create a Custom Story
                </button>
            </div>

            <div className="mt-8">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-2xl font-bold text-slate-700">Discover a Story</h3>
                    <button onClick={() => fetchIdeas(true)} disabled={isLoading || isAppending} title="Get a fresh list of ideas" className="flex items-center text-purple-600 hover:text-purple-800 transition-colors disabled:text-slate-400 disabled:cursor-wait p-2 rounded-full hover:bg-purple-100">
                        <RefreshCwIcon className="w-5 h-5" isSpinning={isLoading} />
                    </button>
                </div>
                 {error && <p className="text-red-500 text-center mb-4">{error}</p>}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                   {isLoading 
                        ? Array.from({ length: 18 }).map((_, index) => <SkeletonCard key={index} />)
                        : ideas.map((idea, index) => (
                            <StoryIdeaCard key={`${idea.title}-${index}`} idea={idea} onClick={() => onSelectIdea(idea)} />
                        ))
                   }
                </div>

                {!isLoading && (
                    <div className="mt-8 text-center">
                        <button
                            onClick={() => fetchIdeas(false)}
                            disabled={isAppending}
                            className="flex items-center justify-center w-full md:w-auto mx-auto bg-purple-500 text-white font-bold py-3 px-6 rounded-full shadow-lg hover:bg-purple-600 transition-all transform hover:scale-105 disabled:bg-slate-400 disabled:cursor-wait"
                        >
                            {isAppending ? (
                                <>
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                                    <span>Loading...</span>
                                </>
                            ) : (
                                <>
                                    <PlusIcon className="w-5 h-5 mr-2" />
                                    <span>Load More Stories</span>
                                </>
                            )}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default HomeScreen;