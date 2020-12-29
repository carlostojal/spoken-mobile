import React, { useState, useEffect } from "react";
import { View, Image, TouchableOpacity, Alert } from "react-native";
import { useMutation } from "@apollo/client";
import { useTranslation } from "react-i18next";

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

  const [reactPost, { data: reactData, loading: reactLoading, error: reactError }] = useMutation(queries.REACT_POST, {
    errorPolicy: "all",
    onError: (error) => {
      console.log("onError" + error);
      refreshToken(reactPost, { variables: { id: post.id } })
    }
  });

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

  if(post) {

    const dateFormatResult = postDateFormat(parseInt(post.time));

    const onReact = () => {
      reactPost({
        variables: {
          id: post.id
        }
      });
      let postCopy = {...post};
      postCopy.user_reacted = !post.user_reacted;
      setPost(postCopy);
    }

    const goToProfile = (id) => {
      props.navigation.navigate("DynamicProfile", {
        user_id: id
      });
    };

    return (
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
            { /*
            <Icon name="md-settings" size={20} style={{marginLeft: 10}}/>
            */ }
          </View>
        </View>
        {
          // content
        }
        <CustomText style={styles.content}>{post.text}</CustomText>
        {
          // footer
        }
        <View style={styles.footer}>
          { /*
          <TouchableOpacity onPress={onReact}>
            { post.user_reacted &&
              <Icon name="md-heart" size={35} color={colors.primary} />
            } 
            { !post.user_reacted &&
              <Icon name="md-heart-empty" size={35} color="#FFFFFF" />
            }
          </TouchableOpacity>
          <TouchableOpacity style={{marginLeft: 10}}>
            <Icon name="md-arrow-back" size={35} color="#FFFFFF" />
          </TouchableOpacity>
          <TouchableOpacity style={{marginLeft: 10}}>
            <Icon name="md-arrow-forward" size={35} color="#FFFFFF" />
          </TouchableOpacity>
          */ }
        </View>
      </View>
    );
  }
  return null;
}