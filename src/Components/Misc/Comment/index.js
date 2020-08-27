import React from "react";
import { View } from "react-native";

import CustomText from "../CustomText";

import postDateFormat from "../../../helpers/postDateFormat";
import styles from "./styles";

export default function Comment(props) {

  const dateFormatResult = postDateFormat(parseInt(props.data.time));

  return (
    <View style={styles.container}>
      <View style={styles.part1}>
        <CustomText style={styles.username}>{`@${props.data.user.username}`}</CustomText>
        <CustomText style={styles.content}>{props.data.text}</CustomText>
      </View>
      <CustomText style={styles.time}>{dateFormatResult.value + dateFormatResult.unit}</CustomText>
    </View>
  );
}