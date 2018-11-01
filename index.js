import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { UIManager, StyleSheet, Text, View, Image, Animated, Easing } from 'react-native';
import { Touchable } from './src';
/*
* Values are from https://material.io/guidelines/motion/duration-easing.html#duration-easing-dynamic-durations
*/

const easing_values = {
  entry: Easing.bezier(0.0, 0.0, 0.2, 1),
  exit: Easing.bezier(0.4, 0.0, 1, 1),
};

const duration_values = {
  entry: 225,
  exit: 195,
};

const height = 46;
class SnackbarComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      translateValue: new Animated.Value(0),
      heightWithStatusBar: props.statusBarHeight + height,
    };
  }

  render() {
    const { backgroundColor, textMessage, messageColor } = this.props;
    const { heightWithStatusBar, translateValue } = this.state;

    return (
      <Animated.View
        style={[
          styles.container,
          {
            height: heightWithStatusBar,
            backgroundColor,
            transform: [
              {
                translateY: translateValue.interpolate({
                  inputRange: [0, 1],
                  outputRange: [heightWithStatusBar * -1, 0],
                }),
              },
            ],
          },
        ]}
      >
        <View style={{ height, flex: 1, justifyContent: 'center' }}>
          <Text style={[styles.text_msg, { color: messageColor }]}>{textMessage}</Text>
        </View>
      </Animated.View>
    );
  }

  componentDidMount() {
    if (this.props.visible) {
      this.state.translateValue.setValue(1);
    } else {
      this.state.translateValue.setValue(0);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.visible && !this.props.visible) {
      Animated.timing(this.state.translateValue, {
        duration: duration_values.entry,
        toValue: 1,
        easing: easing_values.entry,
        useNativeDriver: true,
      }).start();
    } else if (!nextProps.visible && this.props.visible) {
      this.hideSnackbar();
    }
  }

  /**
   * Starting te animation to hide the snack bar.
   * @return {null} No return.
   */
  hideSnackbar() {
    Animated.timing(this.state.translateValue, {
      duration: duration_values.exit,
      toValue: 0,
      easing: easing_values.exit,
      useNativeDriver: true,
    }).start();
  }
}

SnackbarComponent.defaultProps = {
  messageColor: '#FFFFFF',
  backgroundColor: '#484848',
};

SnackbarComponent.propTypes = {
  messageColor: PropTypes.string,
  backgroundColor: PropTypes.string,
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    overflow: 'hidden',
    left: 0,
    right: 0,
    zIndex: 9999,
    top: 0,
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  text_msg: {
    fontSize: 14,
    paddingLeft: 20,
  },
});

export default SnackbarComponent;
