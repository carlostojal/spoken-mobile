import React from "react";
import { View } from "react-native";
import { useTranslation } from "react-i18next";

import CustomText from "../CustomText";
import CustomButtom from "../CustomButton";
import styles from "./styles";
import colors from "../../../colors";

export default function FollowRequest({ user }) {

  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <CustomText style={styles.username}>
        { user.username }
      </CustomText>
      <CustomText style={styles.name}>
        { user.name + " " + user.surname }
      </CustomText>
      <View style={{flex: 1, flexDirection: "row"}}>
        <CustomButtom>
          { t("screens.follow_requests.labels.accept") }
        </CustomButtom>
        <CustomButtom style={{backgroundColor: colors.secondary, marginLeft: 10}} textStyle={{color: "black"}}>
          { t("screens.follow_requests.labels.ignore") }
        </CustomButtom>
      </View>
    </View>
  );
} 