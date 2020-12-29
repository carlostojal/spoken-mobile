import React, { useEffect, useState } from "react";
import { View, ScrollView, Text, TextInput, TouchableOpacity, Vibration, Alert } from "react-native";
import { useLazyQuery,useMutation } from "@apollo/client";
import AsyncStorage from '@react-native-community/async-storage'; 
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { useTranslation } from "react-i18next";

import CustomButton from "../../Misc/CustomButton";

import styles from "./styles";

import queries from "./queries";
import colors from "../../../colors";
import CustomTextField from "../../Misc/CustomTextField";
import Header from "../../Misc/Header";

export default function Login({ navigation }) {

  const [login, setLogin] = useState(null);
  const [password, setPassword] = useState(null);

  const [loginDone, setLoginDone] = useState(false);
  const [tokenRegisterDone, setTokenRegisterDone] = useState(false);

  const { t } = useTranslation();

  const [doLogin, { loading, data, error }] = useLazyQuery(queries.GET_TOKEN, {
    fetchPolicy: "network-only"
  });

  const [setPushToken, {loading: setPushTokenLoading, data: setPushTokenData, error: setPushTokenError}] = useMutation(queries.SET_PUSH_TOKEN, {
    fetchPolicy: "no-cache"
  });

  // when login is done
  useEffect(() => {
    if(data) {
      if(data.getToken) {
        console.log("Login done.");
        AsyncStorage.setItem("access_token", data.getToken).then(() => {
          setLoginDone(true);
        }).catch((e) => {
          console.log(e);
        });
      }
    }
  }, [data]);

  // when login is done, start setting push token
  useEffect(() => {
    if(loginDone) {
      console.log("Setting push token...");
      Notifications.getExpoPushTokenAsync().then((push_token) => {
        setPushToken({variables: {token: push_token.data}});
      });
    }
  }, [loginDone]);

  // when push token is set, set flag to true
  useEffect(() => {
    if(setPushTokenData && setPushTokenData.setExpoPushToken) {
      setTokenRegisterDone(true);
    }
  }, [setPushTokenData]);

  // when login or token register are updated, if both are done, skip login
  useEffect(() => {
    if(loginDone && tokenRegisterDone) {
      console.log("Login done and push token set.");
      Vibration.vibrate([0, 70, 100, 70]);
      navigation.replace("Main");
    }
  }, [loginDone, tokenRegisterDone]);

  useEffect(() => {
    if(error) {
      console.log(error);
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
          details = t("errors.unexpected");
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
            <Header renderLogo>
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
            <CustomButton loading={loading || setPushTokenLoading} loadingColor="white" onPress={() => {
              doLogin({variables: { username: login, password, userPlatform: `${Device.deviceName} (${Device.modelName})` }});
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
