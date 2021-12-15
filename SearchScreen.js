import React, { useState, useEffect, Component, useRef } from 'react';
import { Text, View, TextInput, Image, ScrollView, Modal, ImageBackground,
  FlatList, TouchableOpacity, StyleSheet, AppRegistry, LogBox 
} from 'react-native';
import { CheckBox } from 'react-native-elements';
import { Feather } from '@expo/vector-icons';
import { getDataModel } from './DataModel';
import { youtubeAPI } from './Secrets';
import YTSearch from 'youtube-api-search';


LogBox.ignoreLogs(["AsyncStorage"]);

const API_KEY = youtubeAPI.apiKey;

export function SearchScreen ({navigation, route})  {
    let dataModel = getDataModel();

    const [mode, setMode] = useState('playlist');
    const [text, onChangeText] = useState('');
    const [playlist, setPlaylist] = useState([]);
    const [myPlaylist, setMyPlaylist] = useState([]);
    const [videos, setVideos] = useState([]);
    const [displayVideos, setDisplayVideos] = useState([]);
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

    

    useEffect(() => {
        const listenerId = dataModel.addPlaylistListener(() => {
          let newItems = Array.from(dataModel.getPlaylistCopy());
          setPlaylist(newItems);
        });
        dataModel.initPlaylistOnSnapshot(()=>{
            setPlaylist(dataModel.getPlaylist())});
        
        return(() => {
          dataModel.removePlaylistListener(listenerId);
        });
        
    },[])
    // console.log(week);
    // console.log(playlist);

    const searchYT = (term) => {
        YTSearch({ key: API_KEY, term, limit: 10}, videos => {
            setVideos(videos);
            VideoList(videos);
        })
    }
    
    const onPressSearch = (term) => {
        searchYT(term);
        setLoading('loading');
    }
    const VideoList = (videos) => {
        let videoList = []
        let objectVideos = Array.from(videos)
        objectVideos.map(video => {
            let videoItem = {
                    key: video.id.videoId,
                    name: video.snippet.title,
                    author: '@'+ video.snippet.channelTitle,
                    coverImg: video.snippet.thumbnails.medium.url,
                    url: 'https://www.youtube.com/watch?v=$'+ video.id.videoId
                }
            videoList.push(videoItem);
        })
        setDisplayVideos(videoList);
        setLoading('done');
    }

    const privacyOption = {Public: 'Public - everyone can see', Private: 'Private - only you can see'}


    return (
        <View style={styles.body}>
            <Modal
            visible={playlistIsOpen} 
            animationType='slide'
            transparent={true}
            >
                <Modal
                    animationType='fade'
                    transparent={true}
                    visible={newListOpen}>

                    <View style={styles.modalContainerNewList}>
                        <View style={styles.innerContainer}>
                            <View style={styles.closeModalNewList}>
                                <Feather name="x" size={24} color="black" onPress={()=>{setNewListOpen(false);}}/>
                            </View>
                            <View style={styles.modalHeaderNewList}>
                                <Text style={styles.modalTitle}>New List</Text>
                            </View>

                            <View style={styles.optionContainerP}>    
                                <Text style={styles.inputTitle}>Playlist Name</Text>
                                <View style={styles.searchPlayList}>
                                    <TextInput 
                                        style={[styles.input, styles.playlistInput]} 
                                        onChangeText={onChangeInput}
                                        value={input}
                                    />
                                </View>
                                {/* <Text>Privacy</Text>
                                <View style={styles.search}>
                                <DropDownPicker
                                    schema={{
                                        label: 'name',
                                        value: 'key'
                                    }}
                                    style={styles.dropdown}
                                    dropDownContainerStyle={styles.dropDownContainer}
                                    placeholderStyle={styles.placeholder}
                                    open={dropdownOpen}
                                    value={selectedPlaylist}
                                    items={playlist}
                                    setOpen={setdropDownOpen}
                                    setValue={setSelectedPlaylist}
                                    />
                                </View> */}
                            </View>
                            <View >
                                <TouchableOpacity
                                    style={styles.bigButtonArea}
                                    onPress={()=>{
                                        setNewListOpen(false);
                                        dataModel.createPlaylist(input);
                                        onChangeInput('');
                                    }}
                                >
                                <Text style={styles.bigButtonText}>Create</Text>
                                </TouchableOpacity>

                            </View>
                            

                        </View>
                    </View>
                </Modal>

                <View style={styles.modalContainer}>
                <View style={styles.modalP}>
                    <View style={styles.section1}>
                        <View style={styles.closeModal}>
                            <Feather name="x" size={24} color="black" onPress={()=>{setPlaylistOpen(false); }}/>
                        </View>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Add to playlist</Text>
                        </View>

                        <View style={styles.modalContentP}>
                            <View style={styles.optionContainerP}>
                            <View style={styles. textContainer}>
                            <Text style={styles.modalText}>Choose the lists to add the video</Text>
                            </View>
                            <FlatList
                                contentContainerStyle={styles.modalAreaP}
                                scrollEnabled={false}
                                data={myPlaylist}
                                renderItem={({item})=>{
                                    return (
                                        <View style={styles.modalOptionsP}>
                                            <View style={styles.modalPL}>
                                            <CheckBox 
                                                containerStyle={styles.checkBox}
                                                checkedIcon={<Feather name="check-circle" size={24} color='#F4C2C2' />}
                                                uncheckedIcon={<Feather name="circle" size={24} color='#F4C2C2' />}
                                                checked={item.select}
                                                onPress={()=>{
                                                    setCheck(!check);
                                                    item.select=!item.select;
                                                }}
                                            />
                                            <Text style={styles.modalText}>{item.name}</Text>
                                            </View>
                                            <View style={styles.modalPR}>
                                            { item.privacy === 'public'? 
                                                <Feather name="globe" size={20} color="black" />
                                            :
                                                <Feather name="lock" size={20} color="black" />
                                            }
                                            
                                            </View>
                                        </View>
                                    );
                                }}
                            />
                            </View>
                        
                            <View style={styles.addNewListSection}>
                                <TouchableOpacity
                                    style={styles.addnewListButton}
                                    onPress={()=> {
                                        setNewListOpen(true);
                                    }
                                    }
                                >
                                <Feather name="plus" size={24} color='black' />
                                <Text style={styles.buttonText}>New list</Text>
                                </TouchableOpacity>
                            </View>
                            </View>
                        </View>

                        
                    <View style={styles.section2}>
                        {mode === 'video'?
                            <TouchableOpacity
                                style={styles.bigButton}
                                onPress={()=> {
                                    selectList = dataModel.selectedPLaylist(myPlaylist);
                                    dataModel.savePlaylist(selectList, currentVideo);
                                    dataModel.saveVideos(currentVideo);
                                    setPlaylistOpen(false);
                                }
                                }
                            >
                                <Text style={styles.bigButtonText}>Add</Text>
                            </TouchableOpacity>
                        :
                            <TouchableOpacity
                                style={styles.bigButton}
                                onPress={()=> {
                                    selectList = dataModel.selectedPLaylist(myPlaylist);
                                    dataModel.saveAsNewPlaylist(selectList, currentPlaylist);
                                    setPlaylistOpen(false);
                                }
                                }
                            >
                                <Text style={styles.bigButtonText}>Add</Text>
                            </TouchableOpacity>
                        }
                    </View>
                    
                </View>
                </View>
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
                        {/* <View style={styles.optionContainer}>
                        <Text style={styles.modalText}>Choose the day to add the workout repeatly</Text>
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
                                            checked={item.selectDay}
                                            onPress={()=>{
                                                setCheck(!check);
                                                item.selectDay=!item.selectDay;
                                            }}
                                        />
                                        <Text style={styles.modalText}>{item.day}</Text>
                                    </View>
                                );
                            }}
                        />
                        </View> */}
                        
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
                                            checked={item.selectDate}
                                            onPress={()=>{
                                                setCheck(!check);
                                                item.selectDate=!item.selectDate;
                                            }}
                                        />
                                        <Text style={styles.modalText}>{item.md}</Text>
                                    </View>
                                );
                            }}
                        />
                    </View>
                    <View style={styles.optionContainer}>
                    {mode === 'video'?
                        <TouchableOpacity
                            style={styles.bigButton}
                            onPress={()=> {
                                selectDay = dataModel.selectedDate(week);
                                console.log(currentVideo)
                                dataModel.saveTodo(selectDay.selectDate, currentVideo);
                                setTodoOpen(false);
                            }
                            }å
                        >
                            <Text style={styles.bigButtonText}>Add</Text>
                        </TouchableOpacity>
                    :
                        <TouchableOpacity
                                style={styles.bigButton}
                                onPress={()=> {
                                    selectDay = dataModel.selectedDate(week);
                                    dataModel.saveTodoFromPlayList(selectDay.selectDate, currentPlaylist);
                                    setTodoOpen(false);
                                }
                                }
                            >
                                <Text style={styles.bigButtonText}>Add</Text>
                            </TouchableOpacity>
                    }
                    
                    </View>
                    
                    </View>
                </View>
                </View>
            </Modal>
            <View style={styles.header}>
                <TouchableOpacity
                    style={mode === 'playlist'? [styles.headerButton, styles.headerButtonLeft, styles.buttonSelect]: [styles.headerButton, styles.headerButtonLeft]}
                    onPress={()=> {setMode('playlist'); toTop()}}
                >
                    <Text style={styles.buttonText}>Playlist</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={mode === 'video'? [styles.headerButton, styles.headerButtonRight, styles.buttonSelect]: [styles.headerButton, styles.headerButtonRight]}
                    onPress={()=> {setMode('video'); toTop()}}
                >
                    <Text style={styles.buttonText}>Youtube</Text>
                </TouchableOpacity>

            </View>

            <View style={styles.searchArea}>
                {mode === 'video' ? 
                    <View style={styles.search}>
                        <TextInput 
                            style={styles.input} 
                            onChangeText={onChangeText}
                            value={text}
                        />
                        <TouchableOpacity
                            style={styles.searchButton}
                            onPress={()=> {
                                onPressSearch(text)
                                toTop()}}
                        >
                            <Text style={styles.buttonText}>Search</Text>
                        </TouchableOpacity>
                    </View>
   
                :
                    <Text style={styles.headerText}></Text>
                }
            </View>

            <View style={styles.flapListWrapper}>
                {mode === 'video' ?
                    <FlatList
                        ref={flatListRef}
                        contentContainerStyle={styles.resultArea}
                        showsVerticalScrollIndicator={false}
                        data={displayVideos} 
                        renderItem={({item})=>{
                            return (
                                <View style={styles.video}>
                                    <Image
                                        style={styles.image}
                                        source={{uri: item.coverImg}}
                                    />
                
                                    <View style={styles.videoContent}>
                                        <View style={styles.videoInfo}>
                                            <Text style={styles.detailText}>{item.author}</Text>
                                            <Text style={styles.videoName}>{item.name}</Text>
                                        </View>
                                        {/* <View style={styles.more}>
                                            <Feather name="more-vertical" size={24} color="black" />
                                        </View> */}
                                    </View>
                
                                    <View style={styles.buttonArea}>
                                        <TouchableOpacity
                                            style={styles.button}
                                            onPress={()=> {
                                                dataModel.initGetMyPlaylist(()=>{
                                                    setMyPlaylist(dataModel.getMyPlaylistCopy());
                                                })
                                                setPlaylistOpen(true);
                                                setCurrentVideo(item);
                                            }
                                                }
                                        >
                                            <Feather name="plus" size={12} color="black" />
                                            <Text style={styles.buttonText}>Playlist</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={styles.button}
                                            onPress={() => {
                                                setTodoOpen(true); 
                                                setCurrentVideo(item);
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
                :
                <FlatList
                        ref={flatListRef}
                        contentContainerStyle={styles.resultArea}
                        showsVerticalScrollIndicator={false}
                        data={playlist} 
                        renderItem={({item})=>{
                            return (
                                <View style={styles.playlist}>
                                    <ImageBackground source={{uri: item.coverImg}} imageStyle={{borderRadius: 10}} resizeMode="center" style={styles.playlistImg}>
                
                                    <View style={styles.playlistContent}>
                                        <View style={styles.playlistInfo}>
                                            <Text style={styles.playlistName}>{item.name}</Text>
                                            <Text style={styles.playlistAuthor}>{item.author}</Text>   
                                        </View>
                                        {/* <View style={styles.more}>
                                            <Feather name="more-vertical" size={24} color="white" />
                                        </View> */}
                                    </View>
                                    </ImageBackground>
                
                                    <View style={styles.buttonArea}>
                                        <TouchableOpacity
                                            style={styles.button}
                                            onPress={ ()=> {                                           
                                                dataModel.initGetMyPlaylist(()=>{
                                                setMyPlaylist(dataModel.getMyPlaylistCopy());
                                            });
                                            setPlaylistOpen(true);
                                            setCurrentPlaylist(item.key);}}
                                        >
                                            <Feather name="plus" size={12} color="black" />
                                            <Text style={styles.buttonText}>Playlist</Text>
                                        </TouchableOpacity>
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

                }
                    
            </View>
        </View>

    );
}

const styles = StyleSheet.create({
body: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: '20%',
    fontFamily: 'NanumGothic_400Regular',
    fontSize: 16,
    backgroundColor: '#ffffff',
},
header: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
},
headerButton: {
    width: '40%',
    paddingVertical: 10,
    borderWidth:1,
    borderColor: '#F4C2C2',
    alignItems: 'center',
    justifyContent: 'center',
},
headerButtonLeft: {
    borderTopLeftRadius:10,
    borderBottomLeftRadius:10,
},
headerButtonRight: {
    borderTopRightRadius:10,
    borderBottomRightRadius:10,
},
buttonSelect: {
    backgroundColor: '#F4C2C2',
},
searchArea:{
    width: '100%',
    overflow: 'hidden',
    justifyContent: 'space-between',
    paddingHorizontal: 30,
},
search:{
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    marginVertical: 20,
},
searchPlayList:{
    width: '100%',
    padding: 20,
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
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 50,
},
searchButton:{
    borderRadius: 50,
    backgroundColor: '#F4C2C2',
    color: 'black',
    height: 35,
    paddingHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'center',
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
    backgroundColor: '#F4C2C2',
    marginBottom: 10,
},
playlistImg: {
    height: 128,
    // borderRadius: 10,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    resizeMode: 'cover',
    backgroundColor: '#F4C2C2',
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
videoContent: {
    width: '100%',
    flexDirection: 'row',
    paddingVertical: 10,
    paddingLeft: 10,
    justifyContent: 'space-between',
},
playlistContent: {
    width: '100%',
    height: '100%',
    flexDirection: 'row',
    paddingVertical: 10,
    paddingLeft: 10,
    justifyContent: 'space-between',
    backgroundColor: 'rgba(0,0,0,0.5)'
},
videoInfo: {
    width: 270,
    overflow: 'hidden',
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
    color: 'white'

},
detailText: {
    color: '#A3515A',
    fontSize: 12,
},
playlistAuthor:{
    fontSize: 12,
    color: 'white',
},
videoName:{
    paddingTop: 5,
},
resultArea:{
    justifyContent: 'center',
    alignItems: 'center',

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
checkBox: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 50,
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
modalP: {
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
section1:{

},
section2:{

    marginBottom: 30,
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
closeModalNewList:{
    justifyContent:'flex-end',
    alignItems: 'flex-end',
    paddingTop: 20,
    paddingRight: 20,
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
  modalAreaP: {
      width:'100%',
      justifyContent: 'center',
  },
  modalOptionsP: {
      flexDirection: 'row',
      width:'100%',
      alignItems: 'center',
      justifyContent: 'space-between',
  },
  modalPL:{
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-start',
  },
  modalPR: {
      marginRight:10,
  },
  addNewListSection:{
      padding: 20,

  },
  addnewListButton: {
      width:143,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical:3,
      borderWidth:1,
      borderColor: '#F4C2C2',
      borderRadius:10,
  },
  optionContainerP: {
      width: '100%',
      justifyContent: 'center',
    //   alignItems: 'center',
  },
  textContainer:{
      justifyContent:'center',
      alignItems: 'center',
  },
  modalContentP:{
      width: '100%',
  },
  modalContainerNewList:{
      justifyContent: 'center',
      alignItems: 'center',
      flex:1,
      backgroundColor: 'rgba(0,0,0,0.9)',
  },
  innerContainer: {
      justifyContent: 'space-between',
      backgroundColor: 'white',
      height: 300,
      width:300,
      borderRadius: 15,
      overflow: 'hidden'
  },
  inputTitle:{
      fontFamily: 'AlegreyaSansSC_400Regular',
        fontSize: 18,
        paddingLeft: 20,
  },
  bigButtonArea:{
      alignItems: 'center',
      paddingVertical: 15,
      backgroundColor: '#F4C2C2',

  }

})
