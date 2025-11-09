
import React, { useState, useRef, useCallback } from 'react';
import { RecordIcon, StopIcon } from './Icons';

interface VoiceRecorderProps {
  onRecordingComplete: (audioUrl: string) => void;
}

const VoiceRecorder: React.FC<VoiceRecorderProps> = ({ onRecordingComplete }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const startRecording = useCallback(async () => {
    setError(null);
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorderRef.current = new MediaRecorder(stream);
        mediaRecorderRef.current.ondataavailable = (event) => {
          audioChunksRef.current.push(event.data);
        };
        mediaRecorderRef.current.onstop = () => {
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          const audioUrl = URL.createObjectURL(audioBlob);
          onRecordingComplete(audioUrl);
          audioChunksRef.current = [];
          stream.getTracks().forEach(track => track.stop());
        };
        audioChunksRef.current = [];
        mediaRecorderRef.current.start();
        setIsRecording(true);
      } catch (err) {
        console.error('Error accessing microphone:', err);
        setError('Microphone access denied. Please allow microphone permissions in your browser settings.');
      }
    } else {
      setError('Audio recording is not supported by your browser.');
    }
  }, [onRecordingComplete]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  }, []);

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-purple-100 rounded-2xl w-full">
      {!isRecording ? (
        <button
          onClick={startRecording}
          className="flex items-center justify-center w-20 h-20 bg-red-500 text-white rounded-full shadow-lg hover:bg-red-600 transition-all transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-red-300"
          aria-label="Start Recording"
        >
          <RecordIcon className="w-10 h-10" />
        </button>
      ) : (
        <button
          onClick={stopRecording}
          className="flex items-center justify-center w-20 h-20 bg-gray-700 text-white rounded-full shadow-lg hover:bg-gray-800 transition-all transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-gray-400"
          aria-label="Stop Recording"
        >
          <StopIcon className="w-10 h-10" />
        </button>
      )}
      <p className="mt-4 text-sm text-slate-600">
        {isRecording ? "Recording your magical voice..." : "Tap the button to start recording"}
      </p>
      {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
    </div>
  );
};

export default VoiceRecorder;
