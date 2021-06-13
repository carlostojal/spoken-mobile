import React, { useState, useEffect } from "react";
import { View, FlatList, RefreshControl, ActivityIndicator, Alert, Image, TouchableOpacity } from "react-native";
import { useQuery, useMutation } from "@apollo/client";
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
import getFullBackendAddress from "../../../helpers/getFullBackendAddress";

export default function Profile(props) {

  const { t } = useTranslation();

  const [isAllowed, setIsAllowed] = useState(true);

  const [isFollowed, setIsFollowed] = useState(false);

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
    fetchPolicy: "network-only",
    variables: {
      user_id: props.user_id
    }
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
    }
  }, [userData, user]);

  useEffect(() => {
    if(currentUser && user)
      setIsFollowed(user.followers.some(item => item._id == currentUser._id));
  }, [currentUser, user]);

  useEffect(() => {
    if(followError) {
      Alert.alert(t("strings.error"), t("errors.unexpected") + "\n\n" + followError.message);
      setIsFollowed(!isFollowed);
    }
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
      <TouchableOpacity onPress={() => props.navigation.navigate("PostView", {post: JSON.stringify(item)})}>
        <Post containerStyle={{marginLeft: 15, marginRight: 15}} data={item} navigation={props.navigation} profileType={props.profileType} renderOptions={props.profileType == "personal"} />
      </TouchableOpacity>
    );
  }

  const renderHeader = () => {
    return (
      <View style={styles.container}>
        <View style={{flexDirection: "row"}}>
          { user && user.profile_pic &&
            <Image style={{width: 80, height: 80, borderRadius: 50, marginRight: 15}} source={{uri: `${getFullBackendAddress("media")}/media/${user.profile_pic._id}`}} />
          }
          <View>
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
        { user && currentUser && user._id != currentUser._id &&
          <CustomButton style={{marginTop: 25, padding: 10}} loading={followLoading || userLoading} onPress={onFollow}>
            { isFollowed ? 
              t("screens.profile.labels.unfollow") :
              t("screens.profile.labels.follow")
            }
          </CustomButton>
        }
        { user && currentUser && user._id == currentUser._id &&
					<TouchableOpacity onPress={() => props.navigation.navigate("Settings")}>
						<CustomText>
							{ t("screens.profile.labels.settings") }
						</CustomText>
					</TouchableOpacity>
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
    setIsFollowed(!isFollowed);
    follow({variables: { user_id: props.user_id }});
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
            userRefetch();
            feedRefetch();
          }}/>
        }
        onRefresh={() => {
          userRefetch();
          feedRefetch();
        }}
        refreshing={feedLoading || userLoading}
      />
    </View>
  );
}