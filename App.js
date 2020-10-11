import React, { useState, useEffect } from "react";
import { AppLoading } from "expo";
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { useFonts, Raleway_400Regular, Raleway_600SemiBold, Raleway_700Bold } from '@expo-google-fonts/raleway';
import { ApolloProvider } from "@apollo/client";
import AsyncStorage from "@react-native-community/async-storage";
import Ionicons from "react-native-vector-icons/Ionicons"

import Login from "./src/Components/Screens/Login";
import Home from "./src/Components/Screens/Home";

import queries from "./src/queries";
import getClient from "./src/apollo_config";
import colors from "./src/colors";

export default function App() {

  const [isReady, setIsReady] = useState(false);
  const [client, setClient] = useState(null);
  const [initialRouteName, setInitialRouteName] = useState("Login");

  // async function to load resources on splash screen
  const getResouces = () => {
    return new Promise(async (resolve, reject) => {
      try {
        require("./src/i18n_config");
      
        const my_client = await getClient()
        setClient(my_client);

        // try to use refresh token to get new access token
        const data = await my_client.query({
          query: queries.REFRESH_TOKEN
        });

        // if could refresh token, means the session is active, so skip login
        if(data && data.data) {
          if(data.data.refreshToken) {
            await AsyncStorage.setItem("access_token", data.data.refreshToken);
            setInitialRouteName("Main"); // skip directly from splash screen to main navigator
          }
        }

        resolve("done");
      } catch(e) {
        reject(e);
      }
    });
  }

  const Tab = createBottomTabNavigator();

  const Main = () => {
    return (
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if(route.name === "Home") {
              iconName = "md-home"
            }

            return <Ionicons name={iconName} size={size} color={color} />
          }
        })}
        tabBarOptions={{
          activeTintColor: colors.primary,
          inactiveTintColor: "gray"
        }}
      >
        <Tab.Screen name="Home" component={Home} />
      </Tab.Navigator>
    );
  }

  const Stack = createStackNavigator();

  // load fonts
  let [fontsLoaded] = useFonts({
    Raleway_400Regular,
    Raleway_600SemiBold,
    Raleway_700Bold
  });

  if(!isReady || !fontsLoaded) {
    return (
      <AppLoading
        startAsync={getResouces}
        onFinish={() => setIsReady(true)}
        onError={console.warn}
      />
    );
  }

  return (
    <ApolloProvider client={client}>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false
          }}
          initialRouteName={initialRouteName}
        >
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Main" component={Main} />
        </Stack.Navigator>
      </NavigationContainer>
    </ApolloProvider>
  );
}
