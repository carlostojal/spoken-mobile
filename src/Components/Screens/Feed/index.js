import React, { Component } from "react";
import { View, FlatList, RefreshControl, ActivityIndicator, Text } from "react-native";
import Constants from "expo-constants";
import Post from "../../Misc/Post";

import global_styles from "../../global_styles";
import styles from "./styles";
import queries from "./queries";
import getClient from "../../../apollo_config";

export default class Feed extends Component {

  constructor(props) {
    super(props);
    this.state = {
      feed: null,
      currentPage: 1,
      isLoading: false
    }
  }

  getData = async () => {
    const client = await getClient();
    client.query({
      query: queries.GET_FEED,
      variables: {
        page: this.state.currentPage,
        perPage: Constants.manifest.extra.POSTS_PER_PAGE
      }
    }).then((result) => {
      let res = this.state.feed;
      if(res == null)
        res = result.data.getUserFeed;
      else
        res = res.concat(result.data.getUserFeed);
      this.setState({ isLoading: false, feed: res });
    }).catch((error) => {
      console.log(error);
    });
  }

  handleLoadMore = () => {
    this.setState({ currentPage: this.state.currentPage + 1, isLoading: true }, this.getData);
  }

  renderItem = ({ item }) => {
    return <Post data={item} />
  }

  renderFooter = () => {
    return (
      this.state.isLoading ? 
      <View style={styles.footer}>
        <ActivityIndicator size="large" />
      </View> : null
    );
  }

  componentDidMount() {
    this.setState({ isLoading: true }, this.getData);
  }
  
  render() {
    // console.log(this.state.feed);
    return (
      <View style={global_styles.container}>
        <FlatList
          style={global_styles.container}
          data={this.state.feed}
          renderItem={this.renderItem}
          onEndReached={this.handleLoadMore}
          ListFooterComponent={this.renderFooter}
          keyExtractor={item => item.id}
          refreshControl={
            <RefreshControl refreshing={this.state.isLoading && this.state.currentPage == 1} onRefresh={() => {
              this.setState({ feed: null, currentPage: 1 }, this.getData);
            }}/>
          }
        />
      </View>
    );
  }
}