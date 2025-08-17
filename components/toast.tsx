import React from 'react';
import { Text, View } from 'react-native';
import { CircleCheck, AlertTriangle, Info, XCircle } from 'lucide-react-native';

type Variant = 'success' | 'warning' | 'info' | 'error';

type Props = {

    description: string;
    variant?: Variant;
};

const variantStyles: Record<Variant, { icon: React.ElementType; color: string }> = {
    success: { icon: CircleCheck, color: '#0e6' },
    warning: { icon: AlertTriangle, color: '#e6a700' },
    info: { icon: Info, color: '#00aaff' },
    error: { icon: XCircle, color: '#e60023' },
};

export const Toast = ({ description, variant = 'success' }: Props) => {
    const { icon: Icon, color } = variantStyles[variant];

    return (
        <View
            style={{
                flexDirection: 'row',
                gap: 10,
                alignItems: 'center',
                width: '100%',
                backgroundColor: '#191919',
                borderColor: color,
                borderWidth: 0.5,
                borderRadius: 10,
                padding: 10,
            }}
        >
            <Icon color={color} />
            <View style={{ flex: 1 }}>
                <Text style={{ color: 'white', fontFamily: 'PlusJakartaSans-Regular' }}>
                    {description}
                </Text>
            </View>
        </View>
    );
};
