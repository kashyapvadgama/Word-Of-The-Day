//import Libraries
import React, { useEffect, useState } from "react";
import { View,Text,StyleSheet, TouchableOpacity, SectionList, Alert } from "react-native";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useIsFocused } from "@react-navigation/native";


//create components
const History = ()=>{
      const [sections, setSections] = useState([]);
      const isFocused = useIsFocused();
    
      useEffect(() => {
        loadHistory();
      }, [isFocused]);
      
      const loadHistory = async()=>{
        try{
            const data = await AsyncStorage.getItem("wordHistory");
            if(data){
                const parsed = JSON.parse(data);
                const grouped = groupByDate(parsed);
                setSections(grouped);
            }
        }catch(error){
            console.log(error);
        }
      };

    //this function helps to 
    const groupByDate = (data)=>{
        const grouped = {};
        data.forEach((item) => {
            if(!grouped[item.date]){
                grouped[item.date] = [];
            }
        grouped[item.date].push(item);
    });
    return Object.keys(grouped)
        .sort((a, b) => new Date(b) - new Date(a))
        .map((date) => ({
            title: date,
            data: grouped[date],
        }));
    }

    const clearHistory = () => {
        Alert.alert("Clear History", "Are you sure you want to clear all history?", [
          { text: "Cancel", style: "cancel" },
          {
            text: "CLEAR",
            style: "destructive",
            onPress: async () => {
              await AsyncStorage.removeItem("wordHistory");
              setSections([]);
            },
          },
        ]);
      };

    const renderSectionHeader = ({ section: { title } }) => (
        <Text style={styles.dateHeader}>{title}</Text>
    );

    const renderItem = ({ item }) => (
    <View style={styles.wordCard}>
        <Text style={styles.word}>{item.word}</Text>
        <Text style={styles.detail}><Text style={styles.bold}>Definition:</Text> {item.definition}</Text>
        <Text style={styles.detail}><Text style={styles.bold}>Example:</Text> {item.example}</Text>
    </View>
    );


return(
    <View style={styles.container}>
        <View style={styles.header}>
            <Text style={styles.headingStyle}>History</Text>
        </View>
        <View style={styles.body}>
            {sections.length === 0 ? (
                <Text style={styles.noData}>No words viewed yet.</Text>
            ) : (
            <SectionList
              sections={sections}
              keyExtractor={(item, index) => index.toString()}
              renderSectionHeader={renderSectionHeader}
              renderItem={renderItem}
              contentContainerStyle={{ paddingBottom: 120 }}
              ListHeaderComponent={
                <View style={styles.topRow}>
                  <Text style={styles.subHeading}>Recent Words</Text>
                  <TouchableOpacity onPress={clearHistory}>
                    <Text style={styles.clearText}>CLEAR</Text>
                  </TouchableOpacity>
                </View>
              }
            />
            )}
        </View>
    </View>
)
}
const styles = StyleSheet.create({
    container: { flex: 1 },
    header: {
      flex: 1,
      backgroundColor: "#5F3DD0",
      justifyContent: "center",
    },
    headingStyle: {
      fontSize: moderateScale(30),
      color: "#fff",
      textAlign: "center",
      padding: scale(10),
    },
    body: { 
        flex: 10, 
        paddingHorizontal: scale(20)
    },
    topRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      paddingTop: verticalScale(10),
    },
    subHeading: {
      fontSize: moderateScale(20),
      color: "grey",
    },
    clearText: {
      fontSize: moderateScale(20),
      color: "grey",
    },
    wordCard: {
      backgroundColor: "#E7E1FB",
      borderRadius: scale(10),
      padding: scale(10),
      marginVertical: verticalScale(5),
    },
    word: {
      fontSize: moderateScale(22),
      fontWeight: "bold",
      color: "#000",
    },
    detail: {
      fontSize: moderateScale(16),
      color: "#333",
      marginTop: verticalScale(4),
    },
    bold: {
      fontWeight: "bold",
    },
    dateHeader: {
      textAlign:"center",
      padding: scale(8),
      borderRadius: scale(5),
      fontWeight: "bold",
      fontSize: moderateScale(16),
      marginTop: verticalScale(10),
      color: "#333",
    },
    noData: {
      textAlign: "center",
      marginTop: verticalScale(20),
      fontSize: moderateScale(16),
      color: "grey",
    },
  });
//make components available for other 
export default History
