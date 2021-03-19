import { StyleSheet } from "react-native";

import colors from "../../../colors";

export default StyleSheet.create({

  container: {
    margin: 10,
    padding: 10,
    borderRadius: 10,
    backgroundColor: colors.card
  },

  username: {
    fontSize: 20,
    fontFamily: "Raleway_700Bold"
  },

  name: {
    color: "#aaaaaa",
    fontSize: 20,
    marginBottom: 15
  }
});