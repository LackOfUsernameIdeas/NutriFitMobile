import { Animated, Dimensions, Easing } from "react-native";
// header for screens
import { Header, Icon } from "../components";
import React, { useEffect, useState } from "react"; // Add this line
// drawer
import MealPlanner from "../screens/MealPlanner";
import Onboarding from "../screens/Onboarding";
import Register from "../screens/Register";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createStackNavigator } from "@react-navigation/stack";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../App";
import LogIn from "../screens/LogIn";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import UserMeasurements from "../screens/UserMeasurements";
import { fetchAdditionalUserData } from "../database/getFunctions";

const { width } = Dimensions.get("screen");

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

export default function OnboardingStack(props) {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const auth = getAuth();
    const subscriber = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (initializing) setInitializing(false);
    });

    // Cleanup function
    return () => {
      subscriber(); // Unsubscribe from onAuthStateChanged
    };
  }, [initializing]);

  if (initializing) return null;

  return (
    <Stack.Navigator
      screenOptions={{
        mode: "card",
        headerShown: false
      }}
    >
      {!user ? (
        <>
          <Stack.Screen
            name="Onboarding"
            component={Onboarding}
            option={{
              headerTransparent: true
            }}
          />
          <Stack.Screen
            name="Register"
            component={Register}
            options={{
              headerShown: false
            }}
            initialParams={{ navigation: props.navigation }}
          />
          <Stack.Screen
            name="LogIn"
            component={LogIn}
            options={{
              headerShown: false
            }}
            initialParams={{ navigation: props.navigation }}
          />
        </>
      ) : (
        <Stack.Screen name="App" component={AppStack} />
      )}
    </Stack.Navigator>
  );
}

function AppStack(props) {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState(null);
  const [hasMeasurementsForToday, setHasMeasurementsForToday] = useState(false);
  const [userDocData, setUserDocData] = useState(null); // State for userDocData

  useEffect(() => {
    const auth = getAuth();
    const subscriber = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        const userData = await fetchAdditionalUserData(user.uid, onDataSaved);
        const userDocKey = new Date().toISOString().slice(0, 10);
        if (userData && userData[userDocKey]) {
          setHasMeasurementsForToday(true);
        }
      }
      if (initializing) setInitializing(false);
    });

    // Cleanup function
    return () => {
      subscriber(); // Unsubscribe from onAuthStateChanged
      // Additional cleanup for other listeners if needed
    };
  }, [initializing]);

  // Function to handle data saved event
  const onDataSaved = () => {
    setHasMeasurementsForToday(true);
  };

  // Listen for real-time updates on the user's document
  useEffect(() => {
    if (user) {
      const userDocKey = new Date().toISOString().slice(0, 10);
      const unsubscribe = onSnapshot(
        collection(db, "additionalData2", user.uid, "dataEntries"),
        (querySnapshot) => {
          querySnapshot.forEach((doc) => {
            if (doc.exists()) {
              // Check if the document ID matches the current date
              if (doc.id === userDocKey) {
                setUserDocData(doc.data()); // Update userDocData state
              }
            }
          });
        }
      );

      // Cleanup function
      return () => unsubscribe();
    }
  }, [user]);

  if (initializing) return null;

  // Redirect to UserMeasurements if userDocData is null
  if (!hasMeasurementsForToday) {
    return (
      <Drawer.Navigator
        style={{ flex: 1 }}
        drawerStyle={{
          backgroundColor: "white",
          width: width * 0.8
        }}
        drawerContentOptions={{
          activeTintcolor: "white",
          inactiveTintColor: "#000",
          activeBackgroundColor: "transparent",
          itemStyle: {
            width: width * 0.75,
            backgroundColor: "transparent",
            paddingVertical: 16,
            paddingHorizonal: 12,
            justifyContent: "center",
            alignContent: "center",
            alignItems: "center",
            overflow: "hidden"
          },
          labelStyle: {
            fontSize: 18,
            marginLeft: 12,
            fontWeight: "normal"
          }
        }}
        initialRouteName="UserMeasurements" // Navigate to UserMeasurements if data for today is missing
      >
        <Drawer.Screen
          name="UserMeasurements"
          component={UserMeasurements}
          options={{
            headerShown: false
          }}
          initialParams={{ navigation: props.navigation }}
        />
      </Drawer.Navigator>
    );
  }

  // Render MealPlanner if data for today exists
  return (
    <Drawer.Navigator
      style={{ flex: 1 }}
      drawerStyle={{
        backgroundColor: "white",
        width: width * 0.8
      }}
      drawerContentOptions={{
        activeTintcolor: "white",
        inactiveTintColor: "#000",
        activeBackgroundColor: "transparent",
        itemStyle: {
          width: width * 0.75,
          backgroundColor: "transparent",
          paddingVertical: 16,
          paddingHorizonal: 12,
          justifyContent: "center",
          alignContent: "center",
          alignItems: "center",
          overflow: "hidden"
        },
        labelStyle: {
          fontSize: 18,
          marginLeft: 12,
          fontWeight: "normal"
        }
      }}
      initialRouteName="MealPlanner"
    >
      <Drawer.Screen
        name="MealPlanner"
        component={MealPlanner}
        options={{
          header: ({ navigation, scene }) => (
            <Header
              title="MealPlanner"
              search
              options
              navigation={navigation}
              scene={scene}
            />
          ),
          cardStyle: { backgroundColor: "#F8F9FE" }
        }}
      />
    </Drawer.Navigator>
  );
}
