import React, { Component } from "react";
import { Text, StyleSheet, View, Pressable } from "react-native";
import InfoBoxMacroNutrients from "../components/InfoBoxMacroNutrients";

class MacroNutrients extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tooltipVisible: false,
      tooltipName: "",
      selectedDiet: null
    };
  }

  /**
   * Обработва клик върху диета, като задава избраната диета и показва tooltip със съответната информация.
   * @param {Object} diet - Обект, съдържащ информация за избраната диета.
   */
  handleDietClicked = (diet) => {
    this.setState({ selectedDiet: diet.name });
    this.props.onDietSelect(diet.protein, diet.fat, diet.carbs, diet.name);
    this.showTooltip(diet);
  };

  /**
   * Показва tooltip с информация за конкретния избор на диета.
   * @param {Object} item - Обект, съдържащ данни за името на диетата и стойностите на макронутриентите.
   */
  showTooltip = (item) => {
    this.setState({
      tooltipVisible: true,
      tooltipName: `${item.name} - протеин: ${item.protein}, мазнини: ${item.fat}, въглехидрати: ${item.carbs}`
    });
  };

  /**
   * Скрива tooltip-а.
   */
  hideTooltip = () => {
    this.setState({ tooltipVisible: false });
  };

  render() {
    const { macroNutrientsArray, activityLevel, selectedGoal } = this.props;

    /** Съхранява данни за таблицата с макронутриенти на базата на избрания активност и цел. */
    let tableData = [];
    if (macroNutrientsArray[activityLevel - 1]) {
      macroNutrientsArray[activityLevel - 1].goals.forEach((item) => {
        const { goal, balanced, highprotein, lowcarbs, lowfat } = item;

        if (goal === selectedGoal) {
          const savedData = [
            {
              name: "Балансирана",
              protein: balanced.protein.toFixed(2),
              fat: balanced.fat.toFixed(2),
              carbs: balanced.carbs.toFixed(2)
            },
            {
              name: "Ниско съдържание на мазнини",
              protein: lowfat.protein.toFixed(2),
              fat: lowfat.fat.toFixed(2),
              carbs: lowfat.carbs.toFixed(2)
            },
            {
              name: "Ниско съдържание на въглехидрати",
              protein: lowcarbs.protein.toFixed(2),
              fat: lowcarbs.fat.toFixed(2),
              carbs: lowcarbs.carbs.toFixed(2)
            },
            {
              name: "Високо съдържание на протеин",
              protein: highprotein.protein.toFixed(2),
              fat: highprotein.fat.toFixed(2),
              carbs: highprotein.carbs.toFixed(2)
            }
          ];

          tableData = savedData;
        }
      });
    }

    return (
      <View style={styles.container}>
        <View style={styles.rowContainer}>
          <Text style={styles.header}>Изберете тип диета:</Text>
          <InfoBoxMacroNutrients title="Видове диети" isForMacroNutrients />
        </View>
        <View style={styles.table}>
          {tableData.map((item, index) => (
            <Pressable
              key={index}
              style={({ pressed }) => [
                styles.row,
                pressed && styles.pressedRow,
                this.state.selectedDiet === item.name && styles.selectedRow // Apply selectedRow style when selectedDiet matches
              ]}
              onPress={() => this.handleDietClicked(item)}
              onPressIn={() => this.showTooltip(item)}
              onPressOut={this.hideTooltip}
              delayLongPress={1000}
            >
              <Text style={[styles.cell, styles.nameCell]} numberOfLines={1}>
                {item.name}
              </Text>
              <Text style={styles.cell}>{item.protein}</Text>
              <Text style={styles.cell}>{item.fat}</Text>
              <Text style={styles.cell}>{item.carbs}</Text>
            </Pressable>
          ))}
        </View>
        {this.state.tooltipVisible && (
          <View style={styles.tooltip}>
            <Text style={styles.tooltipText}>{this.state.tooltipName}</Text>
          </View>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 18,
    flex: 1,
    marginTop: 10,
    marginHorizontal: 20
  },
  rowContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10
  },
  table: {
    borderWidth: 1,
    borderColor: "black",
    flexDirection: "column"
  },
  row: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "black",
    paddingVertical: 10,
    paddingHorizontal: 5,
    borderColor: "black",
    borderWidth: 1
  },
  pressedRow: {
    opacity: 0.5
  },
  selectedRow: {
    borderBottomWidth: 3,
    borderBottomColor: "#9a99ff",
    borderColor: "#9a99ff",
    backgroundColor: "#CFD2DB"
  },
  cell: {
    flex: 1
  },
  nameCell: {
    flex: 2
  },
  tooltip: {
    position: "absolute",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    padding: 15,
    borderRadius: 10,
    alignSelf: "center",
    top: "50%",
    zIndex: 999,
    elevation: 5
  },
  tooltipText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold"
  }
});

export default MacroNutrients;
