import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { ActivityIndicator, Image, Modal, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context"
import { moderateScale, scale, verticalScale } from "react-native-size-matters";
import { groupContext } from "../providers/groupContext";

const HomePage = (props) => {
    const [name, setName] = useState('')
    const { loader, groupDetail, callGroupApi } = useContext(groupContext)

    useEffect(() => {
        callGroupApi()
        getUserDetail()
    }, [])
    const groupDetailFun = async (item) => {
        console.log(item._id)
        AsyncStorage.setItem('GroupId', item._id)
            .then((res) => {
                console.log("GroupId stored")
                props.navigation.navigate('GroupDetail')
            })
            .catch((error) => {
                console.log(error)
            })
    }

    const getUserDetail = async () => {
        const Name = await AsyncStorage.getItem('UserName')
        setName(Name)
    }
    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.container}>
                {
                    loader ?
                        <View style={styles.loaderContainer}>
                            <ActivityIndicator size="large" color="#414141ff" />
                        </View> :
                        <View>
                            <Pressable onPress={() => props.navigation.navigate("CreateGroup")}>
                                <Image source={require('../assets/images/add-group.png')} style={styles.img}></Image>
                            </Pressable>
                            <Text style={styles.headerTxt}>Welcome to SplitBill, {name}!</Text>
                            <ScrollView>
                                {
                                    groupDetail.length < 0 ?
                                        <View style={styles.secondContainer}>
                                            <Image source={require('../assets/images/unification.png')} style={styles.imgMain} />
                                            <View style={styles.titleBtnContainer}>
                                                <Text style={styles.title}>SplitBill groups you create or are added to will show here.</Text>
                                            </View>
                                        </View> :
                                        groupDetail.map((item, index) => (
                                            <Pressable key={index} style={styles.groupContainer} onPress={() => groupDetailFun(item)}>
                                                <Text style={styles.groupIcon}>{item.icon}</Text>
                                                <Text style={styles.groupName}>{item.name}</Text>
                                            </Pressable>
                                        ))
                                }
                                <View>
                                    <Pressable style={styles.btnParent} onPress={() => props.navigation.navigate("CreateGroup")}>
                                        <Text style={styles.groupBtn}>Start a new group</Text>
                                    </Pressable>
                                </View>
                            </ScrollView>
                        </View>
                }
            </SafeAreaView>
        </SafeAreaProvider>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f4f7f9",
        padding: moderateScale(20),
        borderBottomWidth: moderateScale(1),
    },
    headerTxt: {
        fontSize: moderateScale(20),
        fontWeight: "bold",
        marginBottom: verticalScale(20),
    },
    secondContainer: {
        // flex: 1,
        marginTop: verticalScale(50),
        justifyContent: "center",
        alignItems: "center",
    },
    imgMain: {
        width: scale(150),
        height: verticalScale(150)
    },
    titleBtnContainer: {
        marginTop: verticalScale(25),
    },
    groupBtn: {
        alignSelf: "center",
        fontSize: moderateScale(15),
        borderWidth: moderateScale(2),
        borderRadius: moderateScale(7),
        textAlign: "center",
        width: scale(180),
        paddingVertical: verticalScale(6),
        backgroundColor: "#4bbb179a",
        borderColor: "#4bbb179a",
        color: "#fff",
        marginTop: verticalScale(30)
    },
    btnParent: {
        width: scale(180),
        alignSelf: "center"
    },
    title: {
        // borderWidth:2,
        marginBottom: verticalScale(30),
        textAlign: "center",
        fontSize: moderateScale(17)
    },
    img: {
        width: scale(25),
        height: verticalScale(25),
        alignSelf: "flex-end",
    },
    groupContainer: {
        padding: moderateScale(8),
        flexDirection: "row",
        borderWidth: moderateScale(2),
        borderRadius: moderateScale(10),
        marginVertical: verticalScale(2),
    },
    groupIcon: {
        fontSize: moderateScale(45),
    },
    groupName: {
        verticalAlign: "middle",
        fontSize: moderateScale(20),
        fontWeight: "bold",
        marginLeft: scale(5),
    },
    loaderContainer: {
        position: "absolute",
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        justifyContent: "center",
        alignItems: "center",
    },

})
export default HomePage;