import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, FlatList, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import { COLORS } from '../../constants';
import { useNavigation } from '@react-navigation/native';

const ParieTerminer = ({mesgrids}) => {
  const [expanded, setExpanded] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const navigation = useNavigation();
  const {width} = Dimensions.get('screen');

  const handlePress = (numero_grid,numero_match,categorie_match) => {
   
    navigation.navigate('ConsulterMesGrilles',{"numero_grid":numero_grid,"numero_match":numero_match,"categorie_match":categorie_match,"username":'admin',customTitle:categorie_match});

  }


  const renderItem = item => {
    console.log(item)
    return (
      <TouchableOpacity
        key={item.numero_grid}
        style={styles.container}
        onPress={() => {
          handlePress(item.numero_grid, item.numero_match, item.categorie_match, item.username);
        }}
      >
        <View style={styles.containerRow}>
          {/* <View style={styles.column}>
         
            <Text style={styles.text}>N°{item.numero_grid}</Text>
          </View> */}
          <View style={styles.column1}>
           
            <Text style={styles.text}> {item.categorie_match} </Text>
          </View>
          <View style={styles.column2}>
            
            <Text style={{...styles.text}}>{item.numero_match}</Text>
          </View>
          {/* <Icon name="caretright" size={18} color={COLORS.green} style={styles.icon} /> */}
        </View>
      </TouchableOpacity>
    );
  };
  
  return (
    <FlatList
      data={mesgrids}
      renderItem={({ item, index }) => renderItem(item)}
      keyExtractor={item => item.numero_grid}
    />
  );
  
}



const styles = StyleSheet.create({
  container: {
    width: 300,
    height: 60,
    backgroundColor: '#FFFFFF',
    shadowColor: 'rgba(154, 154, 154, 0.25)',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 10,
    borderRadius: 10,
    marginVertical: 5,
  },
  containerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    // marginLeft: -10,
    marginTop: 8,
  },
  column1: {
    width:300,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    flex: 2,
  },
  column2: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    
    flex: 1,
  },
  text: {
    width:"100%",
    fontWeight: '600',
    fontSize: 18,
    lineHeight: 39,
    textAlign: 'center',
  },
  icon: {
    marginLeft: 15,
  },
});

export default ParieTerminer;
