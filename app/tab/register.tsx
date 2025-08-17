import React, {useState} from 'react';
import {
    Text,
    View,
    TextInput,
    Button,
    StyleSheet,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform
} from 'react-native';
import {useForm, Controller} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {NavigationProps} from './tab-types/types';
import {RegisterFormData, useAuth} from "../../context/AuthContext";
import {SafeAreaView} from "react-native-safe-area-context";
import {AudioLines, EyeIcon, EyeOff} from "lucide-react-native";
import Spinner from "../../components/loader/spinner";

function Register({navigation}: NavigationProps) {

    const {registerSchema, RegisterUser, loadingRegister} = useAuth()
    const [showPassword,setShowPassword]=useState(false)
    const toggleShowPassword=()=>{
        setShowPassword(!showPassword)
    }
    const {
        control,
        handleSubmit,
        formState: {errors},
    } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
    });


    return (

        <View style={styles.container}>
            <KeyboardAvoidingView contentContainerStyle={{flex: 1, height: "100%", backgroundColor: "#121212"}}
                                  behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{flex: 1}}>


                <Text style={styles.title}><AudioLines size={35} color={"white"} strokeWidth={1.75}/></Text>

                <Text style={styles.title}>Create Your Account</Text>
                <Text style={styles.subtitle}>Sign up to listen to your favorite tracks anytime, anywhere.</Text>

                <Text style={styles.label}>Username</Text>
                <Controller
                    control={control}
                    disabled={loadingRegister}
                    name="username"
                    render={({field: {onChange, value}}) => (
                        <TextInput placeholderTextColor={"rgba(255,255,255,0.56)"}
                                   editable={!loadingRegister}
                                   placeholder="john"
                                   style={styles.input}
                                   onChangeText={onChange}
                                   value={value}
                        />
                    )}
                />
                {errors.username && <Text style={styles.error}>{errors.username.message}</Text>}
                <Text style={styles.label}>Email</Text>
                <Controller
                    control={control}
                    name="email"
                    render={({field: {onChange, value}}) => (
                        <TextInput placeholderTextColor={"rgba(255,255,255,0.56)"}
                                   editable={!loadingRegister}
                                   placeholder="example@gmail.com"
                                   style={styles.input}
                                   keyboardType="email-address"
                                   onChangeText={onChange}
                                   value={value}
                                   autoCapitalize="none"
                        />
                    )}
                />
                {errors.email && <Text style={styles.error}>{errors.email.message}</Text>}
                <Text style={styles.label}>Password</Text>
                <Controller
                    control={control}

                    name="password"
                    render={({field: {onChange, value}}) => (
                        <View  style={styles.passwordInput}>
                            <TextInput placeholderTextColor={"rgba(255,255,255,0.56)"}
                                       placeholder="*******"
                                       editable={!loadingRegister}
                                       style={styles.inputFontStyle}
                                       secureTextEntry={showPassword}
                                       onChangeText={onChange}
                                       value={value}
                            />
                            <TouchableOpacity onPress={toggleShowPassword}>{showPassword ? <EyeOff color={"rgba(255,255,255,0.56)"}/> : <EyeIcon color={"rgba(255,255,255,0.56)"}/>}</TouchableOpacity>
                        </View>
                    )}
                />
                {errors.password && <Text style={styles.error}>{errors.password.message}</Text>}
                <Text style={styles.label}>Confirm Password</Text>
                <Controller
                    disabled={loadingRegister}
                    control={control}
                    name="confirmPassword"
                    render={({field: {onChange, value}}) => (
                        <TextInput placeholderTextColor={"rgba(255,255,255,0.56)"}
                                   editable={!loadingRegister}
                                   placeholder="*******"
                                   style={styles.input}
                                    secureTextEntry={showPassword}
                                   onChangeText={onChange}
                                   value={value}
                        />
                    )}
                />
                {errors.confirmPassword && <Text style={styles.error}>{errors.confirmPassword.message}</Text>}

                <TouchableOpacity disabled={loadingRegister} style={styles.button} onPress={handleSubmit(RegisterUser)}>
                    {loadingRegister ? <Spinner size={20} start={loadingRegister}/> :
                        <Text style={styles.buttonText}>Create</Text>}

                </TouchableOpacity>


                <Text style={styles.link} onPress={() => navigation.navigate('Login')}>Already Have an Account?<Text
                    style={styles.linkspan}> Login here</Text></Text>
            </KeyboardAvoidingView>
        </View>

    );
}

export default Register;

const styles = StyleSheet.create({
    container: {
        paddingTop: 60,
        paddingHorizontal: 20,

        height: "100%",
        backgroundColor: "#212121"

    },
    title: {
        fontSize: 30,
        textAlign: 'center',
        color: "white",
        fontFamily: "PlusJakartaSans-Bold"
    },
    subtitle: {
        fontSize: 14,
        paddingBottom: 10,
        color: "white",
        fontFamily: "PlusJakartaSans-Regular",
        textAlign: 'center',
    },
    input: {
        borderWidth: 1,
        borderColor: '#676767',
        color: "white",
        borderRadius: 8,
        padding: 10,
        fontFamily: "PlusJakartaSans-Regular",
        marginBottom: 8,
    },
    error: {
        color: '#df6d6d',
        marginBottom: 2,
        fontFamily: "PlusJakartaSans-Regular",
        fontSize: 12,
    },
    label: {
        color: '#dfdfdf',
        marginBottom: 4,

        fontSize: 14,
        fontFamily: 'PlusJakartaSans-Medium',
    },
    link: {
        color: "white",
        textAlign: "center",
        paddingVertical: 10,
        lineHeight: 30,
        fontSize: 13,

        fontFamily: "PlusJakartaSans-Regular",
    },
    linkspan: {
        color: "#0e6",
        textAlign: "center",
        paddingVertical: 10,
        lineHeight: 30,
        fontSize: 13,

        fontFamily: "PlusJakartaSans-SemiBold",
        textDecorationLine: "underline"
    },
    button: {
        marginTop: 15,
        width: "100%",
        height: 55,
        backgroundColor: '#1DB954',
        paddingVertical: 10,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 32,
        borderRadius: 25,

    },
    buttonText: {
        lineHeight: 31,
        color: 'white',
        fontFamily: "PlusJakartaSans-Bold",
        fontSize: 16,
    },
    inputFontStyle:{
        fontFamily: "PlusJakartaSans-Regular",
        color: "white",
        flex:1,
    },
    passwordInput: {
        borderWidth: 1,
        borderColor: '#676767',
        color: "white",
        flexDirection:"row",
        alignItems:"center",
        justifyContent:"space-between",
        borderRadius: 8,
        paddingHorizontal: 10,
        fontFamily: "PlusJakartaSans-Regular",
        marginBottom: 8,
    },
});
