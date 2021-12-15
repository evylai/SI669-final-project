import { initializeApp, getApps } from 'firebase/app';
import { 
  initializeFirestore, collection, where, query, orderBy, onSnapshot,
  doc, addDoc, setDoc, getDoc, updateDoc, deleteDoc, getDocs
} from "firebase/firestore";
import { firebaseConfig } from './Secrets';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import moment from 'moment';

let app;
if (getApps().length == 0){
  app = initializeApp(firebaseConfig);
} 
const db = initializeFirestore(app, {
  useFetchStreams: false
});

let snapshotUnsubscribe = undefined;
const auth = getAuth();

class DataModel {

  constructor() {
    this.playlist = [];
    this.myPlaylist = [];
    this.playlistVideos = [];
    this.specificPlaylist=[];
    this.specificVideoKey=[];
    this.playlistlisteners =[];
    this.weekList =[];
    this.currWeekList=[];
    // this.initPlaylistOnSnapshot();
    this.users = [];
    this.userSnapshotUnsub = undefined; 
    this.userSnapshotListeners = [];
    this.todoList = [];
    this.todoListeners = [];
    this.todoWeek = [];
    this.displayName = '';
    this.detailPlaylist = [];
    // this.initTodoOnSnapshot();
    // this.initGetMyPlaylist();
    this.currentSelectedDate = moment().format('l').replaceAll('/', '-');
  }

  addPlaylistListener(callbackFunction) {
    const listenerId = Date.now();
    const listener = {
      id: listenerId,
      callback: callbackFunction
    }
    this.playlistlisteners.push(listener)
    callbackFunction(); // have the caller check right away
    return listenerId;
  }

  removePlaylistListener(listenerId) {
    let idx = this.playlistlisteners.findIndex((elem)=>elem.id===listenerId);
    this.playlistlisteners.splice(idx, 1);
  }

  notifyPlaylistListeners() {
    for (let ul of this.playlistlisteners) {
      ul.callback();
    }
  }

  async initPlaylistOnSnapshot(callback) {
    q = query(collection(db, 'playlist'), where("authID", '!=', auth.currentUser.uid), where('privacy', '==', 'public'))
    onSnapshot(q, (qSnap) => {
      if (qSnap.empty) return;
      let newPlayList = [];
      qSnap.forEach((docSnap) => {
        let list = docSnap.data();
        list.key = docSnap.id;
        newPlayList.push(list);
      });
      this.playlist = newPlayList;
      callback(newPlayList)
      this.notifyPlaylistListeners();
    });
  }

  getPlaylist() {
    return this.playlist;
  }

  getPlaylistCopy() {
    return Array.from(this.playlist);
  }

  getSpecificPlaylist() {
    return this.specificPlaylist;
  }

  getSPecificPlaylistCopy() {
    return Array.from(this.specificPlaylist);
  }

  async initGetMyPlaylist(callback) {

    let q = query(collection(db, 'playlist'), where('authID', '==', auth.currentUser.uid));
    onSnapshot(q, (qSnap) => {
      if (qSnap.empty) return;
      let playList = [];
      qSnap.forEach((docSnap) => {
        let list = docSnap.data();
        list.key = docSnap.id;
        playList.push(list);
      });
      this.myPlaylist = playList;
      console.log(this.myPlaylist)
      callback(playList)
      this.notifyPlaylistListeners();
    });
  }

  async GetSpecificPlaylist(callback) {
    const playlistVideos = collection (db, 'playlist', this.specificPlaylist, 'videos')
    onSnapshot(playlistVideos, (qSnap) => {
      if (qSnap.empty) return;
      let playList = [];
      let videoKey = [];
      qSnap.forEach((docSnap) => {
        let list = docSnap.data();
        list.key = docSnap.id;
        playList.push(list);
        videoKey.push(list.key);
      });
      this.specificPlaylist = playList;
      this.specificVideoKey = videoKey;
      // console.log(this.specificVideoKey);
      callback(playList);
      callback(videoKey);
      this.notifyPlaylistListeners();
    });
  }

  getMyPlaylist() {
    return this.myPlaylist;
  }

  getMyPlaylistCopy() {
    return Array.from(this.myPlaylist);
  }

  getSpecificVideKey() {
    return this.specificVideoKey;
  }

  
  
  initOnAuth() {
    if (this.userSnapshotUnsub) {
      this.userSnapshotUnsub();
    }
    this.userSnapshotUnsub = onSnapshot(collection(db, 'users'), qSnap => {
      let updatedUsers = [];
      qSnap.forEach(docSnap => {
        let user = docSnap.data();
        user.key = docSnap.id;
        updatedUsers.push(user);
      });
      this.users = updatedUsers;
      this.notifyUserSnapshotListeners();
    });
  }

  disconnectOnSignout() {
    if (this.userSnapshotUnsub) {
      this.userSnapshotUnsub();
      this.userSnapshotUnsub = undefined;
    }
    if (this.todoSnapshotUnsub) {
      this.todoSnapshotUnsub();
    }
  }

  addUserSnapshotListener(callback) {
    const id = Date.now();
    this.userSnapshotListeners.push({
      callback: callback,
      id: id
    });
    callback();
    return id;
  }

  removeUserSnapshotListener(id) {
    const idx = this.userSnapshotListeners.findIndex(elem => elem.id === id);
    if (idx !== -1) {
      this.userSnapshotListeners.splice(idx, 1);
    }
  }

  notifyUserSnapshotListeners() {
    for (usl of this.userSnapshotListeners) {
      usl.callback();
    }
  }

  createUser(authUser, displayName) {
    setDoc(doc(db, 'users', authUser.uid), {displayName: displayName});
  }

  async getCurrentUserDisplayName() {
    const authUser = auth.currentUser;
    const userDocSnap = await getDoc(doc(db, 'users', authUser.uid));
    const user = userDocSnap.data();
    this.displayName = user.displayName;
    return user.displayName;
  }
  
  getCurrentDate() {
    let curr = moment();
    let today = today = curr.format('l')

    return today;
  }
  createWeekList() {
    this.weekList = [];
    let curr = moment();
    const today = moment();
    for (let i=1; i<=7; i++) {      
        let list = {
          curr: curr,
          dateOfMonth: curr.day(i-1).format('D'),
          md: curr.day(i-1).format('M')+'/'+curr.day(i-1).format('D'),
          mdy: curr.day(i-1).format('l'),
          day: curr.day(i-1).format('ddd'),
          d: curr.day(i-1).format('d'),
          selectDay: true,
          selectDate: true,
          key: i-1,
        // onPress: () => {setSelectDate(curr.day(i-1).format('d')), list.select=!select, console.log(date)},
        }
        this.weekList.push(list);
        // console.log(this.weekList);
    }
    return Array.from(this.weekList);
  }

  createTodoWeek() {
    let curr = moment();
    const today = moment();
    let list = []
    for (let i=1; i<=7; i++) { 
      if ((i-1) == today.format('d')){
        list = {
          curr: curr,
          dateOfMonth: curr.day(i-1).format('D'),
          md: curr.day(i-1).format('M')+'/'+curr.day(i-1).format('D'),
          mdy: curr.day(i-1).format('l'),
          day: curr.day(i-1).format('ddd'),
          d: curr.day(i-1).format('d'),
          selectDateForTodo: true,
          selectDay: false,
          selectDate: false,
          key: i-1,
          }
      } else{ 
        list = {
          curr: curr,
          dateOfMonth: curr.day(i-1).format('D'),
          md: curr.day(i-1).format('M')+'/'+curr.day(i-1).format('D'),
          mdy: curr.day(i-1).format('l'),
          day: curr.day(i-1).format('ddd'),
          d: curr.day(i-1).format('d'),
          selectDateForTodo: false,
          selectDay: false,
          selectDate: false,
          key: i-1,
          }
      }
        
      this.todoWeek.push(list);
    }
    return Array.from(this.todoWeek);
  }

 async updateTodoWeek(list, id) {
    list.map((item) => {
      if (item.d != id){
        item.selectDateForTodo = false;
      } else {
        console.log(item);
        this.currentSelectedDate = item.mdy.replaceAll('/', '-');
      }
    });
    console.log(this.todoList);
    return this.todoList;
  }

  setWeekDefault(weekList) {
    weekList.map(item =>{
      item.selectDate=false;
      item.selectDay=false;
    })
    return weekList;
  }

  setSelect(select) {
    select = !select;
  }

  selectedDate(weekList) {
    const selectDay = [];
    const selectDate = [];
    const selectDateForTodo = []
    weekList.map(item => {
      if (item.selectDateForTodo){
        selectDateForTodo.push(item.mdy)
      }
      if (item.selectDay){
        selectDay.push(item.day)
      } 
      if (item.selectDate) {
        selectDate.push(item.mdy)
      }
    })
    return {selectDateForTodo, selectDay, selectDate}
  }

  selectedPLaylist(playlist) {
    let selectList = [];
    playlist.map(item => {
      if (item.select){
        selectList.push(item)
      } 
    })
    console.log(selectList);
    return selectList
  }

  async saveTodo(selectDate, videoInfo) {
    const authID = auth.currentUser.uid;
    const userDoc = doc(db, 'users', authID);
    const todoColl = collection (userDoc, 'todo');
    for (i of selectDate){
      let formatD = i.replaceAll('/', '-');
      let collectionName = authID + '_' + formatD;
      let d = new Date(i);
      let todoDoc = doc(todoColl, collectionName);
      let videoColl = collection (todoDoc, 'videos')
      console.log(videoInfo.key)
      let videoDoc = doc(videoColl, videoInfo.key);
      let videoData = {
        videos: videoInfo,
        done: false
      }
      let todoData = {
        date: i,
        day: d.getDay(),
      }
      if (todoDoc.exists){
        updateDoc(videoDoc, videoData);
      } else {
        setDoc(todoDoc, todoData);
        setDoc(videoDoc, videoData);
      }
    }
  }


  async saveTodoFromPlayListO(selectDate, playlist){
    console.log('saveTodoFromPlayList')
    console.log(playlist);
    this.specificPlaylist = playlist;
    this.GetSpecificPlaylist(()=>{
      this.specificPlaylist= Array.from(this.getSPecificPlaylistCopy());
      this.specificVideoKey = this.getSpecificVideKey();

      const formatD = selectDate.replaceAll('/', '-')
      const todoFileName = auth.currentUser.uid + '_' + formatD;
      for (i of this.specificVideoKey){
        const todoDoc = doc(db, 'users', auth.currentUser.uid, 'todo', todoFileName, 'videos', i)
        const found = this.specificPlaylist.find(({key}) => key === i);
        let videoData = {
          done: false,
          videos: found
        }
        setDoc(todoDoc, videoData)
      }

    })
  }

  async saveTodoFromPlayList(selectDate, playlist){
    console.log('saveTodoFromPlayList')
    console.log(playlist);
    this.specificPlaylist = playlist;
    this.GetSpecificPlaylist(()=>{
      this.specificPlaylist= Array.from(this.getSPecificPlaylistCopy());
      this.specificVideoKey = this.getSpecificVideKey();
      for (i of selectDate) {
        const formatD = i.replaceAll('/', '-')
        const todoFileName = auth.currentUser.uid + '_' + formatD;
      
        for (t of this.specificPlaylist){
          console.log('t');
          // const playlistDoc = doc(db, 'playlist', n)
          const videoDoc = doc(db, 'users', auth.currentUser.uid, 'todo', todoFileName, 'videos', t.key)
          let videoData = {
            done: false,
            videos: t
          }
          if (videoDoc.exists){
            updateDoc(videoDoc, videoData)
          } else {
            setDoc(videoDoc, videoData)
          }
        }
      }
    })
  }

  async createPlaylist(name){
    const n = auth.currentUser.uid + '_' + name;
    let displayName = await this.getCurrentUserDisplayName();
    let playlistColl = collection (db, 'playlist')
    let playlistDoc = doc(playlistColl, n);
    let playlistData = {
      author: displayName,
      authID: auth.currentUser.uid,
      coverImg: null,
      name: name,
      key: n,
      privacy: 'public',
      select: false,
      userSaved: [auth.currentUser.uid,]
    }
    setDoc(playlistDoc, playlistData);
  }

  async savePlaylist(playlist, videoInfo) {
    for (i of playlist){
      console.log('loop')
      console.log(i)
      let displayName = await this.getCurrentUserDisplayName();
      console.log(displayName);
      let n = auth.currentUser.uid +'_'+i.name;
      let playlistColl = collection (db, 'playlist')
      let playlistDoc = doc(playlistColl, n);
      let videoDoc = doc(playlistDoc, 'videos', videoInfo.key);
      let videoData = videoInfo;
      let playlistData = {
        author: displayName,
        authID: auth.currentUser.uid,
        coverImg: null,
        name: i.name,
        key: n,
        privacy: 'public',
        select: false,
        userSaved: [auth.currentUser.uid,]
      }
      
      if (playlistDoc.exists){
        updateDoc(videoDoc, videoData);
      } else {
        setDoc(playlistDoc, playlistData);
        setDoc(videoDoc, videoData);
      }

      }
    
  }

  async saveAsNewPlaylist(myPlaylist, playlistInfo) {
    console.log('save As New Playlist')
    this.specificPlaylist = playlistInfo;
    this.GetSpecificPlaylist(()=>{
      this.specificPlaylist= Array.from(this.getSPecificPlaylistCopy());
      this.specificVideoKey = this.getSpecificVideKey();
      console.log('this.specificPlaylist')
      console.log(this.specificPlaylist)

      for (i of myPlaylist){
        console.log(this.displayName);
        console.log('i')
        console.log(i)
        let n = auth.currentUser.uid +'_'+i.name;

        for (t of this.specificPlaylist){
          console.log('t');
          // const playlistDoc = doc(db, 'playlist', n)
          const videoColl = collection(db, 'playlist', n, 'videos')
          const videoDoc = doc(videoColl, t.key)
          let videoData = t

          setDoc(videoDoc, videoData)
        }
    }

    

  })
  }

  async saveVideos(videoInfo) {
    const videoDoc = doc(db, 'videos', videoInfo.key);
    setDoc(videoDoc, videoInfo)
  }

  async getCurrentSelectTodo(callback) {
    // console.log(date);
    const collectionName = auth.currentUser.uid + '_' + this.currentSelectedDate;
    const q = collection(db, 'users', auth.currentUser.uid, 'todo', collectionName, 'videos');

    this.TodoSnapshotUnsub = onSnapshot(q, qSnap => {
      let videos = [];
      qSnap.forEach(docSnap => {
        let videoData = docSnap.data();
        videoData.key = docSnap.id;
        videos.push(videoData);
        // console.log(videoData);
      });
      this.todoList = videos;
      callback(videos);
  });
}

  addCurrentUserTodoListener(callback) {
    if (this.todoSnapshotUnsub) {
      this.todoSnapshotUnsub();
    }
    let today = this.getCurrentDate().replaceAll('/', '-');
    // console.log(today);

    const collectionName = auth.currentUser.uid + '_' + today;
    // console.log(collectionName);
    const q = collection(db, 'users', auth.currentUser.uid, 'todo', collectionName, 'videos');

    this.TodoSnapshotUnsub = onSnapshot(q, qSnap => {
      let videos = [];
      qSnap.forEach(docSnap => {
        let videoData = docSnap.data();
        videoData.key = docSnap.id;
        videos.push(videoData);
        // console.log(videoData);
      });
      this.todoList = videos;
      callback(videos);
    });
  }
  

  removeTodoListener(listenerId) {
    let idx = this.todoListeners.findIndex((elem)=>elem.id===listenerId);
    this.todoListeners.splice(idx, 1);
  }

  notifyTodoListeners() {
    for (let ul of this.todoListeners) {
      ul.callback();
    }
  }

  updateTodo(key, newDone) {
    // console.log(this.currentSelectedDate);
    const collectionName = auth.currentUser.uid + '_' + this.currentSelectedDate;
    updateDoc(doc(db, 'users', auth.currentUser.uid, 'todo', collectionName, 'videos', key), {done: newDone});
    this.notifyTodoListeners();
  }

  deleteTodo(key) {
    const collectionName = auth.currentUser.uid + '_' + this.currentSelectedDate;
    deleteDoc(doc(db, 'users', auth.currentUser.uid, 'todo', collectionName, 'videos', key));
    this.notifyTodoListeners();
  }

  updatePlaylist(name, newState) {
    // console.log(this.currentSelectedDate);
    const documentName = auth.currentUser.uid + '_' + name;
    updateDoc(doc(db, 'playlist', documentName), {select: newState});
    this.notifyPlyalistListeners();
  }

  updateEditedPlaylist(key, newName, newPrivacy) {
    updateDoc(doc(db, 'playlist', key), {name: newName, privacy: newPrivacy});
    // this.notifyPlyalistListeners();
  }

  async deletePlaylist(key) {
    const querySnapshot = await getDocs(collection(db, "playlist", key, 'videos'));
    let videos = []
    querySnapshot.forEach((doc) => {
      videos.push(doc.data().key)
    });
    for (i of videos){
      deleteDoc(doc(db, 'playlist', key, 'videos', i))
    }

    deleteDoc(doc(db, 'playlist', key));
    this.notifyPlaylistListeners();
  }

  deleteVideo(playlistKey, key) {
    deleteDoc(doc(db, 'playlist', playlistKey, 'videos', key));
    this.notifyPlaylistListeners();
  }


  getTodoList() {
    return this.todoList;
  }

  getTodoListCopy() {
    // console.log('copy')
    // console.log(Array.from(this.todoList));
    return Array.from(this.todoList);
  }

  async getVideofromPlaylist(callback) {
    console.log(this.detailPlaylist)
    let q = collection(db, 'playlist', this.detailPlaylist.key, 'videos')
    onSnapshot(q, (qSnap) => {
      if (qSnap.empty) return;
      let itemList = [];
      qSnap.forEach((docSnap) => {
        let item = docSnap.data();
        item.key = docSnap.id;
        itemList.push(item);
      });
      this.playlistVideos = itemList;
      callback(itemList);
    });
  }

  getVideofromPlaylistCopy() {
    return Array.from(this.playlistVideos);
  }
  
  async setDetailPlaylist(playlist) {
    this.detailPlaylist = playlist;
  }

  


  
}
  
let theDataModel = undefined;

export function getDataModel() {
  if (!theDataModel) {
    theDataModel = new DataModel();
  }
  return theDataModel;
}