import AsyncStorage from "@react-native-async-storage/async-storage"
import axios from "axios";
import { useContext, useEffect, useState } from "react"
import { ActivityIndicator, Image, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context"
import { moderateScale, scale, verticalScale } from "react-native-size-matters";
import { groupContext } from "../providers/groupContext";

const GroupDetailPage = (props) => {
    const {list,loader,getOneGroupDetail} = useContext(groupContext)
    // const [list, setList] = useState()
    // const [loader, setLoader] = useState(true)

    useEffect(() => {
        getOneGroupDetail()
    }, [])
    return (
        <SafeAreaProvider>
            <SafeAreaView style={{ flex: 1, }}>
                {loader ?
                    <View style={styles.loaderContainer}>
                        <ActivityIndicator size="large" color="#414141ff" />
                    </View> :
                    <View>
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
        height: '45%',
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
    
})
export default GroupDetailPage;