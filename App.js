import React, { useCallback, useEffect, useState } from "react";
import { Image } from "react-native";
import * as SplashScreen from "expo-splash-screen";
import * as Font from "expo-font";
import { Asset } from "expo-asset";
import { Block, GalioProvider } from "galio-framework";
import { NavigationContainer } from "@react-navigation/native";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import { firebaseConfig } from "./database/connection";
// Преди render на какъвто и да е navigation stack
import { enableScreens } from "react-native-screens";
enableScreens();

import Screens from "./navigation/Screens";
import { Images, nutriTheme } from "./constants";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Инициализация на Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

// Кеширане на изображения за приложението
const assetImages = [
  Images.Onboarding,
  Images.LogoOnboarding,
  Images.Logo,
  Images.NutriFitLogo,
  Images.iOSLogo,
  Images.androidLogo
];

// Функция за кеширане на изображенията
function cacheImages(images) {
  return images.map((image) => {
    if (typeof image === "string") {
      return Image.prefetch(image);
    } else {
      return Asset.fromModule(image).downloadAsync();
    }
  });
}

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // Зареждане на ресурсите
        await _loadResourcesAsync();
        await Font.loadAsync({
          NutriExtra: require("./assets/font/nutri.ttf")
        });
      } catch (e) {
        console.warn(e);
      } finally {
        // Сигнал към приложението, че може да се рендерира
        setAppIsReady(true);
      }
    }
    prepare();
  }, []);

  // Асинхронно зареждане на ресурсите
  const _loadResourcesAsync = async () => {
    return Promise.all([...cacheImages(assetImages)]);
  };

  // Скриване на splash екрана след зареждане на приложението
  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }

  return (
    <NavigationContainer onReady={onLayoutRootView}>
      <GalioProvider theme={nutriTheme}>
        <Block flex>
          <Screens />
        </Block>
      </GalioProvider>
    </NavigationContainer>
  );
}
