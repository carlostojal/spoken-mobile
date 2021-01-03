import { StyleSheet } from "react-native";
import colors from "../../../colors";

export default StyleSheet.create({

  container: {
    backgroundColor: colors.card,
    padding: 20,
    alignItems: "center"
  },

  heading: {
    color: colors.text,
    fontFamily: "Raleway_700Bold",
    fontSize: 25
  },

  text: {
    color: colors.text,
    fontSize: 15,
    marginTop: 20
  }
});