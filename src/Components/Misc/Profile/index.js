import React, { useState, useEffect } from "react";
import { View, FlatList, RefreshControl, ActivityIndicator, Alert } from "react-native";
import { useQuery, useLazyQuery } from "@apollo/client";
import Constants from "expo-constants";
import { useTranslation } from "react-i18next";

import Post from "../Post";
import NoPosts from "../NoPosts";
import CustomText from "../CustomText";
import styles from "./styles";
import queries from "./queries";

export default function Profile(props) {

  const { t } = useTranslation();

  const [page, setPage] = useState(1);
  const perPage = Constants.manifest.extra.POSTS_PER_PAGE;

  const [feed, setFeed] = useState(null);

  const { data: userData } = useQuery(queries.GET_PROFILE, {
    fetchPolicy: "network-only",
    variables: {
      user_id: props.user_id
    }
  });

  const [getFeed, { data: feedData, loading: feedLoading, error: feedError }] = useLazyQuery(queries.GET_USER_POSTS, {
    fetchPolicy: "network-only"
  });

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
      console.log(feedError);
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
          { userData && userData.getUserData ? 
            userData.getUserData.username :
            "..."
          }
        </CustomText>
        <CustomText style={styles.name}>
          { userData && userData.getUserData ? 
            userData.getUserData.name + " " + userData.getUserData.surname :
            "..."
          }
        </CustomText>
      </View>
    );
  };

  const renderFooter = () => {
    return (
      <View style={{marginTop: 20}}>
        { feedLoading && 
          <ActivityIndicator size="large" />
        }
        { !feedLoading &&
          <NoPosts />
        }
      </View>
    );
  }

  const renderSeparator = () => {
    return <View style={{height: 15}} />
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