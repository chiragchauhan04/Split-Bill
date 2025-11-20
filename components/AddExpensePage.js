import React, { useContext, useEffect, useMemo, useState } from 'react'
import { Image, Modal, Pressable, StyleSheet, Text, TextInput, View } from 'react-native'
import { AdvancedCheckbox } from 'react-native-advanced-checkbox';
import RadioGroup from 'react-native-radio-buttons-group';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'
import { moderateScale, scale, verticalScale } from 'react-native-size-matters'
import { groupContext } from '../providers/groupContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const AddExpensePage = (props) => {
    let userId, token;
    const [description, setDescription] = useState('')
    const [amount, setAmount] = useState();
    const [optionModalVisible, setOptionModalVisible] = useState(false)
    const [checkboxModalVisible, setCheckboxModalVisible] = useState(false)
    const [selectedId, setSelectedId] = useState();
    const [checkedMembers, setCheckedMembers] = useState({});

    const { list, loader, getOneGroupDetail } = useContext(groupContext)

    const userIdToken = async () => {
        userId = await AsyncStorage.getItem('UserId')
        setSelectedId(userId)
        console.log(userId)
        token = await AsyncStorage.getItem('Token')
        console.log(token)
    }
    useEffect(() => {
        userIdToken()
        getOneGroupDetail()
    }, [])

    const radioButtons = useMemo(() => (
        list?.members?.map(item => ({
            id: item._id,
            label: item.name,
            value: item._id
        }))), [list]);

    useEffect(() => {

        if (list?.members) {
            const initialState = {};
            list.members.forEach(m => initialState[m._id] = true);
            setCheckedMembers(initialState);
        }
    }, [list]);

    const toggleCheckbox = (id) => {
        setCheckedMembers(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    const AddExpenseApi = async () => {
        const uncheckedIds = Object.keys(checkedMembers)
            .filter(id => checkedMembers[id] === false);
        console.log("Unchecked IDs:", uncheckedIds);
        // console.log("radio", selectedId)
        // console.log("check", checkedMembers)
        const data = { description, amount, "paidBy": selectedId, "excludedMembers": [uncheckedIds] }
        try {
            const res = await axios.create(`https://split-application.onrender.com/api/v1/groups/${groupId}/expenses`,data,)
        }
        catch (error) {
            console.log(error)
        }
    }

    return (
        <SafeAreaProvider>
            <SafeAreaView style={{ flex: 1 }}>
                <View style={styles.container}>
                    <View style={styles.card}>
                        <View style={styles.containerRow}>
                            <Image source={require('../assets/images/description.png')} style={styles.icons} />
                            <TextInput placeholder='Enter a description' value={description} onChangeText={(text) => setDescription(text)} style={styles.input}></TextInput>
                        </View>
                        <View style={styles.containerRow}>
                            <Image source={require('../assets/images/dollar.png')} style={styles.icons} />
                            <TextInput placeholder='0.00' value={amount} onChangeText={(text) => setAmount(text)} keyboardType='numeric' style={styles.input}></TextInput>
                        </View>
                        <View style={styles.btnContainer}>
                            <Text>Paid by </Text>
                            <Pressable onPress={() => setOptionModalVisible(true)}><Text style={styles.btns}>you</Text></Pressable>
                            <Text> and split </Text>
                            <Pressable onPress={() => setCheckboxModalVisible(true)}><Text style={styles.btns}>equally</Text></Pressable>
                        </View>
                        <Pressable onPress={() => AddExpenseApi()}>
                            <Text style={styles.btnDone}>Done</Text>
                        </Pressable>
                    </View>
                    <Modal transparent={true} animationType='slide' visible={optionModalVisible}>
                        <View style={styles.modalRadio}>
                            <View style={styles.radio}>
                                <Pressable onPress={() => setOptionModalVisible(false)}><Text style={styles.cancelModal}>X</Text></Pressable>
                                <RadioGroup radioButtons={radioButtons} onPress={setSelectedId} selectedId={selectedId}
                                    containerStyle={{
                                        justifyContent: "space-between",
                                        alignItems: "center"
                                    }}
                                    labelStyle={{
                                        // flex: 1,
                                        fontSize: moderateScale(16)
                                    }} />
                            </View>
                        </View>
                    </Modal>
                    <Modal transparent={true} animationType='slide' visible={checkboxModalVisible}>
                        <View style={styles.modalRadio}>
                            <View style={styles.radio}>
                                <Pressable onPress={() => setCheckboxModalVisible(false)}><Text style={styles.cancelModal}>X</Text></Pressable>
                                {
                                    list?.members?.map((item, index) => (
                                        <AdvancedCheckbox key={item._id} value={checkedMembers[item._id]} onValueChange={() => toggleCheckbox(item._id)} label={item.name} checkedColor="#007AFF" uncheckedColor="#ccc" size={24} />
                                    ))
                                }
                            </View>
                        </View>
                    </Modal>
                </View>
            </SafeAreaView>
        </SafeAreaProvider>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: moderateScale(20),
    },
    containerRow: {
        flexDirection: "row"
    },
    card: {
        borderWidth: moderateScale(2),
        padding: moderateScale(5),
        borderRadius: moderateScale(10),
        backgroundColor: "rgba(221, 213, 213, 0.5)",
    },
    icons: {
        width: scale(40),
        height: verticalScale(40),
        borderWidth: moderateScale(2),
        marginBottom: moderateScale(10),
        backgroundColor: "#fff",
    },
    input: {
        borderBottomWidth: moderateScale(2),
        width: "85%",
        marginLeft: moderateScale(6),
        marginBottom: moderateScale(10)
    },
    btnContainer: {
        flexDirection: "row",
        alignSelf: "center",
        marginTop: moderateScale(20),
    },
    btnDone: {
        marginTop: moderateScale(40),
        marginBottom: moderateScale(60),
        borderWidth: moderateScale(2),
        textAlign: "center",
        alignSelf: "center",
        width: scale(130),
        fontSize: moderateScale(17),
        fontWeight: "600",
        backgroundColor: "skyblue",
        borderRadius: moderateScale(5),
        padding: moderateScale(10),
    },
    btns: {
        borderWidth: moderateScale(1.5),
        padding: moderateScale(2),
        marginTop: moderateScale(-2.6),
        borderRadius: moderateScale(3),
        backgroundColor: "#ffffffff"
    },
    cancelModal: {
        position: 'absolute',
        top: moderateScale(-90),
        right: moderateScale(-80),
        color: "red",
        fontSize: moderateScale(30),
        width: moderateScale(24),

    },
    modalRadio: {
        flex: 1,
        backgroundColor: "rgba(90, 86, 86, 0.5)",  // dim background
        justifyContent: "center",
        alignItems: "center"
    },
    radio: {
        backgroundColor: "#ffffffff",
        margin: moderateScale(20),
        borderRadius: 10,
        padding: moderateScale(90)
    }
})
export default AddExpensePage