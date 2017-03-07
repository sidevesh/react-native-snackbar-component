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
```
## Options
| Prop        | Type           | Effect  | Default Value |
| ------------- |-------------| -----| -----|
| visible | boolean | Show or hide the snackbar | none |
| textMessage | string | The main message text | none |
| actionHandler | function | Function to be called when button is pressed, if absent no action button is shown | none |
| actionText | message | The text of action button, will be uppercased automatically | none |
| backgroundColor | color | The background color of snackbar | #484848 |
| accentColor | color | The color of action button text | orange |
| messageColor | color | The color of main message text | #FFFFFF |

##Note

* When visible prop is changed, the snackbar will be animated in/out of screen
* The snackbar will not auto-dismiss by itself, for auto-dismiss use setTimeout() and change value passed to prop to false. 
