import AsyncStorage from "@react-native-async-storage/async-storage"
import axios from "axios";
import { useContext, useEffect, useState } from "react"
import { ActivityIndicator, Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context"
import { moderateScale, scale, verticalScale } from "react-native-size-matters";
import { groupContext } from "../providers/groupContext";

const GroupDetailPage = (props) => {
    const [history, setHistory] = useState([])
    const { list, loader, getOneGroupDetail } = useContext(groupContext)

    useEffect(() => {
        getOneGroupDetail()
        expenseHistoryApi()
    }, [])

    const expenseHistoryApi = async () => {
        const groupId = await AsyncStorage.getItem('GroupId');
        const token = await AsyncStorage.getItem('Token');
        try {
            const res = await axios.get(`https://split-application.onrender.com/api/v1/groups/${groupId}/expesne-history`, { headers: { Authorization: `Bearer ${token}` } })
            console.log("history=>", res.data.data)
            setHistory(res.data.data)
        }
        catch (error) {
            console.log(error)
        }
    }
    const formattedDate = (date) => {
        const fdate = new Date(date);
        const formatted = fdate.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
        });

        // console.log(formatted);
        return formatted;
    }
    return (
        <SafeAreaProvider>
            <SafeAreaView style={{ flex: 1, }}>
                {loader ?
                    <View style={styles.loaderContainer}>
                        <ActivityIndicator size="large" color="#414141ff" />
                    </View> :
                    <View style={{ flex: 1 }}>
                        <ScrollView>
                            <View style={styles.topBackground}>
                                <Pressable onPress={() => props.navigation.navigate('Settings')}>
                                    <Image source={require('../assets/images/settings.png')} style={styles.settingIcon}></Image>
                                </Pressable>
                            </View>
                            <View style={styles.container}>
                                <View style={styles.contentContainer}>
                                    <Text style={styles.img}>{list.icon}</Text>
                                    <Text style={styles.groupNameTxt}>{list.name}</Text>
                                </View>
                            </View>
                            <View style={styles.historyContainer}>
                                {
                                    history.map((item, index) => (
                                        <View key={index} style={{ borderWidth: 2, marginBottom: 6, flexDirection: "row" }}>
                                            <Text style={{ width: 40, borderWidth: 2 }}>{formattedDate(item.createdAt)}</Text>
                                            <View style={{ flexDirection: "column" }}>
                                                <Text>{item.description}</Text>
                                                <Text>paid by {item.paidBy} {item.youPaid}</Text>
                                                <View>
                                                    {
                                                        item.youBorrowed ? <Text>you Borrowed {item.youBorrowed}</Text> :
                                                            <Text>you Lent {item.youLent}</Text>
                                                    }
                                                </View>
                                            </View>
                                        </View>
                                    ))
                                }
                            </View>
                        </ScrollView>
                        <Pressable onPress={() => props.navigation.navigate("AddExpense")}>
                            <Text style={styles.addExpenseBtn}>Add expense</Text>
                        </Pressable>
                    </View>
                }
            </SafeAreaView>
        </SafeAreaProvider >
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: moderateScale(10),
    },
    contentContainer: {
        marginTop: verticalScale(-40),
        flexDirection: "row",
    },
    topBackground: {
        backgroundColor: '#33333360',
        width: '100%',
        height: moderateScale(130),
    },
    settingIcon: {
        width: scale(25),
        height: verticalScale(25),
        alignSelf: "flex-end",
        margin: moderateScale(10),
    },
    img: {
        fontSize: moderateScale(80),
        borderWidth: moderateScale(2),
        width: scale(102),
        borderRadius: moderateScale(5),
        backgroundColor: "#fff",

    },
    groupNameTxt: {
        paddingLeft: scale(5),
        fontSize: moderateScale(30),
        verticalAlign: "middle",
        fontWeight: "bold",
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
    addExpenseBtn: {
        position: "absolute",
        bottom: moderateScale(50),
        right: moderateScale(20),
        paddingVertical: moderateScale(10),
        paddingHorizontal: moderateScale(16),
        backgroundColor: "skyblue",
        borderRadius: moderateScale(6),
        borderWidth: moderateScale(2),
        zIndex: 999,
        elevation: 10,   // for Android
    },
    historyContainer: {
        padding: moderateScale(10)
    }

})
export default GroupDetailPage;