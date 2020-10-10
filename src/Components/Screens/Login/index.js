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

export default function Login({ navigation }) {

  const [login, setLogin] = useState(null);
  const [password, setPassword] = useState(null);

  const { t } = useTranslation();

  const [doLogin, { loading, data, error }] = useLazyQuery(queries.GET_TOKEN);

  useEffect(() => {
    if(data) {
      if(data.getToken) {
        AsyncStorage.setItem("access_token", data.getToken).then(() => {
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
        case "WRONG_PASSWORD":
          details = t("errors.wrong_password");
      }

      Alert.alert(t("strings.error"), details);
    }
  }, [error]);

  return (
    <View>
      <ScrollView contentContainerStyle={global_styles.container}>
        <View style={styles.area}>
            <CustomText style={{fontSize: 40, fontFamily: "Raleway_700Bold"}}>
              Hello
            </CustomText>
          </View>
        <View style={styles.area}>
          <TextInput
            style={styles.input}
            onChangeText={text => setLogin(text)}
            placeholder={t("screens.login.labels.login")}
            placeholderTextColor="gray"
            autoCompleteType="username"
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
          <CustomButton onPress={() => {
            doLogin({variables: { username: login, password, userPlatform: `${Device.brand} ${Device.modelName}` }});
          }}>
            {t("screens.login.labels.login_btn")}
          </CustomButton>
          <View style={{height: 10}}/>
          <CustomButton style={{backgroundColor: colors.secondary}} textStyle={{color: "black"}}>
            {t("screens.login.labels.not_registered_2")}
          </CustomButton>
        </View>
      </ScrollView>
    </View>
  );
};