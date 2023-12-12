import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, FlatList } from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import { COLORS } from '../../constants';
import { useNavigation } from '@react-navigation/native';

const ParieEncours = ({mesgrids}) => {
  const [expanded, setExpanded] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const navigation = useNavigation();

  const handlePress = (numero_grid,numero_match,categorie_match,username,etat) => {
   
    let gains = ''
    console.log(etat)
    if(etat == 'Gains Potentiel 500 ER' || etat == 'Gains Potentiels 500 ER'){
      gains = '500 ER';
    }
    if(etat == 'Gains Potentiel 100 000 ER' || etat == 'Gains Potentiels 100 000 ER'){
      gains = '100 000 ER';
    }
    if(etat == 'Gains Potentiel 5 000 ER ' || etat == 'Gains Potentiels 5 000 ER '){
      gains = '5 000 ER';
    }
    if(etat == 'Gains Potentiel 10 000 ER ' || etat == 'Gains Potentiels 10 000 ER '){
      gains = '10 000 ER';
    }

    navigation.navigate('ConsulterMesGrilles',{numero_grid,numero_match,categorie_match,username,customTitle:categorie_match+" - "+gains});

  }


  const renderItem = item => {
    return (
        <TouchableOpacity key={item.numero_grid}  style={styles.container}
        onPress={() => {handlePress(item.numero_grid,item.numero_match,item.categorie_match,item.username,item.etat)}}
        >
          

          <View style={{...styles.containerRow, fontSize: 40}}> 
          <Text style={{...styles.text, fontSize: 20,color:COLORS.white,backgroundColor:COLORS.green,  borderBottomLeftRadius: 10,borderBottomRightRadius: 10}}>  {item.etat} </Text>
          </View>
        <View style={styles.containerRow}> 
        <Text style={styles.text}> N° </Text>
        <Text style={styles.text}> {item.numero_grid} </Text>
        <Text style={styles.text}>  --- </Text>
        <Text style={styles.text}> {item.categorie_match} </Text>
        <Text style={styles.text}>  --- </Text>
        <Text style={styles.text}> {item.numero_match} </Text>
        <Icon name='caretright' size={18} color={COLORS.green} style={styles.icon} />
        
        </View>
        <View style={styles.containerRow}> 
          <Text style={styles.text}>  {item.date_create} </Text>
          </View>

      </TouchableOpacity>
    );
  };

  return (
    <FlatList
          data={mesgrids}
          renderItem={({ item,index }) => (
            renderItem(item)
          )}
          keyExtractor={item => item.numero_grid}
        />
  )
}



const styles = StyleSheet.create({
  container: {
      width:330,
        height:80,
        backgroundColor: '#FFFFFF',
        shadowColor: 'rgba(154, 154, 154, 0.25)',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 1,
        shadowRadius: 10,
        borderRadius: 10,
        marginVertical:5,
     
      },
      containerRow:{
        flexDirection: 'row',
        alignItems:'center',
        justifyContent:'center',
        marginLeft:-10,
        marginTop:0,
        //alignItems: 'center',
      },
      text:{
          fontWeight: '600',
          fontSize: 18,
          lineHeight: 25,
          textAlign: 'center',
      },
      icon:{
        marginLeft:15
      }
});
export default ParieEncours