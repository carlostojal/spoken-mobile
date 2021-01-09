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
        { t("misc.no_results.heading") }
      </CustomText>
      <CustomText style={styles.text}>
        { t("misc.no_results.text") }
      </CustomText>
    </View>
  );
}