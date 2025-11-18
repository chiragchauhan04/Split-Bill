import React, { useState } from 'react'
import { Image, Pressable, StyleSheet, Text, TextInput, View } from 'react-native'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'
import { moderateScale, scale, verticalScale } from 'react-native-size-matters'

const AddExpensePage = (props) => {
    const [description, setDescription] = useState('')
    const [amount, setAmount] = useState()
    return (
        <SafeAreaProvider>
            <SafeAreaView style={{ flex: 1 }}>
                <View style={styles.container}>
                    <View style={styles.card}>
                        <View style={styles.containerRow}>
                            <Image source={require('../assets/images/description.png')} style={styles.icons} />
                            <TextInput placeholder='Enter a description' value={description} onChangeText={(text)=>setDescription(text)} style={styles.input}></TextInput>
                        </View>
                        <View style={styles.containerRow}>
                            <Image source={require('../assets/images/dollar.png')} style={styles.icons} />
                            <TextInput placeholder='0.00' value={amount} onChangeText={(text)=>setAmount(text)} keyboardType='numeric' style={styles.input}></TextInput>
                        </View>
                        <View style={styles.btnContainer}>
                            <Text>Paid by </Text>
                            <Pressable><Text style={styles.btns}>you</Text></Pressable>
                            <Text> and split </Text>
                            <Pressable><Text style={styles.btns}>equally</Text></Pressable>
                        </View>
                        <Pressable>
                            <Text style={styles.btnDone}>Done</Text>
                        </Pressable>
                    </View>
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
    }
})
export default AddExpensePage