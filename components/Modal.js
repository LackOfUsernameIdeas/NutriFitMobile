import React from "react";
import {
  Modal,
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  ScrollView
} from "react-native";

class CustomAlert extends React.Component {
  render() {
    const { visible, onClose, title, ingredients, instructions, grams } =
      this.props;

    return (
      <Modal
        visible={visible}
        transparent={true}
        animationType="fade"
        onRequestClose={onClose}
      >
        <View style={styles.container}>
          <View style={styles.modal}>
            <Text style={styles.title}>{title}</Text>
            <ScrollView style={styles.scrollView}>
              <Text style={styles.sectionTitle}>Съставки:</Text>
              <Text style={styles.message}>{ingredients}</Text>
              <Text style={styles.sectionTitle}>Стъпки:</Text>
              <Text style={styles.message}>
                {Array.isArray(instructions) ? instructions.join("\n") : ""}
              </Text>
              <Text style={styles.sectionTitle}>Крайно количество:</Text>
              <Text style={styles.message}>{grams}г.</Text>
            </ScrollView>
            <TouchableOpacity onPress={onClose}>
              <View style={styles.button}>
                <Text style={styles.buttonText}>Затвори</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 15 // Add horizontal padding
  },
  modal: {
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    padding: 20,
    alignItems: "center",
    width: "100%", // Take up full width
    maxWidth: 400 // Set maximum width
  },
  scrollView: {
    maxHeight: 300 // Set maximum height for scrolling
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10
  },
  message: {
    fontSize: 16,
    marginBottom: 20
  },
  button: {
    backgroundColor: "#8c8bfc",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 50,
    alignItems: "center",
    justifyContent: "center"
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold"
  }
});

export default CustomAlert;
