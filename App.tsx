import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginPage from './components/LoginPage'
import SignUpPage from './components/SignUpPage'
import HomePage from './components/HomePage'
import CreateGroupPage from './components/CreateGroupPage'
import GroupDetailPage from './components/GroupDetailPage'
import SettingsPage from './components/SettingsPage'
import EditGroupDetailPage from './components/EditGroupDetailPage'

const Stack = createNativeStackNavigator();
const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Login" component={LoginPage} />
        <Stack.Screen name="SignUp" component={SignUpPage} />
        <Stack.Screen name="Home" options={{ headerBackVisible: false }} component={HomePage} />
        <Stack.Screen name="CreateGroup" component={CreateGroupPage} />
        <Stack.Screen name="GroupDetail" component={GroupDetailPage} />
        <Stack.Screen name="Settings" component={SettingsPage} />
        <Stack.Screen name="EditGroup" component={EditGroupDetailPage} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}
export default App;