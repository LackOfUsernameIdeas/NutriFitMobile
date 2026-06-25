import { doc, getDoc, collection, onSnapshot } from "firebase/firestore";
import { db } from "../App";

export const fetchAdditionalUserData = async (
  userId,
  onDataSaved = () => {}
) => {
  let userDocData = null;

  try {
    const userDataDocRef = doc(db, "additionalData2", userId);
    const userDataSnapshot = await getDoc(userDataDocRef);

    if (userDataSnapshot.exists()) {
      const userData = userDataSnapshot.data();

      // Extract properties directly from the userData
      const { gender, goal } = userData || {};
      const subcollectionRef = collection(userDataDocRef, "dataEntries");
      const userDocKey = new Date().toISOString().slice(0, 10);

      // Reference the document inside the subcollection using the key
      const userDocRef = doc(subcollectionRef, userDocKey);

      // Listen for real-time updates on the user document
      const unsubscribeUserDoc = onSnapshot(userDocRef, (docSnapshot) => {
        userDocData = docSnapshot.exists() ? docSnapshot.data() : null;

        // Update userDocData state variable
        // Trigger the callback if provided
        const isDataSavedForToday = userDocData !== null;
        if (isDataSavedForToday) {
          onDataSaved();
        }
      });

      // Fetch additional documents in the subcollection
      const macroNutrientsData = [];
      const dailyCaloryRequirements = [];

      const unsubscribeMacroNutrients = onSnapshot(
        subcollectionRef,
        (querySnapshot) => {
          querySnapshot.forEach((doc) => {
            const data = doc.data();
            const docName = doc.id;

            // Assuming the documents are named as 'macroNutrientsData_*' and 'dailyCaloryRequirements_*'
            if (docName.startsWith("macroNutrientsData")) {
              macroNutrientsData.push(data);
            } else if (docName.startsWith("dailyCaloryRequirements")) {
              dailyCaloryRequirements.push(data);
            }
          });
        }
      );

      // Return the combined data
      console.log("THIS SHIT RIGHT HERE FAM -->", {
        gender,
        goal,
        [userDocKey]: userDocData,
        macroNutrientsData,
        dailyCaloryRequirements
      });
      return {
        gender,
        goal,
        macroNutrientsData,
        dailyCaloryRequirements,
        [userDocKey]: userDocData
      };
    } else {
      // User data not found
      return null;
    }
  } catch (error) {
    console.error("Error getting additional user data:", error);
    throw error; // Propagate the error to the calling code if needed
  }
};

export const fetchFavouriteMealsForUser = async (userId) => {
  try {
    const userDocRef = doc(
      db,
      "additionalData2",
      userId,
      "dataEntries",
      "favouriteMeals"
    );
    const docSnapshot = await getDoc(userDocRef);

    if (docSnapshot.exists()) {
      const data = docSnapshot.data();
      return data.favouriteMeals || []; // Return the favorite meals array if it exists
    }
    return []; // Return empty array if no favorite meals
  } catch (error) {
    console.error("Error fetching favourite meals:", error);
    throw error;
  }
};
