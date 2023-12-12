import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, Text, TouchableOpacity } from 'react-native';
import Background from '../../components/Background';
import Match from '../../components/Match';
import Scores from '../../components/Scores';
import { COLORS, ROUTES } from '../../constants';
import path from '../../assets/onboarding3.png'
import AsyncStorage from '@react-native-async-storage/async-storage';
import axiosInstance from '../../config/instance';
import { useAuth } from '../../context/AuthProvider';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Switch2 from '../../components/Switch2';
import { InterstitialAd, AdEventType, TestIds, InterstitialAdManager } from 'react-native-google-mobile-ads';

const adUnitId = __DEV__ ? TestIds.INTERSTITIAL : 'ca-app-pub-6300362813805470/6769819291';
const adsList=[0,1,2,3]
const ads=[]
adsList.forEach(()=>ads.push(InterstitialAd.createForAdRequest(adUnitId, {
  requestNonPersonalizedAdsOnly: true,
})));


const GameStage4 = ({route}) => {
  const [selectedIndex, setSelectedIndex] = useState(true);
  const [matchs,setMatchs] = useState(null);
  const [token,setToken] = useState(null);
  const { scores, setScores,username } = useAuth();
  const [adsCount, setAdsCount] = useState(0);

  const [disableButton ,setDisableButton] = useState(true);
  const { typeGame } = route.params;
  const navigation = useNavigation();
  useEffect(() => {

    // Start loading the interstitial straight away
    ads.forEach(ad => ad.load());

    // Unsubscribe from events on unmount
  }, []);
   
  ads.forEach( (ad, index)=> {
    ad.addAdEventListener(AdEventType.CLOSED, () => {
      if(index<3){
        ads[index+1].show();
      }
    });
  });

  useEffect(() => {



    const checkToken = async () => {
      try {
       // await AsyncStorage.clear();
        let gettoken = await AsyncStorage.getItem('token');
        let getusername = await AsyncStorage.getItem('username');
       // console.log(gettoken)
        if (gettoken) {

          setToken(gettoken);
          

        }
       // setIsLoading(false);
      } catch (error) {
        console.error(error);
      }
    };
    checkToken();

    const fetchData = async () => {
       
      try {
        const response = await axiosInstance.get(`match/matchs/${typeGame}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          
        });
        console.log(response.data);
        setMatchs(response.data);
      } catch (error) {
      //  console.error(error);
      }
    };
    fetchData();
    setDisableButton(true);
  }, [token]);

  const handleResultUpdate = async (id, newResult) => {
    const updatedMatchs = await matchs.map(match => {
      if (match.id === id) {
        return { ...match, resultat: newResult,etat:"Gains Potentiels 100 000 ER" };
      }
      return match;
    });
    setMatchs(updatedMatchs);
  };


  const handleUpdate = ( updatedValue, key) => {
    const updatedData = matchs.map(item => {
      
        return { ...item, [key]: updatedValue };
      
     
    });
    console.log(updatedData)
    setMatchs(updatedData);
  };

      const handlePress = async () => {
       
        handleUpdate(username,'username')
       
        let validation = true;
          
        
        for (let i = 0; i < matchs.length; i++) {
          const item = matchs[i];
          if (item.resultat == null || item.resultat === '') {
            Alert.alert('Il faut compléter l\'ensemble de la grille !!');
            validation = false;
            break; // Exit the loop
          }
        }
        if(validation){
          let newScore = scores-1000;
          console.log("New Scores : "+newScore);
          setScores(newScore);
          try {
            const response = await axiosInstance.post('/mesgrid/mesgrids/1000/'+username, matchs, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
            //console.log(response.data);

            Alert.alert('Accepté !');
            ads[0].show();
            setAdsCount(adsCount+1);
            //navigation.goBack();
            navigation.navigate(ROUTES.HOME);
          } catch (error) {
            console.error(error);
          }
          setDisableButton(false);
        }
        



        
      };
  return (

    <Background  path={path}>
      <Scores scores={scores}/>
      <View style={styles.container}>
          <Switch2 typeGame={typeGame} resultat="Résultat" />
        
          <FlatList
          data={matchs}
          renderItem={({ item,index }) => (
            <Match key={item.id} number={item.id} equipe1={item.equipe1}  equipe2={item.equipe2} resultat={item.resultat} 
            onResultUpdate={newResult => handleResultUpdate(item.id, newResult)}
            />
          )}
          keyExtractor={item => item.id}
        />
      </View>
      {disableButton && (
        <View style={{alignItems:'center'}} >
            <TouchableOpacity style={styles.containerbtn}
            onPress={handlePress}
            >  
              <Text style={styles.text2}>Jouer</Text>
            </TouchableOpacity>
          </View> 
      )}
      
    </Background>
  );
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    backgroundColor: 'rgba(3, 3, 3, 0.4)',
    shadowColor: 'rgba(3, 3, 3, 0.25)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 4,
    borderRadius: 15,
    flexDirection: 'column',
    alignItems: 'center',
    padding: 20,
    paddingTop: 6,
    paddingBottom: 10,
    margin:10,
    marginBottom:Platform.OS === 'android' ? 30:40
  },
  containerSwitch:{
    width: 340,
    height: 60,
    backgroundColor: '#F2F8FF',
    borderRadius: 20,
    flexDirection:'row',
    justifyContent:'center',
    marginVertical:10,
   
  },
  button: {
    marginVertical:10,
    marginHorizontal:10,
    width: 151,
    height: 38,
   // margin:10,
    justifyContent:'center',
    backgroundColor: '#FF793F',
    borderRadius: 20,
  },
  text: {
    fontSize: 22,
    textAlign: 'center',
    fontWeight:'bold'
    //padding: 12,
   // color: 'white'
  },
  containerbtn:{
    //flex:1,
    zIndex:2, 
    marginBottom:Platform.OS === 'android' ? 30:40,
    // bottom:Platform.OS === 'android' ? 80:0,
     width: 283,
     height: 50,
     backgroundColor: COLORS.green,
     borderRadius: 56,
     alignItems: 'center',
     justifyContent: 'center',
     shadowOffset: { width: 0, height: 2 },
     shadowOpacity: 0.8,
     shadowRadius: 3,
    //  elevation: 3,
 },
 text2: {
     color: '#fff',
     fontWeight: 'bold',
     fontSize: 35,
   },
});

export default GameStage4;
