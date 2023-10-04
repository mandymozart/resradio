export const STREAM_URL = "https://edge.mixlr.com/channel/zwtuo";
export const OFFLINE_URL = "/resradio-signatur.mp3";

export const ABLY_ROTATION_CHANNEL = "rotation";
export const ABLY_REMOTE_CHANNEL = "remote";
export const ABLY_CHAT_CHANNEL = "chat";

// Netlify environment variables for forwarding
// Currently only two environments are configured, due to the limitations of the free account tier
export const ABLY_KEY = process.env.REACT_APP_ABLY_API_KEY;
export const NETLIFY_IDENTITY_PROVIDER = process.env.REACT_APP_NETLIFY_IDENTITY_PROVIDER;

export const BREAKPOINT_L = 1279;
export const BREAKPOINT_MD = 769;
export const BREAKPOINT_XS = 481;

export const ITEMS_PER_PAGE = 8;
export const RECENT_SHOWS_END_AFTER = 100;
export const RECENT_SHOWS_BEGIN_BEFORE = 1;
export const RECENT_BROADCASTS_END_AFTER = 100;
export const RECENT_BROADCASTS_BEGIN_BEFORE = 14;
const hour = 3600;
export const BROADCAST_MIN_ALLOWED_DURATION = hour * .5; // Minimum amount of seconds a broadcast can have in order to be recognized eligable for the platform
export const BROADCAST_MAX_ALLOWED_DURATIONp = hour * 12; // Maximum amount of seconds a broadcast can have in order to be recognized eligable for the platform

export const CDN_URL = "https://res-audio.viennastruggle.at";

export const FUNCTIONS = "/.netlify/functions";

export const DATE_FORMAT = "D.M.YYYY";
export const DATE_FORMAT_LONG = "ddd D.M.YYYY";