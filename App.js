import  React,{useEffect, useState} from 'react';
import { NavigationContainer} from '@react-navigation/native';
import mobileAds from 'react-native-google-mobile-ads';

import AuthNavigator from './src/navigations/AuthNavigator';
import DrawerNavigator from './src/navigations/DrawerNavigator';
import { AuthProvider} from './src/context/AuthProvider';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import 'expo-dev-client';
import 'react-native-gesture-handler'
import messaging from '@react-native-firebase/messaging';
import instance from './src/config/instance';
import { StyleSheet } from 'react-native';
import { COLORS } from './src/constants';
import { Platform } from 'react-native';

// mobileAds()
//   .setRequestConfiguration({
//     // An array of test device IDs to add to the allow list.
//     testDeviceIdentifiers: ['1b3d94db-2260-48aa-8776-2abf866e5c37', 'OnePlus'],
//   })
//   .then(() => {
//     // Request config successfully set!
//   });
mobileAds()
  .initialize()
  .then(adapterStatuses => {
    // Initialization complete!
  });


export default function App() {

   const [isAuthenticated,setIsAuthenticated] = useState(true);
   

   const requestUserPermission = async ()=>{
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('Authorization status:', authStatus);
    }
   }

   useEffect(() => {
    


    const checkToken = async () => {
      try {
       await AsyncStorage.clear();
        const token = await AsyncStorage.getItem('token');
        //console.log(token)
        if (token) {
          setIsAuthenticated(false);
        }
       // setIsLoading(false);
      } catch (error) {
        console.error(error);
      }
    };
    checkToken();


    if(requestUserPermission()){
      messaging().getToken().then(token=>{
        instance.post('tokenNotif/send',{
          "token": token
        }).then((reponse)=>{
        })
        console.log(token+" ---");

      })
    }else{
      console.log('Failed token status',authStatus);
    }

    messaging()
      .getInitialNotification()
      .then(async remoteMessage => {
        if (remoteMessage) {
          console.log(
            'Notification caused app to open from quit state:',
            remoteMessage.notification,
          );

        }

      });


      messaging().onNotificationOpenedApp(async (remoteMessage) => {
        console.log(
          'Notification caused app to open from background state:',
          remoteMessage.notification,
        );
        // navigation.navigate(Message.data.tremoteype);
      });
  
          // Register background handler
    messaging().setBackgroundMessageHandler(async remoteMessage => {
      console.log('Message handled in the background!', remoteMessage);
    });

    const unsubscribe = messaging().onMessage(async remoteMessage => {
    //  Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
    });

    return unsubscribe;

  }, []);


  return (
    
      <NavigationContainer>
        {/* { isAuthenticated ? (<AuthNavigator />) : (<DrawerNavigator />) }  */}
        <BottomSheetModalProvider>
        {/* <KeyboardAvoidingView behavior="padding" enabled> */}
        <AuthProvider>
          {isAuthenticated ? (<AuthNavigator />):(
            <>
           
              <DrawerNavigator />
             
            
            </>
          )}
          </AuthProvider>
          {/* </KeyboardAvoidingView> */}
         </BottomSheetModalProvider>
      </NavigationContainer>
   
  );
} 


const styles = StyleSheet.create({
footer:{
  position:'absolute',
  width:Platform.OS==='ios' ?"94.5%" : "100%",
  backgroundColor:COLORS.white,
  bottom: Platform.OS==='ios' ?  30:0,
  height:Platform.OS==='ios' ?10:40,
  borderRadius:20,
  right: Platform.OS==='ios' ? 10 : 0,
  left: Platform.OS==='ios' ? 10 : 0,

}
});
