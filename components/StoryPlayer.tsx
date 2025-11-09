
import React, { useState, useCallback, useRef, useEffect } from 'react';
import type { Story } from '../types';
import { VOICE_OPTIONS } from '../constants';
import { generateSpeech } from '../services/geminiService';
import { decode, decodeAudioData } from '../utils/audioUtils';
import VoiceRecorder from './VoiceRecorder';
import { ChevronLeftIcon, PauseIcon, PlayIcon, SpeakerIcon, MicrophoneIcon } from './Icons';

interface StoryPlayerProps {
  story: Story;
  onBack: () => void;
}

const StoryPlayer: React.FC<StoryPlayerProps> = ({ story, onBack }) => {
  const [audioMode, setAudioMode] = useState<'tts' | 'record' | null>(null);
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recordedAudioUrl, setRecordedAudioUrl] = useState<string | null>(null);

  const audioContextRef = useRef<AudioContext | null>(null);
  const audioBufferRef = useRef<AudioBuffer | null>(null);
  const audioSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const recordedAudioRef = useRef<HTMLAudioElement | null>(null);
  
  useEffect(() => {
    // Initialize AudioContext
    if (!audioContextRef.current) {
        // @ts-ignore
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if(AudioContext) {
            audioContextRef.current = new AudioContext({ sampleRate: 24000 });
        } else {
            setError("Your browser doesn't support the Web Audio API.");
        }
    }

    // Cleanup audio on component unmount
    return () => {
      stopPlayback();
      audioContextRef.current?.close();
    };
  }, []);

  const stopPlayback = () => {
      if (audioSourceRef.current) {
        audioSourceRef.current.stop();
        audioSourceRef.current.disconnect();
        audioSourceRef.current = null;
      }
      if(recordedAudioRef.current){
        recordedAudioRef.current.pause();
        recordedAudioRef.current.currentTime = 0;
      }
      setIsPlaying(false);
  };
  
  const handleTTSSelection = useCallback(async (voice: string) => {
    stopPlayback();
    setRecordedAudioUrl(null);
    setIsLoadingAudio(true);
    setError(null);
    try {
      const base64Audio = await generateSpeech(story.text, voice);
      if (audioContextRef.current) {
        const audioBytes = decode(base64Audio);
        const buffer = await decodeAudioData(audioBytes, audioContextRef.current, 24000, 1);
        audioBufferRef.current = buffer;
      }
    } catch (err) {
      console.error("Error generating speech:", err);
      setError("Could not generate audio. Please try another voice or try again later.");
    } finally {
      setIsLoadingAudio(false);
    }
  }, [story.text]);

  const togglePlayback = () => {
    if (isPlaying) {
      stopPlayback();
    } else {
      if (recordedAudioUrl && recordedAudioRef.current) {
          recordedAudioRef.current.play();
          setIsPlaying(true);
      } else if (audioBufferRef.current && audioContextRef.current) {
        const source = audioContextRef.current.createBufferSource();
        source.buffer = audioBufferRef.current;
        source.connect(audioContextRef.current.destination);
        source.start();
        source.onended = () => setIsPlaying(false);
        audioSourceRef.current = source;
        setIsPlaying(true);
      }
    }
  };
  
  const handleRecordingComplete = (audioUrl: string) => {
      stopPlayback();
      audioBufferRef.current = null;
      setRecordedAudioUrl(audioUrl);
      setAudioMode(null);
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4 animate-fade-in">
       <button onClick={onBack} className="flex items-center text-slate-600 hover:text-slate-800 mb-4 transition-colors">
            <ChevronLeftIcon />
            <span className="ml-2">Back</span>
        </button>
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg p-6 md:p-10">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-purple-700 mb-6">{story.title}</h2>
        
        <div className="max-h-60 overflow-y-auto p-4 bg-purple-50/50 rounded-xl mb-6">
            <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">{story.text}</p>
        </div>

        <div className="flex items-center justify-center space-x-4 mb-6">
            {(audioBufferRef.current || recordedAudioUrl) && (
                <button onClick={togglePlayback} className="flex items-center justify-center w-16 h-16 bg-pink-500 text-white rounded-full shadow-lg hover:bg-pink-600 transition-all transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-pink-300">
                    {isPlaying ? <PauseIcon className="w-8 h-8"/> : <PlayIcon className="w-8 h-8"/>}
                </button>
            )}
            {isLoadingAudio && (
                 <div className="flex items-center justify-center w-16 h-16 bg-slate-200 rounded-full shadow-lg">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
                </div>
            )}
        </div>
        {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}
        
        <div className="space-y-6">
            <div>
                 <button onClick={() => setAudioMode(audioMode === 'tts' ? null : 'tts')} className="flex items-center justify-between w-full p-3 bg-purple-100 rounded-lg text-left text-purple-800 font-bold">
                    <span>Listen with an AI Voice</span>
                    <SpeakerIcon />
                 </button>
                 {audioMode === 'tts' && (
                     <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 p-4 bg-purple-50 rounded-b-lg">
                        {VOICE_OPTIONS.map(voice => (
                            <button key={voice.value} onClick={() => handleTTSSelection(voice.value)} className="p-2 text-sm text-center bg-white rounded-md shadow-sm hover:bg-purple-200 transition-colors">{voice.name}</button>
                        ))}
                     </div>
                 )}
            </div>
             <div>
                <button onClick={() => setAudioMode(audioMode === 'record' ? null : 'record')} className="flex items-center justify-between w-full p-3 bg-blue-100 rounded-lg text-left text-blue-800 font-bold">
                    <span>Record Your Own Voice</span>
                    <MicrophoneIcon />
                 </button>
                 {audioMode === 'record' && (
                     <div className="p-4 bg-blue-50 rounded-b-lg">
                        <VoiceRecorder onRecordingComplete={handleRecordingComplete} />
                     </div>
                 )}
            </div>
        </div>
        
      </div>
      {recordedAudioUrl && <audio ref={recordedAudioRef} src={recordedAudioUrl} onEnded={() => setIsPlaying(false)} hidden />}
    </div>
  );
};

export default StoryPlayer;
