import React from "react";

import ProfileComp from "../../Misc/Profile";

export default function Profile(props) {
  return (
    <>
      <ProfileComp navigation={props.navigation} />
    </>
  );
}