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

class InfoBoxLevels extends React.Component {
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
                    <Text style={styles.bold}>Ниво 1</Text> - Малко или въобще
                    не спортувате. Примерни упражнения: Кратка разходка, Лека
                    Йога, Кратка Тай Чи сесия (20 мин.),
                  </Text>
                  <Text style={styles.textBlock}>
                    <Text style={styles.bold}>Ниво 2</Text> - Спортувате умерено
                    1-3 пъти в седмицата. Примерни упражнения: Умерена разходка
                    за 30 мин, Работа в двора/градинарство за 45 мин, Каране на
                    колело за 1 час,
                  </Text>
                  <Text style={styles.textBlock}>
                    <Text style={styles.bold}>Ниво 3</Text> - Спортувате умерено
                    4-5 пъти в седмицата. Примерни упражнения: Тичане 30 мин,
                    Плуване за 30 мин, Играене на тенис/волейбол за 45 мин,
                  </Text>
                  <Text style={styles.textBlock}>
                    <Text style={styles.bold}>Ниво 4</Text> - Спортувате умерено
                    дневно или интензивно 3-4 пъти в седмицата. Примерни
                    упражнения: Интервална тренировка с висока интензивност 30
                    мин, Тренировка за цялото тяло 45 мин. Бързо плуване за 45
                    минути,
                  </Text>
                  <Text style={styles.textBlock}>
                    <Text style={styles.bold}>Ниво 5</Text> - Спортувате
                    интензивно 6-7 пъти в седмицата. Примерни упражнения:
                    По-тежка и по-дълга интервална тренировка с висока
                    интензивност, Трениране на Кик-бокс за 1 час, Трениране на
                    бойни изкуства,
                  </Text>
                  <Text style={styles.textBlock}>
                    <Text style={styles.bold}>Ниво 6</Text> - Спортувате много
                    интензивно цялата седмица. Примерни упражнения: Тренировка
                    за маратон, Каране на колело из дълги растояния за 2 часа,
                    Вдигане на тежести за 1 час, Участвие в спортен турнир (90
                    мин.)
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

export default InfoBoxLevels;
