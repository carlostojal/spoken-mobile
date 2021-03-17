import React, { useState } from "react";
import { StatusBar } from "react-native";
import AppLoading from "expo-app-loading";
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { useFonts, Raleway_400Regular, Raleway_600SemiBold, Raleway_700Bold } from '@expo-google-fonts/raleway';
import { ApolloProvider } from "@apollo/client";
import AsyncStorage from "@react-native-community/async-storage";
import Ionicons from "react-native-vector-icons/Ionicons"
import { Alert } from "react-native";

import Login from "./src/Components/Screens/Login";
import Signup from "./src/Components/Screens/Signup";
import ConfirmAccount from "./src/Components/Screens/ConfirmAccount";
import HomeScreen from "./src/Components/Screens/Home";
import SearchScreen from "./src/Components/Screens/Search";
import NewPost from "./src/Components/Screens/NewPost";
import FollowRequests from "./src/Components/Screens/FollowRequests";
import Profile from "./src/Components/Screens/Profile";
import DynamicProfile from "./src/Components/Screens/DynamicProfile";

import CustomTheme from "./src/Components/CustomTheme";
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

        let data = null;

        // try to use refresh token to get new access token
        try {
          data = await my_client.query({
            query: queries.REFRESH_TOKEN
          });
        } catch(e) {
          Alert.alert(
            "Error",
            "Connection error."
          );
        }

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

  const HomeStack = createStackNavigator();

  const Home = () => {
    return (
      <HomeStack.Navigator screenOptions={{headerShown: false}}>
        <HomeStack.Screen name="HomeScreen" component={HomeScreen} />
        <HomeStack.Screen name="DynamicProfile" component={DynamicProfile} />
      </HomeStack.Navigator>
    );
  }

  const SearchStack = createStackNavigator();

  const Search = () => {
    return (
      <SearchStack.Navigator screenOptions={{headerShown: false}}>
        <SearchStack.Screen name="SearchScreen" component={SearchScreen} />
        <SearchStack.Screen name="SearchProfile" component={DynamicProfile} />
      </SearchStack.Navigator>
    );
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
            } else if(route.name === "Search") {
              iconName = "md-search"
            } else if(route.name === "New") {
              iconName = "md-add-circle"
            } else if(route.name === "Requests") {
              iconName = "md-heart"
            } else if(route.name === "Profile") {
              iconName = "md-person"
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
        <Tab.Screen name="Search" component={Search} />
        <Tab.Screen name="New" component={NewPost} />
        <Tab.Screen name="Requests" component={FollowRequests} />
        <Tab.Screen name="Profile" component={Profile} />
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
      <NavigationContainer theme={CustomTheme}>
        <StatusBar backgroundColor={colors.card} barStyle="light-content"/>
        <Stack.Navigator
          screenOptions={{
            headerShown: false
          }}
          initialRouteName={initialRouteName}
        >
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Signup" component={Signup} />
          <Stack.Screen name="ConfirmAccount" component={ConfirmAccount} />
          <Stack.Screen name="Main" component={Main} />
        </Stack.Navigator>
      </NavigationContainer>
    </ApolloProvider>
  );
}
