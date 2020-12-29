import React from "react";
import { TouchableHighlight, View, Text, ActivityIndicator } from "react-native";
import { useTheme } from "@react-navigation/native";

import colors from "../../../colors";
import styles from "./styles";

export default function CustomButton(props) {

  return (
    <TouchableHighlight style={[styles.container, props.style, {backgroundColor: colors.primary}]} onPress={props.onPress}>
      <View>
        { !props.loading &&
          <Text style={[styles.text, props.textStyle]}>{props.children}</Text>
        }
        { props.loading &&
          <ActivityIndicator size="small" color={props.loadingColor} />
        }
      </View>
    </TouchableHighlight>
  );
}