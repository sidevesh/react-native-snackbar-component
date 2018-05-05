import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  Text,
  View,
  Image,
  Animated,
  Easing
} from 'react-native';
import { Touchable } from './src';
import { noop } from './src/utils';
/*
* Values are from https://material.io/guidelines/motion/duration-easing.html#duration-easing-dynamic-durations
*/

const easing_values = {
  entry: Easing.bezier(0.0, 0.0, 0.2, 1),
  exit: Easing.bezier(0.4, 0.0, 1, 1)
}

const duration_values = {
  entry: 225,
  exit: 195
}

class SnackbarComponent extends Component {

  constructor(props) {
    super(props);
    this.state = {
      translateValue: new Animated.Value(0),
      hideDistance: 9999
    };
  }

  render() {
    return (
      <Animated.View style={[
          styles.limit_container,
          {
            height: this.state.translateValue.interpolate({inputRange: [0, 1], outputRange: [0, this.state.hideDistance]}),
            backgroundColor: 'teal'
          },
          this.props.position==="bottom"?{bottom: this.props.bottom}:{top: this.props.bottom},
        ]}>
        <Animated.View
          style={[
            styles.container,
            {
              backgroundColor: this.props.backgroundColor,
            },
            this.props.position==="bottom"?{bottom: this.state.translateValue.interpolate({inputRange: [0, 1], outputRange: [this.state.hideDistance*-1, 0]})}:
              {top: this.state.translateValue.interpolate({inputRange: [0, 1], outputRange: [this.state.hideDistance*-1,0]})},
          ]}
          onLayout={(event) => {
            this.setState({hideDistance: event.nativeEvent.layout.height});
          }}
        >
          <View style={styles.text_msg_wrapper}>
            { !!this.props.imageUrl &&
            <Image
              style={styles.image_style}
              source={{ uri: this.props.imageUrl }}
            /> }
            <Text style={[styles.text_msg, {color: this.props.messageColor}]}>{this.props.textMessage}</Text>
          </View>
          {this.props.actionHandler && this.props.actionText &&
            <Touchable onPress={() => {this.props.actionHandler()}} >
              <Text style={[styles.action_text, {color: this.props.accentColor}]}>{this.props.actionText.toUpperCase()}</Text>
            </Touchable>
          }
        </Animated.View>
      </Animated.View>
    );
  }

  componentDidMount() {
    if(this.props.visible) {
      this.state.translateValue.setValue(1);
    }
    else {
      this.state.translateValue.setValue(0);
    }
  }

  componentWillReceiveProps(nextProps) {
    if((nextProps.visible)&&(!this.props.visible)) {
      Animated.timing(
        this.state.translateValue,
        {
          duration: duration_values.entry,
          toValue: 1,
          easing: easing_values.entry
        }
      ).start();
    }
    else if((!nextProps.visible)&&(this.props.visible)) {
      Animated.timing(
        this.state.translateValue,
        {
          duration: duration_values.exit,
          toValue: 0,
          easing: easing_values.exit
        }
      ).start();
    }
  }

  componentWillUpdate(nextProps, nextState) {
    if((nextProps.visible!==this.props.visible)||(nextState.hideDistance!==this.state.hideDistance)) {
      if(nextProps.visible) {
        this.props.distanceCallback(nextState.hideDistance+this.props.bottom);
      }
      else {
        this.props.distanceCallback(this.props.bottom);
      }
    }
  }

}

SnackbarComponent.defaultProps = {
  accentColor:"orange",
  messageColor:"#FFFFFF",
  backgroundColor:"#484848",
  distanceCallback: noop,
  bottom: 0,
  position: "bottom",
};

SnackbarComponent.propTypes = {
  accentColor: PropTypes.string,
  messageColor: PropTypes.string,
  backgroundColor: PropTypes.string,
  distanceCallback: PropTypes.func,
  bottom: PropTypes.number,
  position: PropTypes.string, // bottom (default), top
  imageUrl: PropTypes.string,
};

const styles = StyleSheet.create({
  limit_container: {
    position: 'absolute',
    left: 0,
    right: 0,
    overflow: 'hidden',
    zIndex: 9999,
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'absolute',
    left: 0,
    right: 0,
    paddingLeft: 8,
    paddingRight: 8,
    paddingTop: 16,
    paddingBottom: 16
  },
  text_msg_wrapper: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start'
  },
  text_msg: {
    fontSize: 14,
  },
  image_style: {
    height: 20,
    width: 20,
    marginRight: 8
  },
  action_text: {
    fontSize: 14,
    fontWeight: '600'
  }
});

export default SnackbarComponent;

