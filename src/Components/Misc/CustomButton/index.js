import React from "react";
import { TouchableHighlight, Text } from "react-native";

import styles from "./styles";

export default function CustomButton(props) {
  return (
    <TouchableHighlight style={[styles.container, props.style]} onPress={props.onPress}>
      <Text style={[styles.text, props.textStyle]}>{props.children}</Text>
    </TouchableHighlight>
  );
}