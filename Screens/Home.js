//import Libraries
import axios from "axios";
import React, { useEffect, useState } from "react";
import { View,Text,StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";
import { ScrollView } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';

//create components
const Home = ()=>{
    const [wordData, setWordData] = useState({
        word: "",
        definition: "",
        example: "",
      });
    const [loading, setLoading] = useState(false);
      

    function Greetings(){
      const hour = new Date().getHours();
      if(hour <= 11) return "Good Morning";
      if(hour <= 16) return "Good Afternoon";
      if(hour <= 19) return "Good Evening";
      return "Good Night";
    }
    

    const fetchNewWord = async () => {
        setLoading(true);
        let wordFound = false;
        let randomWord = "";
        let definition = "";
        let example = "";
        let retries = 0;
        const maxRetries = 5;
        while (!wordFound && retries < maxRetries) {
          try {
            const randomWordGenerator = await axios.get("https://random-word-api.vercel.app/api?word");
            randomWord = randomWordGenerator.data[0];
      
            const dictionaryResponse = await axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en/${randomWord}`);
            const dictionaryData = dictionaryResponse.data;
      
            definition = dictionaryData[0]?.meanings[0]?.definitions[0]?.definition || "No definition available";
            example = dictionaryData[0]?.meanings[0]?.definitions[0]?.example || "No example available";
      
            if (definition) {
                wordFound = true;
                const newWordData = {
                  word: randomWord,
                  definition: definition,
                  example: example,
                  date: new Date().toLocaleDateString(),    
                };
                setWordData(newWordData);
                await AsyncStorage.setItem('todayWord', JSON.stringify(newWordData));

                
                try {
                  const existingHistory = await AsyncStorage.getItem('wordHistory');
                  let history = existingHistory ? JSON.parse(existingHistory) : [];
                  history.push(newWordData);
                  await AsyncStorage.setItem('wordHistory', JSON.stringify(history));
                } catch (error) {
                  console.error('Error saving to history:', error);
                }
              }              

          } 
          catch (error) {
            retries++;  
          }
        }
        if (retries === maxRetries) {
            setWordData({
              word: "Error",
              definition: "Unable to fetch word data after multiple attempts.",
              example: "",
            });
          }
      
        setLoading(false);
      };
      const checkTodayWord = async () => {
        try {
          const savedWord = await AsyncStorage.getItem('todayWord');
          if (savedWord) {
            const parsedWord = JSON.parse(savedWord);
            const today = new Date().toLocaleDateString();
            if (parsedWord.date === today) {
              setWordData(parsedWord);
              return; 
            }
          }
          fetchNewWord(); 
        } catch (error) {
          console.error('Error reading todayWord:', error);
          fetchNewWord(); 
        }
      };
      useEffect(() => {
        checkTodayWord();
      }, []);
            
      
return(
    <View style={styles.container}>
        <View style={{flex:1,backgroundColor:"#5F3DD0"}}>
            <Text style={styles.headingStyle}>Word Of The Day</Text>
        </View>
        <View style={{flex:10}}>
        <Text style={styles.greetingStyle}>
            {Greetings()}, Folks!!
        </Text> 
        <View style={styles.WordView}>
        {loading ? (
            <View style={{flex:1,justifyContent:"center",}}>
                <ActivityIndicator size="large" color="#5F3DD0" />
            </View>
                ) : ( <> 
                <ScrollView keyboardShouldPersistTaps="handled">
            <Text style={styles.wordText}>{wordData.word || "Word will appear here"}</Text>
            <Text style={styles.descriptionText}>
            <Text style={styles.boldText}>
            Definition :
            </Text> 
            {wordData.definition || "Definition will appear here"}
            </Text>
            <Text style={styles.descriptionText}>
            <Text style={styles.boldText}>
            Example : 
            </Text> 
              {wordData.example || "Example will appear here"}
            </Text>
            </ScrollView>
            </>
        )}
            <View style={{justifyContent:"center",alignItems:"center"}}>
                <TouchableOpacity style={styles.btnStyle} onPress={fetchNewWord} disabled={loading}>
                    <Text style={styles.btnText}>New Word</Text>
                </TouchableOpacity>
            </View>
        </View>
        </View>
    </View>
)
}
const styles= StyleSheet.create({
    container:{
        flex:1
    },
    headingStyle:{
        fontSize:moderateScale(30),
        color:"#fff",
        padding:scale(10),
        textAlign:"center"
    },
    greetingStyle:{
        fontSize:moderateScale(25),
        color:"#000",
        padding:scale(10)
    },
    WordView:{
        borderRadius:scale(15),
        backgroundColor:"#E7E1FB",
        margin:scale(20),
        height:verticalScale(400),
        padding:scale(10)
    },
    btnStyle:{
        backgroundColor:"#5F3DD0",
        padding:scale(10),
        borderRadius:scale(15)
    },
    btnText:{
        color:"#fff",
        fontSize:moderateScale(20)
    },
    loadingText:{
        justifyContent:"center",
        alignItems:"center",
        fontSize:moderateScale(30),
        textAlign:"center"
    },
    wordText:{
        marginVertical:verticalScale(10),
        fontSize:moderateScale(30)
    },
    descriptionText :{
        marginVertical:verticalScale(10),
        fontSize:moderateScale(20),
        marginBottom:verticalScale(10)
    },
    boldText:{
        fontWeight:"bold",
        fontSize:moderateScale(20),
    }


})
//make components available for other 
export default Home

