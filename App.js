import React, { useState, useEffect } from "react";
import { AppLoading } from "expo";
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';
import { useFonts, Inter_900Black } from '@expo-google-fonts/inter';
import * as Updates from "expo-updates";
import { ApolloProvider, useQuery } from "@apollo/client";

import Login from "./src/Components/Screens/Login";
import Feed from "./src/Components/Screens/Feed";

import queries from "./src/queries";

import getClient from "./src/apollo_config";
import AsyncStorage from "@react-native-community/async-storage";

export default function App() {

  const [isReady, setIsReady] = useState(false);
  const [client, setClient] = useState(null);
  const [initialRouteName, setInitialRouteName] = useState("Login");

  // const [refreshToken, { data }] = useQuery(queries.REFRESH_TOKEN);

  // async function to load resources on splash screen
  const getResouces = () => {
    return new Promise(async (resolve, reject) => {
      try {
        require("./src/i18n_config");
      
        try {
          const update = await Updates.checkForUpdateAsync();
          if (update.isAvailable) {
            await Updates.fetchUpdateAsync();
            // ... notify user of update ...
            await Updates.reloadAsync();
          }
        } catch (e) {
          reject(e);
        }
      
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

  const Drawer = createDrawerNavigator();

  const Main = () => {
    return (
      <Drawer.Navigator initialRouteName="Feed">
        <Drawer.Screen name="Feed" component={Feed} />
      </Drawer.Navigator>
    );
  }

  const Stack = createStackNavigator();

  // load fonts
  let [fontsLoaded] = useFonts({
    Inter_900Black,
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
          <Stack.Screen name="Login" component={Login} options={{
            cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS
          }} />
          <Stack.Screen name="Main" component={Main} />
        </Stack.Navigator>
      </NavigationContainer>
    </ApolloProvider>
  );
}
