import React, { useState, useEffect } from "react";
import { View, Image, TouchableOpacity, FlatList } from "react-native";
import { useMutation } from "@apollo/client";

import CommentIcon from "../../../../assets/icons/comment1.svg";
import CustomText from "../CustomText";
import Comment from "../Comment";
import CommentField from "../CommentField";

import postDateFormat from "../../../helpers/postDateFormat";
import styles from "./styles";
import queries from "./queries";

export default function Post(props) {

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
    // revert user reaction
    if(reactError) {
      let postCopy = {...post};
      postCopy.user_reacted = !post.user_reacted;
      setPost(postCopy)
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

    const getPostDimensions = (e) => {
      if(!imageDimensionsSet) {
        const { nativeEvent } = e;
        if(post.media_url) {
          Image.getSize(post.media_url, (width, height) => {
            const scale = nativeEvent.layout.width / width;
            const dimensions = {
              width: (width * scale) - 2,
              height: height * scale
            }
            setImageDimensionsSet(true);
            setImageDimensions(dimensions);
          }, (error) => {
            console.log(error);
          });
        }
      }
    }

    const getHeaderDimensions = (e) => {
      if(!optionsIconDimensionsSet) {
        const { nativeEvent } = e;
        const icon = require("../../../../assets/icons/icons8-menu-vertical-24.png");
        const source = Image.resolveAssetSource(icon);
        const scale = nativeEvent.layout.height / source.height;
        const dimensions = {
          width: (source.width * scale) - 30,
          height: (source.height * scale) - 30
        }
        setOptionsIconDimensionsSet(true);
        setOptionsIconDimensions(dimensions);
      }
    }

    const getFooterDimensions = (e) => {
      if(!footerIconsDimensionsSet) {
        const { nativeEvent } = e;
        const icon = require("../../../../assets/icons/icons8-heart-50.png");
        const source = Image.resolveAssetSource(icon);
        const scale = nativeEvent.layout.height / source.height;
        const dimensions = {
          width: (source.width * scale) - 15,
          height: (source.height * scale) - 15
        }
        setFooterIconsDimensionsSet(true);
        setFooterIconsDimensions(dimensions);
      }
    }

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
      <View style={styles.container} onLayout={getPostDimensions}>
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
          <View style={styles.header} onLayout={getHeaderDimensions}>
            <CustomText style={styles.username}>{`@${post.poster.username}`}</CustomText>
            <View style={styles.time_options}>
              <CustomText>{dateFormatResult.value + dateFormatResult.unit}</CustomText>
              <Image source={require("../../../../assets/icons/icons8-menu-vertical-24.png")} style={{ marginLeft: 5, width: optionsIconDimensions.width, height: optionsIconDimensions.height }} />
            </View>
          </View>
          {
            // content
          }
          <CustomText style={styles.content}>{post.text}</CustomText>
          {
            // footer
          }
          <View style={styles.footer} onLayout={getFooterDimensions}>
            <TouchableOpacity onPress={onReact}>
              { !post.user_reacted &&
                <Image source={require("../../../../assets/icons/icons8-heart-50.png")} style={{ width: footerIconsDimensions.width, height: footerIconsDimensions.height, marginRight: 10 }} />
              }
              { post.user_reacted &&
                <Image source={require("../../../../assets/icons/icons8-heart-active1-50.png")} style={{ width: footerIconsDimensions.width, height: footerIconsDimensions.height, marginRight: 10 }} />
              }
            </TouchableOpacity>
            <TouchableOpacity onPress={onCommentButton}>
              <CommentIcon width={footerIconsDimensions.width} height={footerIconsDimensions.height} style={styles.footer_icon} />
            </TouchableOpacity>
            <TouchableOpacity>
              <Image source={require("../../../../assets/icons/icons8-share-3-50.png")} style={{ width: footerIconsDimensions.width, height: footerIconsDimensions.height, marginRight: 10 }} />
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