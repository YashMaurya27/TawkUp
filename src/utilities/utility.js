import { equalTo, get, orderByChild, query, ref, remove } from "firebase/database";
import { database } from "./firebase";

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

export const fetchNodeIDbyUserId = async (userID, usersRef) => {
  const userQuery = query(usersRef, orderByChild("uid"), equalTo(userID));
  const querySnapshot = await get(userQuery);
  if (querySnapshot.exists()) {
    const userNode = Object.keys(querySnapshot.val())[0];
    return userNode;
  } else {
    return null;
  }
};

export const fetchUserDataByNode = async (userNode) => {
  const userRef = ref(database, `users/${userNode}`);
  const snapshot = await get(userRef);
  const existingData = snapshot.val();
  return existingData;
};

export const fetchChatKey = async (currentUser, receiverId) => {
  let chatExists = false;
  let chatKey = "";
  const chatRef = ref(database, `chats/${currentUser["uid"]}-${receiverId}`);
  const snapshot = await get(chatRef);
  chatExists = snapshot.exists();
  if (chatExists === false) {
    const otherChat = ref(
      database,
      `chats/${receiverId}-${currentUser["uid"]}`
    );
    const otherSnapshot = await get(otherChat);
    chatExists = otherSnapshot.exists();
    if (chatExists === true) {
      chatKey = `chats/${receiverId}-${currentUser["uid"]}`;
    }
  } else {
    chatKey = `chats/${currentUser["uid"]}-${receiverId}`;
  }
  if (chatKey === "") {
    chatKey = `chats/${currentUser["uid"]}-${receiverId}`;
  }
  return chatKey;
};

export const fetchChatData = async (currentUser, receiverID) => {
  const chatKey = await fetchChatKey(currentUser, receiverID);
  const chatRef = ref(database, chatKey);
  const snapshot = await get(chatRef);
  const chatExists = snapshot.exists();
  if (chatExists === true) {
    return Object.values(snapshot.val());
  } else {
    return [];
  }
};

export const logoutHandler = (userId) => {
  const usersRef = ref(database, "active");
  fetchNodeIDbyUserId(userId, usersRef).then((nodeId) => {
    const userRef = ref(database, `active/${nodeId}`);
    remove(userRef);
  });
  sessionStorage.removeItem("user");
};
