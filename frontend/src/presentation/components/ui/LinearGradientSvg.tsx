import React from 'react';
import { View, StyleSheet, ViewProps } from 'react-native';
import Svg, { Defs, LinearGradient, Stop, Rect } from 'react-native-svg';

export interface LinearGradientSvgProps extends ViewProps {
  colors: string[];
  start?: { x: number, y: number };
  end?: { x: number, y: number };
}

export function LinearGradientSvg({ 
  colors, 
  start = { x: 0, y: 0 }, 
  end = { x: 0, y: 1 }, 
  style, 
  children, 
  ...props 
}: LinearGradientSvgProps) {
  return (
    <View style={style} {...props}>
      <View style={StyleSheet.absoluteFill}>
        <Svg width="100%" height="100%">
          <Defs>
            <LinearGradient id="grad" x1={`${start.x * 100}%`} y1={`${start.y * 100}%`} x2={`${end.x * 100}%`} y2={`${end.y * 100}%`}>
              {colors.map((c, i) => {
                const offset = colors.length > 1 ? (i / (colors.length - 1)) * 100 : 0;
                return <Stop key={i} offset={`${offset}%`} stopColor={c} />;
              })}
            </LinearGradient>
          </Defs>
          <Rect width="100%" height="100%" fill="url(#grad)" />
        </Svg>
      </View>
      {children}
    </View>
  );
}
