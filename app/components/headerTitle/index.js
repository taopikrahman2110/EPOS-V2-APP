/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import React from "react";
import {
  Dimensions,
  Image,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from "react-native";
import BackButton from "../../assets/images/backretun.png";
import iconHeader from "../../assets/images/brankas/brankas-14.png";
import { getPageLang } from "../../languages";
import CommunityPickerModal from "../communityPickerModal/index";
// import NotificationMenu from "../pushNotification/index";
import headerStyles from "./style";

class HeaderTitle extends React.Component {
  constructor(props) {
    super(props);
    this.pagelang = getPageLang("header");
    this.state = {
      title: props.param.title,
      canGoBack: props.param.canGoBack,
      community: "dynamax",
      canChangeCommunity: props.param.canChangeCommunity,
      communityList: props.param.communityList,
      iconHeader: props.param.iconHeader,
      showAddButton:
        props.showAddButton === undefined ? false : props.showAddButton,
    };

    //this.changeCommunity = this.changeCommunity.bind(this);
    this.communityPicker = React.createRef();
  }

  componentWillReceiveProps = (props) => {
    this.setState({
      communityList: props.param.communityList,
      iconHeader: props.param.iconHeader,
      showAddButton:
        props.showAddButton === undefined ? "" : props.showAddButton,
    });
  };

  changeCommunity(community) {
    this.setState({ community: community.code, title: community.text });
    this.props.change(community);
  }

  toogleModal(visible) {
    if (!this.props.param.canGoBack)
      this.communityPicker.current.setModalVisible(visible);
  }

  goBack() {
    this.props.back();
  }

  goToAccountBinding = () => {
    //Alert.alert("A", "AAA", [{ text: "OK", onPress: () => console.log('OK Pressed') }], { cancelable: false });
    this.props.navigation.navigate("AccountBinding");
  };

  renderAddAccountButton = () => {
    if (this.state.showAddButton) {
      return (
        <TouchableHighlight
          onPress={() => this.goToAccountBinding()}
          underlayColor={"#d9d9d9"}
          style={headerStyles.textContainer}
        >
          <View style={headerStyles.backButton}>
            <Text style={headerStyles.textTitle}>{this.pagelang.add}</Text>
          </View>
        </TouchableHighlight>
      );
    }
  };

  _renderBackButton() {
    if (this.props.param.canGoBack) {
      return (
        <TouchableOpacity
          onPress={() => this.goBack()}
          underlayColor={"#d9d9d9"}
          style={headerStyles.textContainer}
        >
          <View style={headerStyles.backButton}>
            <Image
              source={BackButton}
              style={{ height: 20, width: 20, tintColor: "#fff" }}
            />
          </View>
        </TouchableOpacity>
      );
    } else {
      return <Text />;
    }
  }

  _renderTitle() {
    if (!this.props.param.canChangeCommunity) {
      return (
        <Text style={headerStyles.textTitle}>{this.props.param.title}</Text>
      );
    } else if (this.props.param.iconHeader) {
      return (
        <Image
          source={require("../../assets/images/brankas/brankas-14.png")}
          style={{
            height: 60,
            width: Dimensions.get("window").width - 140,
            tintColor: "#fff",
            resizeMode: "contain",
          }}
        />
      );
    } else {
      return (
        <TouchableHighlight
          onPress={() => this.toogleModal(true)}
          underlayColor={"#d9d9d9"}
          style={headerStyles.textContainer}
        >
          <Text style={headerStyles.textTitle}>{this.props.param.title}</Text>
        </TouchableHighlight>
      );
    }
  }

  render() {
    return (
      <View style={headerStyles.headerTitle}>
        <View style={headerStyles.leftContainer}>
          {this._renderBackButton()}
        </View>
        <View
          style={{
            width: Dimensions.get("window").width - 140,
            alignItems: "center",
          }}
        >
          {this._renderTitle()}
        </View>
        <View style={headerStyles.rightContainer}>
          {this.renderAddAccountButton()}
        </View>
        <CommunityPickerModal
          ref={this.communityPicker}
          communityList={this.state.communityList}
          changeCommunity={this.changeCommunity.bind(this)}
        />
        {/* <NotificationMenu /> */}
      </View>
    );
  }
}

export default HeaderTitle;
