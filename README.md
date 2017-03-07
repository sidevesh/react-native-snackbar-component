# React-Native-SnackBar-Component
A snackbar component for Android and iOS, customizable and simple.

See [Google Material Design](https://material.io/guidelines/components/snackbars-toasts.html) for more info on Snackbars.

## Installation

```sh
npm install --save react-native-snackbar-component
```

## Basic Usage

```javascript
import SnackBar from 'react-native-snackbar-component'
```

## Code

```js
<Snackbar visible={true} textMessage="Hello There!" actionHandler={()=>{console.log("snackbar button clicked!")}} actionText="let's go"/>
});
```
