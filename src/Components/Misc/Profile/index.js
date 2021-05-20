import React, { useState, useEffect } from "react";
import { View, FlatList, RefreshControl, ActivityIndicator, Alert, Image } from "react-native";
import { useQuery, useLazyQuery, useMutation } from "@apollo/client";
import Constants from "expo-constants";
import { useTranslation } from "react-i18next";

import Post from "../Post";
import NoPosts from "../NoPosts";
import NotAllowed from "../NotAllowed";
import CustomText from "../CustomText";
import CustomButton from "../CustomButton";
import styles from "./styles";
import queries from "./queries";
import AsyncStorage from "@react-native-community/async-storage";

export default function Profile(props) {

  const { t } = useTranslation();

  const [isAllowed, setIsAllowed] = useState(true);

  const [isFollowed, setIsFollowed] = useState(user && user.is_followed || false);

  const [user, setUser] = useState(null);

  const [feed, setFeed] = useState(null);

  const [currentUser, setCurrentUser] = useState(null);

  const { data: userData, loading: userLoading, error: userError, refetch: userRefetch } = useQuery(queries.GET_PROFILE, {
    fetchPolicy: "cache-first",
    variables: {
      user_id: props.user_id
    }
  });

  const { data: feedData, loading: feedLoading, error: feedError, refetch: feedRefetch } = useQuery(queries.GET_USER_POSTS, {
    fetchPolicy: "network-only"
  });

  const [follow, { data: followData, loading: followLoading, error: followError }] = useMutation(queries.FOLLOW, {
    fetchPolicy: "no-cache"
  });

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
    if(userData && userData.getUserData) {
      setUser(userData.getUserData);
      setIsFollowed(userData.getUserData.is_followed);
    }
  }, [userData, user]);

  useEffect(() => {
    if(followData && followData.followUser)
      setIsFollowed(!isFollowed);
  }, [followData]);

  useEffect(() => {
    if(followError)
      Alert.alert(t("strings.error"), t("errors.unexpected") + "\n\n" + followError.message);
  }, [followError]);

  useEffect(() => {
    if(feedData && feedData.getUserPosts) {
      setFeed(feedData.getUserPosts);
    }
  }, [feedData, feed]);

  useEffect(() => {
    if(feedError) {
      if(feedError.message == "NOT_ALLOWED")
        setIsAllowed(false);
      else
        Alert.alert(t("strings.error"), t("errors.unexpected") + "\n\n" + feedError.message);
    }
  }, [feedError]);

  const renderItem = ({ item }) => {
    return (
      <Post containerStyle={{marginLeft: 15, marginRight: 15}} data={item} navigation={props.navigation} profileType={props.profileType} />
    );
  }

  const renderHeader = () => {
    return (
      <View style={styles.container}>
        <View style={{flexDirection: "row"}}>
          { user && user.profile_pic &&
            <Image style={{width: 80, height: 80, borderRadius: 50}} source={{uri: `${Constants.manifest.extra.MEDIA_SERVER_ADDRESS}:${Constants.manifest.extra.MEDIA_SERVER_PORT}/media/${user.profile_pic._id}`}} />
          }
          <View style={{marginLeft: 15}}>
            <CustomText style={styles.username}>
              { user ? 
                user.username :
                "..."
              }
            </CustomText>
            <CustomText style={styles.name}>
              { user ? 
                user.name + " " + user.surname :
                "..."
              }
            </CustomText>
          </View>
        </View>
        { /*
        <TouchableOpacity onPress={() => props.navigation.navigate("Settings")}>
          <CustomText>{t("screens.profile.labels.settings")}</CustomText>
        </TouchableOpacity>
        */}
        { user && !user._id == currentUser._id &&
          <CustomButton style={{marginTop: 25, padding: 10}} loading={followLoading || userLoading} onPress={onFollow}>
            { user && currentUser && currentUser.following.some(item => item._id == user._id) ? 
              t("screens.profile.labels.unfollow") :
              t("screens.profile.labels.follow")
            }
          </CustomButton>
        }
      </View>
    );
  };

  const renderFooter = () => {
    return (
      <View style={{marginTop: 20}}>
        { feedLoading && 
          <ActivityIndicator size="large" />
        }
        { !feedLoading && isAllowed &&
          <NoPosts />
        }
        { !isAllowed &&
          <NotAllowed />
        }
      </View>
    );
  }

  const renderSeparator = () => {
    return <View style={{height: 15}} />
  }

  const onFollow = () => {
    follow({variables: { user_id: parseInt(props.user_id) }});
  }

  return (
    <View>
      <FlatList
        decelerationRate="normal"
        data={feed}
        renderItem={renderItem}
        onEndReachedThreshold={50}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={renderFooter}
        ItemSeparatorComponent={renderSeparator}
        keyExtractor={item => item._id}
        refreshControl={
          <RefreshControl refreshing={feedLoading} onRefresh={() => {
            setFeed([]);
            userRefetch();
            feedRefetch();
          }}/>
        }
      />
    </View>
  );
}