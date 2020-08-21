import React, { Component } from "react";
import { View, FlatList, RefreshControl, ActivityIndicator } from "react-native";
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
      feed: [],
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
      this.setState({ isLoading: false, feed: this.state.feed.concat(result.data.getUserFeed) });
    }).catch((error) => {
      console.log(error);
    });
  }

  handleLoadMore = () => {
    this.setState({ currentPage: this.state.currentPage + 1, isLoading: true }, this.getData);
  }

  renderItem = ({ item }) => {
    // return null;
    return <Post data={item} />
  }

  renderFooter = () => {
    return (
      this.state.isLoading ? 
      <View>
        <ActivityIndicator size="large" />
      </View> : null
    );
  }

  componentDidMount() {
    this.setState({ isLoading: true }, this.getData);
  }
  
  render() {
    return (
      <View style={global_styles.container}>
        { !this.state.feed &&
          <ActivityIndicator size="large" />
        }
        { this.state.feed &&
          <FlatList
            style={global_styles.container}
            data={this.state.feed}
            renderItem={this.renderItem}
            onEndReached={this.handleLoadMore}
            ListFooterComponent={this.renderFooter}
            keyExtractor={item => item.id}
            refreshControl={
              <RefreshControl refreshing={this.state.isLoading && this.state.currentPage == 1} onRefresh={() => {
                this.setState({ feed: [], currentPage: 1 }, this.getData);
              }}/>
            }
          />
        }
      </View>
    );
  }
}