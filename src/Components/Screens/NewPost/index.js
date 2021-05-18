import React, { useState, useEffect } from "react";
import { ScrollView, View, Alert, Vibration, Image, ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-community/async-storage";
import { useTranslation } from "react-i18next";
import { useMutation } from "@apollo/client";
import Constants from "expo-constants";
import * as ImagePicker from "expo-image-picker";
import Ionicons from "react-native-vector-icons/Ionicons";
import { Audio } from "expo-av";

import Header from "../../Misc/Header";
import CustomTextField from "../../Misc/CustomTextField";
import CustomButton from "../../Misc/CustomButton";

import queries from "./queries";
import styles from "./styles";
import colors from "../../../colors";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";

export default function NewPost(props) {

  const { t } = useTranslation();

  const [text, setText] = useState("");

  const [ createPost, { data: createPostData, loading: createPostLoading, error: createPostError } ] = useMutation(queries.CREATE_POST);

  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploadDone, setUploadDone] = useState(false);
  const [recordingAudio, setRecordingAudio] = useState(false);
  const [recordingObject, setRecordingObject] = useState(null);
  const [mediaUploadType, setMediaUploadType] = useState(null);
  const [image, setImage] = useState(null);
  const [audio, setAudio] = useState(null);
  const [audioPlaying, setAudioPlaying] = useState(false);
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
        const url = `${Constants.manifest.extra.MEDIA_SERVER_ADDRESS}:${Constants.manifest.extra.MEDIA_ADDRESS_PORT}/upload`;
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
          setMediaId(uploadResult.media_id);
          break;
        default:
          Alert.alert(t("strings.error"), t("errors.error_uploading_media"));
          break;
      }
    }
  };

  const onRecord = async () => {

    await Audio.requestPermissionsAsync();
    
    const recording = new Audio.Recording();
    await recording.prepareToRecordAsync(Audio.RECORDING_OPTIONS_PRESET_LOW_QUALITY);
    setRecordingAudio(true);
    await recording.startAsync();
    setRecordingObject(recording);

  };

  const onStopRecord = async () => {
    await recordingObject.stopAndUnloadAsync();
    setRecordingAudio(false);
    const uri = recordingObject.getURI();
    console.log(uri);
    setAudio(uri);

    setUploadLoading(true);

    let filename = uri.split('/').pop();

    // let match = /\.(\w+)$/.exec(filename);
    // let type = match ? `image/${match[1]}` : `image`;

    let form = new FormData();
    form.append("media", { uri, name: filename, type: "audio/3gpp" });

    let uploadResult = null;

    try {
      const url = `${Constants.manifest.extra.MEDIA_SERVER_ADDRESS}:${Constants.manifest.extra.MEDIA_SERVER_PORT}/upload`;
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
      console.error(e);
      Alert.alert(t("strings.error"), t("errors.error_uploading_media"));
      setUploadLoading(false);
    }

    uploadResult = await uploadResult.json();

    switch(uploadResult.result) {
      case "FILE_UPLOADED":
        setUploadDone(true);
        setMediaId(uploadResult.media_id);
        break;
      default:
        Alert.alert(t("strings.error"), t("errors.error_uploading_media"));
        break;
    }
  };

  return (
    <ScrollView>
      <Header>
        { t("screens.new_post.title") }
      </Header>
      <View style={styles.container}>
        { image || audio &&
          <TouchableWithoutFeedback style={{width: 50, height: 50, marginBottom: 10, borderRadius: 5, backgroundColor: colors.card, justifyContent: "center", alignItems: "center"}} onPress={async () => {
            if(audio && !audioPlaying) {
              const sound = new Audio.Sound();
              await sound.loadAsync({
                uri: audio
              });
              sound.setOnPlaybackStatusUpdate(async (status) => {
                if(status.didJustFinish) {
                  setAudioPlaying(false);
                  await sound.unloadAsync();
                }
              });
              setAudioPlaying(true);
              await sound.playAsync();
            }
          }}>
            { image && uploadDone &&
              <Image source={{uri: image.uri}} style={{width: 50, height: 50, borderRadius: 5}} resizeMode="cover" />
            }
            { audio && uploadDone &&
              <>
                { audioPlaying &&
                  <ActivityIndicator size="small" color={colors.primary} />
                }
                { !audioPlaying &&
                  <Ionicons name="play" size={30} color={colors.primary} />
                }
              </>
            }
          </TouchableWithoutFeedback>
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
          { !audio && !recordingAudio &&
            <CustomButton style={{backgroundColor: colors.secondary, marginBottom: 5}} textStyle={{color: "black"}} loading={uploadLoading} onPress={() => {
              onUpload();
            }}>
              { uploadDone ? t("screens.new_post.labels.change_upload") : t("screens.new_post.labels.upload_btn") }
            </CustomButton>
          }
          { !image &&
            <CustomButton style={{backgroundColor: colors.secondary, marginBottom: 5}} textStyle={{color: "black"}} loading={uploadLoading} onPress={async () => {
              if(!recordingAudio)
                await onRecord();
              else
                await onStopRecord();
            }}>
              { !recordingAudio ? t("screens.new_post.labels.record_audio") : t("screens.new_post.labels.stop_recording") }
            </CustomButton>
          }
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