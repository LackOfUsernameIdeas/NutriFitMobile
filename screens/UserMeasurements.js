import React from "react";
import {
  StyleSheet,
  ImageBackground,
  Dimensions,
  StatusBar,
  KeyboardAvoidingView,
  TouchableOpacity,
  ActivityIndicator
} from "react-native";
import { Block, Text } from "galio-framework";
import { Button, Icon, Input } from "../components";
import { Images, nutriTheme } from "../constants";
import { fetchAdditionalUserData } from "../database/getFunctions";
import { getAuth, signOut } from "firebase/auth";

const { width, height } = Dimensions.get("screen");
// Главен компонент
class UserMeasurements extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      height: 0,
      age: 0,
      weight: 0,
      gender: null,
      neck: 0,
      waist: 0,
      hip: 0,
      errorMessage: null,
      isLoading: false
    };
  }

  // Извиква се при зареждане на компонента и извлича пола на потребителя
  componentDidMount() {
    this.fetchGender();
  }

  // Извлича информация за пола на потребителя от базата данни
  fetchGender = async () => {
    const userData = await fetchAdditionalUserData(getAuth().currentUser.uid);
    if (userData) {
      this.setState({ gender: userData.gender });
    }
  };

  // Извиква функция за записване на всички данни на потребителя
  triggerFetchAndSaveAllData = async () => {
    const uid = getAuth().currentUser.uid;
    const { height, age, weight, gender, neck, waist, hip } = this.state;

    try {
      const response = await fetch(
        `https://nutri-api.noit.eu/fetchAndSaveAllDataNewStructure/${uid}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": "349f35fa-fafc-41b9-89ed-ff19addc3494"
          },
          body: JSON.stringify({
            height: height,
            age: age,
            weight: weight,
            gender: gender,
            neck: neck,
            waist: waist,
            hip: hip,
            goalsToFetch: [
              "maintain",
              "mildlose",
              "weightlose",
              "extremelose",
              "mildgain",
              "weightgain",
              "extremegain"
            ]
          })
        }
      );

      const result = await response.json();
    } catch (error) {
      console.error("Error triggering fetch and save:", error);
    }
  };

  // Запазва данни за потребителя в базата
  saveUserData = async () => {
    const uid = getAuth().currentUser.uid;
    const { height, age, weight, neck, waist, hip } = this.state;
    try {
      const response = await fetch(
        `https://nutri-api.noit.eu/saveUserDataNewStructure/${uid}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": "349f35fa-fafc-41b9-89ed-ff19addc3494"
          },
          body: JSON.stringify({
            height: height,
            age: age,
            weight: weight,
            neck: neck,
            waist: waist,
            hip: hip
          })
        }
      );

      const result = await response.json();
      return result;
    } catch (error) {
      console.error("Error triggering fetch and save:", error);
      throw error;
    }
  };

  // Генерира статистика, базирана на въведените от потребителя данни
  generateStats = async () => {
    this.setState({ isLoading: true });

    try {
      const saveResult = await this.saveUserData();

      if (saveResult) {
        this.triggerFetchAndSaveAllData();
        this.props.navigation.navigate("Home");
      }
    } catch (error) {
      console.error("Error generating stats:", error);
    } finally {
      this.setState({ isLoading: false });
    }
  };

  // Валидира данните на потребителя (височина, възраст и др.)
  validateUserData = (userData) => {
    const { height, age, weight, neck, waist, hip } = userData;

    const isValidHeight = (height) => height >= 50 && height <= 250;
    const isValidAge = (age) => age >= 10 && age <= 100;
    const isValidWeight = (weight) => weight >= 20 && weight <= 500;
    const isValidNeck = (neck) => neck >= 20 && neck <= 60;
    const isValidWaist = (waist) => waist >= 50 && waist <= 200;
    const isValidHip = (hip) => hip >= 50 && hip <= 250;

    return (
      isValidHeight(height) &&
      isValidAge(age) &&
      isValidWeight(weight) &&
      isValidNeck(neck) &&
      isValidWaist(waist) &&
      isValidHip(hip)
    );
  };

  // Handle-ва потвърждаването на данните от потребителя
  handleConfirm = async () => {
    const { height, age, weight, neck, waist, hip } = this.state;

    const userData = { height, age, weight, neck, waist, hip };
    if (!this.validateUserData(userData)) {
      this.setState({
        errorMessage: "Моля, въведете валидни стойности за всички полета."
      });
      return;
    }

    try {
      this.setState({ isLoading: true });

      await this.generateStats();

      const response = await fetch(
        "https://nutri-api.noit.eu/processUserData",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": "349f35fa-fafc-41b9-89ed-ff19addc3494"
          },
          body: JSON.stringify(userData)
        }
      );

      if (response.ok) {
        const responseData = await response.json();
        this.setState({ errorMessage: null });
      } else {
        console.error("Server error:", response.statusText);
      }
    } catch (error) {
      console.error("Error saving additional user data:", error);
    } finally {
      this.setState({ isLoading: false });
    }
  };
  // Handle-ва натискането на бутона за връщане и излизане от акаунта
  handleBackButtonPress = async () => {
    const { navigation } = this.props;
    try {
      const auth = getAuth();
      await signOut(auth);
      navigation.navigate("LogIn");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };
  render() {
    const { navigation } = this.props;
    const { isLoading } = this.state;

    return (
      <Block flex middle>
        <StatusBar hidden />
        <TouchableOpacity
          style={styles.backButton}
          onPress={() =>
            navigation.canGoBack()
              ? navigation.goBack()
              : this.handleBackButtonPress()
          }
        >
          <Icon
            name="arrow-back"
            family="Ionicons"
            size={30}
            color={nutriTheme.COLORS.WHITE}
          />
        </TouchableOpacity>
        <ImageBackground
          source={Images.RegisterBackground}
          style={{ width, height, zIndex: 1 }}
        >
          <Block safe flex middle>
            <Block style={styles.registerContainer}>
              <Block flex>
                <Block flex={0.1} middle>
                  <Text color="#8898AA" size={12}>
                    Моля попълнете вашите данни
                  </Text>
                </Block>
                <Block flex center>
                  <KeyboardAvoidingView
                    style={{ flex: 1 }}
                    behavior="padding"
                    enabled
                  >
                    <Block flex center>
                      <Block width={width * 0.8}>
                        <Text
                          color={nutriTheme.COLORS.MUTED}
                          size={14}
                          style={styles.inputLabel}
                        >
                          Ръст
                        </Text>
                        <Input
                          placeholder="Въведете ръст (см)"
                          style={styles.input}
                          keyboardType="numeric"
                          onChangeText={(height) =>
                            this.setState({ height: parseFloat(height) })
                          }
                        />
                      </Block>
                      <Block width={width * 0.8}>
                        <Text
                          color={nutriTheme.COLORS.MUTED}
                          size={14}
                          style={styles.inputLabel}
                        >
                          Възраст
                        </Text>
                        <Input
                          placeholder="Въведете възраст"
                          style={styles.input}
                          keyboardType="numeric"
                          onChangeText={(age) =>
                            this.setState({ age: parseFloat(age) })
                          }
                        />
                      </Block>
                      <Block width={width * 0.8}>
                        <Text
                          color={nutriTheme.COLORS.MUTED}
                          size={14}
                          style={styles.inputLabel}
                        >
                          Тегло
                        </Text>
                        <Input
                          placeholder="Въведете тегло (кг)"
                          style={styles.input}
                          keyboardType="numeric"
                          onChangeText={(weight) =>
                            this.setState({ weight: parseFloat(weight) })
                          }
                        />
                      </Block>
                      <Block width={width * 0.8}>
                        <Text
                          color={nutriTheme.COLORS.MUTED}
                          size={14}
                          style={styles.inputLabel}
                        >
                          Врат
                        </Text>
                        <Input
                          placeholder="Въведете обиколка на врат (см)"
                          keyboardType="numeric"
                          style={styles.input}
                          onChangeText={(neck) =>
                            this.setState({ neck: parseFloat(neck) })
                          }
                        />
                      </Block>
                      <Block width={width * 0.8}>
                        <Text
                          color={nutriTheme.COLORS.MUTED}
                          size={14}
                          style={styles.inputLabel}
                        >
                          Талия
                        </Text>
                        <Input
                          placeholder="Въведете обиколка на талия (см)"
                          style={styles.input}
                          keyboardType="numeric"
                          onChangeText={(waist) =>
                            this.setState({ waist: parseFloat(waist) })
                          }
                        />
                      </Block>
                      <Block width={width * 0.8}>
                        <Text
                          color={nutriTheme.COLORS.MUTED}
                          size={14}
                          style={styles.inputLabel}
                        >
                          Таз
                        </Text>
                        <Input
                          placeholder="Въведете обиколка на таз (см)"
                          style={styles.input}
                          keyboardType="numeric"
                          onChangeText={(hip) =>
                            this.setState({ hip: parseFloat(hip) })
                          }
                        />
                        {this.state.errorMessage && (
                          <Text style={{ color: "red" }}>
                            {this.state.errorMessage}
                          </Text>
                        )}
                      </Block>
                      {isLoading ? (
                        <Block
                          flex={1}
                          style={{
                            position: "absolute",
                            width: width,
                            height: height,
                            backgroundColor: "rgba(0, 0, 0, 0.5)",
                            zIndex: 2
                          }}
                        >
                          <ActivityIndicator
                            size="large"
                            color={nutriTheme.COLORS.PRIMARY}
                          />
                        </Block>
                      ) : (
                        <Block middle>
                          <Button
                            color="primary"
                            style={styles.createButton}
                            onPress={this.handleConfirm}
                          >
                            <Text
                              bold
                              size={14}
                              color={nutriTheme.COLORS.WHITE}
                            >
                              Пратете
                            </Text>
                          </Button>
                        </Block>
                      )}
                    </Block>
                  </KeyboardAvoidingView>
                </Block>
              </Block>
            </Block>
          </Block>
        </ImageBackground>
      </Block>
    );
  }
}

const styles = StyleSheet.create({
  registerContainer: {
    width: width * 0.9,
    height: width * 1.6,
    backgroundColor: "#F4F5F7",
    borderRadius: 20,
    shadowColor: nutriTheme.COLORS.BLACK,
    shadowOffset: {
      width: 0,
      height: 4
    },
    shadowRadius: 8,
    shadowOpacity: 0.1,
    elevation: 1,
    overflow: "hidden"
  },
  inputLabel: {
    textAlign: "left"
  },
  socialConnect: {
    backgroundColor: nutriTheme.COLORS.WHITE,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: "#8898AA"
  },
  socialButtons: {
    width: 120,
    height: 40,
    backgroundColor: "#fff",
    shadowColor: nutriTheme.COLORS.BLACK,
    shadowOffset: {
      width: 0,
      height: 4
    },
    shadowRadius: 8,
    shadowOpacity: 0.1,
    elevation: 1
  },
  socialTextButtons: {
    color: nutriTheme.COLORS.PRIMARY,
    fontWeight: "800",
    fontSize: 14
  },
  inputIcons: {
    marginRight: 12
  },
  passwordCheck: {
    paddingLeft: 15,
    paddingTop: 13
  },
  createButton: {
    width: width * 0.5,
    marginBottom: 20,
    borderRadius: 12
  },
  backButton: {
    position: "absolute",
    top: 20,
    left: 20,
    zIndex: 2
  },
  loadingContainer: {
    position: "absolute",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    width: width,
    height: height,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2
  }
});

export default UserMeasurements;
