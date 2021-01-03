import React, { useState, useEffect } from "react";
import { View, Alert, Vibration } from "react-native";
import { useTranslation } from "react-i18next";
import { useMutation } from "@apollo/client";

import Header from "../../Misc/Header";
import CustomTextField from "../../Misc/CustomTextField";
import CustomButton from "../../Misc/CustomButton";

import queries from "./queries";
import styles from "./styles";

export default function NewPost(props) {

  const { t } = useTranslation();

  const [text, setText] = useState("");

  const [ createPost, { data: createPostData, loading: createPostLoading, error: createPostError } ] = useMutation(queries.CREATE_POST);

  useEffect(() => {
    if(createPostError) {
      Vibration.vibrate([0, 70, 100, 70]);
      Alert.alert(t("strings.error"), t("errors.unexpected") + "\n\n" + createPostError.message);
    }
  }, [createPostError]);

  useEffect(() => {
    if(createPostData && createPostData.createPost) {
      Vibration.vibrate([0, 70, 100, 70]);
      setText(""); // clear text box
      Alert.alert(t("strings.success"), t("screens.new_post.labels.success")); // show success alert
      props.navigation.navigate("Home"); // navigate home
    }
  }, [createPostData]);

  return (
    <View>
      <Header>
        { t("screens.new_post.title") }
      </Header>
      <View style={styles.container}>
        <CustomTextField
          multiline={true}
          numberOfLines={5}
          textAlignVertical="top"
          inputStyle={{borderRadius: 20}}
          onChangeText={(text) => setText(text)}
          value={text}
        >
          { t("screens.new_post.labels.text") }
        </CustomTextField>
        <View style={styles.btn_area}>
          <CustomButton 
            loading={createPostLoading}
            onPress={() => {
              createPost({ variables: { text } })
            }}
          >
            { t("screens.new_post.labels.post_btn") }
          </CustomButton>
        </View>
      </View>
    </View>
  );
}