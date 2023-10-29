import { View} from 'react-native'
import React from 'react'
import { BannerAd, BannerAdSize, TestIds} from 'react-native-google-mobile-ads';



const adUnitId = __DEV__ ? TestIds.BANNER :  'ca-app-pub-6300362813805470/1721004768';

const BannerAdmob = () => {
  return (
    <View  style={{ position:'relative',left:"-15%", width:"50%"}}>
    <BannerAd
      unitId={adUnitId}
      size={BannerAdSize.ADAPTIVE_BANNER}
    
    />
    </View>
  )
}

export default BannerAdmob