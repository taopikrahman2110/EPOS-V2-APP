import { Image, View } from "react-native";
// import DocumentScanner, {
//   ResponseType,
// } from "react-native-document-scanner-plugin";
import React, { Component } from "react";

export default class Scanner extends Component {
  constructor(props) {
    super(props);
    this.state = {
      image: null,
      error: null,
    };
  }

  componentDidMount() {
    // this.doScanner();
  }

  // async doScanner() {
  //   var scanDoc = await DocumentScanner.scanDocument({
  //     responseType: ResponseType.Base64,
  //   });

  //   console.log(scanDoc);

  //   if (scanDoc.status === "success") {
  //     if (scanDoc.scannedImages.length > 0) {
  //       this.setState({
  //         image: scanDoc.scannedImages[0],
  //       });
  //     }
  //   }
  // }

  render() {
    return (
      <View style={{ margin: 10 }}>
        {this.state.image ? (
          <Image
            resizeMode="contain"
            style={{ width: "100%", height: "100%" }}
            source={{ uri: this.state.image }}
          />
        ) : (
          <View />
        )}
      </View>
    );
  }
}
