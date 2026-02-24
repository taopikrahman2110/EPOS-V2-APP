import React from "react";
import {
  BackHandler,
  View,
  StyleSheet,
  NativeModules,
  NativeEventEmitter,
} from "react-native";
import { serverurl, develbase } from "../../config";
import { WebView } from "react-native-webview";
import LoadingScreen from "../../components/LoadingScreen";
import PrepareQuit from "../../components/prepareQuit/index";
import { getPageLang } from "../../languages";
import globalStyles from "../global.style";

import { Permission, PERMISSIONS_TYPE } from "../../permissions/AppPermission";

const { TelpoPrinter } = NativeModules;

const eventEmitter = new NativeEventEmitter();

class HomeScreen extends React.Component {
  constructor(props) {
    super(props);
    this.pagelang = getPageLang("home");
    global.community = { code: "", text: "" };

    this.state = {
      title: "",
      canGoBack: false,
      webUri: serverurl + develbase,
      canChangeCommunity: true,
      communityList: [],
    };

    this.webview = null;
  }

  componentDidMount() {
    setTimeout(() => {
      Permission.requestMultiple([
        PERMISSIONS_TYPE.camera,
        PERMISSIONS_TYPE.microphone,
        PERMISSIONS_TYPE.photo,
        PERMISSIONS_TYPE.read_storage,
        PERMISSIONS_TYPE.contacts,
        PERMISSIONS_TYPE.location,
        PERMISSIONS_TYPE.location_background,
      ]);
    }, 3000);

    eventEmitter.addListener("responseInitialize", (event) => {
      console.log("js event listener", event);
    });

    TelpoPrinter.createModule();
    TelpoPrinter.initializePrinter();

    // if (NativeModules.TelpoPrinter) {
    //   NativeModules.TelpoPrinter.createModule();
    //   NativeModules.TelpoPrinter.initializePrinter();
    // }

    BackHandler.addEventListener("hardwareBackPress", this.handleBackPress);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener("hardwareBackPress", this.handleBackPress);
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

  changeCommunity(community) {
    this.setState({ showLoading: true });
    global.community = community;
    let d = new Date();
    this.setState({
      webUri: serverurl + develbase,
      title: community.text,
      canGoBack: false,
      canChangeCommunity: true,
    });
    setTimeout(() => {
      this.setState({ showLoading: false });
    }, 500);
  }

  goBack() {
    let d = new Date();
    this.setState({
      webUri: serverurl + develbase,
      title: global.community.text,
      canGoBack: false,
      canChangeCommunity: true,
    });
  }

  //----receive on message from webview
  receivePost(param) {
    if (!param) {
      return false;
    } else {
      console.log(param);
      let jsonParam = param === undefined ? {} : JSON.parse(param);
      if (jsonParam.code === undefined) {
      } else {
        if (jsonParam.code === "print-item") {
          console.log("print-item :" + jsonParam.data);
          let dataItemPrinter = jsonParam.data;
          this.doPrint(dataItemPrinter);
        }
      }
    }
  }

  doPrint = (data) => {
    console.log(data);
    data.cartItem.forEach((item) => {
      item.productQty = item.productQty.toString();
    });
    NativeModules.TelpoPrinter.printData(data);
  };

  sendMessage = (code, param) => {
    if (param.constructor != "string".constructor) {
      param = JSON.stringify(param);
    }

    if (this.webview) {
      let tmp = this.webview.postMessage(
        '{"code":"' + code + '", "param":' + param + "}"
      );
    } else {
      setTimeout(() => {
        this.sendMessage(code, param);
      }, 300);
    }
  };
  //------------------------------------

  refreshPage = () => {
    let d = new Date();
    this.setState({
      webUri: serverurl + develbase,
      title: community.text,
      canGoBack: false,
      canChangeCommunity: true,
      hideTopbar: true,
      hideFooterMenu: false,
    });
  };

  onErrorWebview() {
    //alert('testing');
  }

  renderPrepareQuit = () => {
    if (this.state.prepareQuit) {
      return (
        <PrepareQuit
          started={this.state.prepareQuit}
          cancel={this.cancelQuit}
        />
      );
    }
  };

  renderLoading = () => {
    if (this.state.showLoading) {
      return <LoadingScreen />;
    }
  };

  render() {
    const injectedJavascript = `(function() {
      window.postMessage = function(data) {
        window.ReactNativeWebView.postMessage(data);
      };
    })()`;

    return (
      <View style={globalStyles.screenContainer}>
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          }}
        >
          <WebView
            ref={(ref) => (this.webview = ref)}
            source={{ uri: this.state.webUri }}
            onMessage={(event) => {
              this.receivePost(event.nativeEvent.data);
            }}
            scrollEnabled={false}
            geolocationEnabled={true}
            messagingEnabled={true}
            useWebKit={true}
            startInLoadingState={true}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            androidHardwareAccelerationDisabled={true}
            scalesPageToFit={false}
            renderError={() => this.onErrorWebview()}
            injectedJavaScript={injectedJavascript}
            onLoadStart={() => this.setState({ showLoading: true })}
            onLoad={() => this.setState({ showLoading: false })}
            onLoadProgress={({ nativeEvent }) =>
              console.log("Loading", nativeEvent.progress)
            }
            onLoadEnd={() => this.setState({ showLoading: false })}
          />
        </View>
        {this.renderPrepareQuit()}
      </View>
    );
  }
}

export default HomeScreen;

const styles = StyleSheet.create({
  mainBody: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  buttonStyle: {
    backgroundColor: "#307ecc",
    borderWidth: 0,
    color: "#FFFFFF",
    borderColor: "#307ecc",
    height: 40,
    alignItems: "center",
    borderRadius: 30,
    marginLeft: 35,
    marginRight: 35,
    marginTop: 15,
  },
  buttonTextStyle: {
    color: "#FFFFFF",
    paddingVertical: 10,
    fontSize: 16,
  },
});
