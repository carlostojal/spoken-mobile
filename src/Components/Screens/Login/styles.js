import { StyleSheet, Dimensions } from "react-native";

import colors from "../../../colors";

export default StyleSheet.create({

  area: {
    marginBottom: 20
  },

  input: {
    borderWidth: 0.5,
    borderColor: colors.detail,
    borderRadius: 30,
    color: colors.detail,
    padding: 10,
    fontSize: 15,
    fontFamily: "Raleway_400Regular",
    marginBottom: 10
  }
});