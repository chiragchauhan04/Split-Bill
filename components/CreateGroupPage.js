import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useEffect, useState } from "react";
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";

const CreateGroupPage = (props) => {
    const [error, setError] = useState('')
    const [groupName, setGroupName] = useState('');
    const [type, setType] = useState('');

    const createGroup = async () => {
        try {
            const token = await AsyncStorage.getItem('Token');
            if (groupName !== '' && type !== '') {
                const data = { name: groupName, currency: 'INR', category: type, icon: '🏖️' };

                const res = await axios.post('https://split-application.onrender.com/api/v1/groups', data, { headers: { Authorization: `Bearer ${token}` } });
                console.log(res.data);
                // props.navigation.navigate('Home');
                props.navigation.reset({
                    index: 0,
                    routes: [{ name: "Home" }]
                })
            } else {
                if (groupName === '' && type === '') {
                    setError('Group name and type both are required!');
                } else if (groupName === '') {
                    setError('Group name is required!');
                } else if (type === '') {
                    setError('Type is required!');
                } else {
                    setError('');
                }
            }
        } catch (error) {
            console.log(error.response?.data || error.message);
        }
    }
    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.container} >
                <View>
                    <Text style={styles.lableTxt}>Group name</Text>
                    <TextInput style={styles.input} value={groupName} onChangeText={(text) => setGroupName(text)}></TextInput>
                    <Text style={[styles.lableTxt, { marginTop: moderateScale(14), }]}>Type</Text>
                    <View>
                        <View style={styles.btnContainer}>
                            <Pressable onPress={() => setType("Trip")} style={[styles.typeBtnWrapper, type === "Trip" && styles.selectedBtn]}><Text style={styles.typeBtn}>Trip</Text></Pressable>
                            <Pressable onPress={() => setType("Home")} style={[styles.typeBtnWrapper, type === "Home" && styles.selectedBtn]}><Text style={styles.typeBtn}>Home</Text></Pressable>
                        </View>
                        <View style={styles.btnContainer}>
                            <Pressable onPress={() => setType("Event")} style={[styles.typeBtnWrapper, type === "Event" && styles.selectedBtn]}><Text style={styles.typeBtn}>Event</Text></Pressable>
                            <Pressable onPress={() => setType("Other")} style={[styles.typeBtnWrapper, type === "Other" && styles.selectedBtn]}><Text style={styles.typeBtn}>Other</Text></Pressable>
                        </View>
                    </View>
                    {
                        error ? <Text style={styles.error}>{error}</Text> : null
                    }
                    <Pressable onPress={createGroup}>
                        <Text style={styles.btnDone}>Done</Text>
                    </Pressable>
                </View>
            </SafeAreaView>
        </SafeAreaProvider>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f4f7f9",
        // borderWidth: moderateScale(2),
        padding: moderateScale(20),
        borderBottomWidth: moderateScale(1),
    },
    btnContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginVertical: moderateScale(5)
    },
    lableTxt: {
        fontSize: moderateScale(16),
        fontWeight: "bold"
    },
    input: {
        borderBottomWidth: moderateScale(2),
        width: scale(310)
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
        marginTop: moderateScale(30),
        alignSelf: "center",
        width: scale(200),
        height: verticalScale(40),
        borderWidth: moderateScale(2),
        borderRadius: moderateScale(15),
        textAlign: "center",
        verticalAlign: "middle",
        backgroundColor: "#4bbb179a",
        borderColor: "#4bbb179a",
    },
    typeBtnWrapper: {
        borderRadius: moderateScale(15),
    },
    selectedBtn: {
        backgroundColor: '#4bbb179a',
    },
    error: {
        color: "red",
        textAlign: "center",
        marginTop: moderateScale(5),
        fontSize: moderateScale(17)
    },
    img: {
        width: scale(20),
        height: verticalScale(20),
    },
})
export default CreateGroupPage;

