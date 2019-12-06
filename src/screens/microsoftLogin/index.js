import React, { Component } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { WebView } from 'react-native-webview'
import {
    Container,
    Content,
    Text,
    Button,
    Row,
    Col,
    Footer,
    Icon,
    Spinner
} from 'native-base'
import { common, colors } from './../../styles'
import styles from './styles';
import { LOGIN, REDIRECT_URL } from './../../const/urls'
import { MICROSOFT_CLIENT_ID, MICROSOFT_SCOPES, MICROSOFT_CLIENT_SECRET, TOKEN, TYPE, USER_DATA } from './../../const/variables'
import { showMessage, showToast, storeItem, retrieveItem, removeItem } from '../../validator';
import { observer, inject } from "mobx-react";
import { AzureInstance, AzureLoginView } from 'react-native-azure-ad-2'
import firebase from 'react-native-firebase'
const CREDENTIAILS = {
    client_id: MICROSOFT_CLIENT_ID,
    client_secret: MICROSOFT_CLIENT_SECRET,
    redirect_uri: REDIRECT_URL,
    scope: MICROSOFT_SCOPES
};
@inject("BaseStore")
@observer
class MicrosoftLogin extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false
        };
        this.azureInstance = new AzureInstance(CREDENTIAILS);
        this._onLoginSuccess = this._onLoginSuccess.bind(this);
        this._onLoginCancel = this._onLoginCancel.bind(this);
    }

    async componentDidMount() {
        await removeItem(TOKEN);

    }
    render() {
        let url = LOGIN + "?redirect_uri=" + REDIRECT_URL + "&client_id=" + MICROSOFT_CLIENT_ID + "&scope=" + MICROSOFT_SCOPES + "&response_type=code"

        showMessage(url);
        return (
            <Container style={[common.safeArea]}>
                <Row size={5} style={styles.header}>
                    <TouchableOpacity onPress={() => this.props.navigation.navigate('Login')}>
                        <Icon
                            type={'Entypo'}
                            name={'cross'}
                        />
                    </TouchableOpacity>
                </Row>
                <Row size={95} style={common.center}>
                    {this.state.isLoading && (
                        <Spinner
                            color='green'
                            style={[common.center, styles.loader]}
                        />
                    )}

                    <WebView
                        javaScriptEnabled={true}
                        domStorageEnabled={true}
                        source={{ uri: url }}
                        style={styles.webView}
                        onLoadStart={() => this.showSpinner()}
                        onLoad={() => this.hideSpinner()}
                        onNavigationStateChange={this._onNavigationStateChange.bind(this)}
                    />
                    {/* <AzureLoginView
                        azureInstance={this.azureInstance}
                        loadingMessage="Requesting access token"
                        onSuccess={this._onLoginSuccess}
                        onCancel={this._onLoginCancel}
                    /> */}

                </Row>

            </Container>
        );
    }

    showSpinner() {
        this.setState({
            isLoading: true
        })
    }

    hideSpinner() {
        this.setState({
            isLoading: false
        })
    }

    _onLoginSuccess() {
        this.azureInstance.getUserInfo().then(result => {
            showMessage(result);
        }).catch(err => {
            showMessage(err);
        })
    }

    _onLoginCancel() {
        // Show cancel message
        showToast('Login cancelled');
    }

    async getEvents(token) {
        let response = await this.props.BaseStore.loginStore.getEventAttendenceMicrosoft(token)
        let attendeeData = [];
        showMessage(response)
        let value = response.value;
        let usr_response = await this.props.BaseStore.microsoftStore.getProfile(token)
        showMessage(usr_response)
        let userEmail = usr_response.EmailAddress 
        await storeItem(USER_DATA,userEmail);
        let cr_response = await this.props.BaseStore.loginStore.createUser(userEmail)
        showMessage(cr_response)

        if (value && value.length > 0) {
            let current_time = moment().format('X');
            value.map((item) => {
                // userEmail = item.Organizer.EmailAddress.Address;
                let start = item.Start.DateTime
                let end = item.End.DateTime
                if (parseInt(current_time) < parseInt(moment(end).format('X'))) {
                    const notification = new firebase.notifications.Notification()
                        .setTitle(item.subject)
                        .setData({
                            route: 'MeetingContext',
                            notification_start_time: start,
                            notification_end_time: end,
                            title: item.Subject,
                            id: item.Id,
                            calendar_id: item.Subject
                        })
                        .android.setChannelId('idealily_notification')
                        .android.setSmallIcon('ic_launcher')
                        .android.setPriority(firebase.notifications.Android.Priority.Max)

                    firebase.notifications().scheduleNotification(notification, {
                        fireDate: new Date(end).getTime(),
                    })
                }
            })
        }

    }
    async _onNavigationStateChange(webViewState) {
        try {
            let url = webViewState.url;
            let code = url.split('=')[1];
            if (url.indexOf(REDIRECT_URL) != -1) {
                if (code) {
                    if (code.indexOf("#") != -1) {
                        code = code.replace(/#.*/, '');

                    }
                    let access = await retrieveItem(TOKEN);
                    if (access && access.access_token) {
                        return;
                    }
                    let token = await this.props.BaseStore.microsoftStore.getToken(code);
                    showMessage(token)
                    if (token && token.error) {
                        return;
                    }
                    if (token.access_token) {
                        // let access_token = token.access_token;
                        await storeItem(TOKEN, token);
                        await storeItem(TYPE, 'microsoft');
                        await this.getEvents(token.access_token);
                        this.props.navigation.navigate('MeetingContext')

                    }
                    // this.getTokenbyCode(code);
                }

            }
            // this.setState({ uri: url });
        }
        catch (error) {
            showMessage(error)
        }


    }



}

export default MicrosoftLogin;
