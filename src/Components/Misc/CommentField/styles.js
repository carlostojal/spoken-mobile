import { StyleSheet } from "react-native";
import colors from "../../../colors";

export default StyleSheet.create({

  container: {
    padding: 15,
    flexDirection: "row"
  },

  field: {
    padding: 10,
    paddingTop: 5,
    paddingBottom: 5,
    fontSize: 15,
    fontFamily: "Raleway_400Regular",
    flex: 1,
    borderWidth: 1,
    borderColor: colors.detail,
    borderRadius: 20
  },

  buttonContainer: {
    justifyContent: "center",
    marginLeft: 15
  },

  button: {
    color: colors.accent
  }
});