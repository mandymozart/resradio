export const filter: Filter = {
  genres: [],
  moods: [],
  tempos: [],
  history: [],
  shows: [],
  currentBroadcast: null,
};

export type Filter = {
  genres: string[];
  moods: string[];
  tempos: number[];
  history: BroadcastRefernce[];
  shows: ShowReference[];
  currentBroadcast: BroadcastRefernce | null;
};

export type BroadcastRefernce = {
  prismicId: string;
  title: string;
  show: ShowReference;
  alias: string;
  score: number; // 0-9 (0 didn't like it, 9 loved it)
};

export type ShowReference = {
  prismicId: string;
  name: string;
  alias: string;
  score: number; // 0-9 (0 exclude host, 9 must play)
};
