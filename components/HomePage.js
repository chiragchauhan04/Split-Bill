import { useState } from "react";
import { Image, Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context"
import { moderateScale, scale, verticalScale } from "react-native-size-matters";

const HomePage = (props) => {
    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.container}>
                <Text style={styles.headerTxt}>Welcome to SplitBill, Name!</Text>
                <View style={styles.secondContainer}>
                    <Image source={require('../assets/images/unification.png')} style={styles.img} />
                    <View style={styles.titleBtnContainer}>
                        <Text style={styles.title}>SplitBill groups you create or are added to will show here.</Text>
                        <Pressable style={styles.btnParent} onPress={() => props.navigation.navigate("CreateGroup")}>
                            <Text style={styles.groupBtn}>Start a new group</Text>
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
        backgroundColor: "#f4f7f9",
        padding: moderateScale(20),
        borderBottomWidth: moderateScale(1),
    },
    headerTxt: {
        fontSize: moderateScale(18),
        fontWeight: "bold",
    },
    secondContainer: {
        // flex: 1,
        marginTop: verticalScale(50),
        justifyContent: "center",
        alignItems: "center",
    },
    img: {
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
        color: "#fff"
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

})
export default HomePage;