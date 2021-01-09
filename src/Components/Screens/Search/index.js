import React, { useState, useEffect } from "react";
import { View, ActivityIndicator } from "react-native";
import { useTranslation } from "react-i18next";
import { useLazyQuery } from "@apollo/client";

import CustomTextField from "../../Misc/CustomTextField";
import ListUser from "../../Misc/ListUser";
import NoResults from "../../Misc/NoResults";

import queries from "./queries";
import { FlatList } from "react-native-gesture-handler";

export default function Search(props) {

  const { t } = useTranslation();

  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  const [doSearch, {data: searchData, loading: searchLoading, error: searchError}] = useLazyQuery(queries.SEARCH);

  useEffect(() => {
    doSearch({variables: { query }});
  }, [query]);

  useEffect(() => {
    if(searchData && searchData.userSearch) {
      setResults(searchData.userSearch);
    } else {
      setResults([]);
    }
  }, [searchData]);

  const renderHeader = () => {
    return (
      <View style={{position: "absolute", left: 15, right: 15, top: 15}}>
        <View style={{flexDirection: "row"}}>
          <CustomTextField onChangeText={(e) => setQuery(e)} style={{flex: 1}}>
            { t("screens.search.labels.search") }
          </CustomTextField>
        </View>
      </View>
    );
  };

  const renderItem = ({ item }) => {
    return (
      <ListUser user={item} navigation={props.navigation} />
    );
  };

  const renderSeparator = () => {
    return (
      <View style={{height: 2, backgroundColor: "#404040", marginLeft: 15, marginRight: 15}} />
    );
  };

  return (
    <>
      <View style={{marginTop: 90}}>
        { searchLoading &&
          <ActivityIndicator color="white" size={40} />
        }
        { !searchLoading && results.length == 0 &&
          <NoResults />
        }
        <FlatList
          data={results}
          renderItem={renderItem}
          ItemSeparatorComponent={renderSeparator}
        />
      </View>
      {
        renderHeader()
      }
    </>
  );
}