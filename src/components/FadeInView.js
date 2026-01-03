import React, { useEffect, useRef } from 'react';
import { Animated, View } from 'react-native';

const FadeInView = ({ children, style, delay = 0, duration = 800 }) => {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const translateY = useRef(new Animated.Value(20)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: duration,
                delay: delay,
                useNativeDriver: true,
            }),
            Animated.timing(translateY, {
                toValue: 0,
                duration: duration,
                delay: delay,
                useNativeDriver: true,
            }),
        ]).start();
    }, [fadeAnim, translateY, delay, duration]);

    return (
        <Animated.View
            style={[
                style,
                {
                    opacity: fadeAnim,
                    transform: [{ translateY: translateY }],
                },
            ]}
        >
            {children}
        </Animated.View>
    );
};

export default FadeInView;
