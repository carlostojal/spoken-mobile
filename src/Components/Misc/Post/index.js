import React, { useState, useEffect, useRef } from "react";
import { View, Image, TouchableOpacity, Alert, TouchableWithoutFeedback, ActivityIndicator, Button } from "react-native";
import { useMutation } from "@apollo/client";
import { useTranslation } from "react-i18next";
import Icon from "react-native-vector-icons/FontAwesome";
import BottomSheet from "react-native-raw-bottom-sheet";
import InViewPort from "@coffeebeanslabs/react-native-inviewport";
import * as Device from "expo-device";
import { Audio } from "expo-av";
import Constants from "expo-constants";
import * as Location from "expo-location";
import AsyncStorage from "@react-native-community/async-storage";

import CustomText from "../CustomText";

import postDateFormat from "../../../helpers/postDateFormat";
import refreshToken from "../../../helpers/refreshToken";
import styles from "./styles";
import queries from "./queries";
import colors from "../../../colors";

export default function Post(props) {

  const { t } = useTranslation();

  const [post, setPost] = useState(props.data);

  const [imageLoaded, setImageLoaded] = useState(false);

  const [imageHeight, setImageHeight] = useState(null);

  const [shouldBlur, setShouldBlur] = useState(post && post.media && post.media.is_nsfw);

  const [viewStartTime, setViewStartTime] = useState(Date.now());
  const [postIsVisible, setPostIsVisible] = useState(false);

  const [audioButtonLabel, setAudioButtonLabel] = useState("Play");

  const [userReacted, setUserReacted] = useState(false);

  const [audioPlayPercentage, setAudioPlayPercentage] = useState(0);

  const [currentUser, setCurrentUser] = useState(null);

  const bottomSheetRef = useRef();

  const [reactPost, { data: reactData, loading: reactLoading, error: reactError }] = useMutation(queries.REACT_POST, {
    errorPolicy: "all",
    onError: (error) => {
      refreshToken(reactPost, { variables: { id: post._id } })
    }
  });

  const [deletePost, { data: deleteData, loading: deleteLoading, error: deleteError }] = useMutation(queries.DELETE_POST, {
    variables: {
      id: post._id
    }
  });

  const [collectPostView, { data: collectData, loading: collectLoading, error: collectError }] = useMutation(queries.COLLECT_VIEW);

  useEffect(() => {
    async function getUserData() {
      let user_data = null;
      user_data = await AsyncStorage.getItem("user_data");
      user_data = JSON.parse(user_data);
      setCurrentUser(user_data);
    }
    getUserData();
  }, []);

  useEffect(() => {
    if(props.data)
      setPost(props.data);
  }, [props.data]);

  useEffect(() => {
    if(post && currentUser && post.reactions && post.reactions.length > 0) {
      if(post.reactions.some(item => item._id == currentUser._id))
        setUserReacted(true);
    }
  }, [post, currentUser]);

  useEffect(() => {
    if(reactError) {
      setUserReacted(!userReacted);
      Alert.alert(t("strings.error"), reactError.message)
    }
  }, [reactError]);

  useEffect(() => {
    if(deleteError) {
      Alert.alert(t("strings.error"), deleteError.message);
    }
  }, [deleteError]);

  useEffect(() => {
    if(deleteData && deleteData.deletePost)
      Alert.alert(t("strings.success"), t("misc.post.delete_successful"));
  });

  if(post) {

    const dateFormatResult = postDateFormat(parseInt(post.time));

    const onReact = async () => {

      setUserReacted(!userReacted);

      let vars = {
        id: post._id
      }

      const allowed = currentUser.permissions.collect_usage_data;

      if(allowed) {
        
        const { status } = await Location.getPermissionsAsync();

        if(status == "granted") {

          const location = await Location.getCurrentPositionAsync();

          vars.user_lat = location.coords.latitude;
          vars.user_long = location.coords.longitude;
          vars.user_platform = `${Device.manufacturer} ${Device.modelName}`;
          vars.user_os = Device.osName;
        }
      }

      reactPost({
        variables: vars
      });
      
    }

    const onComment = () => {

      props.navigation.navigate("New", {
        original_post: JSON.stringify(post)
      });

    }

    const goToProfile = (id) => {
      let destination = "DynamicProfile";
      if(props.profileType) {
        switch(props.profileType) {
          case "dynamic":
            destination = "DynamicProfile";
            break;
          case "personal":
            destination = "Profile";
            break;
          case "search":
            destination = "SearchProfile";
            break;
        }
      }
      if(props.navigation) {
        props.navigation.navigate(destination, {
          user_id: id
        });
      }
    };

    const onVisibleChange = async (post_id, isVisible) => {

      if(isVisible != postIsVisible) {

        setPostIsVisible(isVisible);

        if(isVisible) {

          setViewStartTime(Date.now());

        } else {

          const allowed = currentUser.permissions.collect_usage_data;

          let data = {
            id: post_id
          };

          if(allowed) {

            data.user_platform = `${Device.manufacturer} ${Device.modelName}`;
            data.user_os = Device.osName;
            data.view_time = (Date.now() - viewStartTime) / 1000;

            const { status } = await Location.requestPermissionsAsync();
            if(status == "granted") {
              const location = await Location.getCurrentPositionAsync();
              data.user_lat = location.coords.latitude;
              data.user_long = location.coords.longitude;
            }
          }

          collectPostView({
            variables: data
          });

          setViewStartTime(null);
        }
      }
    };

    return (
      <InViewPort onChange={(isVisible) => onVisibleChange(post._id, isVisible)}>
        <View style={[{ backgroundColor: colors.card , borderRadius: 20, overflow: "hidden"}, props.containerStyle]}>
          { post.media &&
            <>
              { post.media.type == "image" &&
                <Image source={{uri: `post.media.id`}} style={{ width: imageDimensions.width, height: imageDimensions.height }} onLoadEnd={() => setImageLoaded(true)} />
              }
              { post.media.type == "audio" &&
              <>
                <TouchableOpacity style={{justifyContent: "center", alignItems: "center"}} onPress={async () => {
                  if(audioButtonLabel == "Play") {
                    const audio = new Audio.Sound();
                    const access_token = await AsyncStorage.getItem("access_token");
                    await audio.loadAsync({
                      uri: `${Constants.manifest.extra.MEDIA_SERVER_ADDRESS}:${Constants.manifest.extra.MEDIA_SERVER_PORT}/media/${post.media._id}/${access_token}`
                    });
                    audio.setOnPlaybackStatusUpdate(async (status) => {
                      // console.log(status);
                      if(status.isPlaying)
                        setAudioButtonLabel(parseInt((status.playableDurationMillis - status.positionMillis) / 1000) + 1 + "s");
                      if(status.didJustFinish) {
                        setAudioButtonLabel("Play");
                        await audio.unloadAsync();
                      }
                      const perc = status.positionMillis / status.playableDurationMillis;
                      if(perc == 1)
                        setAudioPlayPercentage(0);
                      else
                        setAudioPlayPercentage(perc || 0);
                    });
                    // setAudioPlaying(true);
                    await audio.playAsync();
                    // await audio.unloadAsync();
                    // setAudioPlaying(false);
                  }
                }} >
                  <Image style={{width: 360, height: 200}} blurRadius={(1 - audioPlayPercentage) * 5} source={{uri: `${Constants.manifest.extra.MEDIA_SERVER_ADDRESS}:${Constants.manifest.extra.MEDIA_SERVER_PORT}/media/${post.poster.profile_pic._id}`}} />
                  { audioPlayPercentage != 0 &&
                    <ActivityIndicator color={colors.primary} size="large" style={{position: "absolute"}} />
                  }
                  { audioPlayPercentage == 0 &&
                    <Icon name="play" size={50} color={colors.primary} style={{position: "absolute"}} />
                  }
                  
                </TouchableOpacity>
                </>
              }
            </>
          }
          {
            // header
          }
          <View style={styles.header}>
            <TouchableOpacity onPress={() => goToProfile(post.poster.id)} style={{flexDirection: "row"}}>
              { post.poster.profile_pic &&
                <Image style={{width: 40, height: 40, borderRadius: 50}} source={{uri: `${Constants.manifest.extra.MEDIA_SERVER_ADDRESS}:${Constants.manifest.extra.MEDIA_SERVER_PORT}/media/${post.poster.profile_pic._id}`}} />
              }
              <View style={{marginLeft: 10}}>
                <CustomText style={styles.username}>{post.poster.username}</CustomText>
                <CustomText style={styles.name}>{`${post.poster.name} ${post.poster.surname}`}</CustomText>
              </View>
            </TouchableOpacity>
            <View style={styles.time_options}>
              <CustomText style={styles.time}>{dateFormatResult.value + dateFormatResult.unit}</CustomText>
              { currentUser && currentUser._id == post.poster._id &&
                <TouchableWithoutFeedback onPress={() => bottomSheetRef.current.open()}>
                  <Icon name="navicon" size={20} style={{marginLeft: 10}} color="white" />
                </TouchableWithoutFeedback>
              }
            </View>
          </View>
          {
            // content
          }
          { post.media && post.media.url &&
            <>
              <View style={{width: 365, height: imageHeight}}>
                <TouchableWithoutFeedback onPress={() => {
                  setShouldBlur(!shouldBlur);
                }}>
                  <Image source={{uri: post.media.url}} style={{flex: 1, width: undefined, height: undefined}} blurRadius={shouldBlur ? 10 : null} />
                </TouchableWithoutFeedback>
              </View>
            </>
          }
          { post.original_post &&
            <TouchableOpacity style={{borderWidth: 1, borderColor: "#474747", borderRadius: 20, margin: 10}}>
              <Post data={post.original_post} renderFooter={false} navigation={props.navigation} />
            </TouchableOpacity>
          }
          <CustomText style={[styles.content, {paddingTop: post.media && post.media.url ? 15 : 0}]}>
            {post.text}
          </CustomText>
          {
            // footer
          }
          { (props.renderFooter == true || props.renderFooter == undefined) &&
            <View style={{flexDirection: "row", padding: 10}}>
              {
                <>
                  <TouchableOpacity onPress={onReact} style={{flex: 1, alignItems: "center"}}>
                    { userReacted &&
                      <Icon name="heart" size={25} color={colors.primary} />
                    } 
                    { !userReacted &&
                      <Icon name="heart-o" size={25} color="#FFFFFF" />
                    }
                  </TouchableOpacity>
                  <TouchableOpacity onPress={onComment} style={{marginLeft: 10}} style={{flex: 1, alignItems: "center"}}>
                    <Icon name="comment-o" size={25} color="#FFFFFF" />
                  </TouchableOpacity>
                </>
              }
            </View>
          }
          <BottomSheet
            ref={bottomSheetRef}
            closeOnDragDown={true}
            closeOnPressBack={true}
            customStyles={{
              container: {
                backgroundColor: "black"
              }
            }}
          >
            <TouchableOpacity>
              <CustomText style={styles.options_option}>
                { t("misc.post.edit") }
              </CustomText>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => props.navigation.navigate("Profile", {
              screen: "Promote",
              params: {
                post_id: post._id
              }
            })}>
              <CustomText style={styles.options_option}>
                { t("misc.post.promote") }
              </CustomText>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {
              Alert.alert(t("misc.post.delete"), t("misc.post.confirm_delete"), [
                {
                  text: t("strings.ok"),
                  onPress: () => {
                    deletePost();
                  }
                },
                {
                  text: t("strings.cancel")
                }
              ])
            }}>
              { deleteLoading && 
                <ActivityIndicator />
              }
              { !deleteLoading &&
                <CustomText style={[styles.options_option, { color: "red" }]}>
                  { t("misc.post.delete") }
                </CustomText>
              }
            </TouchableOpacity>
          </BottomSheet>
        </View>
      </InViewPort>
    );
  }
  return null;
}