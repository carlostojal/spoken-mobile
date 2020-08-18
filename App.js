import React, { useState } from "react";
import { AppLoading } from "expo";
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';
import { useFonts, Inter_900Black } from '@expo-google-fonts/inter';
import * as Updates from "expo-updates";

import Login from "./src/Components/Screens/Login";

export default function App() {

  const [isReady, setIsReady] = useState(false);

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
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false
        }}
      >
        <Stack.Screen name="Login" component={Login} options={{
          cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS
        }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

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
}
