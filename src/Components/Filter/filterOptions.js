export const genreOptions = [
  { value: "house", label: "House", color: "#00B8D9" },
  { value: "techno", label: "Techno", color: "#0052CC" },
];
export const moodOptions = [
  { value: "mellow", label: "Mellow", color: "#00B8D9" },
  { value: "party", label: "Party", color: "#0052CC" },
  { value: "academic", label: "Academic", color: "#00B8D9" },
  { value: "activism", label: "Activism", color: "#0052CC" },
];

export const tempoOptions = [
  { value: "90bpm", label: "90 BPM", color: "#00B8D9" },
  { value: "100bpm", label: "100 BPM", color: "#0052CC" },
  { value: "110bpm", label: "110 BPM", color: "#00B8D9" },
  { value: "120bpm", label: "120 BPM", color: "#0052CC" },
  { value: "fast", label: "fast", color: "#0052CC" },
  { value: "hyper", label: "hyper", color: "#0052CC" },
];

export const filterOptions = [
  {
    label: "Genre",
    options: genreOptions,
  },
  {
    label: "Mood",
    options: moodOptions,
  },
  {
    label: "Tempo",
    options: tempoOptions,
  },
];
