import React from 'react'
import { Image, Text, View } from 'react-native'
import {CheckSquare, CircleCheck} from "lucide-react-native";


type Props = {
    Title: string
    Description: string
}

export const SuccessToast = ({ Title, Description }: Props) => {
    return (
        <View style={{flexDirection:"row",gap:10,alignItems:"center",width:"100%",backgroundColor:"#191919",borderColor:"#0e6",borderWidth:0.2,borderRadius:10,padding:10}}>
              <View>
                 <CircleCheck color={"#0e6"}/>
              </View>
<View>
    <Text style={{color:"white",fontFamily:"PlusJakartaSans-Regular"}}>{Description}</Text>
</View>
        </View>
    )
}
