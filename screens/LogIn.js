import React from "react";
import {
  StyleSheet,
  ImageBackground,
  Dimensions,
  StatusBar,
  KeyboardAvoidingView,
  TouchableOpacity
} from "react-native";
import { Block, Text } from "galio-framework";
import { Button, Icon, Input } from "../components";
import { Images, nutriTheme } from "../constants";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

const { width, height } = Dimensions.get("screen");

class LogIn extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      errorMessage: null
    };
  }

  handleSignIn = () => {
    const { email, password } = this.state;
    const auth = getAuth();
    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        // Handle successful sign-in
        console.log("User signed in successfully!");
        this.props.navigation.navigate("UserMeasurements");
      })
      .catch((error) => {
        // Handle sign-in errors
        let errorMessage;
        switch (error.code) {
          case "auth/invalid-email":
            errorMessage = "Невалиден email. Проверете го и опитайте отново.";
            break;
          case "auth/user-not-found":
            errorMessage = "Потребителят не е намерен. Регистрирайте се първо.";
            break;
          case "auth/wrong-password":
            errorMessage = "Грешна парола. Опитайте отново.";
            break;
          case "auth/missing-email":
            errorMessage = "Моля, въведете вашето имейл адрес.";
            break;
          case "auth/missing-password":
            errorMessage = "Моля, въведете вашата парола.";
            break;
          case "auth/invalid-credential":
            errorMessage = "Не сте въвели правилни данни. Опитайте отново.";
            break;
          default:
            errorMessage = "Грешка: " + error.message;
        }
        this.setState({ errorMessage });
        console.error("Error signing in:", error);
      });
  };

  render() {
    const { navigation } = this.props; // Assuming you're using React Navigation

    return (
      <Block flex middle>
        <StatusBar hidden />
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
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
                <Block flex={0.17} middle>
                  <Text color="#8898AA" size={12}>
                    Влезте във Вашият профил
                  </Text>
                </Block>
                <Block flex center>
                  <KeyboardAvoidingView
                    style={{ flex: 1 }}
                    behavior="padding"
                    enabled
                  >
                    <Block flex center>
                      <Block style={{ marginBottom: 20 }} width={width * 0.8}>
                        <Text
                          color={nutriTheme.COLORS.MUTED}
                          size={14}
                          style={styles.inputLabel}
                        >
                          Вашият имейл
                        </Text>
                        <Input
                          placeholder="example@noit.eu..."
                          style={{
                            borderRadius: 12,
                            borderWidth: 2,
                            borderColor: "rgba(93, 75, 215, 0.1)"
                          }}
                          onChangeText={(email) => this.setState({ email })}
                        />
                      </Block>
                      <Block style={{ marginBottom: 20 }} width={width * 0.8}>
                        <Text
                          color={nutriTheme.COLORS.MUTED}
                          size={14}
                          style={styles.inputLabel}
                        >
                          Вашата парола
                        </Text>
                        <Input
                          style={{
                            borderRadius: 12,
                            borderWidth: 2,
                            borderColor: "rgba(93, 75, 215, 0.1)"
                          }}
                          onChangeText={(password) =>
                            this.setState({ password })
                          }
                          value={this.state.password}
                          password
                          placeholder="Поне 6 символа..."
                        />
                        {this.state.errorMessage && (
                          <Text style={{ color: "red" }}>
                            {this.state.errorMessage}
                          </Text>
                        )}
                      </Block>
                      <Block middle>
                        <Button
                          color="primary"
                          style={styles.createButton}
                          onPress={this.handleSignIn}
                        >
                          <Text bold size={14} color={nutriTheme.COLORS.WHITE}>
                            Влезте в профила
                          </Text>
                        </Button>
                        <TouchableOpacity
                          onPress={() => navigation.navigate("Register")}
                        >
                          <Text
                            style={{
                              marginTop: 0,
                              color: nutriTheme.COLORS.PRIMARY
                            }}
                          >
                            Нямате профил? Натиснете тук!
                          </Text>
                        </TouchableOpacity>
                      </Block>
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
    height: width * 1.1,
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
    marginBottom: 8,
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
    marginBottom: 20, // Increased marginBottom
    borderRadius: 12
  },
  backButton: {
    position: "absolute",
    top: 20,
    left: 20,
    zIndex: 2
  }
});

export default LogIn;
