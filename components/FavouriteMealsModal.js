import React from "react";
import {
  Modal,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  View,
  Text,
  ScrollView,
  Animated
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Block } from "galio-framework";
import { getAuth } from "firebase/auth";
import { saveFavouriteMeal } from "../database/setFunctions";
import { deleteFavouriteMeal } from "../database/deleteFunctions";

class FavoriteMealsModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      favouriteMeals: this.props.favouriteMeals
        ? this.props.favouriteMeals.split(", ").map((meal) => ({
            name: meal,
            liked: true,
            scaleAnim: new Animated.Value(1) // Add scale animation value for each meal
          }))
        : []
    };
  }

  handleFavouriteToggle = async (mealName) => {
    const userId = getAuth().currentUser?.uid;
    if (!userId) return;

    // Find the meal and update its liked state and animate
    this.setState((prevState) => {
      const updatedMeals = prevState.favouriteMeals.map((meal) => {
        if (meal.name === mealName) {
          // Trigger animation when the heart is toggled
          this.startAnimation(meal.scaleAnim);
          return { ...meal, liked: !meal.liked };
        }
        return meal;
      });
      return { favouriteMeals: updatedMeals };
    });

    const meal = this.state.favouriteMeals.find((m) => m.name === mealName);
    const newLikeStatus = !meal.liked;

    try {
      if (newLikeStatus) {
        await saveFavouriteMeal(userId, mealName);
      } else {
        await deleteFavouriteMeal(userId, mealName);
      }
    } catch (error) {
      console.error("Error updating favorite meal:", error);
    }
  };

  startAnimation = (scaleAnim) => {
    // Trigger scale animation
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.5,
        duration: 150,
        useNativeDriver: true
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true
      })
    ]).start();
  };

  render() {
    const { showModal, toggleModal } = this.props;

    return (
      <View style={styles.container}>
        <Modal
          visible={showModal}
          transparent={true}
          animationType="fade"
          onRequestClose={toggleModal}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modal}>
              <Text style={styles.title}>Любимите ви храни</Text>
              <ScrollView style={styles.scrollView}>
                <Text style={styles.textBlock}>
                  По-долу са изброени{" "}
                  <Text style={styles.boldText}>любимите ви ястия</Text>. След
                  като харесате{" "}
                  <Text style={styles.boldText}>5 или повече</Text>, ще имате
                  възможност да създадете хранително меню само от тях!
                </Text>
                <Block>
                  {this.state.favouriteMeals.length > 0 ? (
                    this.state.favouriteMeals.map((meal, index) => (
                      <View key={index} style={styles.mealItem}>
                        <Text style={[styles.textBlock, styles.mealName]}>
                          🍽️ {meal.name}
                        </Text>
                        <Pressable
                          onPress={() => this.handleFavouriteToggle(meal.name)}
                        >
                          <Animated.View
                            style={{ transform: [{ scale: meal.scaleAnim }] }}
                          >
                            <View style={styles.circle}>
                              <Ionicons
                                name={meal.liked ? "heart" : "heart-outline"}
                                size={20}
                                color="red"
                              />
                            </View>
                          </Animated.View>
                        </Pressable>
                      </View>
                    ))
                  ) : (
                    <Text style={styles.textBlock}>
                      Все още не сте харесали ястие! :( {"\n"}
                      За да харесате ястие, генерирайте хранително меню и
                      натиснете сърцето горе в дясно на снимката на ястието.
                    </Text>
                  )}
                </Block>
              </ScrollView>
              <TouchableOpacity onPress={toggleModal}>
                <View style={styles.closeButton}>
                  <Text style={styles.closeButtonText}>Излез</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center"
  },
  modal: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    width: "80%"
  },
  textBlock: {
    fontSize: 16,
    marginBottom: 10,
    flexShrink: 1
  },
  mealItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
    maxWidth: "100%"
  },
  mealName: {
    flex: 1,
    marginRight: 8,
    flexWrap: "wrap"
  },
  boldText: {
    fontWeight: "bold"
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 15
  },
  scrollView: {
    maxHeight: 250
  },
  closeButton: {
    backgroundColor: "#7c6bff",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10
  },
  closeButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold"
  },
  circle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    justifyContent: "center",
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5
  }
});

export default FavoriteMealsModal;
