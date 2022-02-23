import produce from "immer";
import create from "zustand";

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
