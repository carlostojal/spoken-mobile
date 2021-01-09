import { StyleSheet } from "react-native";
import colors from "../../../colors";

export default StyleSheet.create({

  container: {
    backgroundColor: colors.primary,
    flexDirection: "row",
    padding: 15,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center"
  },

  text: {
    fontFamily: "Raleway_600SemiBold",
    color: "white",
    fontSize: 17
  }
});