import type {
    CompositeScreenProps,
    NavigatorScreenParams,
  } from '@react-navigation/native';
  import type { StackScreenProps } from '@react-navigation/stack';
  import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

type UserProfileParamsList = {
  name: string,
  email: string,
  phone: string,
  password: string,
  _id: string,
  cart: string[]
}

type ImageParamsList = {
  name: string,
  type: string,
  uri: string,
  height: number,
  width: number,
}

type ProductParamsList = {
    size?: string,
    price?: string,
    brand?: string,
    usage?: string,
    meeting?: number,
    category?: number,
    images?: ImageParamsList[],
}

type RootStackParamList = {
    Splash: undefined,
    Auth: undefined; 
    Login: undefined;
    Register: undefined;
    TabNavigationRoutes: NavigatorScreenParams<TabParamList>;
    UploadPage: {state: "post"|"edit", product: ProductParamsList|undefined, product_id: string|undefined};
    Summary: {state: "post"|"edit", product: ProductParamsList, product_id: string|undefined};
    ProductDescriptionPage: {category: number, product: string};
    ProfileEditPage: undefined;
  };

type RootStackScreenProps<T extends keyof RootStackParamList> =
  StackScreenProps<RootStackParamList, T>;

type TabParamList = {
    Home: NavigatorScreenParams<HomeStackParamList>;
    ProfilePage: undefined;
    Cart: undefined;
}

type TabScreenProps<T extends keyof TabParamList> =
  CompositeScreenProps<
    BottomTabScreenProps<TabParamList, T>,
    RootStackScreenProps<keyof RootStackParamList>
  >;

type HomeStackParamList = {
    HomePage: undefined;
    BuyerHomePage: undefined;
    SellerHomePage: undefined;
    ProductListPage: {category: number};
}

type HomeStackScreenProps<T extends keyof HomeStackParamList> =
  CompositeScreenProps<
    StackScreenProps<HomeStackParamList, T>,
    TabScreenProps<keyof TabParamList>
  >;

declare global {
namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
}
}

export {
    type UserProfileParamsList,
    type ImageParamsList,
    type ProductParamsList,
    type RootStackParamList,
    type RootStackScreenProps,
    type TabParamList,
    type TabScreenProps,
    type HomeStackParamList,
    type HomeStackScreenProps,
};