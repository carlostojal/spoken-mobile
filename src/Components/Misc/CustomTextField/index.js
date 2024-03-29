import React, { useState } from "react";
import { View, TextInput } from "react-native";
import colors from "../../../colors";

import styles from "./styles";

export default function CustomTextField(props) {

  return (
    <View style={props.style}>
      <TextInput 
        style={[styles.field, props.inputStyle]} 
        secureTextEntry={props.secureTextEntry}
        onChangeText={props.onChangeText} 
        placeholder={props.children} 
        placeholderTextColor={colors.text}
        keyboardType={props.keyboardType} 
        multiline={props.multiline}
        numberOfLines={props.numberOfLines} 
        textAlignVertical={props.textAlignVertical}
        value={props.value}
        />
    </View>
  );
}