import { useWindowDimensions } from "react-native";

const useAuthDrawerSize = () => {
  const { height } = useWindowDimensions();
  if (height < 700) {
    return { height: height * 0.4, percentage: 0.4 };
  }
  return { height: height * 0.3, percentage: 0.3 };
};

export { useAuthDrawerSize };
