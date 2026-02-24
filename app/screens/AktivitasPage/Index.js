import React from "react";
import { BackHandler, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { WebView } from "react-native-webview";
import FooterMenu from "../../components/footerMenu/index";
import HeaderTitle from "../../components/headerTitle/index";
import PrepareQuit from "../../components/prepareQuit/index";
import LoadingScreen from "../../components/LoadingScreen";
import { serverurl, develbase } from "../../config";

class AktivitasScreenPage extends React.Component {
  constructor(props) {
    super(props);
    // this.pagelang = getPageLang('aktivitas');
    global.community = { code: "", text: "" };

    this.state = {
      title: "Riwayat Transaksi",
      canGoBack: false,
      webUri:
        serverurl +
        develbase +
        "/?page=riwayat-transaksi&community=" +
        global.community.code +
        "&t=" +
        new Date().getTime(),
      canChangeCommunity: false,
      hideTopbar: true,
      hideFooterMenu: false,
      prepareQuit: false,
      showLoading: false,
    };
    this.webview = null;
  }

  _retrieveData = async (key) => {
    let value = await AsyncStorage.getItem(key);
    return value;
  };

  componentDidMount() {
    BackHandler.addEventListener("hardwareBackPress", this.handleBackPress);
    this._retrieveData("smart-app-id-login").then((info) => {
      if (info !== null) {
        this.setState({ loginInfo: JSON.parse(info) });
        console.log(info);
      } else {
        this.props.navigation.replace("Login");
      }
    });
  }

  componentWillUnmount() {
    BackHandler.removeEventListener("hardwareBackPress", this.handleBackPress);
  }

  handleBackPress = () => {
    if (this.state.canGoBack) {
      this.webview.goBack();
      return true;
    } else {
      this.props.navigation.replace("Home");
      return true;
    }
  };

  changeCommunity(community) {
    global.community = community;
  }

  goBack() {
    let d = new Date();
    //if (global.community.code == "jakartagardencity") {

    this.setState({
      webUri:
        serverurl +
        develbase +
        "/?page=aktivitas&community=" +
        global.community.code +
        "&t=" +
        d.getTime(),
      title: "aktivitas",
      canGoBack: false,
      canChangeCommunity: false,
    });
  }

  receivePost(param) {
    console.log(param);
    let jsonParam = JSON.parse(param);

    if (jsonParam.code === undefined) {
      jsonParam.title = global.community.text;
      if (jsonParam.canChangeCommunity === undefined) {
        jsonParam.canChangeCommunity = true;
      }
      this.setState({
        title: jsonParam.title,
        canGoBack: jsonParam.canGoBack,
        canChangeCommunity: jsonParam.canChangeCommunity,
        hideTopbar: jsonParam.hideTopbar,
        hideFooterMenu: jsonParam.hideFooterMenu,
      });
    } else {
      if (jsonParam.code === "need-home") {
        this.props.navigation.replace("AktivitasPage");
      } else if (jsonParam.code === "need-beranda") {
        this.props.navigation.replace("Home");
      }
    }
  }

  //------------------------------------

  refreshPage = () => {
    let d = new Date();
    this.setState({
      webUri:
        serverurl +
        develbase +
        "/?page=aktivitas&community=" +
        global.community.code +
        "&t=" +
        d.getTime(),
      title: "aktivitas",
      canGoBack: false,
      canChangeCommunity: true,
    });
  };

  renderHeader = () => {
    if (!this.state.hideTopbar) {
      return (
        <HeaderTitle
          param={{
            title: this.state.title,
            canGoBack: this.state.canGoBack,
            canChangeCommunity: this.state.canChangeCommunity,
            communityList: this.state.communityList,
          }}
          change={this.changeCommunity.bind(this)}
          back={this.goBack.bind(this)}
        />
      );
    }
  };

  renderFooter = () => {
    if (!this.state.hideFooterMenu) {
      return (
        <FooterMenu
          navigation={this.props.navigation}
          currentMenu={2}
          refreshPage={this.refreshPage}
        />
      );
    }
  };

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

  onErrorWebview() {
    //alert('testing');
  }

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
      <View style={{ flex: 1 }}>
        {this.renderHeader()}
        <View
          style={{
            position: "absolute",
            top: this.state.hideTopbar ? 0 : 50,
            left: 0,
            right: 0,
            bottom: this.state.hideFooterMenu ? 0 : 50,
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
        {this.renderFooter()}
        {this.renderLoading()}
      </View>
    );
  }
}

export default AktivitasScreenPage;
