// Gmail username generation tools
// for demonstration purposes only

// Gmail username character set (periods ignored for uniqueness)
const CHARS = "abcdefghijklmnopqrstuvwxyz0123456789_-";
const CHAR_COUNT = BigInt(CHARS.length); // 39 characters

// Special characters that have restrictions
const SPECIAL_CHARS = "_-";
const ALPHANUMERIC_CHARS = "abcdefghijklmnopqrstuvwxyz0123456789";

// Gmail username validation rules
function isValidGmailUsername(username) {
  if (username.length < 6 || username.length > 30) {
    return false;
  }
  
  // Cannot start or end with special characters
  if (SPECIAL_CHARS.includes(username[0]) || SPECIAL_CHARS.includes(username[username.length - 1])) {
    return false;
  }
  
  // Cannot have consecutive special characters
  for (let i = 0; i < username.length - 1; i++) {
    if (SPECIAL_CHARS.includes(username[i]) && SPECIAL_CHARS.includes(username[i + 1])) {
      return false;
    }
  }
  
  // All characters must be in our allowed set
  for (const char of username) {
    if (!CHARS.includes(char)) {
      return false;
    }
  }
  
  return true;
}

// Calculate the number of valid usernames for each length
const USERNAMES_PER_LENGTH = [];
for (let length = 6; length <= 30; length++) {
  // This is a simplified calculation - in reality, we need to account for
  // the restrictions on start/end characters and consecutive special chars
  // For now, we'll use the full character set and filter during generation
  USERNAMES_PER_LENGTH.push(CHAR_COUNT ** BigInt(length));
}

// Calculate cumulative usernames up to each length
const CUMULATIVE_USERNAMES = [];
let cumulative = 0n;
for (let length = 6; length <= 30; length++) {
  CUMULATIVE_USERNAMES.push(cumulative);
  cumulative += CHAR_COUNT ** BigInt(length);
}

export function indexToUsername(index) {
  if (index < 0n) {
    throw new Error("Index must be non-negative");
  }

  // Find which length this index corresponds to
  let length = 6;
  let startIndex = 0n;

  for (let i = 0; i < USERNAMES_PER_LENGTH.length; i++) {
    const usernamesInThisLength = USERNAMES_PER_LENGTH[i];
    if (index < startIndex + usernamesInThisLength) {
      length = 6 + i;
      break;
    }
    startIndex += usernamesInThisLength;
  }

  if (length > 30) {
    throw new Error("Index out of range");
  }

  // Calculate the position within this length
  const positionInLength = index - startIndex;

  // Convert position to username
  let username = "";
  let remaining = positionInLength;

  for (let i = 0; i < length; i++) {
    const charIndex = Number(remaining % CHAR_COUNT);
    username = CHARS[charIndex] + username;
    remaining = remaining / CHAR_COUNT;
  }

  // Validate the generated username
  if (!isValidGmailUsername(username)) {
    // If invalid, try to find the next valid one
    return findNextValidUsername(index, length);
  }

  return username;
}

function findNextValidUsername(startIndex, targetLength) {
  // Simple fallback: generate a valid username by ensuring proper structure
  let attempts = 0;
  const maxAttempts = 1000;
  
  while (attempts < maxAttempts) {
    const testIndex = startIndex + BigInt(attempts);
    let username = "";
    let remaining = testIndex;
    
    // Generate username with proper structure
    for (let i = 0; i < targetLength; i++) {
      let charIndex;
      
      if (i === 0 || i === targetLength - 1) {
        // First and last characters must be alphanumeric
        charIndex = Number(remaining % BigInt(ALPHANUMERIC_CHARS.length));
        username += ALPHANUMERIC_CHARS[charIndex];
        remaining = remaining / BigInt(ALPHANUMERIC_CHARS.length);
      } else {
        // Middle characters can be any valid character
        charIndex = Number(remaining % CHAR_COUNT);
        username += CHARS[charIndex];
        remaining = remaining / CHAR_COUNT;
      }
    }
    
    if (isValidGmailUsername(username)) {
      return username;
    }
    
    attempts++;
  }
  
  // Fallback to a simple valid username
  return generateSimpleValidUsername(targetLength);
}

function generateSimpleValidUsername(length) {
  let username = "";
  for (let i = 0; i < length; i++) {
    if (i === 0 || i === length - 1) {
      // Start and end with alphanumeric
      username += ALPHANUMERIC_CHARS[Math.floor(Math.random() * ALPHANUMERIC_CHARS.length)];
    } else {
      // Middle can be any valid character
      username += CHARS[Math.floor(Math.random() * CHARS.length)];
    }
  }
  return username;
}

export function usernameToIndex(username) {
  if (!isValidGmailUsername(username)) {
    return null;
  }

  // Calculate the index within this length
  let positionInLength = 0n;
  for (let i = 0; i < username.length; i++) {
    const charIndex = BigInt(CHARS.indexOf(username[i]));
    positionInLength = positionInLength * CHAR_COUNT + charIndex;
  }

  // Add the cumulative usernames from shorter lengths
  const length = username.length;
  const startIndex = CUMULATIVE_USERNAMES[length - 6];

  return startIndex + positionInLength;
}

// Legacy function names for compatibility
export function indexToUUID(index) {
  return indexToUsername(index);
}

export function uuidToIndex(uuid) {
  return usernameToIndex(uuid);
}

// Legacy function names for password compatibility
export function indexToPassword(index) {
  return indexToUsername(index);
}

export function passwordToIndex(password) {
  return usernameToIndex(password);
}
