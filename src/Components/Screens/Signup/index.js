import React from "react";
import { View, ScrollView } from "react-native";
import { useTranslation } from "react-i18next";

import Header from "../../Misc/Header";
import CustomTextField from "../../Misc/CustomTextField";

import global_styles from "../../global_styles";

export default function Signup() {

  const { t } = useTranslation();

  return (
    <View>
      <ScrollView contentContainerStyle={global_styles.container}>
        <View style={{padding: 15}}>
          <Header renderLogo>
            { t("screens.signup.title") }
          </Header>
          <CustomTextField style={{marginBottom: 10}}>
            { t("screens.signup.labels.name") }
          </CustomTextField>
          <CustomTextField style={{marginBottom: 10}}>
            { t("screens.signup.labels.surname") }
          </CustomTextField>
        </View>
      </ScrollView>
    </View>
  );
}
