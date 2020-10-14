import { StyleSheet } from "react-native";
import colors from "../../../colors";

export default StyleSheet.create({

  container: {
    backgroundColor: colors.secondary,
    padding: 20,
    alignItems: "center"
  },

  heading: {
    color: "black",
    fontFamily: "Raleway_700Bold",
    fontSize: 25
  },

  text: {
    color: "black",
    fontSize: 15,
    marginTop: 20
  }
});