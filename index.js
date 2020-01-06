import React, { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import { StyleSheet, Text, Animated, Easing } from "react-native";
import { Touchable } from "./src";
import { noop } from "./src/utils";
/*
 * Values are from https://material.io/guidelines/motion/duration-easing.html#duration-easing-dynamic-durations
 */

const easingValues = {
  entry: Easing.bezier(0.0, 0.0, 0.2, 1),
  exit: Easing.bezier(0.4, 0.0, 1, 1)
};

const durationValues = {
  entry: 225,
  exit: 195
};

const SnackbarComponent = ({
  distanceCallback,
  backgroundColor,
  autoHidingTime,
  actionHandler,
  messageColor,
  accentColor,
  textMessage,
  actionText,
  position,
  visible,
  bottom,
  left,
  right
}) => {
  const [hideDistance, setHideDistance] = useState(9999);
  const translateVal = useRef(new Animated.Value(0));
  const translateValue = translateVal.current;
  const positionMap = { right, left, bottom };

  const pV = useRef(hideDistance);
  const pD = useRef(visible);

  const hideSnackbar = () => {
    Animated.timing(translateValue, {
      duration: durationValues.exit,
      easing: easingValues.exit,
      toValue: 0
    }).start();
  };

  useEffect(() => {
    translateValue.setValue(visible ? 1 : 0);
  }, []);

  // componentWillReceiveProps
  useEffect(() => {
    const prevVisible = pV.current;
    const prevHideDistance = pD.current;

    if (visible && !prevVisible) {
      Animated.timing(translateValue, {
        duration: durationValues.entry,
        toValue: 1,
        easing: easingValues.entry
      }).start();

      if (autoHidingTime) {
        setTimeout(hideSnackbar, autoHidingTime);
      }
    } else if (!visible && prevVisible) {
      hideSnackbar();
    }

    if (visible !== prevVisible || hideDistance !== prevHideDistance) {
      if (visible) {
        distanceCallback && distanceCallback(hideDistance + bottom);
      } else {
        distanceCallback && distanceCallback(bottom);
      }
    }

    pD.current = hideDistance;
    pV.current = visible;
  }, [visible, hideDistance, autoHidingTime]);

  return (
    <Animated.View
      style={[
        styles.limit_container,
        {
          height: translateValue.interpolate({
            inputRange: [0, 1],
            outputRange: [0, hideDistance]
          }),
          backgroundColor: backgroundColor
        },
        { [position]: positionMap[position] }
      ]}
    >
      <Animated.View
        style={[
          styles.container,
          { backgroundColor, left, right },
          {
            [position]: translateValue.interpolate({
              inputRange: [0, 1],
              outputRange: [hideDistance * -1, 0]
            })
          }
        ]}
        onLayout={event => {
          setHideDistance(event.nativeEvent.layout.height);
        }}
      >
        <Text style={[styles.text_msg, { color: messageColor }]}>
          {textMessage}
        </Text>
        {actionHandler && !!actionText && (
          <Touchable
            onPress={() => {
              actionHandler();
            }}
          >
            <Text style={[styles.action_text, { color: accentColor }]}>
              {actionText.toUpperCase()}
            </Text>
          </Touchable>
        )}
      </Animated.View>
    </Animated.View>
  );
};

SnackbarComponent.defaultProps = {
  accentColor: "orange",
  messageColor: "#FFFFFF",
  backgroundColor: "#484848",
  distanceCallback: noop,
  actionHandler: noop,
  left: 0,
  right: 0,
  bottom: 0,
  visible: false,
  position: "bottom", // left, right, bottom
  actionText: "",
  textMessage: "",
  autoHidingTime: 0 // Default value will not auto hide the snack bar as the old version.
};

SnackbarComponent.propTypes = {
  accentColor: PropTypes.string,
  messageColor: PropTypes.string,
  backgroundColor: PropTypes.string,
  distanceCallback: PropTypes.func,
  actionHandler: PropTypes.func,
  left: PropTypes.number,
  right: PropTypes.number,
  bottom: PropTypes.number,
  visible: PropTypes.bool,
  actionText: PropTypes.string,
  textMessage: PropTypes.string,
  position: PropTypes.oneOf(["bottom", "top"]), // bottom (default), top
  autoHidingTime: PropTypes.number // How long (in milliseconds) the snack bar will be hidden.
};

const styles = StyleSheet.create({
  limit_container: {
    position: "absolute",
    overflow: "hidden",
    left: 0,
    right: 0,
    zIndex: 9999
  },
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    position: "absolute"
  },
  text_msg: {
    fontSize: 14,
    flex: 1,
    paddingLeft: 20,
    paddingTop: 14,
    paddingBottom: 14
  },
  action_text: {
    fontSize: 14,
    fontWeight: "600",
    paddingRight: 20,
    paddingTop: 14,
    paddingBottom: 14
  }
});

export default SnackbarComponent;
