import { useState, useEffect } from "react";
import { Keyboard, Platform, KeyboardEvent } from "react-native";

const isIOS = Platform.OS === "ios";
const useKeyboardHeight = () => {
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  const handleKeyboardDidShow = (e: KeyboardEvent) => {
    setKeyboardHeight(e.endCoordinates.height);
  };
  const handleKeyboardDidHide = () => {
    setKeyboardHeight(0);
  };

  useEffect(() => {
    // keyboardWillShow is not supported on android
    const showEvent = isIOS ? "keyboardWillShow" : "keyboardDidShow";
    const hideEvent = isIOS ? "keyboardWillHide" : "keyboardDidHide";
    const show = Keyboard.addListener(showEvent, handleKeyboardDidShow);
    const hide = Keyboard.addListener(hideEvent, handleKeyboardDidHide);
    return () => {
      Keyboard.removeSubscription(show);
      Keyboard.removeSubscription(hide);
    };
  }, []);

  return { keyboardHeight };
};

export default useKeyboardHeight;