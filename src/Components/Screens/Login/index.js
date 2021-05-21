import React, { useEffect, useState } from "react";
import { View, ScrollView, Vibration, Alert } from "react-native";
import { useLazyQuery } from "@apollo/client";
import AsyncStorage from '@react-native-community/async-storage'; 
import * as Device from "expo-device";
import * as Location from "expo-location";
import { useTranslation } from "react-i18next";

import CustomButton from "../../Misc/CustomButton";

import styles from "./styles";

import queries from "./queries";
import colors from "../../../colors";
import CustomTextField from "../../Misc/CustomTextField";
import Header from "../../Misc/Header";
import CustomText from "../../Misc/CustomText";
import saveUserData from "../../../helpers/saveUserData";

export default function Login({ navigation }) {

  const [login, setLogin] = useState(null);
  const [password, setPassword] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const { t } = useTranslation();

  const [doLogin, { loading, data, error }] = useLazyQuery(queries.GET_TOKEN, {
    fetchPolicy: "network-only"
  });

  useEffect(() => {
    setIsLoading(loading);
  }, [loading]);

  // when login is done
  useEffect(() => {
    async function doStuff() {
      if(data) {
        if(data.getToken) {
          try {
            await AsyncStorage.setItem("access_token", data.getToken);
          } catch(e) {
            console.error(e);
          }
          try {
            await saveUserData();
          } catch(e) {
            console.error(e);
          }
          Vibration.vibrate([0, 70, 100, 70]);
          navigation.replace("Main");
        }
      }
    }
    doStuff();
  }, [data]);

  useEffect(() => {
    if(error) {
      Vibration.vibrate(100);

      let details;
      switch(error.message) {
        case "USER_NOT_FOUND":
          details = t("errors.user_not_found");
          break;
        case "WRONG_PASSWORD":
          details = t("errors.wrong_password");
          break;
        case "EMAIL_NOT_CONFIRMED":
          details = t("errors.email_not_confirmed");
          break;
        default:
          details = t("errors.unexpected") + "\n\n" + error.message;
      }

      Alert.alert(t("strings.error"), details);

      if(error.message == "EMAIL_NOT_CONFIRMED")
        navigation.navigate("ConfirmAccount", {
          username: login,
          password
        });
    }
  }, [error]);

  return (
    <View>
      <ScrollView>
        <View style={{padding: 15}}>
          <View style={styles.area}>
            <Header subtitle={t("screens.login.subtitle")}>
              {t("screens.login.title")}
            </Header>
          </View>
          <View style={styles.area}>
            <CustomTextField
              onChangeText={text => setLogin(text)}
              autoCompleteType="email"
              keyboardType="email-address"
              style={{marginBottom: 10}}
            >
              {t("screens.login.labels.login")}
            </CustomTextField>
            <CustomTextField
              secureTextEntry={true}
              onChangeText={text => setPassword(text)}
              autoCompleteType="password"
            >
              {t("screens.login.labels.password")}
            </CustomTextField>
          </View>
          <View style={styles.area}>
            <CustomButton loading={isLoading} loadingColor="white" onPress={async () => {

              setIsLoading(true);

              let user_lat = null, user_long = null;

              let { status } = await Location.requestPermissionsAsync();

              if(status == "granted" && await Location.hasServicesEnabledAsync()) {
                const location = await Location.getCurrentPositionAsync({
                  accuracy: Location.Accuracy.Balanced
                });
                user_lat = location.coords.latitude;
                user_long = location.coords.longitude;
              }

              doLogin({variables: {
                username: login,
                password,
                userPlatform: `${Device.manufacturer} ${Device.modelName}`,
                user_lat,
                user_long
              }});
            }}>
              {t("screens.login.labels.login_btn")}
            </CustomButton>
            <View style={{height: 5}}/>
            <CustomButton style={{backgroundColor: colors.secondary}} textStyle={{color: "black"}} onPress={() => {
              navigation.navigate("Signup");
            }}>
              {t("screens.login.labels.register")}
            </CustomButton>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};
