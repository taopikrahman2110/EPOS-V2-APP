import React from "react";
import { BackHandler, View, Image, Platform, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

class IntroScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hideTopbar: false,
      prepareQuit: false,
      show_Main_App: false,
    };

    this.setInterval = null;
  }

  componentDidMount() {
    AsyncStorage.getItem("first_time").then((value) => {
      this.setState({ show_Main_App: !!value });
    });

    BackHandler.addEventListener("hardwareBackPress", this.handleBackPress);
  }

  componentWillUnmount() {
    this.clearTimer();
    BackHandler.removeEventListener("hardwareBackPress", this.handleBackPress);
  }

  startTimer() {
    this.timeout = setInterval(() => {
      this.tick();
    }, 2000);
  }

  clearTimer() {
    this.timeout !== undefined ? this.clearInterval(this.timeout) : null;
  }

  handleBackPress = () => {
    if (this.state.hideTopbar) {
      //go back
      this.webview.goBack();
    } else {
      if (this.state.prepareQuit) {
        //do quit
        BackHandler.exitApp();
      } else {
        this.setState({ prepareQuit: true });
      }
    }
    return true;
  };

  cancelQuit = () => {
    this.setState({ prepareQuit: false });
  };

  on_Done_All_slide = () => {
    AsyncStorage.setItem("first_time", "true").then(() => {
      this.setState({ show_Main_App: true });
      //   this.props.navigation.navigate('Home');
    });
    {
      Platform.OS === "ios" ? "IOS" : "ANDROID";
    }

    AsyncStorage.setItem(
      "PlatformDevice",
      Platform.OS === "ios" ? '"ios"' : '"android"'
    ).then(() => {});
  };

  on_Skip_slides = () => {
    AsyncStorage.setItem("first_time", "true").then(() => {
      this.setState({ show_Main_App: true });
      //   this.props.navigation.navigate('Home');
    });
  };

  goToHome = () => {
    {
      Platform.OS === "ios" ? "IOS" : "ANDROID";
    }

    AsyncStorage.setItem(
      "PlatformDevice",
      Platform.OS === "ios" ? '"ios"' : '"android"'
    ).then(() => {});
    setTimeout(() => {
      this.props.navigation.navigate("Home");
    }, 1000);
  };

  i = 0;

  tick = () => {
    if (this.state.show_Main_App === false) {
      this.slider.goToSlide(this.i); //this.slider is ref of <AppIntroSlider....
      this.i += 1;
      if (this.i == slides.length) {
        // this.i = 0;
        clearInterval(this.timeout);
      }
      return;
    } else {
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <Image
          source={require("../../assets/images/icon-app.png")}
          style={styles.image}
        />
        {this.goToHome()}
      </View>
    );
  }
}
export default IntroScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: 200, // Adjust the width and height as per your requirements
    height: 200,
  },
  title: {
    fontSize: 28,
    color: "transparent",
    fontWeight: "bold",
    textAlign: "center",
    margin: 0,
  },
  text: {
    color: "transparent",
    fontSize: 20,
  },
  // image: {
  //   width: "100%",
  //   height: "100%",
  //   marginTop: -15,
  // },
  viewStyles: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  pictureContainer: {
    flex: 1,
    position: "relative",
    alignItems: "center",
    padding: 0,
    elevation: 6,
  },
});

const slides = [
  {
    key: "k1",
    image: require("../../assets/images/intro/kdl-intro1.jpg"),
    imageStyle: styles.image,
    title: "",
    text: "",
  },
  {
    key: "k2",
    image: require("../../assets/images/intro/kdl-intro2.jpg"),
    imageStyle: styles.image,
    title: "",
    text: "",
  },
  {
    key: "k3",
    image: require("../../assets/images/intro/kdl-intro3.jpg"),
    imageStyle: styles.image,
    title: "",
    text: "",
  },
];
