import React, { useState, useEffect } from "react";
import { ScrollView, View, Alert, Vibration, Image } from "react-native";
import AsyncStorage from "@react-native-community/async-storage";
import { useTranslation } from "react-i18next";
import { useMutation } from "@apollo/client";
import Constants from "expo-constants";
import * as ImagePicker from "expo-image-picker";

import Header from "../../Misc/Header";
import CustomTextField from "../../Misc/CustomTextField";
import CustomButton from "../../Misc/CustomButton";

import queries from "./queries";
import styles from "./styles";
import colors from "../../../colors";

export default function NewPost(props) {

  const { t } = useTranslation();

  const [text, setText] = useState("");

  const [ createPost, { data: createPostData, loading: createPostLoading, error: createPostError } ] = useMutation(queries.CREATE_POST);

  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploadDone, setUploadDone] = useState(false);
  const [image, setImage] = useState(null);
  const [mediaId, setMediaId] = useState(null);

  useEffect(() => {
    if(createPostError) {
      
      let details = t("errors.unexpected") + "\n\n" + createPostError.message;
      switch(createPostError.message) {
        case "INVALID_TEXT":
          details = t("errors.invalid_post_text");
          break;
      }

      Alert.alert(t("strings.error"), details);
    }
  }, [createPostError]);

  useEffect(() => {
    if(createPostData && createPostData.createPost) {
      Vibration.vibrate([0, 70, 100, 70]);
      setText(""); // clear text box
      setMediaId(null);
      setUploadDone(false);
      Alert.alert(t("strings.success"), t("screens.new_post.labels.success")); // show success alert
      props.navigation.navigate("Home"); // navigate home
    }
  }, [createPostData]);

  const onUpload = async () => {

    setUploadLoading(true);

    let img;
    try {
      img = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true
      });
    } catch(e) {
      Alert.alert(t("strings.error"), t("errors.error_uploading_media"));
      setUploadLoading(false);
    }

    if(img.cancelled) {
      setUploadLoading(false);
    } else {

      setImage(img);

      let localUri = img.uri;
      let filename = localUri.split('/').pop();

      let match = /\.(\w+)$/.exec(filename);
      let type = match ? `image/${match[1]}` : `image`;

      let form = new FormData();
      form.append("media", { uri: localUri, name: filename, type });

      let uploadResult = null;

      try {
        const url = `${Constants.manifest.extra.EXPRESS_ADDRESS}:${Constants.manifest.extra.EXPRESS_PORT}/upload`;
        uploadResult = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "multipart/form-data",
            "Authorization": await AsyncStorage.getItem("access_token")
          },
          body: form
        });

        setUploadLoading(false);

      } catch(e) {
        Alert.alert(t("strings.error"), t("errors.error_uploading_media"));
        setUploadLoading(false);
      }

      uploadResult = await uploadResult.json();

      switch(uploadResult.result) {
        case "FILE_UPLOADED":
          setUploadDone(true);
          setMediaId(parseInt(uploadResult.media_id));
          break;
        default:
          Alert.alert(t("strings.error"), t("errors.error_uploading_media"));
          break;
      }
    }
  };

  return (
    <ScrollView>
      <Header>
        { t("screens.new_post.title") }
      </Header>
      <View style={styles.container}>
        { image && uploadDone &&
          <Image source={{uri: image.uri}} style={{width: 50, height: 50, borderRadius: 5, marginBottom: 10}} resizeMode="cover" />
        }
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
          <CustomButton style={{backgroundColor: colors.secondary, marginBottom: 5}} textStyle={{color: "black"}} loading={uploadLoading} onPress={() => {
            onUpload();
          }}>
            { uploadDone ? t("screens.new_post.labels.change_upload") : t("screens.new_post.labels.upload_btn") }
          </CustomButton>
          <CustomButton 
            loading={createPostLoading}
            onPress={() => {
              createPost({ variables: { text, media_id: mediaId } })
            }}
          >
            { t("screens.new_post.labels.post_btn") }
          </CustomButton>
        </View>
      </View>
    </ScrollView>
  );
}