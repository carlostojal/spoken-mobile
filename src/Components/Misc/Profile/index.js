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

export default function Profile(props) {

  const { t } = useTranslation();

  const [isAllowed, setIsAllowed] = useState(true);

  const [isFollowed, setIsFollowed] = useState(user && user.is_followed || false);

  const [user, setUser] = useState(null);

  const [page, setPage] = useState(1);
  const perPage = Constants.manifest.extra.POSTS_PER_PAGE;

  const [feed, setFeed] = useState(null);

  const { data: userData, loading: userLoading } = useQuery(queries.GET_PROFILE, {
    fetchPolicy: "network-only",
    variables: {
      user_id: props.user_id
    }
  });

  const [getFeed, { data: feedData, loading: feedLoading, error: feedError }] = useLazyQuery(queries.GET_USER_POSTS, {
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
    if(page)
      getFeed({ variables: { page, perPage, user_id: props.user_id } });
  }, [page]);

  useEffect(() => {
    if(feedData && feedData.getUserPosts) {
      if(feedData.getUserPosts.length == 0) {
        setPage(null);
      } else {
        if(!feed)
          setFeed(feedData.getUserPosts);
        else
          setFeed([...feed].concat(feedData.getUserPosts));
      }
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

  useEffect(() => {
    if(props.shouldReload) {
      setPage(1);
      setFeed({});
    }
  }, [props.shouldReload]);

  const renderItem = ({ item }) => {
    return (
      <Post data={item} navigation={props.navigation} />
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
    follow({variables: { user_id: props.user_id }});
  }

  return (
    <View>
      <FlatList
        decelerationRate="normal"
        data={feed}
        renderItem={renderItem}
        onEndReached={() => {
          if(page)
            setPage(page + 1);
        }}
        onEndReachedThreshold={50}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={renderFooter}
        ItemSeparatorComponent={renderSeparator}
        keyExtractor={item => item.id}
        refreshControl={
          <RefreshControl refreshing={feedLoading && page == 1} onRefresh={() => {
            setPage(1);
            setFeed([]);
          }}/>
        }
      />
    </View>
  );
}