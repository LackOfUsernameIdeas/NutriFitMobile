import React, { Component } from "react";
import { Text, StyleSheet, View, TouchableOpacity } from "react-native";
import { Block } from "galio-framework";

class DailyCalorieRequirements extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedButtonIndex: null
    };
  }

  /**
   * Обработва събитие при кликване върху бутон за калории, като обновява избрания индекс и задава целевите калории и цел.
   * @param {number} index - Индекс на избрания бутон.
   * @param {number} calories - Калории, свързани с избрания бутон.
   * @param {string} goal - Цел, свързана с избрания бутон.
   * @returns {void}
   */
  handleCaloriesButtonClick = (index, calories, goal) => {
    this.setState({ selectedButtonIndex: index });
    this.props.onCaloriesSelect(calories);
    this.props.onGoalSelect(goal);
  };

  render() {
    const { dailyCaloryRequirementsArray, activityLevel } = this.props;

    const selectedLevelData = dailyCaloryRequirementsArray[activityLevel - 1];

    return (
      <View style={styles.container}>
        <Block style={[styles.bmrButton]}>
          <Text style={styles.buttonText}>Базов метаболизъм</Text>
          <Text style={styles.buttonValue}>
            {selectedLevelData?.BMR.toFixed(2) + " kcal"}
          </Text>
        </Block>

        <TouchableOpacity
          style={[
            styles.button,
            this.state.selectedButtonIndex === 1
              ? { borderColor: "#9a99ff", backgroundColor: "#CFD2DB" }
              : null
          ]}
          onPress={() =>
            this.handleCaloriesButtonClick(
              1,
              selectedLevelData?.goals["Mild weight loss"].calory.toFixed(2),
              "mildlose"
            )
          }
        >
          <Text style={styles.buttonText}>Леко сваляне на тегло</Text>
          <Text style={styles.buttonValue}>
            {selectedLevelData?.goals["Mild weight loss"].calory.toFixed(2) +
              " kcal"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.button,
            this.state.selectedButtonIndex === 2
              ? { borderColor: "#9a99ff", backgroundColor: "#CFD2DB" }
              : null
          ]}
          onPress={() =>
            this.handleCaloriesButtonClick(
              2,
              selectedLevelData?.goals["Weight loss"].calory.toFixed(2),
              "weightlose"
            )
          }
        >
          <Text style={styles.buttonText}>Сваляне на тегло</Text>
          <Text style={styles.buttonValue}>
            {selectedLevelData?.goals["Weight loss"].calory.toFixed(2) +
              " kcal"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.button,
            this.state.selectedButtonIndex === 3
              ? { borderColor: "#9a99ff", backgroundColor: "#CFD2DB" }
              : null
          ]}
          onPress={() =>
            this.handleCaloriesButtonClick(
              3,
              selectedLevelData?.goals["Extreme weight loss"].calory.toFixed(2),
              "extremelose"
            )
          }
        >
          <Text style={styles.buttonText}>Екстремно сваляне на тегло</Text>
          <Text style={styles.buttonValue}>
            {selectedLevelData?.goals["Extreme weight loss"].calory.toFixed(2) +
              " kcal"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.button,
            this.state.selectedButtonIndex === 4
              ? { borderColor: "#9a99ff", backgroundColor: "#CFD2DB" }
              : null
          ]}
          onPress={() =>
            this.handleCaloriesButtonClick(
              4,
              selectedLevelData?.goals["maintain weight"].toFixed(2),
              "maintain"
            )
          }
        >
          <Text style={styles.buttonText}>Запазване на тегло</Text>
          <Text style={styles.buttonValue}>
            {selectedLevelData?.goals["maintain weight"].toFixed(2) + " kcal"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.button,
            this.state.selectedButtonIndex === 5
              ? { borderColor: "#9a99ff", backgroundColor: "#CFD2DB" }
              : null
          ]}
          onPress={() =>
            this.handleCaloriesButtonClick(
              5,
              selectedLevelData?.goals["Mild weight gain"].calory.toFixed(2),
              "mildgain"
            )
          }
        >
          <Text style={styles.buttonText}>Леко качване на тегло</Text>
          <Text style={styles.buttonValue}>
            {selectedLevelData?.goals["Mild weight gain"].calory.toFixed(2) +
              " kcal"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.button,
            //styles.weightGainButton,
            this.state.selectedButtonIndex === 6
              ? { borderColor: "#9a99ff", backgroundColor: "#CFD2DB" }
              : null
          ]}
          onPress={() =>
            this.handleCaloriesButtonClick(
              6,
              selectedLevelData?.goals["Weight gain"].calory.toFixed(2),
              "weightgain"
            )
          }
        >
          <Text style={styles.buttonText}>Качване на тегло</Text>
          <Text style={styles.buttonValue}>
            {selectedLevelData?.goals["Weight gain"].calory.toFixed(2) +
              " kcal"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.button,
            // styles.weightGainButton,
            this.state.selectedButtonIndex === 7
              ? { borderColor: "#9a99ff", backgroundColor: "#CFD2DB" }
              : null
          ]}
          onPress={() =>
            this.handleCaloriesButtonClick(
              7,
              selectedLevelData?.goals["Extreme weight gain"].calory.toFixed(2),
              "extremegain"
            )
          }
        >
          <Text style={styles.buttonText}>Екстремно качване на тегло</Text>
          <Text style={styles.buttonValue}>
            {selectedLevelData?.goals["Extreme weight gain"].calory.toFixed(2) +
              " kcal"}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    margin: 8,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center"
  },
  button: {
    width: "45%",
    height: "20%",
    margin: "2.5%",
    padding: 15,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#C5C9D1",
    alignItems: "center",
    backgroundColor: "#FFFFFF"
  },
  buttonText: {
    fontSize: 10,
    fontWeight: "bold",
    textAlign: "center"
  },
  buttonValue: {
    fontSize: 15,
    fontWeight: "bold",
    textAlign: "center"
  },
  bmrButton: {
    width: "45%",
    height: "20%",
    margin: "2.5%",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    backgroundColor: "#FFFFFF"
  },
  weightLossButton: {
    backgroundColor: "#FF9800"
  },
  weightMaintainButton: {
    backgroundColor: "#2196F3"
  },
  weightGainButton: {
    backgroundColor: "#F44336"
  },
  spinnerText: {
    color: "#FFF"
  }
});

export default DailyCalorieRequirements;
