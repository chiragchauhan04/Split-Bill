import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { ActivityIndicator, BackHandler, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context"
import { moderateScale, scale, verticalScale } from "react-native-size-matters";
import { groupContext } from "../providers/groupContext";

const EditGroupDetailPage = (props) => {
    const { callGroupApi } = useContext(groupContext)
    const [data, setData] = useState(null);
    const [loader, setLoader] = useState(true);
    const [type, setType] = useState('')
    const [groupName, setGroupName] = useState('')
    const [groupId, setGroupId] = useState('')
    const [token, setToken] = useState('')
    const getGroupDetail = async () => {
        const groupId = await AsyncStorage.getItem("GroupId");
        setGroupId(groupId)
        const token = await AsyncStorage.getItem("Token");
        setToken(token)
        try {
            const res = await axios.get(`https://split-application.onrender.com/api/v1/groups/findone/${groupId}`,
                { headers: { Authorization: `Bearer ${token}` } });
            setData(res.data.data.groupInfo);
            console.log(res.data.data.groupInfo)
            setGroupName(res.data.data.groupInfo.name)
            setType(res.data.data.groupInfo.category)
            setLoader(false);
        } catch (error) {
            console.log(error.response?.data || error.message);
            setLoader(false);
        }
    };

    useEffect(() => {
        getGroupDetail();
    }, []);

    const updateGroupDetail = async () => {
        // console.log(type)
        // console.log(groupName)
        console.log(token)
        const Data = { name: groupName, icon: "🏝️", category: type }
        try {
            const res = await axios.patch(`https://split-application.onrender.com/api/v1/groups/${groupId}/update`, Data, { headers: { Authorization: `Bearer ${token}` } })
            console.log(res)
            if (res) {
                await callGroupApi()
                props.navigation.goBack()
            }
        }
        catch (error) {
            console.log(error)
        }
    }

    return (
        <SafeAreaProvider>
            <SafeAreaView style={{ flex: 1 }}>
                {loader ? (
                    <View style={styles.loaderContainer}>
                        <ActivityIndicator size="large" color="#414141ff" />
                    </View>
                ) : (
                    <View style={styles.container}>
                        <View style={styles.containerRow}>
                            <View>
                                <Text style={styles.iconText}>{data?.icon}</Text>
                            </View>
                            <View style={{ paddingLeft: scale(10), width: "77%" }}>
                                <Text>Group name</Text>
                                <TextInput style={{ borderBottomWidth: moderateScale(2), fontSize: moderateScale(18) }} value={groupName} onChangeText={(text) => setGroupName(text)}></TextInput>
                            </View>
                        </View>
                        <View style={{ marginTop: verticalScale(20) }}>
                            <View style={styles.btnContainer}>
                                <Pressable onPress={() => setType("Trip")} style={[styles.typeBtnWrapper, type === "Trip" && styles.selectedBtn]}><Text style={styles.typeBtn}>Trip</Text></Pressable>
                                <Pressable onPress={() => setType("Home")} style={[styles.typeBtnWrapper, type === "Home" && styles.selectedBtn]}><Text style={styles.typeBtn}>Home</Text></Pressable>
                            </View>
                            <View style={styles.btnContainer}>
                                <Pressable onPress={() => setType("Event")} style={[styles.typeBtnWrapper, type === "Event" && styles.selectedBtn]}><Text style={styles.typeBtn}>Event</Text></Pressable>
                                <Pressable onPress={() => setType("Other")} style={[styles.typeBtnWrapper, type === "Other" && styles.selectedBtn]}><Text style={styles.typeBtn}>Other</Text></Pressable>
                            </View>
                        </View>
                        <Pressable onPress={() => updateGroupDetail()}>
                            <Text style={styles.btnDone}>Done</Text>
                        </Pressable>
                    </View>
                )}
            </SafeAreaView>
        </SafeAreaProvider>
    )
}
const styles = StyleSheet.create({
    container: {
        padding: moderateScale(20)
    },
    loaderContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    iconText: {
        fontSize: moderateScale(50),
        borderWidth: moderateScale(2),
        width: scale(65),
        backgroundColor: "#666",
        borderRadius: moderateScale(5),
    },
    containerRow: {
        flexDirection: "row",
    },
    typeBtnWrapper: {
        borderRadius: moderateScale(15),
    },
    btnContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginVertical: moderateScale(5)
    },
    selectedBtn: {
        backgroundColor: '#4bbb179a',
    },
    typeBtn: {
        borderWidth: moderateScale(2),
        width: scale(145),
        height: verticalScale(40),
        borderRadius: moderateScale(13),
        textAlign: "center",
        verticalAlign: "middle",
        fontSize: moderateScale(18),
        fontWeight: "bold"
    },
    btnDone: {
        borderWidth: 2,
        textAlign: "center",
        width: scale(200),
        padding: moderateScale(8),
        borderRadius: moderateScale(10),
        alignSelf: "center",
        marginTop: verticalScale(30),
        backgroundColor: "#4bbb179a",
        borderColor: "#4bbb179a",
        color: "#fff",
        fontSize: moderateScale(18)
    }
})
export default EditGroupDetailPage;