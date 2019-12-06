import React, { Component } from 'react';
import { TouchableOpacity, View } from 'react-native';
import {
    Container,
    Content,
    Text,
    Button,
    Row,
    Col,
    Icon,
    Fab,
    Footer,
    Spinner,
    Form,
    Item,
    Input,
    Label,
    Textarea
} from 'native-base'
import { showMessage, showToast, sleep, getRandomColor, retrieveItem } from './../../../validator'
import { common, colors } from './../../../styles'
import styles from './styles';
import { responsiveWidth } from 'react-native-responsive-dimensions';
import MapView, { Marker } from 'react-native-maps';
import { observer, inject } from "mobx-react";
import GetLocation from 'react-native-get-location'
import { ScrollView } from 'react-native-gesture-handler';
import { buttons } from './../../../const/data/buttons'
import Geocoder from 'react-native-geocoding';
import { API_KEY } from '../../../const/variables';
import { USER_DATA } from '../../../const/variables';
import  Loader  from './../../../components/loader'

const RADIUS = 2000;

@inject("BaseStore")
@observer
class MeetingLocation extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            phone: '',
            meeting: '',
            room: '',
            location: "",
            latitude: 37.7749,
            longitude: 122.4194,
            locations: buttons,
            markers: [],
            address: '',
            isSelected: false,
            address_selected: ''
        };
    }

    async onNext() {

        let { phone, meeting, room, address_selected } = this.state;
        // if(phone === '') {
        //     showToast('Please enter phone number','danger');
        //     return;
        // }
        // else if(meeting === '') {
        //     showToast('Please enter meeting url','danger');
        //     return;
        // }
        // else if(room === '') {
        //     showToast('Please enter conf room number','danger');
        //     return;
        // }
        // if (address_selected == '') {
        //     showToast('Please select address by pressing marker on map', 'danger');
        //     return
        // }
        let data = {
            phone: phone,
            meeting: meeting,
            location: address_selected,
            room: room
        }
        await this.props.BaseStore.meetingStore.setLocationDetails(data);
        this.props.navigation.navigate('MeetingTime');
    }

    async getNearByPlaces(text) {
        let location = await GetLocation.getCurrentPosition({
            enableHighAccuracy: true,
            timeout: 15000,
        })
        // alert(JSON.stringify(location));

        if (location) {
            showMessage(text)
            location.radius = RADIUS;
            location.query = text;
            // this.loadModal.open();
           
            let resp = await this.props.BaseStore.meetingStore.nearByUser(location)
            showMessage(resp)
            this.loadModal.close();
             
            let locations = []
            if (resp.status && resp.status === 'OK' && resp.candidates && resp.candidates.length > 0) {
                let results = resp.candidates;
                results.map((item, index) => {
                    let obj = {}
                    if (index <= 5) {
                        obj.name = item.name
                        obj.address = item.formatted_address
                        obj.id = item.id;
                        obj.cords = item.geometry.location;
                        obj.isSelected = false;
                        locations.push(obj);
                    }
                })

                if (locations.length > 0) {
                    let obj = locations[0];
                    this.setState({
                        markers: locations,
                        latitude: obj.cords.lat,
                        longitude: obj.cords.lng,
                        address_selected: obj.address
                    })
                }

            }
            else {
                showToast("Searched item not found please try again..","danger")
            }
        }
    }
    async initData() {

        let user = await retrieveItem(USER_DATA);

        let location = await GetLocation.getCurrentPosition({
            enableHighAccuracy: true,
            timeout: 15000,
        })
        if (location) {
            Geocoder.from(location.latitude, location.longitude)
                .then(json => {
                    let addressComponent = json.results[0];
                    this.setState({
                        latitude: location.latitude,
                        longitude: location.longitude,
                        user: user,
                        address_selected: addressComponent.formatted_address
                    })
                })

        }
        let basic = this.props.BaseStore.meetingStore.basicDetails;
        let emails = basic.emails;
        emails.map(async(email)=>{
            let response = await this.props.BaseStore.loginStore.createUser(email)
            showMessage(email);
            showMessage(response);
        })
        showMessage(emails);

    }

    componentDidMount() {
        this.initData();
        Geocoder.init("AIzaSyBD4P3jgE50fpNrzpRzu97Vym7Q33Wepfo");

        // this.getNearByPlaces()
    }

    onMapPress = (e) => {

        let coordinates = e.nativeEvent.coordinate;
        // this.setState({ marker1: !this.state.marker1 })}
        // showMessage(coordinates)
        if (Platform.OS === 'android') {
            if (this.marker) {
                this.marker._component.animateMarkerToCoordinate(coordinates, 0);
            }
        } else {
            coordinate.timing(coordinates).start();
        }
        showMessage(coordinates.latitude)

    }

    onAddress(item) {
        let { locations } = this.state;
        item.isSelected = true;
        locations.map((data) => {
            if (data.id !== item.id) {
                data.isSelected = false
            }
        })
        this.setState({
            address: item.text,
            locations: locations
        })
        if (item.text === 'Custom') {
            let markers = [];
            this.setState({ markers: markers })
            return;
        }
        this.getNearByPlaces(item.text)

    }

    onMarkerClick(item) {
        this.setState({
            address_selected: item.address
        })
    }

    onMarkerDrag(e) {
        showMessage(e.nativeEvent.coordinate)
        let cords = e.nativeEvent.coordinate;
        Geocoder.from(cords.latitude, cords.longitude)
            .then(json => {
                let addressComponent = json.results[0];
                showMessage(addressComponent)
                this.setState({
                    latitude: cords.latitude,
                    longitude: cords.longitude,
                    address_selected: addressComponent.formatted_address
                })
                showMessage(addressComponent);
            })
            .catch(error => showToast(error.message));


        // this.setState({ x: e.nativeEvent.coordinate })
    }
    renderNearBy() {
        let { locations } = this.state
        return locations.map((item, index) => {
            // showMessage(index);
            let color = colors.red
            if (item.isSelected) {
                return (
                    <TouchableOpacity onPress={() => this.onAddress(item)}>
                        <View style={[common.center, styles.box, styles.boxBorder, { backgroundColor: color }]}>
                            <Text style={styles.boxText}>{item.text}</Text>
                        </View>
                    </TouchableOpacity>
                )
            }
            return (
                <TouchableOpacity onPress={() => this.onAddress(item)}>
                    <View style={[common.center, styles.box, { backgroundColor: color }]}>
                        <Text style={styles.boxText}>{item.text}</Text>
                    </View>
                </TouchableOpacity>
            )

        })
    }
    render() {
        let { user, phone, meeting, room, latitude, longitude, markers, address_selected, address } = this.state
        // let marker_img = require('./../../../assets/images/flag-blue.png')
        return (
            <Container style={[common.safeArea]}>
                <Content style={common.marginHorizontal_5}>
                    <Text style={[common.text]}>Pick Location</Text>
                    <Row size={20}>
                        <Col size={40} style={common.rowCenter}>
                            <Text style={styles.text}>Phone:</Text>
                        </Col>
                        <Col size={60}>
                            <Input
                                style={[common.input, common.inputMargin]}
                                placeholder={'800-123-4567'}
                                placeholderTextColor={colors.lightGray}
                                onChangeText={(text) => this.setState({ phone: text })}
                                value={phone}
                            />
                        </Col>
                    </Row>
                    <Row size={20}>
                        <Col size={40} style={common.rowCenter}>
                            <Text style={styles.text}>Web Meeting:</Text>
                        </Col>
                        <Col size={60}>
                            <Input
                                style={[common.input, common.inputMargin]}
                                placeholder={'URL'}
                                placeholderTextColor={colors.lightGray}
                                onChangeText={(text) => this.setState({ meeting: text })}
                                value={meeting}
                            />
                        </Col>
                    </Row>
                    <Row size={20}>
                        <Col size={40} style={common.rowCenter}>
                            <Text style={styles.text}>Conf Room:</Text>
                        </Col>
                        <Col size={60}>
                            <Input
                                style={[common.input, common.inputMargin]}
                                placeholder={'Room Number'}
                                placeholderTextColor={colors.lightGray}
                                onChangeText={(text) => this.setState({ room: text })}
                                value={room}
                            />
                        </Col>
                    </Row>
                    <Row size={20} style={common.rowMarginTop_5}>
                        <Col size={40} style={common.rowCenter}>
                            <Text style={styles.text}>Location On Map:</Text>
                        </Col>
                    </Row>
                    <ScrollView
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}>
                        <Row size={20} style={common.rowMarginTop_2}>
                            {this.renderNearBy()}

                        </Row>
                    </ScrollView>
                    <Row size={20} style={common.rowMarginTop_2}>
                        <Col size={100} style={[styles.mapBox, common.center]}>
                            <MapView
                                style={styles.map}
                                onPress={e => this.onMapPress(e)}
                                maxZoomLevel={19}
                                region={{
                                    latitude: latitude,
                                    longitude: longitude,
                                    latitudeDelta: 0.0922,
                                    longitudeDelta: 0.0421
                                }}>
                                {markers.length === 0 && (
                                    <Marker.Animated
                                        draggable={address === 'Custom' ? true : false}
                                        onDragEnd={(e) => this.onMarkerDrag(e)}
                                        ref={marker => {
                                            this.marker = marker;
                                        }}
                                        coordinate={{ latitude: latitude, longitude: longitude }}
                                        centerOffset={{ x: -18, y: -60 }}
                                        anchor={{ x: 0.69, y: 1 }}
                                    // image={marker_img}
                                    >
                                    </Marker.Animated>
                                )}

                                {markers.length > 0 && (
                                    markers.map((item) => {
                                        return (
                                            <Marker.Animated
                                                ref={marker => {
                                                    this.marker = marker;
                                                }}
                                                coordinate={{ latitude: item.cords.lat, longitude: item.cords.lng }}
                                                centerOffset={{ x: -18, y: -60 }}
                                                anchor={{ x: 0.69, y: 1 }}
                                                onPress={() => this.onMarkerClick(item)}
                                            // image={marker_img}
                                            >
                                            </Marker.Animated>
                                        )
                                    })

                                )}
                            </MapView>
                        </Col>
                    </Row>
                    <Row size={20} style={[common.inputMargin, common.center]} >
                        {address_selected != '' && (
                            <Text>{address_selected}</Text>
                        )}
                    </Row>
                    <Row size={20} style={[common.inputMargin, common.center]} >
                        <Button block style={{ backgroundColor: colors.pink }} onPress={() => this.onNext()}>
                            <Text>Next</Text>
                        </Button>
                    </Row>
                </Content>
                {/* <Footer style={common.footer}>
                    {isLoading && (
                        <Spinner color={colors.black} />
                    )}
                </Footer> */}
                <Footer style={styles.footer}>
                    <Col size={70} style={common.marginHorizontal_5}>
                        <Text style={[common.text, { color: 'white' }]}>{user}</Text>
                    </Col>
                    {/* <Col size={50}>
                    <TouchableOpacity onPress={()=>this.props.navigation.navigate('MeetingContext')}>
                    <View style={styles.iconView}>
                    <Icon
                     name={'plus'}
                     type={'AntDesign'}
                     style={styles.icon}
                    />
                    </View>
                    </TouchableOpacity>
                    </Col> */}
                </Footer>

                <Fab
                    active={this.state.active}
                    direction="up"
                    containerStyle={{}}
                    style={{ backgroundColor: '#5067FF' }}
                    position="bottomRight"
                    onPress={() => this.props.navigation.navigate('MeetingContext')}>
                    <Icon
                        name="plus"
                        type={'AntDesign'}
                    />

                </Fab>
                <Loader
                    onRef={ref => this.loadModal = ref} 
                    title={'Please wait !!! Fetching Address'}
                />
            </Container>
        );
    }
}

export default MeetingLocation;
