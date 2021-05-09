import React, { useState, useEffect } from "react";
import { View, FlatList, RefreshControl, ActivityIndicator, Alert } from "react-native";
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
import { TouchableOpacity } from "react-native-gesture-handler";

export default function Profile(props) {

  const { t } = useTranslation();

  const [isAllowed, setIsAllowed] = useState(true);

  const [isFollowed, setIsFollowed] = useState(user && user.is_followed || false);

  const [user, setUser] = useState(null);

  const [feed, setFeed] = useState(null);

  const { data: userData, loading: userLoading, error: userError } = useQuery(queries.GET_PROFILE, {
    fetchPolicy: "network-only",
    variables: {
      user_id: props.user_id
    }
  });

  console.log(userError);

  const { data: feedData, loading: feedLoading, error: feedError } = useQuery(queries.GET_USER_POSTS, {
    fetchPolicy: "network-only"
  });

  const [follow, { data: followData, loading: followLoading, error: followError }] = useMutation(queries.FOLLOW, {
    fetchPolicy: "no-cache"
  });

  useEffect(() => {
    if(userData && userData.getUserData) {
      setUser(userData.getUserData);
      setIsFollowed(userData.getUserData.is_followed);
    }
  }, [userData]);

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
  }, [feedData]);

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
      <Post data={item} navigation={props.navigation} profileType={props.profileType} renderOptions={true} />
    );
  }

  const renderHeader = () => {
    return (
      <View style={styles.container}>
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
        <TouchableOpacity onPress={() => props.navigation.navigate("Settings")}>
          <CustomText>{t("screens.profile.labels.settings")}</CustomText>
        </TouchableOpacity>
        { user && !user.is_himself &&
          <CustomButton style={{marginTop: 25, padding: 10}} loading={followLoading || userLoading} onPress={onFollow}>
            { isFollowed ? 
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
        keyExtractor={item => item.id}
        refreshControl={
          <RefreshControl refreshing={feedLoading} onRefresh={() => {
            setFeed([]);
          }}/>
        }
      />
    </View>
  );
}