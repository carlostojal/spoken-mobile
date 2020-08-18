import React, { useState } from "react";
import { AppLoading } from "expo";
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';
import { useFonts, Inter_900Black } from '@expo-google-fonts/inter';
import * as Updates from "expo-updates";
import { ApolloProvider } from "@apollo/client";

import Login from "./src/Components/Screens/Login";
import Feed from "./src/Components/Screens/Feed";


import getClient from "./src/apollo_config";

export default function App() {

  const [isReady, setIsReady] = useState(false);
  const [client, setClient] = useState(null);

  const getResouces = async () => {
    require("./src/i18n_config");
  
    try {
      const update = await Updates.checkForUpdateAsync();
      if (update.isAvailable) {
        await Updates.fetchUpdateAsync();
        // ... notify user of update ...
        await Updates.reloadAsync();
      }
    } catch (e) {
      // handle or log error
    }
  
    if(!client) {
      getClient().then(my_client => {
        setClient(my_client)
      });
    }
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
