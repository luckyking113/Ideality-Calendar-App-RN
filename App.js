/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React,{Component} from 'react';
import AppNavigator from './src/routes/stacknavigator'
import { Root } from 'native-base'
import { Provider } from 'mobx-react';
import BaseStore from './src/stores/BaseStore'

export class App extends Component {

  constructor(props) {
    super(props);
    console.disableYellowBox = true;
  }
  render() {
    return (
      <Root >
      <Provider BaseStore={new BaseStore()}>  
      <AppNavigator/>
      </Provider>
      </Root>
   );
  }
  
}





export default App;
