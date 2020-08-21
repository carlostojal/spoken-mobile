import React, { useState } from "react";
import { View, ScrollView, Image, Text, TextInput, TouchableOpacity, Vibration } from "react-native";
import { useLazyQuery } from "@apollo/client";
import AsyncStorage from '@react-native-community/async-storage'; 
import { useTranslation } from "react-i18next";

import global_styles from "../../global_styles";
import styles from "./styles";

import queries from "./queries";

export default function Login({ navigation }) {

  const [login, setLogin] = useState(null);
  const [password, setPassword] = useState(null);
  const [navigated, setNavigated] = useState(false);
  const [shouldVibrate, setShouldVibrate] = useState(false);

  const { t } = useTranslation();

  const [doLogin, { loading, data, error }] = useLazyQuery(queries.GET_TOKEN, {
    variables: {
      username: login,
      password: password
    }
  });

  if(data) {
    if(data.getToken) {
      AsyncStorage.setItem("access_token", data.getToken).then(() => {
        if(!navigated) {
          navigation.replace("Main");
          setNavigated(true);
        }
      }).catch((e) => {
        console.log(e);
      });
    } else {
      if(shouldVibrate) {
        Vibration.vibrate(100);
        setShouldVibrate(false);
      }
    }
  }

  return (
    <View>
      <ScrollView contentContainerStyle={[global_styles.container, { alignItems: "center" }]}>
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
          <View style={styles.not_registered}>
            <Text>{t("screens.login.labels.not_registered_1")}</Text>
            <TouchableOpacity>
              <Text style={styles.register}>{t("screens.login.labels.not_registered_2")}</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.area}>
          <TouchableOpacity onPress={() => {
            setShouldVibrate(true);
            doLogin();
          }}>
            <Text>Login</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};