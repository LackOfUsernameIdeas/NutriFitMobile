import React from "react";
import {
  ImageBackground,
  Image,
  StyleSheet,
  StatusBar,
  Dimensions
} from "react-native";
import { Block, Button, Text, theme } from "galio-framework";

const { height, width } = Dimensions.get("screen");

import nutriTheme from "../constants/Theme";
import Images from "../constants/Images";

// Landing страница
class Onboarding extends React.Component {
  render() {
    const { navigation } = this.props;

    return (
      <Block flex style={styles.container}>
        <StatusBar hidden />
        <Block flex center>
          <ImageBackground
            source={Images.Onboarding}
            style={{ height, width, zIndex: 1 }}
          />
        </Block>
        <Block center>
          <Image source={Images.LogoOnboarding} style={styles.logo} />
        </Block>
        <Block flex space="between" style={styles.padded}>
          <Block flex space="around" style={{ zIndex: 2 }}>
            <Block style={styles.title}>
              <Block>
                <Text color="white" size={60}>
                  Добре дошли!
                </Text>
              </Block>
            </Block>
            <Block center>
              <Block style={styles.subTitle}>
                <Text color="white" size={16}>
                  Бъдете винаги във форма и в оптимално здравословно състояние с
                  помощта на изкуствен интелект!
                </Text>
              </Block>
              <Button
                style={styles.button}
                color={nutriTheme.COLORS.SECONDARY}
                onPress={() => navigation.navigate("LogIn")}
                textStyle={{ color: nutriTheme.COLORS.BLACK }}
              >
                Влезте в профила Ви
              </Button>
            </Block>
            <Block center>
              <Text
                color="white"
                size={16}
                onPress={() => navigation.navigate("Register")}
                style={{ marginVertical: 0 }}
              >
                Нямате профил? Регистрирайте се!
              </Text>
            </Block>
          </Block>
        </Block>
      </Block>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.COLORS.BLACK
  },
  padded: {
    paddingHorizontal: theme.SIZES.BASE * 2,
    position: "relative",
    bottom: theme.SIZES.BASE,
    zIndex: 2
  },
  button: {
    width: width - theme.SIZES.BASE * 4,
    height: theme.SIZES.BASE * 3,
    shadowRadius: 0,
    shadowOpacity: 0,
    borderRadius: 10
  },
  logo: {
    width: 200,
    height: 60,
    zIndex: 2,
    position: "relative",
    marginTop: "-50%"
  },
  title: {
    marginTop: "-15%"
  },
  subTitle: {
    marginBottom: 10
  }
});

export default Onboarding;
