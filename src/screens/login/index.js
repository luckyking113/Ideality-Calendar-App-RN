import React, { Component } from 'react';
import { ImageBackground, View,Text,Dimensions, TouchableOpacity, Image,DeviceEventEmitter } from 'react-native';
import { GoogleSignin } from 'react-native-google-signin';
import { showMessage, showToast, storeItem, retrieveItem } from './../../validator'
import { GOOGLE_SCOPES, WEB_CLIENT_ID, DEBUG_WEB_CLIENT_ID, USER_DATA, TOKEN, CALL_DURATION, TYPE } from './../../const/variables'
import { common, colors } from './../../styles'
import styles from './styles';
import { observer, inject } from "mobx-react";
import type { Notification, NotificationOpen } from 'react-native-firebase';
import firebase from 'react-native-firebase'
import moment from 'moment';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';

import DeviceInfo from 'react-native-device-info';
import { PermissionsAndroid } from 'react-native';
import Contacts from 'react-native-contacts';

const TIME_OUT = 300000;

const LoginRoute = ({navigationRouter}) => (
	<View style={[styles.scene, { backgroundColor: '#fff' }]}>
		<View style={styles.TabMainContainer} >
			<TouchableOpacity onPress={() => navigationRouter.callGoogleApi()} style={styles.GooglePlusStyle} activeOpacity={0.5}>
				<Image 
					source={require('../../assets/images/icon_google.png')} 
					style={styles.ImageIconGoogleStyle} />
				<Text style={styles.TextStyle1}> Login with Google </Text>
			</TouchableOpacity>
		</View>
		<View style={styles.TabMainContainer} >
			<TouchableOpacity onPress={() => navigationRouter.onMicrosoft()} style={styles.OutlookStyle} activeOpacity={0.5}>
				<Image 
					source={require('../../assets/images/icon_outlook.png')} 
					style={styles.ImageIconOutlookStyle} />
				<Text style={styles.TextStyle1}> Login with Office 365 </Text>
			</TouchableOpacity>
		</View>
	</View>
);
   
const SignupRoute = () => (
	<View style={[styles.scene, { backgroundColor: '#fff' }]} />
);
@inject("BaseStore")
@observer
export default class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            mode: false,
            isLoading: false,
            index:0,
            routes: [
                { key: 'login', title: 'Login' },
                { key: 'signup', title: 'Signup' },
            ],
        };
        let that = this;
    }

    componentDidMount() {
        // let isCreated = this.props.BaseStore.meetingStore.isCreated;
        // if(isCreated) {
        //   this.props.navigation.navigate('MeetingLocation');
        // }
       
        this.initGoogle()

        DeviceEventEmitter.addListener('ringing', async (data) => {
            showMessage("ringing");
        })
        DeviceEventEmitter.addListener('busy', async (data) => {
            showMessage("busy");
            let date = moment().unix()
            await storeItem(CALL_DURATION, date);
        })
        DeviceEventEmitter.addListener('disconnect', async (data) => {
            let curr_time = moment().unix();
            let prev_time = await retrieveItem(CALL_DURATION);
            let diff = curr_time - prev_time;
            showMessage(diff + " curr time " + curr_time + " prev time " + prev_time);
            if (diff > 5) {
                showToast('call is over 10 mins');
                if(data.phone) {
                    let call_data = {
                        start:prev_time,
                        end:curr_time,
                        phone:data.phone
                    }
                    this.props.navigation.navigate('MeetingCall',{item:call_data})
                
                }
            }
            showMessage(data);
        })


        this.onNotification()
        this.synchCalendar();
        // this.initContacts()
    }   

    async initContacts() {
        PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
            {
                'title': 'Contacts',
                'message': 'This app would like to view your contacts.'
            }
        ).then(() => {
            Contacts.getContactsByPhoneNumber('8146499783',(err, contacts) => {
                if (err === 'denied') {
                    // error
                } else {
                    // contacts returned in Array
                    showMessage(contacts);
                }
            })
        })
    }

    async synchCalendar() {

        setInterval(async () => {
            let type = await retrieveItem(TYPE);
            if(type === 'google') {
                this.synchGoogleCalendar();
            }
            else {
                this.synchMicrosoftCalendar();
            }
        }, TIME_OUT)
    }

   async synchGoogleCalendar() {
        let token = await retrieveItem(TOKEN);
        if (!token) {
            return
        }
        let events = await this.props.BaseStore.loginStore.getEventAttendence(token.accessToken);
        showMessage(token);
        showMessage(events);
        if (events && events.items) {
            let items = events.items;
            let current_time = moment().format('X');

            for (let a = 0; a < items.length; a++) {
                if (items[a].end.dateTime != undefined) {
                    if (parseInt(current_time) < parseInt(moment(items[a].end.dateTime).format('X'))) {

                        const notification = new firebase.notifications.Notification()
                            .setTitle(items[a].summary)
                            .setData({
                                route: 'MeetingContext',
                                notification_start_time: items[a].start.dateTime,
                                notification_end_time: items[a].end.dateTime,
                                title: items[a].summary,
                                id: items[a].id,
                                calendar_id: events.summary
                            })
                            .android.setChannelId('idealily_notification')
                            .android.setSmallIcon('ic_launcher')
                            .android.setPriority(firebase.notifications.Android.Priority.Max)

                        firebase.notifications().scheduleNotification(notification, {
                            fireDate: new Date(items[a].end.dateTime).getTime(),
                        })
                    }
                }
               
            }
        }

    }

   async synchMicrosoftCalendar() {
        let token = await retrieveItem(TOKEN);
        if (!token) {
            return
        }
        let events = await this.props.BaseStore.loginStore.getEventAttendenceMicrosoft(token.access_token);
        showMessage(token);
        showMessage(events);
        if (events && events.value) {
            let items = events.value;
            let current_time = moment().format('X');

            for (let a = 0; a < items.length; a++) {
                if (items[a].End.dateTime != undefined) {
                    if (parseInt(current_time) < parseInt(moment(items[a].End.dateTime).format('X'))) {

                        const notification = new firebase.notifications.Notification()
                            .setTitle(items[a].Subject)
                            .setData({
                                route: 'MeetingContext',
                                notification_start_time: items[a].Start.dateTime,
                                notification_end_time: items[a].End.dateTime,
                                title: items[a].Subject,
                                id: items[a].Id,
                                calendar_id: items[a].Id
                            })
                            .android.setChannelId('idealily_notification')
                            .android.setSmallIcon('ic_launcher')
                            .android.setPriority(firebase.notifications.Android.Priority.Max)

                        firebase.notifications().scheduleNotification(notification, {
                            fireDate: new Date(items[a].End.dateTime).getTime(),
                        })
                    }
                }
              
            }
        }

    }


    registerToken() {
        firebase.firestore().collection('users')
            .where('device_id', '==', DeviceInfo.getDeviceId())
            .get().then((d) => {
                if (d.size > 0) { }
                else {
                    firebase.firestore().collection('users')
                        .add({
                            device_id: DeviceInfo.getDeviceId(),
                            fcm_token: ''
                        })
                        .then((data) => {
                            console.log(data)
                        })
                        .catch((err) => {
                            console.log(err)
                        })
                }
            })


        firebase.messaging().getToken()
            .then(fcmToken => {
                if (fcmToken) {
                    // user has a device token


                    firebase.firestore().collection('users')
                        .where('device_id', '==', DeviceInfo.getDeviceId())
                        .get()
                        .then((data) => {
                            data.forEach((doc) => {
                                firebase.firestore().collection('users')
                                    .doc(doc.id)
                                    .update('fcm_token', fcmToken)
                                    .then((d) => { })
                                    .catch((err) => { })
                            })
                        })
                } else {
                    // user doesn't have a device token yet
                }
            });
    }
    onNotification() {

        this.removeNotificationDisplayedListener = firebase.notifications().onNotificationDisplayed((notification1: Notification) => {

            // this.props.navigation.navigate('MeetingNotes')
        });

        this.notificationOpenedListener = firebase.notifications().onNotificationOpened((notificationOpen: NotificationOpen) => {
            // Get the action triggered by the notification being opened
            console.log(notificationOpen.notification._data);
            this.props.navigation.navigate('MeetingNotes', { notification_data: notificationOpen.notification._data })

        });


        this.removeNotificationListener = firebase.notifications().onNotification((notification2: Notification) => {


            const notification = new firebase.notifications.Notification()
                .setNotificationId(notification2._notificationId)
                .setTitle(notification2._title)
                .setBody(notification2._body)
                .android.setChannelId('idealily_notification')
                .android.setSmallIcon('ic_launcher')
                .android.setPriority(firebase.notifications.Android.Priority.Max)
                .setSound('default')
                .setData(notification2._data)
            // const remoteInput = new firebase.notifications.Android.RemoteInput('inputText')
            //                     .setLabel('Message');

            const action = new firebase.notifications.Android.Action('save_notes', 'ic_launcher', 'Save Notes');
            // Add the action to the notification
            notification.android.addAction(action);

            // firebase.notifications().displayNotification(notification)
            this.props.navigation.navigate('MeetingNotes', { notification_data: notification2._data })
        });

    }


    async initGoogle() {
        try {
            await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
            showMessage('GoogleSignin.configure');
            GoogleSignin.configure({
                webClientId: DEBUG_WEB_CLIENT_ID, // client ID of type WEB for your server (needed to verify user ID and offline access)
                scopes: GOOGLE_SCOPES
                //iosClientId: '<FROM DEVELOPER CONSOLE>', // [iOS] optional, if you want to specify the client ID of type iOS (otherwise, it is taken from GoogleService-Info.plist)
            })
            // google services are available
        } catch (err) {
            showToast('play services are not available', 'danger');
            return;
        }
       
    }

    componentWillUnmount() {
        this.removeNotificationDisplayedListener();
        this.removeNotificationListener();
        this.notificationOpenedListener();
    }

    async callGoogleApi() {
        this.props.navigation.navigate('MeetingHome');
        // let attendeeData = [];
        // try {

        //     await GoogleSignin.hasPlayServices();
        //     const userInfo = await GoogleSignin.signIn();
        //     const accessInfo = await GoogleSignin.getTokens();
        //     let token = accessInfo.accessToken;
        //     let user_data = await this.props.BaseStore.loginStore.createUser(userInfo.user.email)
        //     await storeItem(USER_DATA, userInfo.user.email);
        //     await storeItem(TOKEN, accessInfo);
        //     await storeItem(TYPE, "google");
        //     let events = await this.props.BaseStore.loginStore.getEventAttendence(token);
        //     showMessage(token);
        //     showMessage(events);
        //     if (events && events.items) {
        //         let items = events.items;
        //         let current_time = moment().format('X');

        //         for (let a = 0; a < items.length; a++) {
        //             if (items[a].end.dateTime != undefined) {
        //                 if (parseInt(current_time) < parseInt(moment(items[a].end.dateTime).format('X'))) {

        //                     const notification = new firebase.notifications.Notification()
        //                         .setTitle(items[a].summary)
        //                         .setData({
        //                             route: 'MeetingContext',
        //                             notification_start_time: items[a].start.dateTime,
        //                             notification_end_time: items[a].end.dateTime,
        //                             title: items[a].summary,
        //                             id: items[a].id,
        //                             calendar_id: events.summary
        //                         })
        //                         .android.setChannelId('idealily_notification')
        //                         .android.setSmallIcon('ic_launcher')
        //                         .android.setPriority(firebase.notifications.Android.Priority.Max)

        //                     firebase.notifications().scheduleNotification(notification, {
        //                         fireDate: new Date(items[a].end.dateTime).getTime(),
        //                     })
        //                 }
        //             }
                    
        //         }

        //         if (items.attendees) {
        //             console.log('-------------- elements -------------------', element.attendees);
        //             element.attendees.forEach(id => {
        //                 attendeeData.push(id.email);
        //             });
        //         }
        //     }
        //     // let uniqueEmails = [...new Set(attendeeData)];
        //     // uniqueEmails.forEach(async (email) => {
        //     //     await this.props.BaseStore.loginStore.createUser(userInfo.user.email)
        //     // })
        //     await this.props.BaseStore.loginStore.createUser(userInfo.user.email)
        //     this.props.navigation.navigate('MeetingContext');
        // } catch (error) {
        //     showToast(error.message, 'danger')
        //     this.setState({ isLoading: false })
        //     // this.props.navigation.navigate('MeetingHome');
        // }
    }

    onMicrosoft() {
        this.props.navigation.navigate('MicrosoftLogin')
    }

    render() {
        let { mode, isLoading } = this.state;
        let that = this;
        return (
            <ImageBackground 
                source={require('../../assets/images/login_bkg.png')}
                style={{width: '100%', height: '100%'}} >
                <View style={{
                    flex: 1,
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                }}>
                    <View style={{flex: 1.5, width: '100%', justifyContent:'center', alignItems:'center'}} >
                        <ImageBackground source={require('../../assets/images/login-icon.png')} style={{width: 82, height: 82, alignSelf: "center"}}/>
                    </View>
                    <View style={{flex: 1, width: '100%'}} >
                        <View style={{width: '90%', height:240, backgroundColor: 'white', alignSelf:"center"}} >
                            <TabView
                                navigationState={this.state}
                                renderScene={
                                    ({ route }) => {
                                        switch (route.key) {
                                            case 'login':
                                            return <LoginRoute navigationRouter={that} />;
                                            case 'signup':
                                            return <SignupRoute navigationRouter={that}/>;
                                            default:
                                            return null;
                                        }
                                    }
                                }
                                tabStyle={{backgroundColor:'red'}}
                                onIndexChange={index => this.setState({ index })}
                                initialLayout={{ width: Dimensions.get('window').width }}
                                renderTabBar={(props) =>
                                    <TabBar
                                        {...props}												
                                        style={{backgroundColor: 'transparent', height: 50}}
                                        renderIcon={this.renderIcon}
                                        labelStyle = {{color:'black'}}
                                        indicatorStyle={{backgroundColor:'lightblue'}}				
                                    />
                                }
                            />
                        </View>
                    </View>
                    <View style={styles.FooterMainContainer}>
                        <TouchableOpacity onPress={this.onPressHandler} style={styles.GuestStyle} activeOpacity={0.5}>
                            <Text style={styles.TextStyle}> Continue as Guest </Text>
                            <Image 
                            source={require('../../assets/images/right_arrow.png')} 
                            style={styles.ImageIconStyle}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
            </ImageBackground>            
        );
    }
}

 