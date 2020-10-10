import { StyleSheet } from "react-native";
import colors from "../../../colors";

export default StyleSheet.create({

  container: {
    flexDirection: "row",
    backgroundColor: colors.primary,
    padding: 20,
    borderRadius: 30,
    justifyContent: "center"
  },

  text: {
    fontFamily: "Raleway_600SemiBold",
    color: "white",
    fontSize: 17
  }
});