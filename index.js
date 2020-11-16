import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  Text,
  Animated,
  Easing,
  ViewPropTypes,
} from 'react-native';
import { Touchable } from './src';

/* Values are from https://material.io/guidelines/motion/duration-easing.html#duration-easing-dynamic-durations */
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
          styles.limitContainer,
          {
            height: this.state.translateValue.interpolate({
              inputRange: [0, 1],
              outputRange: [0, this.state.hideDistance],
            }),
          },
          this.props.position === 'top'
            ? { top: this.props.top }
            : { bottom: this.props.bottom },
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
            this.props.containerStyle,
          ]}
          onLayout={event => this.setState({ hideDistance: event.nativeEvent.layout.height })}
        >
          {typeof this.props.textMessage === 'function'
            ? this.props.textMessage()
            : (
              <Text
                style={[
                  styles.textMessage,
                  { color: this.props.messageColor },
                  this.props.messageStyle,
                ]}
              >
                {this.props.textMessage}
              </Text>
            )
          }
          {this.props.actionHandler !== null && !!this.props.actionText
            ? (
              <Touchable onPress={this.props.actionHandler}>
                <Text
                  style={[
                    styles.actionText,
                    { color: this.props.accentColor },
                    this.props.actionStyle,
                  ]}
                >
                  {this.props.actionText.toUpperCase()}
                </Text>
              </Touchable>
            )
            : null
          }
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

  // eslint-disable-next-line camelcase
  UNSAFE_componentWillReceiveProps(nextProps) {
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

  // eslint-disable-next-line camelcase
  UNSAFE_componentWillUpdate(nextProps, nextState) {
    if (
      this.props.distanceCallback !== null
      && (
        nextProps.visible !== this.props.visible
        || nextState.hideDistance !== this.state.hideDistance
      )
    ) {
      if (nextProps.visible) {
        this.props.distanceCallback(nextState.hideDistance + this.props[this.props.position]);
      } else {
        this.props.distanceCallback(this.props[this.props.position]);
      }
    }
  }

  /**
   * Starting the animation to hide the snackbar.
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
  distanceCallback: null,
  actionHandler: null,
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
  visible: false,
  position: 'bottom',
  actionText: '',
  textMessage: '',
  autoHidingTime: 0, // Default value will not auto hide the snack bar as the old version.
  containerStyle: {},
  messageStyle: {},
  actionStyle: {},
};

SnackbarComponent.propTypes = {
  accentColor: PropTypes.string,
  messageColor: PropTypes.string,
  backgroundColor: PropTypes.string,
  distanceCallback: PropTypes.func,
  actionHandler: PropTypes.func,
  left: PropTypes.number,
  right: PropTypes.number,
  top: PropTypes.number,
  bottom: PropTypes.number,
  visible: PropTypes.bool,
  actionText: PropTypes.string,
  textMessage: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  position: PropTypes.oneOf(['bottom', 'top']), // bottom (default), top
  // eslint-disable-next-line react/no-unused-prop-types
  autoHidingTime: PropTypes.number, // How long (in milliseconds) the snack bar will be hidden.
  containerStyle: ViewPropTypes.style,
  messageStyle: Text.propTypes.style,
  actionStyle: Text.propTypes.style,
};

const styles = StyleSheet.create({
  limitContainer: {
    position: 'absolute',
    overflow: 'hidden',
    left: 0,
    right: 0,
    zIndex: 9999,
    backgroundColor: 'rgba(0, 0, 0, 0)',
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'absolute',
  },
  textMessage: {
    fontSize: 14,
    flex: 1,
    textAlign: 'left',
    paddingStart: 20,
    paddingTop: 14,
    paddingBottom: 14,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
    paddingEnd: 20,
    paddingTop: 14,
    paddingBottom: 14,
  },
});

export default SnackbarComponent;
