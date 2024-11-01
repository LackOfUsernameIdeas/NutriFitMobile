import { Flex } from "galio-framework";
import React from "react";

const HSeparator = (props) => {
  const { variant, size, color, ...rest } = props;
  return (
    <Flex
      h={size ? size : "1px"}
      w="100%"
      bg={color ? color : "rgba(135, 140, 189, 0.3)"}
      {...rest}
    />
  );
};

const VSeparator = (props) => {
  const { variant, ...rest } = props;
  return <Flex w="1px" bg="rgba(135, 140, 189, 0.3)" {...rest} />;
};

export { HSeparator, VSeparator };
