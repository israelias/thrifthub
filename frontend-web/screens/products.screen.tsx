import React from "react";
import { StyleSheet } from "react-native";

import {
  Box,
  Divider,
  Flex,
  VStack,
  HStack,
  Stack,
  Wrap,
  useBreakpointValue,
  useMediaQuery,
  ScrollView,
} from "native-base";

import EditScreenInfo from "../components/editscreeninfo";
import { Text, View } from "../components/themed";
import { ProductCardPreview } from "../components/product/preview.product";

import { getRequest } from "../services/crud.service";

export default function TabTwoScreen() {
  const [products, setProducts] = React.useState<Product[] | undefined>();
  const [loading, setLoading] = React.useState(false);

  const [direction, setDirection] = React.useState<"column" | "row">("column");

  const [isLargerThan512] = useMediaQuery({ minWidth: 512 });

  const spacing = useBreakpointValue({
    base: "100%",
    sm: "75%",
    md: "50%",
    lg: "25%",
  });

  const loadProducts = async () => {
    setLoading(true);
    const data = await getRequest({
      url: `store?expand=category,vendor,product_images`,
    });
    if (data) {
      setProducts(data);
      setLoading(false);
    }
  };
  console.log(products);

  React.useEffect(() => {
    loadProducts();
  }, []);

  return (
    <View>
      <Box py={4} px={3} style={styles.container}>
        <Text style={styles.title}>Products</Text>
        <Divider style={styles.separator} />
        {/* <EditScreenInfo path="/screens/products.screen.tsx" /> */}
        {loading ? (
          <Text style={styles.title}>Loading...</Text>
        ) : (
          <Wrap direction="row" space={3} justifyContent="center">
            {products?.map((product) => (
              <>
                <Box py={4} width={spacing}>
                  <ProductCardPreview key={product.id} product={product} />
                </Box>
              </>
            ))}
          </Wrap>
        )}
      </Box>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    // alignItems: "center",
    // justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});
