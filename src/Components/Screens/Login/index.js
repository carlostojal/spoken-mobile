import React, { useEffect, useState } from "react";
import { View, ScrollView, Vibration, Alert } from "react-native";
import { useLazyQuery } from "@apollo/client";
import AsyncStorage from '@react-native-community/async-storage'; 
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import * as Permissions from "expo-permissions";
import { useTranslation } from "react-i18next";

import CustomButton from "../../Misc/CustomButton";

import styles from "./styles";

import queries from "./queries";
import colors from "../../../colors";
import CustomTextField from "../../Misc/CustomTextField";
import Header from "../../Misc/Header";
import CustomText from "../../Misc/CustomText";

export default function Login({ navigation }) {

  const [login, setLogin] = useState(null);
  const [password, setPassword] = useState(null);

  const [isLoading, setLoading] = useState(false);

  const [status, setStatus] = useState("");

  const { t } = useTranslation();

  const [doLogin, { loading, data, error }] = useLazyQuery(queries.GET_TOKEN, {
    fetchPolicy: "network-only"
  });

  const getPushTokenAndLogin = () => {
    setStatus("Getting expo push token");
    Notifications.getExpoPushTokenAsync().then((push_token) => {
      setStatus("Token: " + push_token.data);
      doLogin({variables: { username: login, password, userPlatform: `${Device.deviceName} (${Device.modelName})`, pushToken: push_token.data }});
    });
  }

  useEffect(() => {
    setLoading(loading);
  }, [loading]);

  // when login is done
  useEffect(() => {
    if(data) {
      if(data.getToken) {
        AsyncStorage.setItem("access_token", data.getToken).then(() => {
          Vibration.vibrate([0, 70, 100, 70]);
          navigation.replace("Main");
        }).catch((e) => {
          console.log(e);
        })
      }
    }
  }, [data]);

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
          <CustomText>
            {status}
          </CustomText>
          <View style={styles.area}>
            <CustomButton loading={isLoading} loadingColor="white" onPress={() => {
              setLoading(true);
              setStatus("Asking permission");
              Permissions.getAsync(Permissions.NOTIFICATIONS).then(({status: existingStatus}) => {
                let finalStatus = existingStatus;
                if (existingStatus !== 'granted') {
                  Permissions.askAsync(Permissions.NOTIFICATIONS).then(({status}) => {
                    finalStatus = status;
                    if (finalStatus === 'granted') {
                      getPushTokenAndLogin();
                    }
                  });
                } else {
                  getPushTokenAndLogin();
                }
              });
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
