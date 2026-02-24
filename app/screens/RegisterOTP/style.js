import { StyleSheet } from "react-native";
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  titleWrapper: {
    flex: 1,
    justifyContent: "center",
    flexDirection: "row",
  },
  title: {
    color: "red",
    fontSize: 16,
    fontWeight: "800",
    paddingVertical: 30,
  },
  wrapper: {
    marginTop: 30,
  },
  inputWrapper1: {
    paddingVertical: 50,
    paddingHorizontal: 20,
    backgroundColor: "#009C92",
  },
  inputWrapper2: {
    paddingVertical: 50,
    paddingHorizontal: 20,
  },
  inputWrapper3: {
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
    paddingVertical: 50,
    paddingHorizontal: 20,
    backgroundColor: "rgb(8,194,223)",
  },
  inputLabel1: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "800",
  },
  inputLabel2: {
    color: "#31B404",
    fontSize: 14,
    fontWeight: "800",
    textAlign: "center",
  },
  inputLabel3: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "800",
    textAlign: "center",
  },
  otpTextView: {
    marginTop: 15,
    justifyContent: "center",
    flexDirection: "row",
    flexWrap: "wrap",
  },
  otpHyperlink: {
    color: "rgb(8,194,223)",
    fontSize: 20,
  },
  pictureContainer: {
    flex: 1,
    position: "relative",
    alignItems: "center",
    paddingTop: 16,
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 16,
    elevation: 6,
  },
  formContainer: {
    padding: 30,
    marginTop: 0,
  },
  inputContainer1: {
    borderColor: "#AAAAAA",
    backgroundColor: "#fff",
    borderRadius: 5,
    borderWidth: 1,
    marginBottom: 20,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  inputIcon: {
    width: 20,
    height: 20,
    tintColor: "#000",
    marginLeft: 15,
    justifyContent: "center",
  },
  inputs: {
    height: 45,
    marginLeft: 16,
    color: "#000",
    borderBottomColor: "#FFFFFF",
    flex: 1,
    marginTop: 5,
  },
  buttonstyle: {
    backgroundColor: "#255a8e",
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
    height: 50,
    borderRadius: 25,
    marginTop: 20,
  },
  buttontextstyle: {
    fontSize: 16,
    textAlign: "center",
    color: "#fff",
    fontWeight: "bold",
  },
});

export default styles;
