import React from "react";
import { ScrollView } from "react-native";

import ProfileComp from "../../Misc/Profile";

export default function DynamicProfile(props) {
  return (
    <>
      <ProfileComp user_id={props.route.params.user_id} />
    </>
  );
}