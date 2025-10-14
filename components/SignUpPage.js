import { ActivityIndicator, Image, Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableHighlight, View } from "react-native";
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context"
import { Dropdown } from "react-native-element-dropdown";
import { useState } from "react";
import axios from "axios";

const SignUpPage = (props) => {
    const [nameError, setNameError] = useState('')
    const [numberError, setNumberError] = useState('')
    const [emailError, setEmailError] = useState('')
    const [passwordError, setPasswordError] = useState('')
    const [name, setName] = useState('');
    const [number, setNumber] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loader, setLoader] = useState(false)

    const userSignUp = () => {
        // Reset errors first
        setNameError('');
        setNumberError('');
        setEmailError('');
        setPasswordError('');

        let isValid = true;

        // Validate name
        if (!name.trim()) {
            setNameError('Enter your name!');
            isValid = false;
        }

        // Validate number
        if (number.length !== 10) {
            setNumberError('Enter correct number!');
            isValid = false;
        }

        // Validate email
        if (!email.trim()) {
            setEmailError('Enter your email!');
            isValid = false;
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setEmailError('Enter a valid email!');
            isValid = false;
        }

        // Validate password
        if (!password.trim()) {
            setPasswordError('Enter your password!');
            isValid = false;
        } else if (password.length < 6 || !/^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{3,}$/.test(password)) {
            setPasswordError('Enter minimum 6 character ,1 upper ,1 special,and 1 number in password.');
            isValid = false;
        }

        if (!isValid) return;
        const detailOfUser = { name: name.trim(), mo: number.trim(), email: email.trim(), password: password.trim(), };
        setLoader(true)
        axios.post(`http://split-application.onrender.com/api/user/signup`, detailOfUser)
            .then((res) => {
                console.log(res.data);
                if (res) {
                    setLoader(false)
                    console.log(res.data.user)
                    props.navigation.navigate('Login')
                }
            })
            .catch((error) => {
                console.log(error);
            })

    }

    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.container}>
                <ScrollView>
                    <View style={styles.loginCard}>
                        <Text style={styles.headerText}>Sign Up</Text>
                        <View>
                            <View style={styles.labelContainer}>
                                <Image source={require('../assets/images/user.png')} style={styles.img} />
                                <Text style={styles.label}> Name </Text>
                            </View>
                            <TextInput style={styles.input} value={name} onChangeText={(text) => setName(text)}></TextInput>
                            <Text style={styles.errorTxt}>{nameError}</Text>
                        </View>
                        <View>
                            <View style={styles.labelContainer}>
                                <Image source={require('../assets/images/iphone.png')} style={styles.img} />
                                <Text style={styles.label}> Mobile No </Text>
                            </View>
                            <TextInput keyboardType="numeric" style={styles.input} value={number} onChangeText={(text) => setNumber(text)}></TextInput>
                            <Text style={styles.errorTxt}>{numberError}</Text>
                        </View>
                        <View>
                            <View style={styles.labelContainer}>
                                <Image source={require('../assets/images/email.png')} style={styles.img} />
                                <Text style={styles.label}> Email Id </Text>
                            </View>
                            <TextInput keyboardType="email-address" style={styles.input} value={email} onChangeText={(text) => setEmail(text)}></TextInput>
                            <Text style={styles.errorTxt}>{emailError}</Text>
                        </View>
                        <View>
                            <View style={styles.labelContainer}>
                                <Image source={require('../assets/images/padlock.png')} style={styles.img} />
                                <Text style={styles.label}> Password </Text>
                            </View>
                            <TextInput style={styles.input} secureTextEntry={true} value={password} onChangeText={(text) => setPassword(text)}></TextInput>
                            <Text style={[styles.errorTxt, { fontSize: moderateScale(15) }]}>{passwordError}</Text>
                        </View>
                        {
                            loader === true ? <ActivityIndicator size="large"></ActivityIndicator> : null
                        }
                        <Pressable onPress={userSignUp}>
                            <View style={[styles.input, styles.logInContainer]}>
                                <Image source={require('../assets/images/log-in.png')} style={styles.img} />
                                <Text style={styles.btnTxt}>Sign Up</Text>
                            </View>
                        </Pressable>
                        <View style={styles.footerLine}>
                            <Text>Already have an account? </Text>
                            <Pressable onPress={() => props.navigation.navigate("Login")}>
                                <Text style={styles.signUp}>Log In</Text>
                            </Pressable>
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </SafeAreaProvider >
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f4f7f9",
        padding: moderateScale(20),
        borderBottomWidth: moderateScale(1),
    },
    headerText: {
        color: "orange",
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
        width: '100%',
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
        paddingVertical: verticalScale(8)
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
        backgroundColor: "orange",
        borderColor: "orange"

    },
    errorTxt: {
        color: 'red',
        fontWeight: "bold",
        fontSize: moderateScale(17)
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
        color: "#203A62",
        fontWeight: "bold",
        borderBottomColor: "#203A62",
        borderBottomWidth: moderateScale(2)
    }
})
export default SignUpPage;