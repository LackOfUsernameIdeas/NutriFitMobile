import React, { useState, useEffect } from "react";
import { Image, StyleSheet, TouchableOpacity, View, Alert } from "react-native";
import { Block, Text, theme } from "galio-framework";
import PropTypes from "prop-types";
import { nutriTheme } from "../constants";
import CustomAlert from "./Modal";
import Icon from "react-native-vector-icons/Ionicons";
import { saveFavouriteMeal } from "../database/setFunctions";
import { deleteFavouriteMeal } from "../database/deleteFunctions";
import { getAuth } from "firebase/auth";
import { fetchFavouriteMealsForUser } from "../database/getFunctions";

const RecipeWidget = (props) => {
  const { image, item, style, imageStyle } = props;
  const [like, setLike] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  // Check if the meal is already favorited by the user
  useEffect(() => {
    const checkFavouriteMeals = async () => {
      try {
        const userId = getAuth().currentUser?.uid;
        if (userId) {
          const favouriteMeals = await fetchFavouriteMealsForUser(userId);
          setLike(favouriteMeals.includes(item.name));
        }
      } catch (error) {
        console.error("Error checking favorite meals:", error);
      }
    };

    checkFavouriteMeals();
  }, [item.name]);

  // Toggle favorite status and update the database
  const handleFavoriteToggle = async () => {
    const userId = getAuth().currentUser?.uid;
    if (!userId) return;

    const newLikeStatus = !like;
    setLike(newLikeStatus);

    try {
      if (newLikeStatus) {
        await saveFavouriteMeal(userId, item.name);
      } else {
        await deleteFavouriteMeal(userId, item.name);
      }
    } catch (error) {
      console.error("Error updating favorite meal:", error);
    }
  };

  const handleIngredientsPress = () => {
    setShowAlert(true);
  };

  const imageStyles = [styles.fullImage, imageStyle];
  const cardContainer = [styles.card, styles.shadow, style];
  const imgContainer = [styles.imageContainer, styles.shadow];

  return (
    <Block card flex style={cardContainer}>
      {image && (
        <Block flex style={imgContainer}>
          <Image source={{ uri: image }} style={imageStyles} />
          <TouchableOpacity
            onPress={handleFavoriteToggle}
            style={styles.favoriteIcon}
          >
            <View style={styles.circle}>
              <Icon
                name={like ? "heart" : "heart-outline"}
                size={16}
                color="red"
              />
            </View>
          </TouchableOpacity>
        </Block>
      )}
      <Block flex space="between" style={styles.cardDescription}>
        <Text size={20} style={styles.cardTitle}>
          {item.name}
        </Text>
        <TouchableOpacity onPress={handleIngredientsPress}>
          <View style={styles.button}>
            <Text style={styles.buttonText}>Начин на приготвяне</Text>
          </View>
        </TouchableOpacity>
        <CustomAlert
          visible={showAlert}
          onClose={() => setShowAlert(false)}
          title="Рецепта"
          ingredients={item.ingredients.join(", ")}
          instructions={item.instructions}
          grams={item.recipeQuantity}
        />
      </Block>
    </Block>
  );
};

RecipeWidget.propTypes = {
  image: PropTypes.string,
  item: PropTypes.object.isRequired,
  style: PropTypes.object,
  imageStyle: PropTypes.object
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.COLORS.WHITE,
    borderWidth: 0,
    borderRadius: 15,
    minHeight: 114,
    marginTop: 5
  },
  imageContainer: {
    borderRadius: 15,
    elevation: 1,
    overflow: "hidden",
    position: "relative",
    flex: 1
  },
  fullImage: {
    height: 150
  },
  shadow: {
    shadowColor: nutriTheme.COLORS.BLACK,
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowRadius: 4,
    shadowOpacity: 0.1,
    elevation: 2
  },
  cardDescription: {
    padding: theme.SIZES.BASE / 2,
    justifyContent: "flex-end",
    alignItems: "center"
  },
  cardTitle: {
    textAlign: "center",
    flex: 1,
    flexWrap: "wrap",
    paddingBottom: 6
  },
  button: {
    backgroundColor: "#8c8bfc",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 50,
    marginTop: 15,
    alignItems: "center",
    justifyContent: "center"
  },
  buttonText: {
    color: theme.COLORS.WHITE,
    fontSize: 16,
    fontWeight: "bold"
  },
  favoriteIcon: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 1
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

export default RecipeWidget;
