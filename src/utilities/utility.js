export const trimTitles = (text, length) => {
  let trimmed = text.split(" ");
  if (trimmed.length > length) {
    trimmed = trimmed.splice(0, length).join(" ");
  } else {
    trimmed = trimmed.join(" ");
  }
  return trimmed;
};

export const codeToTitle = (code) => {
  if (code.includes("_")) {
    let wordArr = code.split("_");
    wordArr = wordArr.map((word) => {
      word = word.charAt(0).toLocaleUpperCase() + word.slice(1);
      return word;
    });
    return wordArr.join(" ");
  } else {
    let words = [];
    let currentWord = "";
    for (let char of code) {
      if (char.toUpperCase() === char && currentWord.length > 0) {
        words.push(currentWord);
        currentWord = char;
      } else {
        currentWord += char;
      }
    }
    words.push(currentWord);
    let titleCaseString = words
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
    return titleCaseString;
  }
};

export const convertToJWT = (objectData) => {
  // Header and payload (claims)
  const header = { alg: "HS256", typ: "JWT" };
  const payload = objectData;

  // Combine header and payload and convert to Base64
  const encodedHeader = window.btoa(JSON.stringify(header));
  const encodedPayload = window.btoa(JSON.stringify(payload));

  // Create a signature using a simple secret key
  const signature = window.btoa(
    encodedHeader + "." + encodedPayload + "yourSecretKey"
  );

  // Combine encoded parts to create the JWT
  const jwtToken = encodedHeader + "." + encodedPayload + "." + signature;
  return jwtToken;
};

export const fetchCurrentTime = () => {
  const currentTime = new Date();

  const currentOffset = currentTime.getTimezoneOffset();

  const ISTOffset = 330; // IST offset UTC +5:30

  const ISTTime = new Date(
    currentTime.getTime() + (ISTOffset + currentOffset) * 60000
  );

  let hoursIST = ISTTime.getHours();
  let mode = "am";
  if (hoursIST > 12) {
    hoursIST = hoursIST - 12;
    mode = "pm";
  }
  if (hoursIST === 0) {
    hoursIST = 12;
    mode = "am";
  }
  const minutesIST = ISTTime.getMinutes();
  return hoursIST + ":" + minutesIST + mode;
};
