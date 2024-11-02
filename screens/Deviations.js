import React from "react";
import { StyleSheet, View } from "react-native";
import { Text } from "galio-framework";
import { getAuth } from "firebase/auth";
import { Card } from "../components";
import { saveDeviations } from "../database/setFunctions";

//Главен компонент
class Deviations extends React.Component {
  constructor(props) {
    super(props);
  }

  async componentDidMount() {
    const { mealPlan, userPreferences, isPlanGeneratedWithOpenAI } = this.props;

    // Калкулираме общи стойности
    const calculatedTotals = this.calculateMealTotals(mealPlan);

    // Калкулираме отклоненията
    const deviationsSavable = {
      calories: {
        deviation: calculatedTotals.calories - userPreferences.Calories,
        deviationPercentage:
          (
            ((calculatedTotals.calories - userPreferences.Calories) /
              userPreferences.Calories) *
            100
          ).toFixed(2) + "%",
        userLimit: userPreferences.Calories
      },
      protein: {
        deviation: calculatedTotals.protein - userPreferences.Protein,
        deviationPercentage:
          (
            ((calculatedTotals.protein - userPreferences.Protein) /
              userPreferences.Protein) *
            100
          ).toFixed(2) + "%",
        userLimit: userPreferences.Protein
      },
      carbohydrates: {
        deviation:
          calculatedTotals.carbohydrates - userPreferences.Carbohydrates,
        deviationPercentage:
          (
            ((calculatedTotals.carbohydrates - userPreferences.Carbohydrates) /
              userPreferences.Carbohydrates) *
            100
          ).toFixed(2) + "%",
        userLimit: userPreferences.Carbohydrates
      },
      fat: {
        deviation: calculatedTotals.fat - userPreferences.Fat,
        deviationPercentage:
          (
            ((calculatedTotals.fat - userPreferences.Fat) /
              userPreferences.Fat) *
            100
          ).toFixed(2) + "%",
        userLimit: userPreferences.Fat
      }
    };

    // Запазваме отклоненията
    try {
      const uid = getAuth().currentUser.uid;
      await saveDeviations(
        uid,
        isPlanGeneratedWithOpenAI ? "mealPlanOpenAI" : "mealPlanGemini",
        deviationsSavable
      );
    } catch (error) {
      console.error("Error saving deviations:", error);
    }
  }

  /**
   * Изчислява общите стойности на калории, протеини, мазнини и въглехидрати в плана за хранене.
   * @param {Object} mealPlan - Обект, съдържащ различни ястия с хранителна информация за всяко.
   * @returns {Object} Обект със стойности за общите калории, протеини, мазнини и въглехидрати.
   */
  calculateMealTotals = (mealPlan) => {
    const totals = {
      calories: 0,
      protein: 0,
      fat: 0,
      carbohydrates: 0
    };

    Object.entries(mealPlan).forEach(([mealType, meal]) => {
      if (mealType !== "totals") {
        Object.values(meal).forEach((foodItem) => {
          if (foodItem && foodItem.totals) {
            totals.calories += foodItem.totals.calories || 0;
            totals.protein += foodItem.totals.protein || 0;
            totals.fat += foodItem.totals.fat || 0;
            totals.carbohydrates += foodItem.totals.carbohydrates || 0;
          }
        });
      }
    });

    return totals;
  };
  render() {
    const { mealPlan, userPreferences, isPlanGeneratedWithOpenAI } = this.props;

    const calculatedTotals = this.calculateMealTotals(mealPlan);

    return (
      <View style={styles.container}>
        <Card>
          <Text style={styles.title}>
            Сумирани калории: {calculatedTotals.calories.toFixed(2)}
          </Text>
          {calculatedTotals.calories - userPreferences.Calories !== 0 ? (
            <View style={styles.deviationContainer}>
              <Text style={styles.deviationText}>
                Отклонение на {isPlanGeneratedWithOpenAI ? "OpenAI" : "Gemini"}{" "}
                в цифри:
              </Text>
              <Text style={styles.deviationValue}>
                (
                {calculatedTotals.calories - userPreferences.Calories > 0 &&
                  "+"}
                {(calculatedTotals.calories - userPreferences.Calories).toFixed(
                  2
                )}
                )
              </Text>
              <Text style={styles.deviationText}>
                Процент на отклонение на{" "}
                {isPlanGeneratedWithOpenAI ? "OpenAI" : "Gemini"}:
              </Text>
              <Text style={styles.deviationValue}>
                (
                {calculatedTotals.calories - userPreferences.Calories > 0 &&
                  "+"}
                {(
                  ((calculatedTotals.calories - userPreferences.Calories) /
                    userPreferences.Calories) *
                  100
                ).toFixed(2)}
                %)
              </Text>
            </View>
          ) : (
            <Text style={styles.noDeviationText}>
              Няма отклонение от страна на{" "}
              {isPlanGeneratedWithOpenAI ? "OpenAI" : "Gemini"}!
            </Text>
          )}
        </Card>
        <Card>
          <Text style={styles.title}>
            Сумиран протеин: {calculatedTotals.protein.toFixed(2)}
          </Text>
          {calculatedTotals.protein - userPreferences.Protein !== 0 ? (
            <View style={styles.deviationContainer}>
              <Text style={styles.deviationText}>
                Отклонение на {isPlanGeneratedWithOpenAI ? "OpenAI" : "Gemini"}{" "}
                в цифри:
              </Text>
              <Text style={styles.deviationValue}>
                ({calculatedTotals.protein - userPreferences.Protein > 0 && "+"}
                {(calculatedTotals.protein - userPreferences.Protein).toFixed(
                  2
                )}
                )
              </Text>
              <Text style={styles.deviationText}>
                Процент на отклонение на{" "}
                {isPlanGeneratedWithOpenAI ? "OpenAI" : "Gemini"}:
              </Text>
              <Text style={styles.deviationValue}>
                ({calculatedTotals.protein - userPreferences.Protein > 0 && "+"}
                {(
                  ((calculatedTotals.protein - userPreferences.Protein) /
                    userPreferences.Protein) *
                  100
                ).toFixed(2)}
                %)
              </Text>
            </View>
          ) : (
            <Text style={styles.noDeviationText}>
              Няма отклонение от страна на{" "}
              {isPlanGeneratedWithOpenAI ? "OpenAI" : "Gemini"}!
            </Text>
          )}
        </Card>
        <Card>
          <Text style={styles.title}>
            Сумирани въглехидрати: {calculatedTotals.carbohydrates.toFixed(2)}
          </Text>
          {calculatedTotals.carbohydrates - userPreferences.Carbohydrates !==
          0 ? (
            <View style={styles.deviationContainer}>
              <Text style={styles.deviationText}>
                Отклонение на {isPlanGeneratedWithOpenAI ? "OpenAI" : "Gemini"}{" "}
                в цифри:
              </Text>
              <Text style={styles.deviationValue}>
                (
                {calculatedTotals.carbohydrates -
                  userPreferences.Carbohydrates >
                  0 && "+"}
                {(
                  calculatedTotals.carbohydrates - userPreferences.Carbohydrates
                ).toFixed(2)}
                )
              </Text>
              <Text style={styles.deviationText}>
                Процент на отклонение на{" "}
                {isPlanGeneratedWithOpenAI ? "OpenAI" : "Gemini"}:
              </Text>
              <Text style={styles.deviationValue}>
                (
                {calculatedTotals.carbohydrates -
                  userPreferences.Carbohydrates >
                  0 && "+"}
                {(
                  ((calculatedTotals.carbohydrates -
                    userPreferences.Carbohydrates) /
                    userPreferences.Carbohydrates) *
                  100
                ).toFixed(2)}
                %)
              </Text>
            </View>
          ) : (
            <Text style={styles.noDeviationText}>
              Няма отклонение от страна на{" "}
              {isPlanGeneratedWithOpenAI ? "OpenAI" : "Gemini"}!
            </Text>
          )}
        </Card>
        <Card>
          <Text style={styles.title}>
            Сумирани мазнини: {calculatedTotals.fat.toFixed(2)}
          </Text>
          {calculatedTotals.fat - userPreferences.Fat !== 0 ? (
            <View style={styles.deviationContainer}>
              <Text style={styles.deviationText}>
                Отклонение на {isPlanGeneratedWithOpenAI ? "OpenAI" : "Gemini"}{" "}
                в цифри:
              </Text>
              <Text style={styles.deviationValue}>
                ({calculatedTotals.fat - userPreferences.Fat > 0 && "+"}
                {(calculatedTotals.fat - userPreferences.Fat).toFixed(2)})
              </Text>
              <Text style={styles.deviationText}>
                Процент на отклонение на{" "}
                {isPlanGeneratedWithOpenAI ? "OpenAI" : "Gemini"}:
              </Text>
              <Text style={styles.deviationValue}>
                ({calculatedTotals.fat - userPreferences.Fat > 0 && "+"}
                {(
                  ((calculatedTotals.fat - userPreferences.Fat) /
                    userPreferences.Fat) *
                  100
                ).toFixed(2)}
                %)
              </Text>
            </View>
          ) : (
            <Text style={styles.noDeviationText}>
              Няма отклонение от страна на{" "}
              {isPlanGeneratedWithOpenAI ? "OpenAI" : "Gemini"}!
            </Text>
          )}
        </Card>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    justifyContent: "space-between",
    marginHorizontal: -5,
    marginTop: -20
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
    marginTop: 10
  },
  deviationContainer: {
    marginTop: 10
  },
  deviationText: {
    fontSize: 14,
    textAlign: "center"
  },
  deviationValue: {
    fontSize: 14,
    color: "rgba(67, 24, 255, 1)",
    textAlign: "center",
    marginBottom: 10
  },
  noDeviationText: {
    fontSize: 14,
    color: "#03AC13",
    marginTop: 10,
    textAlign: "center",
    marginBottom: 10
  }
});

export default Deviations;
