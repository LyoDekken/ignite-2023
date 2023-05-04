import { Button as NativeBaseButton, IButtonProps, Text } from "native-base";

type Props = IButtonProps & {
  title: string;
  variant?: "solid" | "outline";
};

const Button = ({ title, variant = 'solid', ...rest }: Props) => {
  return (
    <NativeBaseButton
      w={"full"}
      h={14}
      bgColor={variant === "outline" ? "transparent" : "green.700"}
      borderWidth={variant === "outline" ? 1 : 0}
      borderColor={variant === "outline" ? "green.700" : "transparent"}
      rounded={"sm"}
      _pressed={
        variant === "outline"
          ? { bgColor: "gray.500" }
          : { bgColor: "transparent" }
      }
      {...rest}
    >
      <Text
        color={variant === "outline" ? "green.500" : "white"}
        fontFamily={"heading"}
        fontSize="sm"
      >
        {title}
      </Text>
    </NativeBaseButton>
  );
};

export default Button;
