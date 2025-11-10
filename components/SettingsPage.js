import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useEffect, useState } from "react";
import { ActivityIndicator, Image, Modal, Pressable, StyleSheet, Text, TextInput, View, } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";

const SettingsPage = (props) => {
    const [data, setData] = useState(null);
    const [loader, setLoader] = useState(true);
    const [inviteModal, setInviteModal] = useState(false)
    const [email, setEmail] = useState('')

    const getGroupDetail = async () => {
        const groupId = await AsyncStorage.getItem("GroupId");
        const token = await AsyncStorage.getItem("Token");
        try {
            const res = await axios.get(`https://split-application.onrender.com/api/v1/groups/findone/${groupId}`,
                { headers: { Authorization: `Bearer ${token}` } });
            setData(res.data.data);
            console.log(res.data.data._id)
            setLoader(false);
        } catch (error) {
            console.log(error);
            setLoader(false);
        }
    };

    useEffect(() => {
        getGroupDetail();
    }, []);

    const inviteMemberApi = async () => {
        const groupId = await AsyncStorage.getItem('GroupId')
        const token = await AsyncStorage.getItem("Token");
        try {
            const res = await axios.get(`https://split-application.onrender.com/api/v1/groups/${groupId}?email=${email}`,
                { headers: { Authorization: `Bearer ${token}` } }
            )
            console.log(res)
            setInviteModal(false)
            setEmail('')
        }
        catch (error) {
            console.log(error)
        }

    }

    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.safeContainer}>
                {loader ? (
                    <View style={styles.loaderContainer}>
                        <ActivityIndicator size="large" color="#414141ff" />
                    </View>
                ) : (
                    <View style={styles.container}>
                        <View style={styles.groupCard}>
                            <View style={styles.iconContainer}>
                                <Text style={styles.iconText}>{data?.icon}</Text>
                            </View>

                            <View style={styles.groupInfo}>
                                <Text style={styles.groupNameTxt}>{data?.name}</Text>
                                <Pressable style={styles.editButton} onPress={() => console.log("Edit group name")}>
                                    <Image source={require("../assets/images/pencil.png")} style={styles.editIcon} />
                                </Pressable>
                            </View>
                        </View>
                        <View style={styles.detailsSection}>
                            <Text style={styles.detailsHeader}>Group members</Text>
                            <Pressable style={styles.detailRow} onPress={() => setInviteModal(true)}>
                                <Image source={require('../assets/images/link.png')} style={[styles.editIcon, { marginLeft: scale(10) }]} />
                                <Text style={styles.detailValue}>Invite via link</Text>
                            </Pressable>

                            <View style={styles.detailRow}>
                                <Text style={styles.detailValue}>
                                    {data?.members?.map((item, index) => (
                                        <View key={index} style={styles.detailInsideRow}>
                                            <View style={{flexDirection: "row",}}>
                                                <Text style={styles.detailLabel}>{data.icon}</Text>
                                                <Text>{item.user.name}</Text>
                                            </View>
                                            <Text>{item.user.email}</Text>
                                        </View>
                                    ))}
                                </Text>
                            </View>
                        </View>
                        <View style={styles.detailsSection}>
                            <Text style={styles.detailsHeader}>Advance settings</Text>
                            <Pressable style={styles.detailRow}>
                                <Image source={require('../assets/images/log-in.png')} style={[styles.editIcon, { marginLeft: scale(10), tintColor: "red" }]} />
                                <Text style={[styles.detailValue, { color: "red", fontWeight: "700" }]}>Leave group</Text>
                            </Pressable>
                            <Pressable >
                                {
                                    data?.members?.map((item, index) => (
                                        <View key={index}>
                                            {
                                                item.role === "admin" ?
                                                    <View style={styles.detailRow}>
                                                        <Image source={require('../assets/images/delete.png')} style={[styles.editIcon, { marginLeft: scale(10), tintColor: "red" }]} />
                                                        <Text style={[styles.detailValue, { color: "red", fontWeight: "700" }]}>Delete group</Text>
                                                    </View> : null
                                            }
                                        </View>
                                    ))
                                }
                            </Pressable>
                        </View>
                    </View>
                )}
                <Modal transparent={true} visible={inviteModal} style={inviteModal} animationType="slide" onRequestClose={() => setShowModal(false)}>
                    <View style={styles.modalBackground}>
                        <View style={styles.modalContainer}>
                            <Text style={styles.modalTitle}>Invite via link</Text>
                            <TextInput keyboardType="email-address" style={styles.input} placeholder="Enter email address" placeholderTextColor="#777" value={email} onChangeText={(text) => setEmail(text.toLowerCase())} />
                            <Pressable style={styles.shareButton} onPress={() => inviteMemberApi()}>
                                <Text style={styles.shareButtonText}>Share Link</Text>
                            </Pressable>
                            <Pressable onPress={() => setInviteModal(false)}>
                                <Text style={styles.cancelText}>Cancel</Text>
                            </Pressable>
                        </View>
                    </View>
                </Modal>
            </SafeAreaView>
        </SafeAreaProvider>
    );
};

const styles = StyleSheet.create({
    safeContainer: {
        flex: 1,
        backgroundColor: "#f6f7fb",
    },
    container: {
        flex: 1,
        paddingHorizontal: moderateScale(15),
        paddingVertical: verticalScale(10),
    },
    loaderContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    groupCard: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#fff",
        borderRadius: moderateScale(10),
        padding: moderateScale(12),
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
        marginBottom: verticalScale(20),
    },
    iconContainer: {
        width: scale(90),
        height: scale(90),
        borderRadius: moderateScale(8),
        backgroundColor: "#f0f0f0",
        justifyContent: "center",
        alignItems: "center",
        marginRight: scale(12),
    },
    iconText: {
        fontSize: moderateScale(50),
    },
    groupInfo: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    groupNameTxt: {
        fontSize: moderateScale(22),
        fontWeight: "bold",
        color: "#222",
    },
    editButton: {
        padding: moderateScale(6),
    },
    editIcon: {
        width: scale(22),
        height: scale(22),

    },
    detailsSection: {
        backgroundColor: "#fff",
        borderRadius: moderateScale(10),
        padding: moderateScale(15),
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
        marginBottom: verticalScale(20),
    },
    detailsHeader: {
        fontSize: moderateScale(18),
        fontWeight: "600",
        color: "#333",
        marginBottom: verticalScale(10),
    },
    detailRow: {
        flexDirection: "row",
        marginBottom: verticalScale(8),
        alignItems: "center",
        justifyContent: "space-between",
        borderWidth: 2,
        paddingVertical: verticalScale(5),
        borderRadius: moderateScale(3),
        backgroundColor: "#f0f0f0",
    },
    detailInsideRow: {
        flexDirection: "row",
        // marginBottom: verticalScale(8),
        // borderWidth:2
        // paddingLeft: moderateScale(3),
        // alignItems: "center",
        // justifyContent: "space-between",
        // borderWidth: 2,
        // borderRadius: moderateScale(3),
        // backgroundColor: "#f0f0f0",
    },
    detailLabel: {
        fontSize: moderateScale(30),
        backgroundColor: "#666",
        borderRadius: moderateScale(20),
        // marginVertical: scale(10)
    },
    detailValue: {
        fontSize: moderateScale(15),
        flex: 1,
        justifyContent: "space-evenly",
        alignItems: "center",
        marginLeft: scale(10)
    },
    modalBackground: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: "center",
        alignItems: "center",
    },
    modalContainer: {
        width: "85%",
        backgroundColor: "#fff",
        borderRadius: 10,
        padding: 20,
        alignItems: "center",
        elevation: 5,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: "700",
        marginBottom: 15,
        color: "#222",
    },
    input: {
        width: "100%",
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 6,
        paddingHorizontal: 10,
        paddingVertical: 8,
        marginBottom: 15,
        fontSize: 15,
        color: "#000",
    },
    shareButton: {
        backgroundColor: "#4A90E2",
        borderRadius: 6,
        paddingVertical: 10,
        paddingHorizontal: 30,
        marginBottom: 10,
    },
    shareButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
    },
    cancelText: {
        color: "#666",
        fontSize: 14,
        textDecorationLine: "underline",
    },

});

export default SettingsPage;
