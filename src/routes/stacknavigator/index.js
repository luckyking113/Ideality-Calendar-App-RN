import Login from './../../screens/login';
import MeetingHome from './../../screens/metting/home';
import MeetingCreate from './../../screens/metting/create';
import MeetingLocation from './../../screens/metting/location';
import MeetingTime from './../../screens/metting/time';
import MeetingContext from './../../screens/metting/context';
import MeetingNotes from './../../screens/notes/meeting';
import MeetingCall from './../../screens/notes/call';
import MicrosoftLogin from './../../screens/microsoftLogin';

import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

let AppNavigator = createStackNavigator({
   Login:Login, 
   MeetingHome:MeetingHome, 
   MeetingCreate:MeetingCreate,
   MeetingLocation:MeetingLocation,
   MeetingTime:MeetingTime ,
   MeetingContext:MeetingContext, 
   MeetingNotes:MeetingNotes, 
   MeetingCall:MeetingCall, 
   MicrosoftLogin:MicrosoftLogin, 
},{
    initialRouteName:'Login',
    headerMode:'none'
})
export default createAppContainer(AppNavigator);