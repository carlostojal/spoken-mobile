import React, { useState, useEffect } from "react";
import { ScrollView, View, Alert, Vibration, Image, ActivityIndicator, TouchableWithoutFeedback } from "react-native";
import AsyncStorage from "@react-native-community/async-storage";
import { useTranslation } from "react-i18next";
import { useMutation } from "@apollo/client";
import Constants from "expo-constants";
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";
import Ionicons from "react-native-vector-icons/Ionicons";
import { Audio } from "expo-av";

import Header from "../../Misc/Header";
import CustomTextField from "../../Misc/CustomTextField";
import CustomButton from "../../Misc/CustomButton";
import Post from "../../Misc/Post";

import queries from "./queries";
import styles from "./styles";
import colors from "../../../colors";
import CustomText from "../../Misc/CustomText";
import getFullBackendAddress from "../../../helpers/getFullBackendAddress";

export default function NewPost(props) {

  const { t } = useTranslation();

  const [text, setText] = useState("");

  const [ createPost, { data: createPostData, loading: createPostLoading, error: createPostError } ] = useMutation(queries.CREATE_POST);

  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploadDone, setUploadDone] = useState(false);
  const [recordingAudio, setRecordingAudio] = useState(false);
  const [recordingObject, setRecordingObject] = useState(null);
  const [image, setImage] = useState(null);
  const [audio, setAudio] = useState(null);
  const [mediaId, setMediaId] = useState(null);
  const [mediaForm, setMediaForm] = useState(null);
  const [originalPost, setOriginalPost] = useState(props.route.params && props.route.params.original_post ? JSON.parse(props.route.params.original_post) : null);

  // console.log(props.route.params && props.route.params.original_post);

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
      clear();
      Alert.alert(t("strings.success"), t("screens.new_post.labels.success")); // show success alert
      props.navigation.navigate("Home"); // navigate home
    }
  }, [createPostData]);

  const clear = () => {
    setText(""); // clear text box
    setMediaId(null);
    setUploadDone(false);
    setImage(null);
    setAudio(null);
    setMediaForm(null);
    setOriginalPost(null);
  }

  const onUpload = async () => {

    setUploadLoading(true);

    let img;
    try {
      img = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1]
      });
    } catch(e) {
      Alert.alert(t("strings.error"), t("errors.error_uploading_media"));
      setUploadLoading(false);
    }

    if(img.cancelled) {
      setUploadLoading(false);
    } else {

      const manipResult = await ImageManipulator.manipulateAsync(img.uri, [], {
        compress: Constants.manifest.extra.IMAGE_COMPRESSION_LEVEL,
        format: ImageManipulator.SaveFormat.JPEG
      });

      setImage(manipResult);

      let localUri = manipResult.uri;
      let filename = localUri.split('/').pop();

      let match = /\.(\w+)$/.exec(filename);
      let type = match ? `image/${match[1]}` : `image`;

      let form = new FormData();
      form.append("media", { uri: localUri, name: filename, type });

      setMediaForm(form);
      setUploadLoading(false);

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
    setAudio(uri);

    let filename = uri.split('/').pop();

    let form = new FormData();
    form.append("media", { uri, name: filename, type: "audio/3gpp" });

    setMediaForm(form);
    setUploadLoading(false);
  };

  return (
    <ScrollView>
      <Header>
        { t("screens.new_post.title") }
      </Header>
      <View style={styles.container}>
        { /* image &&
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
          */ }
        { originalPost &&
          <View style={{marginBottom: 20}}>
            <CustomText style={{fontSize: 20, marginBottom: 10}}>
              { t("screens.new_post.labels.replying_to") }
            </CustomText>
            <Post data={originalPost} renderFooter={false} />
          </View>
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
              { image ? t("screens.new_post.labels.change_upload") : t("screens.new_post.labels.upload_btn") }
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
          <CustomButton style={{backgroundColor: colors.secondary, marginBottom: 5}} textStyle={{color: "black"}} loading={uploadLoading} onPress={() => clear()}>
            { t("screens.new_post.labels.clear_btn") }
          </CustomButton>
          <CustomButton 
            loading={createPostLoading || uploadLoading}
            onPress={async () => {

              let uploadResult = null;

              if(mediaForm) {

                setUploadLoading(true);

                try {
                  const url = `${getFullBackendAddress("media")}/upload`;
                  const tokens = JSON.parse(await AsyncStorage.getItem("tokens"));
                  uploadResult = await fetch(url, {
                    method: "POST",
                    headers: {
                      "Content-Type": "multipart/form-data",
                      "Authorization": tokens && tokens.access ? tokens.access : ""
                    },
                    body: mediaForm
                  });
            
                  setUploadLoading(false);
            
                } catch(e) {
                  console.error(e);
                  Alert.alert(t("strings.error"), t("errors.error_uploading_media"));
                  setUploadLoading(false);
                }
            
                uploadResult = await uploadResult.json();

                console.log(uploadResult);
            
                switch(uploadResult.result) {
                  case "FILE_UPLOADED":
                    setUploadDone(true);
                    console.log(uploadResult.media_id);
                    break;
                  default:
                    Alert.alert(t("strings.error"), t("errors.error_uploading_media"));
                    break;
                }
              }

              console.log("test");

              const vars = {
                text,
                media_id: uploadResult && uploadResult.media_id ? uploadResult.media_id : null,
                original_post_id: props.route.params && props.route.params.original_post ? JSON.parse(props.route.params.original_post)._id : null
              }

              console.log(vars);

              await createPost({
                variables: vars
              });
            }}
          >
            { t("screens.new_post.labels.post_btn") }
          </CustomButton>
        </View>
      </View>
    </ScrollView>
  );
}