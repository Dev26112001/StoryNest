export enum View {
  Home,
  Creating,
  Playing,
}

export interface Story {
  title: string;
  text: string;
}

export interface StoryIdea {
  title: string;
  premise: string;
}

export interface VoiceOption {
  name: string;
  value: string; // The voice name for the API
}