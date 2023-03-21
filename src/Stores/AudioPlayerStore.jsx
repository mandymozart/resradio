import produce from "immer";
import create from "zustand";
import { mountStoreDevtool } from 'simple-zustand-devtools';

const useAudioPlayerStore = create(
  produce((set) => ({
    isPlaying: false,
    setIsPlaying: (value) =>
      set(() => ({
        isPlaying: value,
      })),
    isLoading: false,
    setIsLoading: (value) =>
      set(() => ({
        isLoading: value,
      })),
  }))
);

export default useAudioPlayerStore;

if (process.env.NODE_ENV === 'development') {
  mountStoreDevtool('AudioPlayerStore', useAudioPlayerStore);
}
