import React from 'react';
import {
  StyleSheet,
  View,
  Button,
} from 'react-native';
import Snackbar from 'react-native-snackbar-component';

export default function App() {
  const [isVisible, setIsVisible] = React.useState(false);
  return (
    <View style={styles.container}>
      <Button
        onPress={() => setIsVisible(!isVisible)}
        title="Toggle snackbar"
        accessibilityLabel="toggle"
      />
      <Snackbar
        visible={isVisible}
        textMessage="Hello There!"
        actionHandler={() => alert('its snack time!')}
        actionText="let's go again"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
