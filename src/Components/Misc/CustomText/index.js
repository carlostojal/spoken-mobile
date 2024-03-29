import React from "react";
import { Text } from "react-native";

import styles from "./styles";

export default CustomText = (props) => {
  return (
    <Text allowFontScaling={false} style={[styles.text, props.style]}>{props.children}</Text>
  );
}