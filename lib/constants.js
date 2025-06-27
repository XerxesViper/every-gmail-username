// Calculate total number of possible Gmail usernames
// Characters: a-z, 0-9, _, - (periods are ignored for uniqueness)
const CHARS = "abcdefghijklmnopqrstuvwxyz0123456789_-";
const CHAR_COUNT = BigInt(CHARS.length); // 39 characters

// Gmail username rules:
// - Length: 6 to 30 characters
// - Cannot start or end with _, or -
// - Cannot have consecutive _, or - characters
// - Periods are ignored for uniqueness

// Calculate total combinations for usernames 6-30 characters
let totalUsernames = 0n;
for (let length = 6; length <= 30; length++) {
  totalUsernames += CHAR_COUNT ** BigInt(length);
}

export const MAX_USERNAME = totalUsernames;
export const WIDTH_TO_SHOW_DOUBLE_HEIGHT = 768;
export const SCROLLBAR_WIDTH = 24;
export const ITEM_HEIGHT = 28;

export const querySmallScreen = `(max-width: ${WIDTH_TO_SHOW_DOUBLE_HEIGHT}px)`;
export const queryVerySmallScreen = `(max-width: 550px)`;
