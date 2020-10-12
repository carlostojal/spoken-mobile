import React, { useEffect, useState } from "react";
import { View, ScrollView, Text, TextInput, TouchableOpacity, Vibration, Alert } from "react-native";
import { useLazyQuery } from "@apollo/client";
import AsyncStorage from '@react-native-community/async-storage'; 
import * as Device from "expo-device";
import { useTranslation } from "react-i18next";

import CustomButton from "../../Misc/CustomButton";

import global_styles from "../../global_styles";
import styles from "./styles";

import queries from "./queries";
import colors from "../../../colors";
import CustomText from "../../Misc/CustomText";
import Header from "../../Misc/Header";

export default function Login({ navigation }) {

  const [login, setLogin] = useState(null);
  const [password, setPassword] = useState(null);

  const { t } = useTranslation();

  const [doLogin, { loading, data, error }] = useLazyQuery(queries.GET_TOKEN, {
    fetchPolicy: "network-only"
  });

  useEffect(() => {
    if(data) {
      if(data.getToken) {
        AsyncStorage.setItem("access_token", data.getToken).then(() => {
            Vibration.vibrate([0, 70, 100, 70]);
            navigation.replace("Main");
        }).catch((e) => {
          console.error(e);
        });
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
      <ScrollView contentContainerStyle={global_styles.container}>
        <View style={{padding: 15}}>
          <View style={styles.area}>
            <Header renderLogo>
              {t("screens.login.title")}
            </Header>
          </View>
          <View style={styles.area}>
            <TextInput
              style={styles.input}
              onChangeText={text => setLogin(text)}
              placeholder={t("screens.login.labels.login")}
              placeholderTextColor="gray"
              autoCompleteType="email"
              keyboardType="email-address"
            />
            <TextInput
              style={styles.input}
              secureTextEntry={true}
              onChangeText={text => setPassword(text)}
              placeholder={t("screens.login.labels.password")}
              placeholderTextColor="gray"
              autoCompleteType="password"
            />
          </View>
          <View style={styles.area}>
            <CustomButton loading={loading} loadingColor="white" onPress={() => {
              doLogin({variables: { username: login, password, userPlatform: `${Device.deviceName} (${Device.modelName})` }});
            }}>
              {t("screens.login.labels.login_btn")}
            </CustomButton>
            <View style={{height: 5}}/>
            <CustomButton style={{backgroundColor: colors.secondary}} textStyle={{color: "black"}}>
              {t("screens.login.labels.register")}
            </CustomButton>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};