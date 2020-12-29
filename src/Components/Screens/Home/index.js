import React, { useState } from "react";

import Feed from "../Feed";

export default function Home(props) {

  return (
    <Feed navigation={props.navigation} />
  );
}