//logged user
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { Home } from '../screens/Home';
import { NewOrder } from '../screens/NewOrder';
import { Details } from '../screens/Details';

const { Navigator, Screen } = createNativeStackNavigator();

export function AppRoutes() {
  return (
    <Navigator
      screenOptions={{
        headerShown: false
      }}
    >
      <Screen
        name="home"
        component={Home}
      />
      <Screen
        name="newOrder"
        component={NewOrder}
      />
      <Screen
        name="details"
        component={Details}
      />
    </Navigator>
  )
}
