import AsyncStorage from "@react-native-async-storage/async-storage"
import axios from "axios";
import { useContext, useEffect, useState } from "react"
import { ActivityIndicator, Alert, Image, Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context"
import { moderateScale, scale, verticalScale } from "react-native-size-matters";
import { groupContext } from "../providers/groupContext";

const GroupDetailPage = (props) => {
    const [history, setHistory] = useState([])
    const [summary, setSummary] = useState([])
    const [settleUpData, setSettleUpData] = useState([])
    const [showModal, setShowModal] = useState(false)
    const [showPayment, setShowPayment] = useState(false)
    const [loading, setLoading] = useState(false)
    const [btnClicked, setBtnClicked] = useState(false)
    const [error, setError] = useState('')
    const [paymentDetail, setPaymentDetail] = useState([])
    const [paymentAmount, setPaymentAmount] = useState()
    const { list, loader, getOneGroupDetail } = useContext(groupContext)

    useEffect(() => {
        summaryApi()
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

    const summaryApi = async () => {
        const groupId = await AsyncStorage.getItem('GroupId');
        const token = await AsyncStorage.getItem('Token');
        try {
            const res = await axios.get(`https://split-application.onrender.com/api/v1/groups/${groupId}/overall-summary`, { headers: { Authorization: `Bearer ${token}` } })
            console.log("summary=>", res.data.data)
            setSummary(res.data.data)
        }
        catch (error) {
            console.log(error)
        }
    }
    const alertBox = async (item) => {
        const groupId = await AsyncStorage.getItem('GroupId');
        const token = await AsyncStorage.getItem('Token');
        console.log(item);
        Alert.alert("Delete history", "Are you sure to delete this history?", [
            {
                text: "Cancel",
                style: "cancel"
            },
            {
                text: "Ok",
                onPress: async () => {
                    try {
                        const res = await axios.delete(`https://split-application.onrender.com/api/v1/groups/${groupId}/${item._id}/expensehistory-delete`, { headers: { Authorization: `Bearer ${token}` } })
                        summaryApi()
                        getOneGroupDetail()
                        expenseHistoryApi()
                        console.log(res)
                    }
                    catch (error) {
                        console.log(error)
                    }
                }
            }
        ])
    }

    const settleUp = async () => {
        setShowModal(true)
        setLoading(true)
        const groupId = await AsyncStorage.getItem('GroupId');
        const userId = await AsyncStorage.getItem("UserId");
        const token = await AsyncStorage.getItem('Token');
        try {
            const res = await axios.get(`https://split-application.onrender.com/api/v1/settlement/settle-summary/${groupId}`, { headers: { Authorization: `Bearer ${token}` } })
            console.log("setttle", res.data.data)
            setError('')
            setLoading(false)
            setSettleUpData(res.data.data)
        }
        catch (error) {
            setLoading(false)
            console.log(error)
            setError('Something gone wrong please try again later!')
        }
    }

    const paymentFun = async (item) => {
        setShowPayment(true)
        // console.log(item.amount);
        setPaymentDetail(item)
        setPaymentAmount(item?.amount.toString())
        // console.log(item);
    }

    const settleUpApi = async () => {
        setBtnClicked(true)
        const groupId = await AsyncStorage.getItem('GroupId');
        const token = await AsyncStorage.getItem('Token');
        const toUserId = paymentDetail.userId;
        // console.log("g", groupId);
        // console.log("t", token);
        // console.log("u", toUserId);
        const data = { toUserId: toUserId, amount: paymentAmount || paymentDetail.amount }
        // console.log("d",data);
        try {
            const res = await axios.post(`https://split-application.onrender.com/api/v1/settlement/${groupId}/settle`,
                data, { headers: { Authorization: `Bearer ${token}` } }
            )
            console.log(res);
            setError('')
            setBtnClicked(false)
            summaryApi()
            getOneGroupDetail()
            expenseHistoryApi()
            setShowModal(false)
            setShowPayment(false)
        }
        catch (error) {
            console.log(error);
            setError('Something gone wrong please try again later!')
            setBtnClicked(false)
        }

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
                            <Pressable onPress={() => settleUp()}>
                                <Text style={styles.settleUpBtn}>Settle up</Text>
                            </Pressable>
                            {
                                summary.length > 0 && <Text style={styles.label}>Summary:</Text>
                            }
                            <View style={styles.summaryContainer}>
                                {
                                    (summary || []).map((item, index) => (
                                        <View key={index}>
                                            <Text style={{ fontWeight: "500", }}>{item.name} {item.status} {item.amount}</Text>
                                        </View>
                                    ))
                                }
                            </View>
                            {
                                history.length > 0 && <Text style={styles.label}>History:</Text>
                            }
                            <View style={styles.historyContainer}>
                                {
                                    (history || []).map((item, index) => (
                                        <Pressable onPress={() => alertBox(item)} key={index} style={styles.historySecContainer}>
                                            <Text style={styles.date}>{formattedDate(item.createdAt)}</Text>
                                            <View style={styles.rowContainer}>
                                                <View>
                                                    <Text style={styles.descriptionLabel}>{item.description}</Text>
                                                    <Text>paid by {item.paidBy} {item.youPaid}</Text>
                                                </View>
                                                <View>
                                                    {
                                                        item.youBorrowed ? <Text style={styles.borrowLabel}>you Borrowed {item.youBorrowed}</Text> :
                                                            <Text style={styles.lentLabel}>you Lent {item.youLent}</Text>
                                                    }
                                                </View>
                                            </View>
                                        </Pressable>
                                    ))
                                }
                            </View>
                        </ScrollView>
                        <Pressable onPress={() => props.navigation.navigate("AddExpense")}>
                            <Text style={styles.addExpenseBtn}>Add expense</Text>
                        </Pressable>
                        <Modal transparent={true} animationType="slide" visible={showModal}>
                            <View style={{ flex: 1, backgroundColor: "#fff" }}>
                                <Pressable onPress={() => setShowModal(false)}>
                                    <Text style={styles.cancelModal}>X</Text>
                                </Pressable>
                                {
                                    loading ?
                                        <View style={styles.loaderContainer}>
                                            <ActivityIndicator size="large" color="#414141ff" />
                                            {
                                                error && <Text style={{ color: "red" }}>{error}</Text>
                                            }
                                        </View> :
                                        <View style={{ marginTop: moderateScale(80) }}>
                                            {
                                                settleUpData?.map((item, index) => (
                                                    <Pressable onPress={() => paymentFun(item)} key={index} style={styles.userRowContainer}>
                                                        <View>
                                                            <Text style={{ fontSize: moderateScale(18), fontWeight: "bold" }}>{item.name}</Text>
                                                        </View>
                                                        <View>
                                                            <Text>{item.status}</Text>
                                                            <Text>{item.amount}</Text>
                                                        </View>
                                                    </Pressable>
                                                ))
                                            }
                                        </View>
                                }
                            </View>
                        </Modal>
                        <Modal transparent={true} animationType="slide" visible={showPayment}>
                            <View style={{ flex: 1, backgroundColor: "#fff" }}>
                                <Pressable onPress={() => setShowPayment(false)}>
                                    <Text style={styles.cancelModal}>X</Text>
                                </Pressable>
                                <View style={{ marginTop: moderateScale(70), padding: moderateScale(20) }}>
                                    <View style={styles.insideContainerPay}>
                                        <Text style={styles.amountTxtName}>You paid {paymentDetail.name}</Text>
                                        <View style={styles.amountRowContainer}>
                                            <Image source={require(`../assets/images/rupee.png`)} style={styles.rupeeIcon} />
                                            <TextInput style={styles.amountInput} keyboardType="numeric" value={paymentAmount} onChangeText={(amount) => setPaymentAmount(amount)} />
                                        </View>
                                        <Pressable disabled={btnClicked} onPress={() => settleUpApi()}>
                                            <Text style={styles.btnPay}>Pay</Text>
                                        </Pressable>
                                    </View>
                                </View>
                                <View style={styles.loaderContainer}>
                                    {
                                        btnClicked && <ActivityIndicator size="large" color="#414141ff" />
                                    }
                                    {
                                        error && <Text style={{ color: "red" }}>{error}</Text>
                                    }
                                </View>
                            </View>
                        </Modal>
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
        zIndex: 10,
        elevation: 10,   // for Android
    },
    historyContainer: {
        padding: moderateScale(10)
    },
    settleUpBtn: {
        borderWidth: 2,
        textAlign: "center",
        margin: moderateScale(10),
        backgroundColor: "green",
        color: "#fff",
        paddingVertical: moderateScale(6),
        borderRadius: moderateScale(5),
        fontSize: moderateScale(18),
    },
    historySecContainer: {
        borderWidth: 2,
        marginBottom: 6,
        flexDirection: "row",
        borderRadius: moderateScale(4),
        padding: moderateScale(2),
        backgroundColor: "#e7e7e7ff",
    },
    date: {
        width: 35,
        fontSize: moderateScale(12),
    },
    rowContainer: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-between",
    },
    descriptionLabel: {
        fontWeight: "700",
        fontSize: moderateScale(16),
    },
    borrowLabel: {
        color: "red",
        fontWeight: "500",
        fontSize: moderateScale(12),
    },
    lentLabel: {
        color: "green",
        fontWeight: "500",
        fontSize: moderateScale(12),
    },
    label: {
        fontSize: moderateScale(19),
        fontWeight: "600",
        paddingHorizontal: moderateScale(10),
    },
    summaryContainer: {
        paddingHorizontal: moderateScale(10),
    },
    cancelModal: {
        position: 'absolute',
        top: moderateScale(10),
        right: moderateScale(10),
        color: "red",
        fontSize: moderateScale(30),
        width: moderateScale(24),
    },
    userRowContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        padding: moderateScale(8),
        marginTop: moderateScale(5),
        backgroundColor: "#aaa4a4ff"
    },
    amountInput: {
        borderBottomWidth: moderateScale(2),
        width: moderateScale(100),
        fontSize: moderateScale(20),
        height: moderateScale(44),
        fontWeight: "bold",
    },
    insideContainerPay: {
        borderWidth: 2,
        borderRadius: moderateScale(10),
        backgroundColor: "#d6d3d3ff",
    },
    rupeeIcon: {
        width: moderateScale(35),
        height: moderateScale(35),
    },
    amountRowContainer: {
        flexDirection: "row",
        alignSelf: "center",
        marginTop: moderateScale(30),
        // borderWidth: moderateScale(2),
    },
    amountTxtName: {
        textAlign: "center",
        fontSize: moderateScale(30),
        fontWeight: "bold",
    },
    btnPay: {
        alignSelf: "center",
        textAlign: "center",
        width: moderateScale(150),
        backgroundColor: "green",
        borderWidth: moderateScale(2),
        borderRadius: moderateScale(10),
        marginVertical: moderateScale(40),
        paddingVertical: moderateScale(8),
        fontSize: moderateScale(18),
        fontWeight: "bold",
        color: "#fff",
    }
})
export default GroupDetailPage;