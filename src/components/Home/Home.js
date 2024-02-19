import React, { useEffect, useState } from "react";

// FIREBASE IMPORT
import { database } from "../../utilities/firebase";
import { ref, get, onValue } from "firebase/database";

export default function Home() {
  const [users, setUsers] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersRef = ref(database, "users");
        const snapshot = await get(usersRef);
        const usersData = snapshot.val();
        const userArr = Object.keys(usersData).map((userID) => {
          return {
            userID,
            ...usersData[userID],
          };
        });
        setUsers([...userArr]);
      } catch (error) {
        console.error("Error fetching user data:", error.message);
      }
    };

    fetchData();
  }, []);
  return <div>Home</div>;
}
