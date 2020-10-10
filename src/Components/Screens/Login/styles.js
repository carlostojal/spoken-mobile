import { StyleSheet, Dimensions } from "react-native";

import colors from "../../../colors";

export default StyleSheet.create({

  area: {
    marginBottom: 20
  },

  image: {
    flex: 1,
    width: Dimensions.get("window").width * 0.65,
    height: undefined
  },

  input: {
    borderWidth: 0.5,
    borderColor: colors.detail,
    borderRadius: 30,
    color: colors.detail,
    padding: 15,
    fontSize: 15,
    fontFamily: "Raleway_400Regular",
    marginBottom: 20
  },
  
  not_registered: {
    alignItems: "center"
  },

  register: {
    color: colors.accent
  }
});