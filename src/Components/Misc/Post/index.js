import React, { useState, useEffect } from "react";
import { View, Image, TouchableOpacity, FlatList, Alert } from "react-native";
import { useMutation } from "@apollo/client";
import { useTranslation } from "react-i18next";
import Icon from "react-native-vector-icons/Ionicons";

import CustomText from "../CustomText";
import Comment from "../Comment";
import CommentField from "../CommentField";

import postDateFormat from "../../../helpers/postDateFormat";
import styles from "./styles";
import queries from "./queries";

export default function Post(props) {

  const { t } = useTranslation();

  const [post, setPost] = useState(props.data);

  const [imageDimensions, setImageDimensions] = useState({
    width: null,
    height: null
  });
  const [imageDimensionsSet, setImageDimensionsSet] = useState(false);

  const [optionsIconDimensions, setOptionsIconDimensions] = useState({
    width: null,
    height: null
  });
  const [optionsIconDimensionsSet, setOptionsIconDimensionsSet] = useState(false);

  const [footerIconsDimensions, setFooterIconsDimensions] = useState({
    width: null,
    height: null
  });
  const [footerIconsDimensionsSet, setFooterIconsDimensionsSet] = useState(false);

  const [imageLoaded, setImageLoaded] = useState(false);

  const [shouldRenderComments, setShouldRenderComments] = useState(false);

  const [shouldFocusComment, setShouldFocusComment] = useState(false);

  const [commentFieldRef, setCommentFieldRef] = useState();

  const [reactPost, { data: reactData, loading: reactLoading, error: reactError }] = useMutation(queries.REACT_POST);

  const [commentPost, { data: commentData, loading: commentLoading, error: commentError }] = useMutation(queries.COMMENT_POST);

  useEffect(() => {
    if(reactError) {
      Alert.alert(t("strings.error"), reactError.message)
    }    
  }, [reactError]);

  useEffect(() => {
    if(commentData && commentData.commentPost)
      setPost(commentData.commentPost);
  }, [commentData]);

  useEffect(() => {
    if(reactData && reactData.reactPost)
      setPost(reactData.reactPost);
  }, [reactData]);

  useEffect(() => {
    if(shouldFocusComment && commentFieldRef) {
      commentFieldRef.focus();
      setShouldFocusComment(false);
    }
  }, [shouldFocusComment, commentFieldRef]);

  if(post) {

    const dateFormatResult = postDateFormat(parseInt(post.time));


    const renderComment = ({item}) => {
      return (
        <Comment data={item}/>
      );
    }

    const onPostPress = () => {
      setShouldRenderComments(!shouldRenderComments);
    }

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

    const onComment = (text) => {
      commentPost({
        variables: {
          id: post.id,
          text: text
        }
      });
    }

    const onCommentButton = () => {
      setShouldRenderComments(true);
      setShouldFocusComment(true);
    }

    const setCommentRef = (input) => {
      setCommentFieldRef(input);
    }

    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={onPostPress}>
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
            <CustomText style={styles.username}>{`@${post.poster.username}`}</CustomText>
            <View style={styles.time_options}>
              <CustomText>{dateFormatResult.value + dateFormatResult.unit}</CustomText>
              <Icon name="md-settings" size={20} style={{marginLeft: 10}}/>
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
            <TouchableOpacity onPress={onReact}>
              <Icon name="md-heart-empty" size={30} />
            </TouchableOpacity>
            <TouchableOpacity onPress={onCommentButton} style={{marginLeft: 10}}>
              <Icon name="md-arrow-back" size={30} />
            </TouchableOpacity>
            <TouchableOpacity style={{marginLeft: 10}}>
              <Icon name="md-arrow-forward" size={30} />
            </TouchableOpacity>
          </View>
          {
            // comments
          }
          { shouldRenderComments &&
            <>
              <CommentField onComment={onComment} setRef={setCommentRef.bind(this)} />
              <FlatList 
                data={post.comments}
                renderItem={renderComment}
                keyExtractor={item => item.id}
              />
            </>
          }
        </TouchableOpacity>
      </View>
    );
  }
  return null;
}