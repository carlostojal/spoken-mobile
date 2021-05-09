import React, { useState, useEffect, useRef } from "react";
import { View, Image, TouchableOpacity, Alert, TouchableWithoutFeedback, ActivityIndicator } from "react-native";
import { useMutation } from "@apollo/client";
import { useTranslation } from "react-i18next";
import Icon from "react-native-vector-icons/Ionicons";
import BottomSheet from "react-native-raw-bottom-sheet";
import InViewPort from "@coffeebeanslabs/react-native-inviewport";
import * as Device from "expo-device";

import CustomText from "../CustomText";

import postDateFormat from "../../../helpers/postDateFormat";
import refreshToken from "../../../helpers/refreshToken";
import styles from "./styles";
import queries from "./queries";
import colors from "../../../colors";
import AsyncStorage from "@react-native-community/async-storage";

export default function Post(props) {

  const { t } = useTranslation();

  const [post, setPost] = useState(props.data);

  const [imageLoaded, setImageLoaded] = useState(false);

  const [imageHeight, setImageHeight] = useState(null);

  const [shouldBlur, setShouldBlur] = useState(post && post.media && post.media.is_nsfw);

  const [viewStartTime, setViewStartTime] = useState(Date.now());
  const [postIsVisible, setPostIsVisible] = useState(false);

  const bottomSheetRef = useRef();

  const [reactPost, { data: reactData, loading: reactLoading, error: reactError }] = useMutation(queries.REACT_POST, {
    errorPolicy: "all",
    onError: (error) => {
      console.log("onError" + error);
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
    if(post && post.media && post.media.url) {
      Image.getSize(post.media.url, (width, height) => {
        setImageHeight((365 / width) * height);
      });
    }
  }, []);

  useEffect(() => {
    if(reactError) {
      console.log(reactError);
      Alert.alert(t("strings.error"), reactError.message)
    }    
  }, [reactError]);
  
  useEffect(() => {
    if(reactData && reactData.reactPost)
      setPost(reactData.reactPost);
  }, [reactData]);

  useEffect(() => {
    if(deleteError) {
      Alert.alert(t("strings.error"), deleteError.message);
    }
  }, [deleteError]);

  useEffect(() => {
    if(deleteData && deleteData.deletePost)
      Alert.alert(t("strings.success"), t("misc.post.delete_successful"));
  })

  if(post) {

    const dateFormatResult = postDateFormat(parseInt(post.time));

    const onReact = () => {
      reactPost({
        variables: {
          id: post._id
        }
      });
      let postCopy = {...post};
      postCopy.user_reacted = !post.user_reacted;
      setPost(postCopy);
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
      props.navigation.navigate(destination, {
        user_id: id
      });
    };

    const onVisibleChange = async (post_id, isVisible) => {

      if(isVisible != postIsVisible) {

        setPostIsVisible(isVisible);

        if(isVisible) {

          setViewStartTime(Date.now());

        } else {

          let user_data = null;
          user_data = await AsyncStorage.getItem("user_data");
          user_data = JSON.parse(user_data);

          const allowed = user_data.permissions.collect_usage_data;

          let data = {
            id: post_id,
            user_platform: `${Device.manufacturer} ${Device.modelName}`,
            user_os: Device.osName,
            view_time: (Date.now() - viewStartTime) / 1000
          };

          console.log(data);

          if(!allowed) {
            data.user_platform = null;
            data.user_os = null;
            data.view_time = null;
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
        <View style={[{ backgroundColor: colors.card }, styles.container]}>
          {
            // image
          }
          { post.media_url &&
            <Image source={{uri: post.media_url}} style={{ width: imageDimensions.width, height: imageDimensions.height }} onLoadEnd={() => setImageLoaded(true)} />
          }
          { post.media_url && !imageLoaded &&
            <View style={styles.loading_image} />
          }
          {
            // header
          }
          <View style={styles.header}>
            <TouchableOpacity onPress={() => goToProfile(post.poster.id)}>
              <CustomText style={styles.username}>{post.poster.username}</CustomText>
              <CustomText style={styles.name}>{`${post.poster.name} ${post.poster.surname}`}</CustomText>
            </TouchableOpacity>
            <View style={styles.time_options}>
              <CustomText style={styles.time}>{dateFormatResult.value + dateFormatResult.unit}</CustomText>
              { props.renderOptions && 
                <TouchableWithoutFeedback onPress={() => bottomSheetRef.current.open()}>
                  <Icon name="md-settings" size={20} style={{marginLeft: 10}} color="white" />
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
          <CustomText style={[styles.content, {paddingTop: post.media && post.media.url ? 15 : 0}]}>{post.text}</CustomText>
          {
            // footer
          }
          <View style={styles.footer}>
            {/*
              <>
                <TouchableOpacity onPress={onReact}>
                  { post.user_reacted &&
                    <Icon name="md-heart" size={35} color={colors.primary} />
                  } 
                  { !post.user_reacted &&
                    <Icon name="md-heart-empty" size={35} color="#FFFFFF" />
                  }
                </TouchableOpacity>
                <TouchableOpacity style={{marginLeft: 10}}>
                  <Icon name="md-arrow-forward" size={35} color="#FFFFFF" />
                </TouchableOpacity>
              </>
                */}
          </View>
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