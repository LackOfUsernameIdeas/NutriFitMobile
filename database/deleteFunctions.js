import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../App";

export const deleteFavouriteMeal = async (userId, meal) => {
  try {
    const userDataDocRef = doc(
      db,
      "additionalData2",
      userId,
      "dataEntries",
      "favouriteMeals"
    );

    // Fetch existing data
    const docSnapshot = await getDoc(userDataDocRef);
    const existingData = docSnapshot.exists() ? docSnapshot.data() : {};

    // Retrieve existing list of favorite meals, if any, and remove the specified meal
    const favouriteMeals = existingData.favouriteMeals || [];
    const updatedMeals = favouriteMeals.filter((favMeal) => favMeal !== meal);

    // Update the document with the modified list of favorite meals
    await setDoc(userDataDocRef, { favouriteMeals: updatedMeals });
  } catch (error) {
    console.error("Error removing favourite meal:", error);
    throw error;
  }
};
