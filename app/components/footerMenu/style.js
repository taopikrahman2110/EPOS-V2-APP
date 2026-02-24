import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  footer: {
    flex: 1,
    flexDirection: "row",
    position: "absolute",
    height: 50,
    bottom: 0,
    left: 0,
    right: 0,
    borderTopWidth: 1,
    borderColor: "#255a8e",
    backgroundColor: "#255a8e",
  },
  menuView: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
  },
  menuItem: {
    alignItems: "center",
  },
  image: {
    flex: 1,
  },
  activelink: {
    color: "#255a8e",
    fontSize: 10,
    // marginTop: -8,
  },
  nonactivelink: {
    fontSize: 10,
    // marginTop: -8,
  },
});
export default styles;
