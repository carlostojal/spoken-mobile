import React, { useEffect, useState } from "react";
import { FlatList, View } from "react-native";
import { useQuery } from "@apollo/client";
import { useTranslation } from "react-i18next";
import Post from "../../Misc/Post";
import NoPosts from "../../Misc/NoPosts";
import queries from "./queries";
import CustomText from "../../Misc/CustomText";

export default function PostView(props) {

  const { t } = useTranslation();

  const [post, setPost] = useState(JSON.parse(props.route.params.post));

  const { data: commentsData, loading: commentsLoading, error: commentsError } = useQuery(queries.GET_COMMENTS, {
    variables: {
      id: post._id
    }
  });

  const [comments, setComments] = useState(null);

  useEffect(() => {
    if(commentsData && commentsData.getPostComments)
      setComments(commentsData.getPostComments);
  }, [commentsData]);

  console.log(comments);

  return (
    <>
      { post && comments &&
        <>
          <FlatList
            data={comments}
            ListHeaderComponent={ () => {
              return (
                <View style={{margin: 15}}>
                  <Post data={post} />
                  <CustomText>
                    { t("screens.post_view.labels.comments") }
                  </CustomText>
                </View>
              );
            }}
            ListFooterComponent={
              <NoPosts />
            }
            keyExtractor={item => item._id}
            renderItem={({ item }) => {
              return (
                <View style={{margin: 15}}>
                  <Post data={item} />
                </View>
              );
            }}
          />
        </>
      }
    </>
  );
}