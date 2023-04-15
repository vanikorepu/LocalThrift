import type {
    CompositeScreenProps,
    NavigatorScreenParams,
  } from '@react-navigation/native';
  import type { StackScreenProps } from '@react-navigation/stack';
  import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

type RootStackParamList = {
    Splash: undefined,
    Auth: undefined; 
    Login: undefined;
    Register: undefined;
    TabNavigationRoutes: NavigatorScreenParams<TabParamList>;
    UploadPage: undefined;
    Summary: undefined;
    ProductDescriptionPage: {category: number, product: number};
  };

type RootStackScreenProps<T extends keyof RootStackParamList> =
  StackScreenProps<RootStackParamList, T>;

type TabParamList = {
    Home: NavigatorScreenParams<HomeStackParamList>;
    Profile: NavigatorScreenParams<ProfileStackParamList>;
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

type ProfileStackParamList = {
    ProfilePage: undefined;
    ProfileEditPage: undefined;
}

type ProfileStackScreenProps<T extends keyof ProfileStackParamList> =
  CompositeScreenProps<
    StackScreenProps<ProfileStackParamList, T>,
    TabScreenProps<keyof TabParamList>
  >;

declare global {
namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
}
}

export {
    type RootStackParamList,
    type RootStackScreenProps,
    type TabParamList,
    type TabScreenProps,
    type HomeStackParamList,
    type HomeStackScreenProps,
    type ProfileStackParamList,
    type ProfileStackScreenProps
};