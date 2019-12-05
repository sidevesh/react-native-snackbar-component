import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet, Text, Animated, Easing,
} from 'react-native';
import { Touchable } from './src';
import { noop } from './src/utils';
/*
 * Values are from https://material.io/guidelines/motion/duration-easing.html#duration-easing-dynamic-durations
 */

const easingValues = {
  entry: Easing.bezier(0.0, 0.0, 0.2, 1),
  exit: Easing.bezier(0.4, 0.0, 1, 1),
};

const durationValues = {
  entry: 225,
  exit: 195,
};

class SnackbarComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      translateValue: new Animated.Value(0),
      hideDistance: 9999,
    };
  }

  render() {
    return (
      <Animated.View
        style={[
          styles.limit_container,
          {
            height: this.state.translateValue.interpolate({
              inputRange: [0, 1],
              outputRange: [0, this.state.hideDistance],
            }),
            backgroundColor: this.props.backgroundColor,
          },
          { [this.props.position]: this.props[this.props.position] },
        ]}
      >
        <Animated.View
          style={[
            styles.container,
            {
              backgroundColor: this.props.backgroundColor,
              left: this.props.left,
              right: this.props.right,
            },
            {
              [this.props.position]: this.state.translateValue.interpolate({
                inputRange: [0, 1],
                outputRange: [this.state.hideDistance * -1, 0],
              }),
            },
          ]}
          onLayout={(event) => {
            this.setState({ hideDistance: event.nativeEvent.layout.height });
          }}
        >
          <Text style={[styles.text_msg, { color: this.props.messageColor }]}>
            {this.props.textMessage}
          </Text>
          {this.props.actionHandler && !!this.props.actionText && (
            <Touchable
              onPress={() => {
                this.props.actionHandler();
              }}
            >
              <Text
                style={[styles.action_text, { color: this.props.accentColor }]}
              >
                {this.props.actionText.toUpperCase()}
              </Text>
            </Touchable>
          )}
        </Animated.View>
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
        duration: durationValues.entry,
        toValue: 1,
        easing: easingValues.entry,
      }).start();
      if (nextProps.autoHidingTime) {
        const hideFunc = this.hideSnackbar.bind(this);
        setTimeout(hideFunc, nextProps.autoHidingTime);
      }
    } else if (!nextProps.visible && this.props.visible) {
      this.hideSnackbar();
    }
  }

  componentWillUpdate(nextProps, nextState) {
    if (
      nextProps.visible !== this.props.visible
      || nextState.hideDistance !== this.state.hideDistance
    ) {
      if (nextProps.visible) {
        this.props.distanceCallback(nextState.hideDistance + this.props.bottom);
      } else {
        this.props.distanceCallback(this.props.bottom);
      }
    }
  }

  /**
   * Starting te animation to hide the snack bar.
   * @return {null} No return.
   */
  hideSnackbar() {
    Animated.timing(this.state.translateValue, {
      duration: durationValues.exit,
      toValue: 0,
      easing: easingValues.exit,
    }).start();
  }
}

SnackbarComponent.defaultProps = {
  accentColor: 'orange',
  messageColor: '#FFFFFF',
  backgroundColor: '#484848',
  distanceCallback: noop,
  actionHandler: noop,
  left: 0,
  right: 0,
  bottom: 0,
  visible: false,
  position: 'bottom',
  actionText: '',
  textMessage: '',
  autoHidingTime: 0, // Default value will not auto hide the snack bar as the old version.
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
  position: PropTypes.oneOf(['bottom', 'top']), // bottom (default), top
  autoHidingTime: PropTypes.number, // How long (in milliseconds) the snack bar will be hidden.
};

const styles = StyleSheet.create({
  limit_container: {
    position: 'absolute',
    overflow: 'hidden',
    left: 0,
    right: 0,
    zIndex: 9999,
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'absolute',
  },
  text_msg: {
    fontSize: 14,
    flex: 1,
    textAlign: 'left',
    paddingStart: 20,
    paddingTop: 14,
    paddingBottom: 14,
  },
  action_text: {
    fontSize: 14,
    fontWeight: '600',
    paddingEnd: 20,
    paddingTop: 14,
    paddingBottom: 14,
  },
});

export default SnackbarComponent;
