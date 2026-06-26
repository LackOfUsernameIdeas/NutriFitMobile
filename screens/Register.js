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
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from "firebase/auth";

const { width, height } = Dimensions.get("screen");

class Register extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      errorMessage: null
    };
  }

  handleSignUp = () => {
    const { email, password } = this.state;
    const auth = getAuth();

    createUserWithEmailAndPassword(auth, email, password)
      .then(() => {
        // Handle successful registration
        console.log("User registered successfully!");

        // Now let's log in the user
        signInWithEmailAndPassword(auth, email, password)
          .then(() => {
            // Handle successful sign-in
            console.log("User logged in successfully!");
            // Redirect the user to the UserMeasurements
            this.props.navigation.navigate("UserMeasurements");
          })
          .catch((error) => {
            // Handle sign-in errors
            console.error("Error signing in after registration:", error);
            // You might want to display an error message to the user here
          });
      })
      .catch((error) => {
        // Handle registration errors
        let errorMessage;
        switch (error.code) {
          case "auth/invalid-email":
            errorMessage =
              "Email-ът ви е невалиден. Проверете за грешки в изписването.";
            break;
          case "auth/weak-password":
            errorMessage = "Паролата ви е твърде слаба.";
            break;
          case "auth/email-already-exists":
            errorMessage =
              "Този еmail е регистриран. Да не би да искахте да влезете в профила ви?";
            break;
          case "auth/invalid-password":
            errorMessage = "Паролата ви не е правилна.";
            break;
          case "auth/missing-password":
            errorMessage = "Моля напишете вашата парола.";
            break;
          case "auth/email-already-in-use":
            errorMessage =
              "Този еmail е регистриран. Да не би да искахте да влезете в профила ви?";
            break;
          case "auth/weak-password":
            errorMessage = "Паролата ви трябва да бъде поне 6 символа.";
            break;
          case "auth/missing-email":
            errorMessage = "Моля напишете вашия еmail.";
            break;
          default:
            errorMessage = "Грешка се случи: " + error.message;
        }
        this.setState({ errorMessage });
        console.error("Error registering user:", error);
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
                    Създадете профил
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
                          onPress={this.handleSignUp}
                        >
                          <Text bold size={14} color={nutriTheme.COLORS.WHITE}>
                            Създай профил
                          </Text>
                        </Button>
                        <TouchableOpacity
                          onPress={() => navigation.navigate("LogIn")}
                        >
                          <Text
                            style={{
                              marginTop: 0,
                              color: nutriTheme.COLORS.PRIMARY
                            }}
                          >
                            Вече имате профил? Натиснете тук!
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

export default Register;
