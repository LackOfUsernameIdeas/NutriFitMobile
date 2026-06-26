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

  handleDietClicked = (diet) => {
    this.setState({ selectedDiet: diet.name }); // Update selectedDiet in state
    this.props.onDietSelect(diet.protein, diet.fat, diet.carbs, diet.name);
    this.showTooltip(diet.name);
  };

  showTooltip = (name) => {
    this.setState({ tooltipVisible: true, tooltipName: name });
  };

  hideTooltip = () => {
    this.setState({ tooltipVisible: false });
  };

  render() {
    const { macroNutrientsArray, activityLevel, selectedGoal } = this.props;

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
              onPressIn={() => this.showTooltip(item.name)}
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
    marginTop: 10,
    marginHorizontal: 20
  },
  rowContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginBottom: 10
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
    paddingHorizontal: 5
  },
  pressedRow: {
    opacity: 0.5
  },
  selectedRow: {
    borderBottomWidth: 3,
    borderBottomColor: "#9a99ff",
    borderColor: "#9a99ff",
    borderWidth: 2,
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
    padding: 10,
    borderRadius: 5,
    alignSelf: "center",
    top: "50%",
    zIndex: 999,
    elevation: 5
  },
  tooltipText: {
    color: "#fff"
  }
});

export default MacroNutrients;
