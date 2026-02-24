import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { LogBox } from "react-native";
import ignoreWarnings from "ignore-warnings";

// import CodeOTP from "./screens/CodeOTP";
// import ForgotPass from "./screens/ForgotPass";
import HomeScreen from "./screens/Home/index";
import IntroScreen from "./screens/IntroScreen/index";
// import Login from "./screens/Login";
// import Password from "./screens/Password";
// import Profile from "./screens/Profile";
// import Register from "./screens/Register";
// import RegisterOTP from "./screens/RegisterOTP";
// import ResetPass from "./screens/ResetPass";
// import Promotion from "./screens/Promotion";
// import ProfileScreenPage from "./screens/ProfilePage/Index";
// import NotifikasiScreenPage from "./screens/NotifikasiPage/Index";
// import PromoScreenPage from "./screens/PromoPage/Index";
// import AktivitasScreenPage from "./screens/AktivitasPage/Index";
// import Scanner from "./screens/Scannner";

ignoreWarnings("warn", ["ViewPropTypes", "[react-native-gesture-handler]"]);

LogBox.ignoreLogs([
  "ViewPropTypes will be removed from React Native. Migrate to ViewPropTypes exported from 'deprecated-react-native-prop-types'.",
  "NativeBase: The contrast ratio of",
  "[react-native-gesture-handler] Seems like you're using an old API with gesture components, check out new Gestures system!",
]);

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="IntroScreen">
        <Stack.Screen
          name="IntroScreen"
          component={IntroScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false }}
        />
        {/* <Stack.Screen
          name="Login"
          component={Login}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ProfilePage"
          component={ProfileScreenPage}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="NotifikasiPage"
          component={NotifikasiScreenPage}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="AktivitasPage"
          component={AktivitasScreenPage}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Profile"
          component={Profile}
          options={{ headerShown: false }}
        /> */}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
