import React, { useEffect, useState } from "react";
import { View, FlatList, RefreshControl, TouchableOpacity, ActivityIndicator } from "react-native";
import Constants from "expo-constants";
import { useTranslation } from "react-i18next";

import Header from "../../Misc/Header";
import Post from "../../Misc/Post";
import CustomText from "../../Misc/CustomText";

import global_styles from "../../global_styles";
import styles from "./styles";
import queries from "./queries";
import getClient from "../../../apollo_config";

export default function Feed(props) {

  const [data, setData] = useState({
    feed: null,
    currentPage: 1,
    isLoading: true
  });

  useEffect(() => {
    if(data.isLoading)
      getData();
  });

  const getData = async () => {
    const client = await getClient();
    client.query({
      query: queries.GET_FEED,
      variables: {
        page: data.currentPage,
        perPage: Constants.manifest.extra.POSTS_PER_PAGE
      }
    }).then((result) => {
      let res = data.feed;
      if(res == null)
        res = result.data.getUserFeed;
      else
        res = res.concat(result.data.getUserFeed);
      setData({ currentPage: data.currentPage, isLoading: false, feed: res });
    }).catch((error) => {
      console.log(error);
    });
  }

  const handleLoadMore = () => {
    setData({ currentPage: data.currentPage + 1, isLoading: true, feed: data.feed });
  }

  const renderItem = ({ item }) => {
    return (
      <Post data={item} />
    );
  }

  const renderHeader = () => {
    return (
      <Header navigation={props.navigation} homeScroller={props.homeScroller} />
    );
  }

  const renderFooter = () => {
    return (
      <View style={styles.footer}>
        {
          data.isLoading && data.feed && data.feed.langth > 0 &&  <ActivityIndicator size="small" />
        }
      </View>
    );
  }

  const renderSeparator = () => {
    return <View style={{height: 20}} />
  }

  const { t } = useTranslation();

  return (
    <View style={global_styles.container}>
      <FlatList
        decelerationRate="normal"
        data={data.feed}
        renderItem={renderItem}
        onEndReached={handleLoadMore}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={renderFooter}
        ItemSeparatorComponent={renderSeparator}
        stickyHeaderIndices={[0]}
        keyExtractor={item => item.id}
        refreshControl={
          <RefreshControl refreshing={data.isLoading && data.currentPage == 1} onRefresh={() => {
            setData({ currentPage: 1, isLoading: true, feed: null });
          }}/>
        }
      />
      { (!data.feed || data.feed.length == 0) && !data.isLoading &&
        <CustomText>{t("screens.feed.labels.no_posts")}</CustomText>
      }
    </View>
  );
}