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

class InfoBoxMacroNutrients extends React.Component {
  state = {
    showModal: false
  };

  toggleModal = () => {
    this.setState((prevState) => ({
      showModal: !prevState.showModal
    }));
  };

  render() {
    const { title, isForMacroNutrients } = this.props;
    const { showModal } = this.state;

    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={this.toggleModal}>
          <Ionicons
            name="information-circle"
            size={24}
            color="#8c8bfc"
            style={isForMacroNutrients && { marginBottom: 8 }}
          />
        </TouchableOpacity>
        <Modal
          visible={showModal}
          transparent={true}
          animationType="fade"
          onRequestClose={this.toggleModal}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modal}>
              <Text style={styles.title}>{title}</Text>
              <ScrollView style={styles.scrollView}>
                <Block>
                  <Text style={styles.textBlock}>
                    <Text style={styles.bold}>Балансирана:</Text>
                    {"\n"}
                    Балансирано разпределение на макронутриенти с умерени нива
                    на протеини, въглехидрати и мазнини. Идеална за поддържане
                    на здравето.
                  </Text>
                  <Text style={styles.textBlock}>
                    <Text style={styles.bold}>
                      Ниско съдържание на мазнини:
                    </Text>
                    {"\n"}
                    Набляга на намаляване на приема на мазнини и поддържане на
                    адекватни нива на протеини и въглехидрати. Подходящ за тези,
                    които се стремят да намалят общия прием на калории и да
                    контролират теглото си.
                  </Text>
                  <Text style={styles.textBlock}>
                    <Text style={styles.bold}>
                      Ниско съдържание на въглехидрати:
                    </Text>
                    {"\n"}
                    Фокусира се върху минимизиране на приема на въглехидрати,
                    като същевременно осигурява достатъчно протеини и
                    здравословни мазнини.
                  </Text>
                  <Text style={styles.textBlock}>
                    <Text style={styles.bold}>
                      Високо съдържание на протеин:
                    </Text>
                    {"\n"}
                    Дава приоритет на по-висок прием на протеин с умерени нива
                    на въглехидрати и мазнини. Идеална за тези, които искат да
                    подпомогнат развитието на мускулите, особено при силови
                    тренировки или фитнес програми.
                  </Text>
                </Block>
              </ScrollView>
              <TouchableOpacity onPress={this.toggleModal}>
                <View style={styles.closeButton}>
                  <Text style={styles.closeButtonText}>Затвори</Text>
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
    borderRadius: 15,
    padding: 20,
    width: "80%"
  },
  textBlock: {
    marginBottom: 10 // Adjust the spacing as needed
  },
  bold: {
    fontWeight: "bold"
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10
  },
  scrollView: {
    maxHeight: 250 // Adjust the maxHeight as needed
  },
  info: {
    fontSize: 16,
    marginBottom: 10
  },
  paragraph: {
    marginBottom: 10
  },
  bold: {
    fontWeight: "bold"
  },
  closeButton: {
    backgroundColor: "#8c8bfc",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 50,
    alignItems: "center",
    justifyContent: "center"
  },
  closeButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold"
  }
});

export default InfoBoxMacroNutrients;
