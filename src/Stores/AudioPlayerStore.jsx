import produce from "immer";
import { mountStoreDevtool } from 'simple-zustand-devtools';
import create from "zustand";

const useAudioPlayerStore = create(
  produce((set) => ({
    isPlaying: false,
    setIsPlaying: (value) =>
      set(() => ({
        isPlaying: value,
      })),
    isLoading: true,
    setIsLoading: (value) =>
      set(() => ({
        isLoading: value,
      })),
    isPlayingBroadcast: false,
    setIsPlayingBroadcast: (value) =>
      set(() => ({
        isPlayingBroadcast: value,
      })),
    isLoadingBroadcast: false,
    setIsLoadingBroadcast: (value) =>
      set(() => ({
        isLoadingBroadcast: value,
      })),
    volume: 0.7,
    setVolume: (value) => set(() => ({ volume: value })),
  }))
);

export default useAudioPlayerStore;

if (process.env.NODE_ENV === 'development') {
  mountStoreDevtool('AudioPlayerStore', useAudioPlayerStore);
}
