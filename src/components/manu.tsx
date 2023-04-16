import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  View,
  Pressable,
  StyleSheet,
  Platform,
  Dimensions,
  TouchableOpacity,
  Text,
  StatusBar,
  Animated,
} from "react-native";
import { Portal } from "@gorhom/portal";
import useKeyboardHeight from "./useKeyboardHeight";

const { width: layoutWidth, height: layoutHeight } = Dimensions.get("window");

const isIOS = Platform.OS === "ios";

interface ManuProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  alignment: "left" | "right" | "center" | undefined;
  style: {};
  backgroundStyle: {};
  topOffset: number;
}

const defaultManuProps = {
  style: {},
  backgroundStyle: {},
  alignment: undefined,
  topOffset: 0,
}

const Menu = ({ trigger, children, style, backgroundStyle, alignment, topOffset}: ManuProps) => {
  const triggerWrapperRef = useRef(null);
  const itemsWrapperRef = useRef(null);
  const [menuVisible, setMenuVisible] = useState(false);

  const [triggerDimensions, setTriggerDimensions] = useState({
    top: 0,
    left: 0,
    width: 0,
    height: 0,
  });
  const [modalDimensions, setModalDimensions] = useState({
    width: 0,
    height: 0,
  });

  const { keyboardHeight } = useKeyboardHeight();

  const styles = StyleSheet.create({
    modalWrapper: {
      ...StyleSheet.absoluteFillObject,
      zIndex: 10,
    },

    button: {
      width: "auto",
      alignSelf: "center",
    },
    activeSection: {
      // backgroundColor: "white",
      alignSelf: "flex-start",
      ...Platform.select({
        ios: {
          alignSelf: "flex-start",
          // width: layoutWidth * 0.5,

          // borderRadius: 13,
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 0,
          },
          shadowOpacity: 0.35,
          shadowRadius: 100,
        },
        android: {
          // maxWidth: layoutWidth * 0.7,
          alignSelf: "flex-start",
          elevation: 8,
        },
      }),
      opacity:
        modalDimensions.width !== 0 && triggerDimensions.left !== 0 ? 1 : 0,
      zIndex: 99,
    },
    overlay: {
      ...Platform.select({
        ios: {
          borderRadius: 13,
        },
      }),
    },
  });
  const fadeAnim = useRef(new Animated.Value(0)).current; // Initial value for opacity: 0

  const calculateDimensions = () => {
    triggerWrapperRef?.current?.measureInWindow((x: number, y: number, width: number, height: number) => {
      setTriggerDimensions({
        top: Math.max(y, 0),
        left: x,
        width,
        height,
      });
    });

    setTimeout(() => {
      itemsWrapperRef?.current?.measureInWindow((x: number, y: number, width: number, height: number) => {
        setModalDimensions({ width, height });
      });
    }, 100);
  };

  useEffect(() => {
    if (menuVisible) {
      if (triggerWrapperRef?.current) calculateDimensions();
    }
  }, [menuVisible, itemsWrapperRef, setModalDimensions]);

  const closeModal = () => {
    setMenuVisible(false);
    setModalDimensions({ width: 0, height: 0 });
    setTriggerDimensions({ top: 0, left: 0, width: 0, height: 0 });
  };

  const { top, left } = useMemo(() => {
    let left = 0;
    let top = 0;

    if (alignment === undefined) {
      left =
        triggerDimensions.left - modalDimensions.width + triggerDimensions.width;
      // if the popup is outside the screen from the left
      if (triggerDimensions.left - modalDimensions.width < 0)
        left = triggerDimensions.left;
    } else {
      left = triggerDimensions.left;
  
      if (alignment === "center") {
        left -= modalDimensions.width / 2 - triggerDimensions.width / 2;
      } else if (alignment === "right") {
        left -= modalDimensions.width + triggerDimensions.width;
      }
    }


    if (isIOS) {
      const initialTriggerTop =
        triggerDimensions.top + triggerDimensions.height + 1 + topOffset;
      if (
        modalDimensions.height + initialTriggerTop >
        layoutHeight - keyboardHeight
      )
        top = triggerDimensions.top - modalDimensions.height - 1 + topOffset;
      else top = initialTriggerTop;
    } else {
      const initialTriggerTop =
        triggerDimensions.top +
        triggerDimensions.height +
        StatusBar.currentHeight;

      top =
        initialTriggerTop + modalDimensions.height >
        layoutHeight - keyboardHeight
          ? initialTriggerTop -
            triggerDimensions.height -
            modalDimensions.height
          : initialTriggerTop;
    }

    return { top, left };
  }, [modalDimensions, triggerDimensions, keyboardHeight]);

  const menuPositionStyles = { left, top };

  return (
    <>
      <Pressable
        onPress={() => {
          setMenuVisible(true);
        }}
        ref={triggerWrapperRef}
      >
        {trigger}
      </Pressable>
      <Portal hostName="menu">
        {menuVisible && (
          <TouchableOpacity
            activeOpacity={1}
            onPress={closeModal}
            style={[styles.modalWrapper, backgroundStyle]}
          >
            <Animated.View
              style={[styles.activeSection, menuPositionStyles, style]}
              collapsable={false}
              ref={itemsWrapperRef}
            >
              {/* pass the closeModal to children prop  */}
              {Array.isArray(children)
                ? children.map((childrenItem) => {
                    return React.cloneElement(childrenItem, {
                      closeModal,
                    });
                  })
                : React.cloneElement(children, {
                    closeModal,
                  })}
            </Animated.View>
          </TouchableOpacity>
        )}
      </Portal>
    </>
  );
};

Menu.defaultProps = defaultManuProps;


interface MenuItemProps {
  element: React.ReactNode;
  onPress: (() => void);
  closeModal: (() => void);
  style: {};
}

const defaultManuItemProps: MenuItemProps = {
  element: <View></View>,
  onPress: () => {},
  closeModal: () => {},
  style: {},
}

export const MenuItem = ({ element, onPress, closeModal, style }: MenuItemProps) => {

  const handleOnPress = () => {
    onPress();
    closeModal();
  };

  return (
    <>
      <TouchableOpacity activeOpacity={0.8} onPress={handleOnPress} style={style}>
        {element}
      </TouchableOpacity>
    </>
  );
};

MenuItem.defaultProps = defaultManuItemProps;

export default Menu;