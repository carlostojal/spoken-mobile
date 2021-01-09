import React from "react";

import ProfileComp from "../../Misc/Profile";

export default function DynamicProfile(props) {
  return (
    <>
      <ProfileComp user_id={props.route.params.user_id} navigation={props.navigation} profileType="dynamic" />
    </>
  );
}