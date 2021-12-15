import React, { useEffect, useState } from 'react';
import { FlatList, Modal, StyleSheet, Button, Alert,
  Text, TextInput, View, Pressable } from 'react-native';

import { getDataModel } from './DataModel';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";

export function LoginScreen ({navigation, route}) {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState('login');
  const [displayName, setDisplayName] = useState('');
  const dataModel = getDataModel();
  const auth = getAuth(); 

  useEffect(()=>{
    // dataModel.initUsersOnSnapshot();
    
    onAuthStateChanged(auth, (authUser) => {
      if (authUser) {
        dataModel.initOnAuth();
        navigation.navigate('Tabs', {currentAuthUserId: authUser.uid});
      } else {
        navigation.navigate('Login');
      }
    });

  }, [])

    return (
      <View style={loginStyles.body}>
        
        <View style={loginStyles.loginContainer}>
          {mode === 'login'?
            <View style={loginStyles.sectionHeader}>
              <Text style={loginStyles.sectionHeaderText}>
                Log in
              </Text>
            </View>
            :
            <View style={loginStyles.sectionHeader}>
              <Text style={loginStyles.sectionHeaderText}>
                Sign up
              </Text>
            </View>
          }
          
          
          {mode === 'signup' ? 
            <View style={loginStyles.loginRow}>
              <View style={loginStyles.loginLabelContainer}>
                <Text style={loginStyles.loginLabelText}>Display Name: </Text>
              </View>
              <View style={loginStyles.loginInputContainer}>
                <TextInput 
                  style={loginStyles.loginInputBox}
                  placeholder='enter display name' 
                  autoCapitalize='none'
                  spellCheck={false}
                  value={displayName}
                  onChangeText={(text)=>{setDisplayName(text)}}
                />
              </View>
            </View>
            :
            <View>{/* Empty view, show nothing */}</View> 
          }

          <View style={loginStyles.loginRow}>
            <View style={loginStyles.loginLabelContainer}>
              <Text style={loginStyles.loginLabelText}>Email: </Text>
            </View>
            <View style={loginStyles.loginInputContainer}>
              <TextInput 
                style={loginStyles.loginInputBox}
                placeholder='enter email address' 
                autoCapitalize='none'
                spellCheck={false}
                value={email}
                onChangeText={(text)=>{setEmail(text)}}
              />
            </View>
          </View>

          <View style={loginStyles.loginRow}>
            <View style={loginStyles.loginLabelContainer}>
              <Text style={loginStyles.loginLabelText}>Password: </Text>
            </View>
            <View style={loginStyles.loginInputContainer}>
              <TextInput 
                style={loginStyles.loginInputBox}
                placeholder='enter password' 
                secureTextEntry={true}
                value={password}
                onChangeText={(text)=>{setPassword(text)}}
              />
            </View>
          </View>
          
          

          <View style={loginStyles.loginButtonRow}>
            <Pressable
              title={mode==='login'?'Log in':'Sign up'}
              style={loginStyles.button}
              onPress={async ()=>{  
                if (mode === 'login') {
                  try {
                    const credential = 
                      await signInWithEmailAndPassword(auth, email, password);
                    console.log('logged in user', email);
                    // const authUser = credential.user;      
                    // const user = await dataModel.getUserForAuthUser(authUser);
                    // navigation.navigate('Home', {currentUserId: user.key});
                    setEmail('');
                    setPassword('');
                  } catch(error) {
                    Alert.alert("Log in Error", error.message,[{ text: "OK" }]);
                  }
              } else {
                try {
                  const credential = await createUserWithEmailAndPassword(auth, email, password);  
                  const authUser = credential.user;
                  // const user = await 
                  dataModel.createUser(authUser, displayName);  
                  // navigation.navigate('Home', {currentUserId: user.key});
                  // console.log('created user', email);
                  setEmail('');
                  setPassword('');
                  setMode('login')
                } catch(error) {
                  Alert.alert("Sign Up Error", error.message,[{ text: "OK" }]);
                }
              }
              setEmail('');
              setPassword('');
            }}
            >
              {mode==='login'? <Text style={loginStyles.buttonText}>Log in</Text> : <Text style={loginStyles.buttonText}>Sign up</Text>}
            </Pressable>
          </View>

          <View style={loginStyles.modeSwitchContainer}>
            {mode === 'login' ?
              <Text>Didn't have an account? 
                <Text 
                  onPress={()=>{setMode('signup'); console.log("go to sign up")}} 
                  style={{color: '#A3515A'}}> Sign up </Text> 
              </Text>
            :
              <Text>Already as an account? 
              <Text 
                onPress={()=>{setMode('login'); console.log("go to log in")}} 
                style={{color: '#A3515A'}}> Log In </Text> 
              </Text>
            }
          </View>
        </View>
      </View>
    );
  }


const loginStyles = StyleSheet.create({
  body: {
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: '2%',
    fontFamily: 'Hind_400Regular',
  },
  sectionHeaderText: {
    fontFamily: 'AlegreyaSansSC_400Regular',
    fontSize: 50,
    width: '100%',
    textAlign: 'center',
    marginBottom: 30,
  },
  loginContainer: {
    flex: 0.5,
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '80%',
  },
  loginRow: {
    height: 80,
    // flex: 0.7,
    // flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    width: '100%',
  },
  loginLabelContainer: {
    flex: 0.3,
    justifyContent: 'center',
    alignItems: 'flex-end'
  },
  loginLabelText: {
    fontSize: 18,
    fontFamily: 'AlegreyaSansSC_400Regular',
  },
  loginInputContainer: {
    flex: 0.5,
    justifyContent: 'space-around',
    alignItems: 'flex-start',
    width: '100%'
  },
  loginInputBox: {
    width: '100%',
    borderColor: '#E2E3E5',
    backgroundColor: '#E2E3E5',
    borderWidth: 2,
    borderRadius: 50,
    fontSize: 18,
    paddingHorizontal: '5%',
    padding: '1%'
  },
  loginButtonRow: {
    width: '100%',
    justifyContent: 'center', 
    alignItems: 'center',
    marginVertical: 20,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F4C2C2',
    width: '100%', 
    paddingVertical: 10,
    borderRadius: 10,
  },
  buttonText: {
    fontFamily: 'AlegreyaSansSC_400Regular',
    color: 'black',
    fontSize: 20,
  }
});
