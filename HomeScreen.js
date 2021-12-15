import React, { useState, useEffect, Component, useRef, useCallback } from 'react';
import { Text, View, Image, Modal,
  FlatList, TouchableOpacity, StyleSheet, Button, AppRegistry, LogBox 
} from 'react-native';
import { CheckBox } from 'react-native-elements';
import DropDownPicker from 'react-native-dropdown-picker';
import { Feather } from '@expo/vector-icons';
import { getDataModel } from './DataModel';
import { MenuProvider, Menu, MenuTrigger, MenuOptions, MenuOption,} from 'react-native-popup-menu';
import YoutubePlayer from "react-native-youtube-iframe";
import { ProgressBar, Colors } from 'react-native-paper';

LogBox.ignoreLogs(["AsyncStorage"]);


export function HomeScreen ({navigation, route}) {

  let dataModel = getDataModel();
  const [week, setWeek] = useState(dataModel.createTodoWeek());
  const [selectedDate, setSelectedDate] = useState(dataModel.getCurrentDate());
  const [playlist, setPlaylist] = useState(dataModel.getPlaylist());
  const [formattedDate, setFormattedDate] = useState(undefined);
  const [userDisplayName, setUserDisplayName] = useState('User');
  const [myPlaylist, setMyPlaylist] = useState([]);
  const [todoList, setTodoList] = useState([]);
  const [check, setCheck]= useState(false);
  const [addVideoOpen, setAddVideoOpen] = useState(false);
  const [playerOpen, setPlayerOpen] = useState(false);
  const [selectedPlaylist, setSelectedPlaylist] = useState('');
  const [dropdownOpen, setdropDownOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState('');
  const [progress, setProgress] = useState('');
  const flatListRef = useRef();
  const toTop = () => {
    flatListRef.current.scrollToOffset({ animated: true, offset: 0 })
  }
  const progressCheck = () => {
    let count = todoList.length;
    let done = 0;
    if (todoList.length == 0){
      return 0
    } else {
      for (i of todoList) {
        if (i.done) {
          done+=1;
        };
      }
      let progress = done/count;
    return progress
    }
  }
  
  useEffect(()=>{
    dataModel.addUserSnapshotListener(async () => {
        setUserDisplayName(await dataModel.getCurrentUserDisplayName());
    });
    const listenerId = dataModel.addCurrentUserTodoListener(() => {
      let newItems = Array.from(dataModel.getTodoListCopy());
      setTodoList(newItems);
    });
    const plistenerId = dataModel.addPlaylistListener(() => {
      let newItems = Array.from(dataModel.getPlaylistCopy());
      setPlaylist(newItems);
    });
    dataModel.initGetMyPlaylist(()=>{
      setMyPlaylist(dataModel.getMyPlaylistCopy())});
    
    return(() => {
      dataModel.removeTodoListener(listenerId);
      dataModel.removePlaylistListener(plistenerId);
    });
}, []);

  return (
    <MenuProvider>
    <View style={styles.body}>
      <Modal
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
        </Modal>
      <Modal
        visible={addVideoOpen} 
        animationType='slide'
        transparent={true}
        >
            <View style={styles.modalContainer}>
              <View style={styles.modal}>
                <View style={styles.section1}>
                  <View style={styles.closeModal}>
                      <Feather name="x" size={24} color="black" onPress={()=>{setAddVideoOpen(false)}}/>
                  </View>
                  <View style={styles.modalHeader}>
                      <Text style={styles.modalTitle}>Add videos</Text>
                  </View>
                  

                  <View style={styles.modalContent}>
                      <View style={styles.optionContainer}>
                        <Text style={styles.modalText}>From playlist</Text>
                        <DropDownPicker
                          schema={{
                            label: 'name',
                            value: 'key'
                          }}
                          placeholder="Select videos"
                          style={styles.dropdown}
                          dropDownContainerStyle={styles.dropDownContainer}
                          placeholderStyle={styles.placeholder}
                          categorySelectable={true}
                          open={dropdownOpen}
                          value={selectedPlaylist}
                          items={myPlaylist}
                          setOpen={setdropDownOpen}
                          setValue={setSelectedPlaylist}
                          // setItems={setItems}
                        />

                      </View>
                  </View>
                </View>

                <View style={styles.section2}>
                <TouchableOpacity
                    style={styles.bigButton}
                    onPress={()=> {
                      console.log(selectedDate)
                      dataModel.saveTodoFromPlayListO(selectedDate, selectedPlaylist);
                      setSelectedPlaylist([]),
                      setAddVideoOpen(false);
                    }
                    }
                >
                    <Text style={styles.bigButtonText}>Save</Text>
                </TouchableOpacity>
                </View>
                  
              </View>
            </View>
      </Modal>
      <View style={styles.header}>
        <Text style={styles.headerText}>Week</Text>
      </View>

      <View style={styles.weekContainer}>
        <FlatList
            contentContainerStyle={styles.week}
            showsVerticalScrollIndicator={false}
            scrollEnabled={false}
            data={week}
            renderItem={({item})=>{
                return (
                  <View style={styles.weekly}>
                       <View style={styles.dayCapital}>
                         <Text style={styles.dayText}>{item.day[0]}</Text>
                       </View>
                       <TouchableOpacity 
                          style={item.selectDateForTodo ? styles.selectDate:styles.day} 
                          onPress={()=>{
                            item.selectDateForTodo = true,
                            dataModel.updateTodoWeek(week, item.d),
                            // console.log(dataModel.updateTodoWeek(week, item.d)),
                            dataModel.getCurrentSelectTodo(()=>{
                              setTodoList(dataModel.getTodoListCopy());
                            });
                            setSelectedDate(item.mdy)
                            console.log(selectedDate);
                            toTop();
                            console.log(todoList);
                            // console.log(dataModel.getTodoListCopy())

                            }
                          }>
                         <Text style={styles.dayText}>{item.dateOfMonth}</Text>
                       </TouchableOpacity>
                  </View>
                );
            }}
        />

      </View>

      <View style={styles.summary}>
        <Text>{todoList.length} videos</Text>
        <Feather name="plus" size={24} color="black" onPress={()=>setAddVideoOpen(true)}/>
      </View>

      <View style={styles.progress}>
          <ProgressBar style={styles.progressBar} progress={progressCheck()} color={'#F4C2C2'}/>
      </View>


      <View style={styles.todoResult}>
        <FlatList
          contentContainerStyle={styles.videoArea}
          data={todoList}
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
                                    progressCheck();
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
  weekContainer: {
    width:'100%',
    height: 80,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  week: {
    width:'100%',
    height: 80,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  weekly: {
    width: '100%',
    // borderWidth:1,

  },
  dayCapital: {
    // borderWidth:1,
    backgroundColor: '#ffffff',
    padding: 1,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  day: {
    borderWidth:1,
    borderColor: '#F4C2C2',
    backgroundColor: '#ffffff',
    padding: 1,
    borderRadius: 20,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectDate: {
    // borderWidth:1,
    borderColor: '#A3515A',
    backgroundColor: '#F4C2C2',
    padding: 1,
    borderRadius: 20,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayText: {
    fontFamily: 'AlegreyaSansSC_400Regular',
    fontSize: 20,
  },
  summary: {
    width: '100%',
    marginVertical: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  progress:{
    width: '100%',
    marginBottom: 20,
    paddingHorizontal: 30,
  },
  progressBar:{
    height: 20,
    width: '100%',
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
  }, 
  todoCover: {
    width: 312,
    // height: 270,
    borderRadius: 10,
    // borderWidth:1,
    marginBottom: 30,
    backgroundColor: '#F7D4D4'
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
  image: {
    height: 176,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    resizeMode: 'cover',
    backgroundColor: '#F4C2C2',
    marginBottom: 10,
  },
  videoContent: {
    width: '100%',
    // justifyContent: 'flex-start',
    overflow: 'hidden',
  },
  videoDetail:{
    width: '100%',
    justifyContent: 'space-between',
    paddingHorizontal:10,
  },
  actionOptions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: -15,
    marginBottom: -10,

  },
  todoResult:{
    flex:1,
    flexDirection: 'row',
    // borderWidth:1,
  },
  videoArea:{
    justifyContent: 'center',
    alignItems: 'center',
    // borderWidth:3,
  },
  videoInfo: {
    width: 270,
    overflow: 'hidden',
  },
  detailText: {
    color: '#A3515A',
    fontSize: 12,
  },
  videoName:{
    paddingTop: 5,
},
checkBox: {
  marginLeft: 0,
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
  fontFamily: 'AlegreyaSansSC_400Regular',
  fontSize: 18,
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
modalTitle:{
  fontFamily: 'AlegreyaSansSC_400Regular',
  fontSize: 30,
},
section1:{
  // borderWidth:1,
},
section2:{
  width: '100%',
  marginBottom: 30,
  // borderWidth:1,
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
// placeholder: {
//   backgroundColor: '#E2E3E5',
// },
dropDownContainer:{
  borderWidth: 1,
  borderColor: '#E2E3E5',
  borderRadius: 5,
},
dropdown:{
  marginVertical: 5,
  backgroundColor: '#E2E3E5',
  borderRadius: 20,
  height: 35,
  borderWidth:0,
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
playerModalContainer: {
  flex:1,
  justifyContent: 'center',
  backgroundColor: 'rgba(0,0,0,0.9)',
},
closeArea: {
  height: '100%',
  width: '100%',
  justifyContent: 'flex-end',
  alignItems: 'flex-end',
  padding:10
}

});

