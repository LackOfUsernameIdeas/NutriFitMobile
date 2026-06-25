import { doc, runTransaction, setDoc } from "firebase/firestore";
import { db } from "../App";

export const savePreferences = async (userId, calories, nutrients) => {
  try {
    const newTimestampKey = new Date().toISOString().slice(0, 10);

    const userDataDocRef = doc(
      db,
      "additionalData2",
      userId,
      "dataEntries",
      newTimestampKey
    );

    await runTransaction(db, async (transaction) => {
      const docSnapshot = await transaction.get(userDataDocRef);
      const existingTimestampData = docSnapshot.exists()
        ? docSnapshot.data()
        : {};

      // Merge existing data with new data, preserving existing properties if not present in the new data
      const data = {
        ...existingTimestampData,
        Preferences: {
          Calories:
            calories !== undefined ? calories : existingTimestampData.calories,
          Carbohydrates:
            nutrients.carbs !== undefined
              ? Number(nutrients.carbs)
              : existingTimestampData.nutrients.carbs,
          Fat:
            nutrients.fat !== undefined
              ? Number(nutrients.fat)
              : existingTimestampData.nutrients.fat,
          Diet:
            nutrients.name !== undefined
              ? nutrients.name
              : existingTimestampData.nutrients.name,
          Protein:
            nutrients.protein !== undefined
              ? Number(nutrients.protein)
              : existingTimestampData.nutrients.protein
        }
      };

      // Update the document with the merged data
      transaction.set(userDataDocRef, data);
    });
  } catch (error) {
    console.error("Error saving bmi: ", error);
    throw error;
  }
};

export const saveMealPlan = async (
  userId,
  aiUsed,
  mealPlan,
  mealPlanImages
) => {
  try {
    const newTimestampKey = new Date().toISOString().slice(0, 10);

    const userDataDocRef = doc(
      db,
      "additionalData2",
      userId,
      "dataEntries",
      newTimestampKey
    );

    await runTransaction(db, async (transaction) => {
      const docSnapshot = await transaction.get(userDataDocRef);
      const existingTimestampData = docSnapshot.exists()
        ? docSnapshot.data()
        : {};

      // Merge existing data with new data, preserving existing properties if not present in the new data
      const data = {
        ...existingTimestampData,
        [aiUsed]: {
          ...(existingTimestampData[aiUsed] || {}), // Spread existing data for aiUsed if available
          ...Object.keys(mealPlan)
            .filter((mealType) => mealType !== "totals") // Filter out "totals" meal type
            .reduce((acc, mealType) => {
              acc[mealType] = Object.keys(mealPlan[mealType]).reduce(
                (mealAcc, course) => {
                  mealAcc[course] = {
                    ...mealPlan[mealType][course],
                    image: mealPlanImages[mealType]?.[course] || "" // Get the relevant image URL from mealPlanImages
                  };
                  return mealAcc;
                },
                {}
              );
              return acc;
            }, {})
        }
      };

      // Update the document with the merged data
      transaction.set(userDataDocRef, data);
    });
  } catch (error) {
    console.error("Error saving meal plan:", error);
    throw error;
  }
};

export const saveDeviations = async (userId, aiUsed, deviations) => {
  try {
    const newTimestampKey = new Date().toISOString().slice(0, 10);

    const userDataDocRef = doc(
      db,
      "additionalData2",
      userId,
      "dataEntries",
      newTimestampKey
    );

    await runTransaction(db, async (transaction) => {
      const docSnapshot = await transaction.get(userDataDocRef);
      const existingTimestampData = docSnapshot.exists()
        ? docSnapshot.data()
        : {};

      // Merge existing deviations with new deviations using deep merge
      const mergedDeviations = {
        ...(existingTimestampData[aiUsed] || {}), // Existing deviations if any
        deviations: deviations // New deviations
      };

      // Merge existing data with new data, preserving existing properties if not present in the new data
      const data = {
        ...existingTimestampData,
        [aiUsed]: {
          ...mergedDeviations
        }
      };

      // Update the document with the merged data
      transaction.set(userDataDocRef, data);
    });
  } catch (error) {
    console.error("Error saving deviations:", error);
    throw error;
  }
};

// Save a favorite meal
export const saveFavouriteMeal = async (userId, meal) => {
  try {
    const userDataDocRef = doc(
      db,
      "additionalData2",
      userId,
      "dataEntries",
      "favouriteMeals"
    );

    await runTransaction(db, async (transaction) => {
      const docSnapshot = await transaction.get(userDataDocRef);
      const existingData = docSnapshot.exists() ? docSnapshot.data() : {};

      // Retrieve the existing list of favorite meals, or start with an empty array if none exist
      const favouriteMeals = existingData.favouriteMeals || [];

      // Check if the meal is already in the favorites to avoid duplicates
      if (!favouriteMeals.includes(meal)) {
        favouriteMeals.push(meal); // Add the new meal to the list
      }

      // Update the document with the modified list of favorite meals
      transaction.set(userDataDocRef, { favouriteMeals });
    });
  } catch (error) {
    console.error("Error saving favourite meal:", error);
    throw error;
  }
};
