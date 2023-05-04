import { Image, IImageProps } from "native-base";

type UserPhotoProps  = IImageProps & {
  size: number
}

const UserPhoto = ({size, ...rest}: UserPhotoProps ) => {
  return (
    <Image 
      w={size}
      h={size}
      rounded={"full"}
      borderWidth={2}
      borderColor={"gray.400"}
      {...rest}
    />
  );
};

export default UserPhoto;
