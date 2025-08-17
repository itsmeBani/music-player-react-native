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
import {LoginFormData, RegisterFormData, useAuth} from "../../context/AuthContext";
import {SafeAreaView} from "react-native-safe-area-context";
import {AudioLines, EyeIcon, EyeOff} from "lucide-react-native";
import Spinner from "../../components/loader/spinner";
function Login({navigation}: NavigationProps) {

    const {loginSchema,LoginWithEmailPassword,loadingLogin} = useAuth()
    const [showPassword,setShowPassword]=useState(false)
    const toggleShowPassword=()=>{
        setShowPassword(!showPassword)
    }
    const {
        control,
        handleSubmit,
        formState: {errors},
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
    });



    return (

        <View style={loginStyle.container}>
            <View  style={{flex: 1,justifyContent:"center"}}>


                <Text style={loginStyle.title}><AudioLines size={35} color={"white"} strokeWidth={1.75}/></Text>

                <Text style={loginStyle.title}>Welcome Back</Text>
                <Text style={loginStyle.subtitle}>Log in to continue enjoying your favorite tracks.</Text>


                <Text style={loginStyle.label}>Email</Text>
                <Controller
                    control={control}
                    name="email"
                    render={({field: {onChange, value}}) => (
                        <TextInput  placeholderTextColor={"rgba(255,255,255,0.56)"}

                                    placeholder="example@gmail.com"
                            style={loginStyle.input}
                            keyboardType="email-address"
                            onChangeText={onChange}
                            value={value}
                            autoCapitalize="none"
                                    editable={!loadingLogin}
                        />
                    )}
                />
                {errors.email && <Text style={loginStyle.error}>{errors.email.message}</Text>}
                <Text style={loginStyle.label}>Password</Text>
                <Controller
                    control={control}
                    name="password"
                    render={({field: {onChange, value}}) => (
                     <View  style={loginStyle.passwordInput}>
                         <TextInput placeholderTextColor={"rgba(255,255,255,0.56)"}
                                    placeholder="*******"

                                    style={loginStyle.inputFontStyle}
                                    secureTextEntry={showPassword}
                                    onChangeText={onChange}
                                    value={value}
                                    editable={!loadingLogin}
                         />
                         <TouchableOpacity onPress={toggleShowPassword}>{showPassword ? <EyeOff color={"rgba(255,255,255,0.56)"}/> : <EyeIcon color={"rgba(255,255,255,0.56)"}/>}</TouchableOpacity>
                     </View>
                    )}
                />
                {errors.password && <Text style={loginStyle.error}>{errors.password.message}</Text>}
                <TouchableOpacity disabled={loadingLogin} style={loginStyle.button} onPress={handleSubmit(LoginWithEmailPassword)}>
                    {loadingLogin ?  <Spinner size={20} start={loadingLogin}/>:
                        <Text style={loginStyle.buttonText}>Login</Text>}

                </TouchableOpacity>


                <Text style={loginStyle.link} onPress={() => navigation.navigate('Register')}>Don't Have an Account?<Text style={loginStyle.linkspan}> Register now</Text></Text>
            </View>
        </View>

    );
}

export default Login;

const loginStyle = StyleSheet.create({

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
    container: {
        paddingTop: 30,
        paddingHorizontal: 20,

        height: "100%",
        backgroundColor: "#212121"

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
    inputFontStyle:{
        fontFamily: "PlusJakartaSans-Regular",
        color: "white",
        flex:1,
        justifyContent:"center",
        alignItems:"center"
    },
    passwordInput: {
        borderWidth: 1,
        borderColor: '#676767',
        color: "white",
        flexDirection:"row",
       alignItems:"center",
        justifyContent:"space-between",
        borderRadius: 8,
        paddingHorizontal: 6,

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
    linkspan:{
        color: "#0e6",
        textAlign: "center",
        paddingVertical: 10,
        lineHeight: 30,
        fontSize: 13,

        fontFamily: "PlusJakartaSans-SemiBold",
        textDecorationLine:"underline"
    },
    button: {
        marginTop: 15,
        width: "100%",
        height:55,
        backgroundColor: '#1DB954',
        paddingVertical: 10,
        alignItems: "center",
        justifyContent:"center",
        paddingHorizontal: 32,
        borderRadius: 25,

    },
    buttonText: {
        lineHeight: 31,
        color: 'white',
        fontFamily: "PlusJakartaSans-Bold",
        fontSize: 16,
    },

});
