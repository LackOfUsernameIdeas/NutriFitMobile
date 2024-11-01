import React from "react";
import {
  Modal,
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  ScrollView
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Block } from "galio-framework";

class FavoriteMealsModal extends React.Component {
  render() {
    const { showModal, favouriteMeals, toggleModal } = this.props;

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
                  {favouriteMeals ? (
                    favouriteMeals.split(", ").map((meal, index) => (
                      <Text key={index} style={styles.textBlock}>
                        🍽️ {meal}
                      </Text>
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
    marginBottom: 10,
    fontSize: 16
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
    maxHeight: 250 // Adjust the maxHeight as needed
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
  }
});

export default FavoriteMealsModal;
