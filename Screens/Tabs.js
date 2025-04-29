//import Libraries
import { StyleSheet, Text, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Octicons';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';

//Screens 
import Home from './Home';
import History from './History';

//create Components 
const Tab = createBottomTabNavigator();
export default function Tabs() {
  return (
  <Tab.Navigator 
  screenOptions={{
    tabBarShowLabel:false,
    tabBarStyle:{
        position:"absolute",
        bottom:verticalScale(25),
        marginHorizontal:scale(20),
        height:verticalScale(85),
        elevation:0,
        borderRadius:15,
        backgroundColor:"#fff",
        ...styles.shadow
    }
  }}>
    <Tab.Screen name='Home' component={Home} options={{headerShown:false,tabBarIcon:({focused})=>(
        <View style={styles.TabBarIconsView}>
            <Icon name="home" size={moderateScale(30)} color={focused ? '#5F3DD0' : '#000'} />
            <Text style={{ color: focused ? '#5F3DD0' : '#000' }}>HOME</Text>
        </View>
    )}} />
    <Tab.Screen name='History' component={History} options={{headerShown:false,tabBarIcon:({focused})=>(
        <View style={styles.TabBarIconsView}>
            <Icon name="history" size={moderateScale(30)} color={focused ? '#5F3DD0' : '#000'} />
            <Text style={{ color: focused ? '#5F3DD0' : '#000' }}>HISTORY</Text>
        </View>
    )}} />

    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  TabBarIconsView:{
    width:scale(70),
    alignItems:"center",
    justifyContent:"center",
    top:verticalScale(25)
},
  shadow:{
    shadowColor:"#7F5DF0",
    shadowOpacity:0.25,
    shadowRadius:3.5,
    elevation:5,
    shadowOffset:{
        height:10,
        width:0
    },
  }
});
