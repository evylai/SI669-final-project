import React, { useState, useEffect, Component, useRef } from 'react';
import { Text, View, TextInput, Image, ScrollView, Modal, ImageBackground,
  FlatList, TouchableOpacity, StyleSheet, AppRegistry, LogBox 
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { CheckBox } from 'react-native-elements';
import { getDataModel } from './DataModel';
import moment from 'moment';
import DropDownPicker from 'react-native-dropdown-picker';
import { MenuProvider, Menu, MenuTrigger, MenuOptions, MenuOption,} from 'react-native-popup-menu';
import YoutubePlayer from "react-native-youtube-iframe";

LogBox.ignoreLogs(["AsyncStorage"]);

export function PlaylistDetailScreen ({navigation, route})  {
    let dataModel = getDataModel();
    const [addVideoOpen, setAddVideoOpen] = useState(false);
    const [playerOpen, setPlayerOpen] = useState(false);
    const [mode, setMode] = useState('playlist');
    const [text, onChangeText] = useState('');
    const [playlist, setPlaylist] = useState(route.params.playlist);
    console.log('playlist');
    console.log(playlist);
    const [myPlaylist, setMyPlaylist] = useState([]);
    const [videos, setVideos] = useState([]);
    const [displayVideos, setDisplayVideos] = useState(dataModel.getVideosfromPlaylist(playlist));
    const [loading, setLoading] = useState('');
    const [todoIsOpen, setTodoOpen] = useState(false);
    const [playlistIsOpen, setPlaylistOpen] = useState(false);
    const [week, setWeek] = useState(dataModel.createWeekList());
    const [check, setCheck] = useState(false);
    const [currentVideo, setCurrentVideo] = useState([]);
    const [currentPlaylist, setCurrentPlaylist] = useState([]);
    const [newListOpen, setNewListOpen] = useState(false);
    const [input, onChangeInput] = useState('');
    const [dropdownOpen, setdropDownOpen] = useState(false);
    let selectDay = [];
    let selectList = [];
    const flatListRef = useRef();
    const toTop = () => {
      flatListRef.current.scrollToOffset({ animated: true, offset: 0 })
    }
    const privacyOption = {Public: 'Public - everyone can see', Private: 'Private - only you can see'}

    useEffect(() => {
        // const listenerId = dataModel.addPlaylistListener(() => {
        //   let newItems = Array.from(dataModel.getPlaylistCopy());
        //   setPlaylist(newItems);
        // });
        dataModel.initGetMyPlaylist(()=>{
            setMyPlaylist(dataModel.getMyPlaylistCopy())});
        
        return(() => {
          dataModel.removePlaylistListener(listenerId);
        });
        
    },[])



    return (
    <MenuProvider skipInstanceCheck={true} >
        <View style={styles.body}>
            {/* <Modal
            visible={playerOpen} 
            transparent={true}
            onDismiss={() => setPlayerOpen(false)}
            onRequestClose={() => setPlayerOpen(false)}

            >
                <View style={styles.playerModalContainer}>
                    <TouchableOpacity
                    onPress={()=>setPlayerOpen(false)}
                    >
                        <View style={styles.closeArea}>
                        <Feather name="x" size={24} color="white" />
                        </View>
                    </TouchableOpacity> 
                    <View Style={styles.playerContainer}>
                    <YoutubePlayer
                        height={220}
                        videoId={selectedVideo}
                        onLoad={()=>{console.log(selectedVideo)}}
                    />
                    </View>
                    <TouchableOpacity onPress={()=>setPlayerOpen(false)}>
                    <View style={styles.closeArea}></View>
                    </TouchableOpacity>

                </View>
            </Modal> */}
            <View style={styles.topSection}>
            </View>
            <View 
                style={styles.videoResult}>
                <Text> test </Text>
                <FlatList
                    contentContainerStyle={styles.videoArea}
                    data={displayVideos}
                    ref={flatListRef}
                    renderItem={({item})=>{
                        return (
                            <View style={item.done? styles.todoCover:styles.todoCoverF}>
                                <TouchableOpacity
                                onPress={()=>{console.log('pressed!');setPlayerOpen(true); setSelectedVideo(item.key)}}
                                >
                                <Image
                                    style={styles.image}
                                    source={{uri: item.videos.coverImg}}
                                />
                                </TouchableOpacity>

                                <View style={styles.videoContent}>
                                <View style={styles.actionOptions}>
                                    <CheckBox 
                                            containerStyle={styles.checkBox}
                                            checkedIcon={<Feather name="check-circle" size={27} color='#A3515A' />}
                                            uncheckedIcon={<Feather name="circle" size={28} color='#F4C2C2' />}
                                            checked={item.done}
                                            onPress={()=>{
                                                setCheck(!check);
                                                item.done=!item.done;
                                                dataModel.updateTodo(item.key, item.done)
                                            }}
                                        />
                                        <View style={styles.icon}>
                                        {/*  */}
                                        <Menu>
                                        <MenuTrigger>
                                            <Feather name="more-vertical" size={24} color="black" />
                                        </MenuTrigger>
                                        <MenuOptions optionsContainerStyle = {styles.menuContainer}>
                                            <MenuOption 
                                            optionWrapper={styles.menuOption}
                                            onSelect={() => dataModel.deleteTodo(item.key)} >
                                            <Text style={styles.menuText}>Remove</Text>
                                            </MenuOption>
                                        </MenuOptions>
                                        </Menu>
                                        
                                        </View>
                                </View>
                                <TouchableOpacity onPress={()=>{setPlayerOpen(true); setSelectedVideo(item.key); console.log(selectedVideo)}} >
                                <View style={styles.videoDetail} >
                                    <View style={styles.videoInfo}>
                                        <Text style={styles.detailText}>{item.videos.author}</Text>
                                        <Text style={styles.videoName}>{item.videos.name}</Text>
                                    </View>
                                </View>
                                </TouchableOpacity>
                                </View>

                                <Text>{item.md}</Text>
                            </View>
                        );
                    }}
                />

            </View>    
        </View>    
    </MenuProvider>
    );
    
}

const styles = StyleSheet.create({
    body: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        paddingTop: '20%',
        fontFamily: 'NanumGothic_400Regular',
        fontSize: 16,
        backgroundColor: '#ffffff',
    },
    header: {
        // borderWidth:1,
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        width: '100%',
        marginBottom: 10,
        paddingHorizontal: 30,
    },
    headerText: {
    fontSize: 30,
    fontFamily: 'AlegreyaSansSC_400Regular'
    },
    flapListWrapper:{
        flex:1,
        flexDirection: 'row',
    },
    video: {
        width: 312,
        // height: 270,
        borderRadius: 10,
        borderWidth:1,
        borderColor: '#E2E3E5',
        marginBottom: 30,
    },
    playlist: {
        width: 312,
        borderRadius: 10,
        borderWidth:1,
        borderColor: '#E2E3E5',
        marginVertical: 10,
        overflow: 'hidden',
    },
    image: {
        height: 176,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        resizeMode: 'cover',
        backgroundColor: '#F7D4D4',
        marginBottom: 10,
    },
    playlistImg: {
        height: 128,
        // borderRadius: 10,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        resizeMode: 'cover',
        backgroundColor: '#F7D4D4',
        marginBottom: 10,
        overflow: 'hidden',
        // borderWidth:1,
    },
    buttonArea: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingBottom: 10,
    },
    button: {
        flexDirection: 'row',
        width: 143,
        // borderWidth: 1,
        // borderColor: '#F4C2C2',
        backgroundColor: '#F4C2C2',
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 3,
    },
    buttonText: {
        color: 'black',
        fontFamily: 'AlegreyaSansSC_400Regular',
        fontSize: 16,
        paddingLeft: 5,
    },
    playlistContent: {
        width: '100%',
        height: '100%',
        flexDirection: 'row',
        paddingVertical: 10,
        paddingLeft: 10,
        justifyContent: 'space-between',
        // backgroundColor: 'rgba(0,0,0,0.5)'
    },
    playlistInfo:{
        width: 270,
        overflow: 'hidden',
        justifyContent: 'space-between',
    },
    playlistName:{
        width: 270,
        height: 80,
        overflow: 'hidden',
        fontSize: 30,
        fontFamily: 'Hind_700Bold',
    
    },
    playlistAuthor:{
        fontSize: 12,
        paddingBottom: 5,
    },
    resultArea:{
        justifyContent: 'center',
        alignItems: 'center',
    
    },
    menuContainer: {
        width: 102,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 5,
        paddingHorizontal: 20,
    borderRadius: 5,
    },
    menuOption: {
    paddingHorizontal: 10,
    },
    menuText: {
    fontSize: 12,
    },
    modalArea:{
    // width: '90%',
    height: 150,
    // borderWidth: 1,
    borderColor: 'blue',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    marginTop: -30,
    },
    modalOptions: {
        width: 40,
        height: 70,
        alignItems: 'center',
        // borderWidth: 1,
        borderColor: 'red',
        overflow: 'hidden',
    },
    modalText: {
        // borderWidth:2,
        justifyContent: 'center',
    },
    modalContainer:{
        width:'100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
    },
    modal: {
        justifyContent: 'space-between',
        width: '100%',
        height: 739,
        // marginTop: '30%',
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
    },
    modalContent: {
        flex:1,
        justifyContent: 'space-between',
        alignItems: 'center',
        borderColor: 'orange',
        // borderWidth:2,
    },
    closeModal:{
        justifyContent:'flex-start',
        alignItems: 'flex-end',
        marginTop: -20,
        marginRight: -20,
    },
    modalHeader:{
        marginVertical: 10,
        alignItems: 'center',
    },
    modalHeaderNewList:{
        marginTop: -20,
        alignItems: 'center',
    },
    modalTitle:{
        fontFamily: 'AlegreyaSansSC_400Regular',
        fontSize: 30,
    },
    optionContainer:{
        height: 200,
        alignItems: 'center',
        width:'100%',
    },
    bigButton: {
        alignItems: 'center',
        justifyContent: 'flex-end',
        backgroundColor: '#F4C2C2',
        width: '100%', 
        paddingVertical: 10,
        borderRadius: 10,
        // borderWidth: 1,
        marginTop: 70,
      },
    bigButtonText: {
    fontFamily: 'AlegreyaSansSC_400Regular',
    color: 'black',
    fontSize: 20,
    },
    checkBox: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 50,
    },
})