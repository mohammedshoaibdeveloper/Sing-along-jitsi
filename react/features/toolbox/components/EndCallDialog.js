import React, { Component } from "react";
import {
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import {
    kickParticipant
} from "../../base/participants"
// import { disconnect } from "../../../base/connection"

import { appNavigate } from "../../app/actions"

export default class CallEndPopOver extends Component {

    constructor(props) {
        super(props)
        this.state = {
            IsConfirmView: false,
            open: true
        }

        this.showConfirmView = this.showConfirmView.bind(this)
    }

    showConfirmView = () => {
        this.setState({
            IsConfirmView:! this.state.IsConfirmView
        })
    }

    componentWillUnmount() {
        this.setState({open: true})
    }

    _endCall() {

        let participants = this.props._allParticipants;
        participants = participants.filter(participant => participant.id != this.props._localParticipant.id)
        participants.forEach(participant => {
            this.props.dispatch(kickParticipant(participant.id))
        })
        this.props.dispatch(appNavigate(undefined))
        return true
    }


    confirmView = () => {
        return (
            <View style={{ flex: 1, marginTop: 5, borderRadius: 10 }}>
                <View style={{ flex: 1, height: 90, marginTop: 0, marginBottom: 5, justifyContent: 'flex-end' }}>
                    <Text style={{ textAlign: 'center', marginBottom: 5, fontSize: 16, top: -10 }}>{'Do you want to leave meeting?'}</Text>
                </View>

                <View style={{ flex: 1, height: 100, justifyContent: 'center' }}>
                    <TouchableOpacity style={[styles.fullgreen, { justifyContent: 'center', alignContent: 'center', alignItems: 'center' }]} onPress={() => { 
                                                this.setState({open: false})
                        this.props.dispatch(appNavigate(undefined)) }}>
                        <Text style={{ color: 'white', fontSize: 15 }}>Yes</Text>
                    </TouchableOpacity>
                </View>

                <View style={{ flex: 1, maxHeight: 60, marginBottom: 5, justifyContent: 'flex-start', }}>
                    <TouchableOpacity style={[styles.halfgreen, { borderWidth: 0, margin: 0 }]} onPress={() => this.setState({open: false})}>
                        <Text style={{ color: '', fontSize: 15 }}>Cancel</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

    componentWillReceiveProps(nextProps) {
        this.setState({open: nextProps.open, IsConfirmView: false})
    }


    callEndView = () => {
        
        return (
            <View style={{ flex: 1, marginTop: 10, borderRadius: 10}}>
              
                <View style={{ flex: 1, height: 90, marginTop: 5, marginBottom: 5, justifyContent: 'flex-end' }}>
                    <Text style={{ textAlign: 'center', marginBottom: 5, fontSize: 16, top: -10 }}>{'Do you want to End meeting for all or Leave Meeting?'}</Text>
                </View>

                <View style={{ flex: 1, height: 100, justifyContent: 'center' }}>
                    <TouchableOpacity style={[styles.fullgreen, { justifyContent: 'center', alignContent: 'center', alignItems: 'center', }]} onPress={() => this._endCall()}>
                        <Text style={{ color: 'white', fontSize: 15 }}>End Meeting for all</Text>
                    </TouchableOpacity>
                </View>

                <View style={{ flex: 1, maxHeight: 60, marginBottom: 5, justifyContent: 'flex-start', }}>
                    <TouchableOpacity style={[styles.halfgreen, { borderWidth: 0, margin: 0 }]} onPress={this.showConfirmView}>
                        <Text style={{ color: '', fontSize: 15 }}>Leave Meeting</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

    componentDidMount() {
        // console.log(this.props)
    }

    render() {
        const { setModalVisible } = this.props;
        return (
            <Modal
                style={{ flex: 1, width: '100%', width: '100%' }}
                animationType="slide"
                transparent={true}
                visible={setModalVisible}
                backgroundColor={'yellow'}
                visible={this.state.open}
                onRequestClose={() => {

                    this.setState({open: false})
                }}
            >
                <View style={{ flex: 1, justifyContent: 'center', alignContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.9)' }}>
                    <View style={{ width: 300, height: 210, backgroundColor: 'white', borderRadius: 10, }}>
                        {this.state.IsConfirmView ? this.confirmView() : this.callEndView()}
                    </View>
                </View>
            </Modal>
        );
    }
};

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        width: '100%',
        width: '100%',
        position: 'absolute',
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: 'yellow'
    },
    modalView: {
        flex: 1,
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5
    },
    openButton: {
        backgroundColor: "#F194FF",
        borderRadius: 20,
        padding: 10,
        elevation: 2
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
    },
    modalText: {
        marginBottom: 15,
        textAlign: "center"
    },
    fullgreen: {
        flex:1,
        height: 50,
        maxHeight:50,
        marginLeft:20,
        marginRight:20,
        borderRadius:10,
        backgroundColor: '#8B0000',
        shadowColor: '#8BC341',
        shadowOffset: {width: 0,height: 7},
        shadowOpacity: 0.43,
        shadowRadius: 9.51,
        elevation: 4,
      },
      halfgreen: {
        borderColor: '#8BC341',
        justifyContent:'center',
        alignItems:'center',
        borderRadius:10,
        maxHeight: 50,
        borderWidth:1,
        flex: 1,
        marginLeft:5,
        marginRight:5
      }
});