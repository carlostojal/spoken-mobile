import { StyleSheet } from "react-native";

export default StyleSheet.create({

  container: {
    borderColor: "#c7c7c7",
    borderWidth: 1,
    marginBottom: 20
  },

  header: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 15
  },

  username: {
    fontWeight: "bold"
  },

  time_options: {
    flexDirection: "row"
  },

  content: {
    padding: 15,
    paddingTop: 0,
    fontSize: 15
  },

  footer: {
    height: 40,
    flexDirection: "row",
    padding: 15,
    paddingTop: 0,
    justifyContent: "flex-end"
  }
});