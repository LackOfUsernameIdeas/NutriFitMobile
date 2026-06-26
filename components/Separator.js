import React from "react";
import { View } from "react-native";

const HSeparator = (props) => {
  const { variant, size, color, ...rest } = props;
  return (
    <View
      style={{
        height: size ? size : 1,
        width: "100%",
        backgroundColor: color ? color : "rgba(135, 140, 189, 0.3)"
      }}
      {...rest}
    />
  );
};

const VSeparator = (props) => {
  const { variant, ...rest } = props;
  return (
    <View
      style={{
        width: 1,
        backgroundColor: "rgba(135, 140, 189, 0.3)"
      }}
      {...rest}
    />
  );
};

export { HSeparator, VSeparator };
