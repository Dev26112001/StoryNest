import React, { useState, useCallback } from 'react';
import { View, Story, StoryIdea } from './types';
import StoryCreator from './components/StoryCreator';
import StoryPlayer from './components/StoryPlayer';
import HomeScreen from './components/HomeScreen';
import { generateStoryFromIdea } from './services/geminiService';

const App: React.FC = () => {
    const [view, setView] = useState<View>(View.Home);
    const [currentStory, setCurrentStory] = useState<Story | null>(null);
    const [isLoadingStory, setIsLoadingStory] = useState<boolean>(false);

    const handleStartCreating = useCallback(() => {
        setView(View.Creating);
    }, []);

    const handleStoryCreated = useCallback((story: Story) => {
        setCurrentStory(story);
        setView(View.Playing);
    }, []);
    
    const handleSelectIdea = useCallback(async (idea: StoryIdea) => {
        setIsLoadingStory(true);
        try {
            const story = await generateStoryFromIdea(idea.title, idea.premise);
            setCurrentStory(story);
            setView(View.Playing);
        } catch (error) {
            console.error("Failed to generate the full story:", error);
            // In a real app, you might set an error state to show a message.
            setView(View.Home); // Go back home on error
        } finally {
            setIsLoadingStory(false);
        }
    }, []);

    const handleBackToHome = useCallback(() => {
        setCurrentStory(null);
        setView(View.Home);
    }, []);

    const renderContent = () => {
        if (isLoadingStory) {
            return (
                <div className="flex flex-col items-center justify-center text-center p-4">
                    <h2 className="text-3xl font-bold text-purple-700 mb-4">Your Story is Brewing...</h2>
                    <p className="text-slate-600 mb-8">The story fairies are mixing words and magic!</p>
                    <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-pink-500"></div>
                </div>
            )
        }
        
        switch (view) {
            case View.Creating:
                return <StoryCreator onStoryCreated={handleStoryCreated} onBack={handleBackToHome} />;
            case View.Playing:
                return currentStory ? <StoryPlayer story={currentStory} onBack={handleBackToHome} /> : null;
            case View.Home:
            default:
                return <HomeScreen onStartCreating={handleStartCreating} onSelectIdea={handleSelectIdea} />;
        }
    };

    return (
        <main className="min-h-screen w-full bg-gradient-to-b from-purple-100 via-blue-100 to-yellow-100 flex items-center justify-center py-10">
            {renderContent()}
        </main>
    );
};

export default App;
