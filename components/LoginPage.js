import axios from "axios";
import { ActivityIndicator, Image, Pressable, StyleSheet, Text, TextInput, TouchableHighlight, View } from "react-native";
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context"
import { Dropdown } from "react-native-element-dropdown";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const LoginPage = (props) => {
    let userDetail;
    const [email, setEmail] = useState('');
    const [number, setNumber] = useState('');
    const [password, setPassword] = useState('');
    const [value, setValue] = useState('');
    const [loader, setLoader] = useState(false);
    const [error, setError] = useState('');

    const data = [
        { label: 'Select', value: 'select' },
        { label: 'Email Id', value: 'emailId' },
        { label: 'Mobile No', value: 'mobileNo' },
    ]

    useEffect(() => {
        const getToken = async () => {
            const token = await AsyncStorage.getItem("Token")
            if (token) {
                props.navigation.navigate("Home")
            }
        }
        getToken()
    }, [])

    const userLogin = () => {
        // console.log(loginType);
        if (value === "emailId") {
            userDetail = { email: email, password: password }
        } else {
            userDetail = { mo: number, password: password }
        }
        // console.log(userDetail);
        setLoader(true)
        axios.post(`http://split-application.onrender.com/api/user/login`, userDetail)
            .then((res) => {
                console.log(res.data);
                Promise.all([
                    AsyncStorage.setItem("Token", res.data.token),
                    AsyncStorage.setItem("UserId", res.data.user.id.toString()),
                    AsyncStorage.setItem("Email", res.data.user.email),
                    AsyncStorage.setItem("UserName", res.data.user.name),
                ])
                    .then(() => {
                        console.log('token stored successfully');
                        setLoader(false)
                        props.navigation.navigate('Home')
                    })
                    .catch((error) => {
                        console.log('Error:', error);
                    });
            })
            .catch((error) => {
                console.log(error);
                setError("Enter correct email or mobile number and password!")
                setLoader(false)
            })
    }
    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.container}>
                <View style={styles.loginCard}>
                    <Text style={styles.headerText}>Welocme Back!</Text>
                    <View style={styles.labelContainer}>
                        <Image source={require('../assets/images/right.png')} style={styles.img} />
                        <Text style={styles.label}> Login Using: </Text>
                    </View>
                    <View style={styles.labelContainer}>
                        <Dropdown
                            style={styles.dropDown}
                            placeholder="Select"
                            data={data}
                            labelField="label"
                            valueField="value"
                            value={value}
                            onChange={item => {
                                // console.log(item.value)
                                setValue(item.value);
                            }} />
                    </View>
                    <View>
                        {
                            value === "emailId" ? <View>
                                <View style={styles.labelContainer}>
                                    <Image source={require('../assets/images/email.png')} style={styles.img} />
                                    <Text style={styles.label}> Email Id </Text>
                                </View>
                                <TextInput style={styles.input} keyboardType="email-address" value={email} onChangeText={(text) => setEmail(text.toLocaleLowerCase())}></TextInput>
                            </View> : value === "mobileNo" ? <View>
                                <View style={styles.labelContainer}>
                                    <Image source={require('../assets/images/iphone.png')} style={styles.img} />
                                    <Text style={styles.label}> Mobile No </Text>
                                </View>
                                <TextInput style={styles.input} keyboardType="numeric" value={number} onChangeText={(text) => setNumber(text)}></TextInput>
                            </View> : <View>
                                <View style={styles.labelContainer}>
                                    <Image source={require('../assets/images/user.png')} style={styles.img} />
                                    <Text style={styles.label}> User Name </Text>
                                </View>
                                <TextInput style={styles.input} editable={false}></TextInput>
                            </View>
                        }
                    </View>
                    <View>
                        <View style={styles.labelContainer}>
                            <Image source={require('../assets/images/padlock.png')} style={styles.img} />
                            <Text style={styles.label}> Password </Text>
                        </View>
                        <TextInput style={styles.input} value={password} onChangeText={(text) => setPassword(text)}></TextInput>
                    </View>
                    <Text style={styles.errorTxt}>{error}</Text>
                    {
                        loader === true ? <ActivityIndicator size="large"></ActivityIndicator> : null
                    }
                    <Pressable onPress={() => userLogin()}>
                        <View style={[styles.input, styles.logInContainer]}>
                            <Image source={require('../assets/images/log-in.png')} style={styles.img} />
                            <Text style={styles.btnTxt}>Log In</Text>
                        </View>
                    </Pressable>
                    <View style={styles.footerLine}>
                        <Text>Don't have an account? </Text>
                        <Pressable onPress={() => props.navigation.navigate("SignUp")}>
                            <Text style={styles.signUp}>Sign Up</Text>
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
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f4f7f9",
        padding: moderateScale(40),
        borderBottomWidth: moderateScale(1),
    },
    headerText: {
        color: "#203A62",
        fontSize: moderateScale(25),
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: moderateScale(15),
    },
    loginCard: {
        backgroundColor: "#fff",
        padding: moderateScale(25),
        borderRadius: moderateScale(10)
    },
    input: {
        borderWidth: moderateScale(2),
        width: scale(250),
        borderColor: "black",
        borderRadius: moderateScale(6),
        marginVertical: moderateScale(10)
    },
    dropDown: {
        borderWidth: moderateScale(2),
        width: scale(250),
        borderColor: "black",
        borderRadius: moderateScale(6),
        marginVertical: moderateScale(10),
        paddingVertical: verticalScale(8),
        paddingHorizontal: scale(3)
    },
    labelContainer: {
        flexDirection: "row",
        // justifyContent:"center",
        alignItems: "center",
    },
    img: {
        width: scale(20),
        height: verticalScale(20),
    },
    label: {
        fontSize: moderateScale(19),
        color: "black"
    },
    logInContainer: {
        flexDirection: 'row',
        borderWidth: 2,
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: 10,
        backgroundColor: "#203A62",

    },
    btnTxt: {
        marginHorizontal: scale(10),
        color: "#fff",
        fontWeight: "bold",
        fontSize: 17
    },
    footerLine: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
    },
    signUp: {
        color: "orange",
        fontWeight: "bold",
        borderBottomColor: "orange",
        borderBottomWidth: moderateScale(2)
    },
    errorTxt: {
        color: 'red',
        fontWeight: "bold",
        fontSize: moderateScale(17)
    },
})
export default LoginPage;