import React, { useState, useEffect, Component, useRef } from 'react';
import { Text, View, TextInput, Image, ScrollView, Modal, ImageBackground,
  FlatList, TouchableOpacity, StyleSheet, AppRegistry, LogBox 
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { CheckBox } from 'react-native-elements';
import { getDataModel } from './DataModel';
import DropDownPicker from 'react-native-dropdown-picker';
import { MenuProvider, Menu, MenuTrigger, MenuOptions, MenuOption,} from 'react-native-popup-menu';

LogBox.ignoreLogs(["AsyncStorage"]);

export function PlaylistScreen ({navigation, route})  {
    let dataModel = getDataModel();
    const [mode, setMode] = useState('playlist');
    const [text, onChangeText] = useState('');
    const [playlist, setPlaylist] = useState([]);
    const [myPlaylist, setMyPlaylist] = useState([]);
    const [selectedPlaylist, setSelectedPlaylist] = useState([]);
    const [detailPlaylist, setDetailPlaylist] = useState([]);
    const [videos, setVideos] = useState([]);
    const [displayVideos, setDisplayVideos] = useState([]);
    const [loading, setLoading] = useState('');
    const [todoIsOpen, setTodoOpen] = useState(false);
    const [detailIsOpen, setDetailIsOpen] = useState(false);
    const [editIsOpen, setEditIsOpen] = useState(false);
    const [playlistIsOpen, setPlaylistOpen] = useState(false);
    const [week, setWeek] = useState(dataModel.createWeekList());
    const [check, setCheck] = useState(false);
    const [currentVideo, setCurrentVideo] = useState([]);
    const [currentPlaylist, setCurrentPlaylist] = useState([]);
    const [newListOpen, setNewListOpen] = useState(false);
    const [input, onChangeInput] = useState('');
    const [dropdownOpen, setdropDownOpen] = useState(false);
    const [selectedPrivacy, setSelectedPrivacy] = useState('');
    let selectDay = [];
    let selectList = [];
    const flatListRef = useRef();
    const toTop = () => {
      flatListRef.current.scrollToOffset({ animated: true, offset: 0 })
    }
    const privacyOption = [
        {label: 'Public - everyone can see', value: 'public'},
        {label: 'Private - only you can see', value: 'private'}
      ];
    useEffect(() => {
        const listenerId = dataModel.addPlaylistListener(() => {
          let newItems = Array.from(dataModel.getPlaylistCopy());
          setPlaylist(newItems);
        });
        dataModel.initGetMyPlaylist(()=>{
            setMyPlaylist(dataModel.getMyPlaylistCopy())});
        dataModel.initPlaylistOnSnapshot(()=>{
            setPlaylist(dataModel.getPlaylist())});
        
        return(() => {
          dataModel.removePlaylistListener(listenerId);
        });
        
    },[])

    return (
        <MenuProvider skipInstanceCheck={true} >
        < View style={styles.body}>

        <Modal
            visible={detailIsOpen} 
            >
            <Modal
            visible={editIsOpen} 
            animationType='slide'
            transparent={true}
            >
            <View style={styles.modalContainer}>
              <View style={styles.modal}>
                <View style={styles.section1}>
                  <View style={styles.closeModal}>
                      <Feather name="x" size={24} color="black" onPress={()=>{setEditIsOpen(false)}}/>
                  </View>
                  <View style={styles.modalHeader}>
                      <Text style={styles.modalTitle}>Edit playlist</Text>
                  </View>
                  

                  <View style={styles.modalContent}>
                      <View style={styles.options}>
                        <Text style={styles.inputTitle}>List name</Text>
                        <TextInput 
                            style={[styles.input, styles.playlistInput]} 
                            onChangeText={onChangeInput}
                            value={input}
                        />
                        <Text style={styles.inputTitle}>Privacy</Text>
                        <DropDownPicker
                          placeholder={detailPlaylist.privacy}
                          style={styles.dropdown}
                          dropDownContainerStyle={styles.dropDownContainer}
                          placeholderStyle={styles.placeholder}
                          open={dropdownOpen}
                          value={selectedPrivacy}
                          items={privacyOption}
                          setOpen={setdropDownOpen}
                          setValue={setSelectedPrivacy}
                          
                          // setItems={setItems}
                        />
                      </View>
                  </View>
                </View>

                <View style={styles.section2}>
                <TouchableOpacity
                    style={styles.bigButton}
                    onPress={()=> {
                      dataModel.updateEditedPlaylist(detailPlaylist.key, input, selectedPrivacy);
                      setEditIsOpen(false);
                    }
                    }
                >
                    <Text style={styles.bigButtonText}>Save</Text>
                </TouchableOpacity>
                </View>
                  
              </View>
            </View>
            </Modal>
            <MenuProvider skipInstanceCheck={true} >
            <View style={styles.detailHeader}>
                <TouchableOpacity
                    onPress={()=> setDetailIsOpen(false)}>
                    <Feather name="chevron-left" size={24} color="black" />
                </TouchableOpacity>
                <View style={styles.detailHeaderInfo}>
                    <Text style={styles.headerText}>{input}</Text>
                    <Text>{selectedPrivacy}</Text>
                </View>
                <Menu>
                    <MenuTrigger>
                        <Feather name="more-vertical" size={24} color="black" />
                    </MenuTrigger>
                    <MenuOptions optionsContainerStyle = {styles.menuContainer}>
                        <MenuOption 
                        optionWrapper={styles.menuOption}
                        onSelect={() => {setEditIsOpen(true)}} >
                        <Text style={styles.menuText}>Edit</Text>
                        </MenuOption>
                    </MenuOptions>
                </Menu>

            </View>
            <View 
                style={styles.videoResult}>
                <FlatList
                    contentContainerStyle={styles.videoArea}
                    data={dataModel.getVideofromPlaylistCopy()}
                    ref={flatListRef}
                    renderItem={({item})=>{
                        return (
                            <View style={styles.todoCoverF}>
                                <TouchableOpacity
                                onPress={()=>{console.log('pressed!');setPlayerOpen(true); setSelectedVideo(item.key)}}
                                >
                                <Image
                                    style={styles.image}
                                    source={{uri: item.coverImg}}
                                />
                                </TouchableOpacity>

                                <View style={styles.videoContent}>
                                    <View style={styles.actionOptions}>
                                        <TouchableOpacity onPress={()=>{setPlayerOpen(true); setSelectedVideo(item.key); console.log(selectedVideo)}} >
                                            <View style={styles.videoDetail} >
                                                <View style={styles.videoInfo}>
                                                    <Text style={styles.detailText}>{item.author}</Text>
                                                    <Text style={styles.videoName}>{item.name}</Text>
                                                </View>
                                            </View>
                                        </TouchableOpacity>
                                        <View style={styles.icon}>
                                            <Menu>
                                            <MenuTrigger>
                                                <Feather name="more-vertical" size={24} color="black" />
                                            </MenuTrigger>
                                            <MenuOptions optionsContainerStyle = {styles.menuContainer}>
                                                <MenuOption 
                                                optionWrapper={styles.menuOption}
                                                onSelect={() => dataModel.deleteVideo(detailPlaylist.key, item.key)} >
                                                <Text style={styles.menuText}>Remove</Text>
                                                </MenuOption>
                                            </MenuOptions>
                                            </Menu>
                                            
                                        </View>
                                    </View>
                                </View>

                                <Text>{item.md}</Text>
                            </View>
                        );
                    }}
                />

            </View>  
            </MenuProvider>
        </Modal>

        <Modal
            visible={todoIsOpen} 
            animationType='slide'
            transparent={true}
            >
                <View style={styles.modalContainer}>
                <View style={styles.modal}>
                    <View style={styles.closeModal}>
                        <Feather name="x" size={24} color="black" onPress={()=>{setTodoOpen(false); dataModel.setWeekDefault(week)}}/>
                    </View>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>Add to to-do</Text>
                    </View>

                    <View style={styles.modalContent}>
                        <View style={styles.optionContainer}>
                        <Text style={styles.modalText}>Add to specific date</Text>
                        <FlatList
                            contentContainerStyle={styles.modalArea}
                            scrollEnabled={false}
                            data={week}
                            renderItem={({item})=>{
                                return (
                                    <View style={styles.modalOptions}>
                                        <CheckBox 
                                            containerStyle={styles.checkBox}
                                            checkedIcon={<Feather name="check-circle" size={24} color='#F4C2C2' />}
                                            uncheckedIcon={<Feather name="circle" size={24} color='#F4C2C2' />}
                                            checked={item.selectDateForTodo}
                                            onPress={()=>{
                                                setCheck(!check);
                                                item.selectDateForTodo=!item.selectDateForTodo;
                                            }}
                                        />
                                        <Text style={styles.modalText}>{item.md}</Text>
                                    </View>
                                );
                            }}
                        />
                    </View>
                    <View style={styles.optionContainer}>
                        <TouchableOpacity
                                style={styles.bigButton}
                                onPress={()=> {
                                    selectDay = dataModel.selectedDate(week);
                                    dataModel.saveTodoFromPlayList(selectDay.selectDateForTodo, currentPlaylist);
                                    setTodoOpen(false);
                                }
                                }
                            >
                            <Text style={styles.bigButtonText}>Add</Text>
                        </TouchableOpacity>
                    </View>
                    
                    </View>
                </View>
                </View>
        </Modal>
            <View style={styles.header}>
                <Text style={styles.headerText}>My playlist</Text>
            </View>
            <View style={styles.flapListWrapper}>
                <FlatList
                    ref={flatListRef}
                    contentContainerStyle={styles.resultArea}
                    showsVerticalScrollIndicator={false}
                    data={myPlaylist} 
                    renderItem={({item})=>{
                        return (
                            <View style={styles.playlist}>
                                
                                
                                <TouchableOpacity
                                    onPress={()=>{
                                        setDetailPlaylist(item);
                                        dataModel.setDetailPlaylist(item);
                                        dataModel.getVideofromPlaylist(()=>{
                                            setDisplayVideos(dataModel.getVideofromPlaylistCopy())
                                        })
                                        onChangeInput(item.name);
                                        setSelectedPrivacy(item.privacy);
                                        setDetailIsOpen(true);
                                    }}
                                >
                                        <ImageBackground source={{uri: item.coverImg}} imageStyle={{borderRadius: 10}} resizeMode="center" style={styles.playlistImg}>
                                        <View style={styles.playlistContent}>
                                        <View style={styles.playlistInfo}>
                                            <Text style={styles.playlistName}>{item.name}</Text>  
                                        </View>
                                        
                                        <View style={styles.more}>
                                            <Menu>
                                                <MenuTrigger>
                                                    <Feather name="more-vertical" size={24} color="black" />
                                                </MenuTrigger>
                                                <MenuOptions optionsContainerStyle = {styles.menuContainer}>
                                                    <MenuOption 
                                                    optionWrapper={styles.menuOption}
                                                    onSelect={() => {console.log(item.key), dataModel.deletePlaylist(item.key), setDisplayVideos(dataModel.getVideofromPlaylistCopy())}} >
                                                    <Text style={styles.menuText}>Remove</Text>
                                                    </MenuOption>
                                                </MenuOptions>
                                            </Menu>
                                        </View>
                                    </View>
                                    </ImageBackground>
                                </TouchableOpacity>
                                
                                
            
                                <View style={styles.buttonArea}>
                                    <TouchableOpacity
                                        style={styles.button}
                                        onPress={() => {
                                            setTodoOpen(true); 
                                            setCurrentPlaylist(item.key);
                                            dataModel.setWeekDefault(week);
                                        }}
                                    >
                                        <Feather name="plus" size={12} color="black" />
                                        <Text style={styles.buttonText}>To-do</Text>
                                    </TouchableOpacity>
                                </View>
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
        justifyContent: 'flex-start',
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
    options:{
        height: 200,
        alignItems: 'flex-start',
        width: '100%',
        padding: 5,
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
    videoResult: {
        flex:1,
        marginTop: -30,
    },
    detailHeader: {
        paddingTop: 90,
        height: 200,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'flex-start',
        backgroundColor: '#F4C2C2',
    },
    todoCoverF: {
        width: 312,
        // height: 270,
        borderRadius: 10,
        borderWidth:1,
        borderColor: '#E2E3E5',
        marginBottom: 30,
        borderColor: '#E2E3E5',
      },
      videoArea:{
        justifyContent: 'center',
        alignItems: 'center',
      },
      videoContent: {
        width: '100%',
        // justifyContent: 'flex-start',
        overflow: 'hidden',
        backgroundColor: 'white'
      },
      videoDetail:{
        width: '100%',
        justifyContent: 'space-between',
        paddingHorizontal:10,
      },
      actionOptions: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        // marginTop: -15,
        // marginBottom: -10,
      },
      detailText: {
        color: '#A3515A',
        fontSize: 12,
      },
      videoName:{
        paddingTop: 5,
    },
    videoInfo: {
        width: 270,
        overflow: 'hidden',
      },
    playlistInput:{
        width: '100%',
    },
    input: {
        flexDirection: 'row',
        width: 230,
        marginRight: 10,
        height: 35,
        backgroundColor: '#E2E3E5',
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 50,
    },
    inputTitle:{
        fontFamily: 'AlegreyaSansSC_400Regular',
          fontSize: 18,
          paddingLeft: 20,
          paddingTop: 20,
          paddingBottom: 5,
    },
    dropDownContainer:{
        borderWidth: 1,
        borderColor: '#E2E3E5',
        borderRadius: 5,
        paddingVertical: 10,
      },
      dropdown:{
        marginVertical: 5,
        backgroundColor: '#E2E3E5',
        borderRadius: 20,
        height: 35,
        borderWidth:0,
        paddingVertical: 10,
      },
      detailHeaderInfo: {
          justifyContent: 'flex-start',
          alignItems: 'center',
          width: 300,
          overflow: 'hidden',
      }

})