import React from 'react';
import {NativeSyntheticEvent, TextInput, TextInputChangeEventData, View} from "react-native";
import {Feather, Search} from "lucide-react-native";


interface  SearchInputProp {
    value:string
    onChange:React.Dispatch<React.SetStateAction<string>>
}
function SearchInput({value,onChange} :SearchInputProp) {
    return (
        <View
            style={{

                height: 40,
                 alignItems:"center",
                paddingHorizontal:10,
                borderRadius: 9,
                borderWidth:0.2,
                borderColor:"white",
                gap: 10,
                flexDirection: "row",
                  marginBottom:10

            }}>
            <Search   size={20}  strokeWidth={3} color={"#fff"}/>
            <TextInput value={value}  placeholderTextColor={"rgba(255,255,255,0.65)"}
                       onChangeText={(text:string)=>onChange(text)}

                       placeholder={"What do you want to listen to?"}
                       style={{
                           color: "#fff",

                           flex: 1,
                           fontFamily: "PlusJakartaSans-SemiBold"
                       }}


            />
        </View>
    );
}

export default SearchInput;