import React, { useState } from "react";
import { View, TextInput, TouchableOpacity } from "react-native";

import CustomText from "../CustomText";

import styles from "./styles";

export default function CommentField(props) {

  const [text, setText] = useState("");

  const onType = (e) => {
    setText(e);
  }

  const onComment = () => {
    props.onComment(text);
    setText("");
  }

  return (
    <View style={styles.container}>
      <TextInput style={styles.field} onChangeText={onType} value={text} />
      { text != "" &&
        <TouchableOpacity style={styles.buttonContainer} onPress={onComment}>
          <CustomText style={styles.button}> Comment</CustomText>
        </TouchableOpacity>
      }
    </View>
  );
}