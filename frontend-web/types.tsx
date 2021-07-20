/**
 * Learn more about using TypeScript with React Navigation:
 * https://reactnavigation.org/docs/typescript/
 */

import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp } from "@react-navigation/native";

//  full_name = models.CharField(max_length=50, null=False, blank=False)
//     email = models.EmailField(max_length=254, null=False, blank=False)
//     phone_number = models.CharField(max_length=20, null=False, blank=False)
//     country = CountryField(blank_label="Country *", null=False, blank=False)
//     zipcode = models.CharField(max_length=20, null=True, blank=True)
//     town_or_city = models.CharField(max_length=40, null=False, blank=False)
//     street_address1 = models.CharField(max_length=80, null=False, blank=False)
//     street_address2 = models.CharField(max_length=80, null=True, blank=True)
//     county = models.CharField(max_length=80, null=True, blank=True)

//     created_at = models.DateTimeField(auto_now_add=True)

//     stripe_pid = models.CharField(max_length=254, null=False, blank=False, default="")

//     order = models.ForeignKey(Order, related_name="order_detail", on_delete=models.CASCADE)

export type RootStackParamList = {
  Root: undefined;
  Home: undefined;
  Feed: { sort: "latest" | "top" } | undefined;
  Profile: { userId: string };
  NotFound: undefined;
};

export type LandingStackParamList = {
  Home: undefined;
  Details: undefined;
};

export type BottomTabParamList = {
  TabOne: undefined;
  TabTwo: undefined;
};

export type TabOneParamList = {
  TabOneScreen: undefined;
};

export type TabTwoParamList = {
  TabTwoScreen: undefined;
};

export type RootParamList = {
  LandingScreen: undefined;
  StoreScreen: undefined;
  FavoriteScreen: undefined;
  OrderScreen: { paramA: string };
  SellScreen: { paramB: string; paramC: number };
  BuyScreen: undefined;
};

export type ProductParamList = {
  Product: {
    name: string;
  };
  EditProduct: {
    name: string;
    submit?: React.MutableRefObject<() => void>;
  };
};

export type SearchParamList = {
  Search: undefined;
} & ProductParamList;

export type SearchStackNavProps<T extends keyof SearchParamList> = {
  navigation: StackNavigationProp<SearchParamList, T>;
  route: RouteProp<SearchParamList, T>;
};

export type AuthParamList = {
  Login: undefined;
  Register: undefined;
};

export type AuthNavProps<T extends keyof AuthParamList> = {
  navigation: StackNavigationProp<AuthParamList, T>;
  route: RouteProp<AuthParamList, T>;
};

export type HomeParamList = {
  Feed: undefined;
} & ProductParamList;

export type HomeStackNavProps<T extends keyof HomeParamList> = {
  navigation: StackNavigationProp<HomeParamList, T>;
  route: RouteProp<HomeParamList, T>;
};

// creating a screen

// const Screen1 = ({ navigation, route }: Screen1Props) => {
//   return (
//     <>
//       <Text>Screen1</Text>
//       <Button
//         onPress={() => {
//           navigation.push("Screen2", { paramA: "Hello!" });
//         }}
//       />
//     </>
//   );
// };

// Accessing params from the next screen

// const Screen2 = ({ route }: Screen2Props) => {
//   return <Text>{route.params.paramA}</Text>;
// };

// Or

// using hooks to access the route params

// const Screen1 = () => {
//   const navigation =
//     useNavigation<StackNavigationProp<RootParamList, "Screen1">>();
//   const route = useRoute<RouteProp<RootParamList, "Screen1">>();

//   // ...
// };

// <NavigationContainer>
//   <Root.Navigator>
//     <Root.Screen name="Screen1" component={Screen1} />
//     <Root.Screen name="Screen2" component={Screen2} />
//     <Root.Screen name="Screen3" component={Screen3} />
//   </Root.Navigator>
// </NavigationContainer>;
