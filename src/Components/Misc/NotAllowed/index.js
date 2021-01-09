import React from "react";
import { View } from "react-native";
import { useTranslation } from "react-i18next";

import CustomText from "../CustomText";
import styles from "./styles";

export default function NoPosts() {

  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <CustomText style={styles.heading}>
        { t("misc.not_allowed.heading") }
      </CustomText>
      <CustomText style={styles.text}>
        { t("misc.not_allowed.text") }
      </CustomText>
    </View>
  );
}