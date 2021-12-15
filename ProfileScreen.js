import React, {useEffect, useState} from 'react';
import { Text, View, 
    FlatList, TouchableOpacity, StyleSheet, Button, AppRegistry, LogBox, Image 
  } from 'react-native';
import { getDataModel } from './DataModel';
import { getAuth, signOut } from '@firebase/auth';
const auth = getAuth();

LogBox.ignoreLogs(["AsyncStorage"]);

export function ProfileScreen ({navigation, route}) {
    let dataModel = getDataModel();
    const [userDisplayName, setUserDisplayName] = useState('User');

    useEffect(()=>{
        dataModel.addUserSnapshotListener(async () => {
            setUserDisplayName(await dataModel.getCurrentUserDisplayName());
        });
    }, []);

    return (
        <View style={styles.body}>
            <View style={styles.header}>
                <View style={styles.profileImg}>
                    <Image
                        style={{resizeMode: 'cover', width: 150, height: 150}}
                        source={require('./assets/Evie_evy.png')}/>
                </View>
                <Text style={styles.headerText}>{userDisplayName}</Text>
            </View>
                
            <View style={styles.infoArea}>
                <Text style={styles.title}>Email</Text>
                <Text style={styles.info}>{auth.currentUser.email}</Text>
                <TouchableOpacity
                    style={styles.button}
                    onPress={()=> {
                    dataModel.disconnectOnSignout();
                    signOut(auth)
                    }}
                >
                    <Text style={styles.buttonText}>Log out</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
body: {
    flex:1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 100,
    fontFamily: 'NanumGothic_400Regular',
    fontSize: 16,
    backgroundColor: '#ffffff',
    
},
button: {
    borderWidth:1,
    paddingHorizontal: 20,
    paddingVertical: 3,
    borderRadius: 5,
    borderColor: '#A3515A',
    marginVertical: 30,
},
buttonText: {
    fontSize: 18,
    color: '#A3515A',
    fontFamily: 'AlegreyaSansSC_400Regular'
},
header:{
    flex: 0.4,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    marginVertical: 10,
    paddingVertical: 10,
},
headerText: {
    fontSize: 30,
    fontFamily: 'AlegreyaSansSC_400Regular'
},
profileImg:{
    width: 103,
    height: 103,
    borderRadius: 50,
    borderWidth:1,
    borderColor: '#E2E3E5',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    paddingTop: 10,
},
infoArea:{
    width: '100%',
    padding: 30,
    paddingLeft: 70,
    alignItems: 'flex-start'
},
title:{
    fontSize: 18,
    fontFamily: 'AlegreyaSansSC_400Regular',
    paddingBottom: 5,
},

})