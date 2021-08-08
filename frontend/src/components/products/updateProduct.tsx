import React from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  Platform,
  Alert,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';

import {
  useForm,
  SubmitHandler,
  SubmitErrorHandler,
} from 'react-hook-form';

import _ from 'lodash/fp';

import { FormBuilder } from 'react-native-paper-form-builder';

import {
  Headline,
  Subheading,
  Caption,
  useTheme,
  Button,
  TextInput,
} from 'react-native-paper';

import * as ICONS from '../../constants/icons.constants';
import { CONDITION_OPTIONS } from '../../constants/options.constants';
import Background from '../common/background';
import Logo from '../common/logo';
import Header from '../common/header';

import overlay from '../../utils/overlay';

import { RouteProp } from '@react-navigation/native';
import { ProductStackNavigatorParamList } from '../../types';

import { useVendorData } from '../../context/vendor.context';
import { useAuth } from '../../context/authorization.context';
import { useProductsData } from '../../context/products.context';

type FormValues = {
  vendor: string;
  title: string;
  category: string;
  description: string;
  price: string;
  condition: string;
  images?: FileList;
};

export const UpdateProduct = ({
  product,
  navigation,
  route,
}: {
  product: ProductStackNavigatorParamList['UpdateProduct'];
  navigation?: StackNavigationProp<ProductStackNavigatorParamList>;
  route?: RouteProp<ProductStackNavigatorParamList, 'UpdateProduct'>;
}) => {
  const { updateProduct } = useVendorData();

  const { categoryOptions } = useProductsData();
  const { accessToken } = useAuth();

  const theme = useTheme();
  const backgroundColor = overlay(2, theme.colors.surface) as string;

  const [getTitle, setTitle] = React.useState(product.product.title);
  const [getCategory, setCategory] = React.useState(
    product.product.category.id.toString()
  );
  const [getDescription, setDescription] = React.useState(
    product.product.description
  );
  const [getPrice, setPrice] = React.useState(
    product.product.price.toString()
  );
  const [getCondition, setCondition] = React.useState(
    product.product.condition
  );

  const [status, setStatus] = React.useState<string | undefined>(
    undefined
  );
  const [fileList, setFileList] = React.useState<
    FileList | undefined
  >(undefined!);

  const {
    control,
    setFocus,
    formState: {
      errors,
      isDirty,
      isSubmitted,
      isSubmitting,
      isValidating,
    },
    handleSubmit,
  } = useForm<FormValues>({
    defaultValues: {
      title: product.product.title,
      category: product.product.category.id.toString(),
      description: product.product.description,
      price: product.product.price.toString(),
      condition: product.product.condition,
      images: fileList,
    },
    mode: 'onChange',
    criteriaMode: 'all',
  });

  const onSubmit: SubmitHandler<FormValues> = async (data, e) => {
    console.log('EditProduct: ValidSubmitData =>', data, e);
    await updateProduct(
      product.product.slug,
      data.title,
      data.category,
      data.description,
      data.price,
      data.condition,
      accessToken ?? ''
    ).then((response) => console.log(response));
  };

  const onError: SubmitErrorHandler<FormValues> = (errors, e) => {
    console.log('EditProduct: ErrorSubmitData =>', errors, e);
    navigation &&
      navigation.reset({
        index: 0,
        routes: [{ name: 'Products' }],
      });
  };

  const hasUnsavedChanges = Boolean(
    getTitle ||
      getDescription ||
      getCategory ||
      getPrice ||
      getCondition
  );

  React.useEffect(
    () =>
      navigation &&
      navigation.addListener('beforeRemove', (e) => {
        if (!hasUnsavedChanges) {
          return;
        }

        e.preventDefault();

        if (Platform.OS === 'web') {
          const discard = confirm(
            'You have unsaved changes. Discard them and leave the screen?'
          );

          if (discard) {
            navigation.dispatch(e.data.action);
          }
        } else {
          Alert.alert(
            'Discard changes?',
            'You have unsaved changes. Discard them and leave the screen?',
            [
              {
                text: "Don't leave",
                style: 'cancel',
                onPress: () => {},
              },
              {
                text: 'Discard',
                style: 'destructive',
                onPress: () => navigation.dispatch(e.data.action),
              },
            ]
          );
        }
      }),
    [hasUnsavedChanges, navigation]
  );

  return (
    <ScrollView
      style={{ backgroundColor }}
      contentContainerStyle={[
        styles.scrollViewContent,
        { backgroundColor },
      ]}
    >
      <Logo loading={isSubmitting || isValidating} />
      <Header>Update Product</Header>
      <Caption style={styles.centerText}>
        You're about update {product.product.title}. You can continue
        to update details so long as the product is not yet sold!
      </Caption>
      <Headline style={styles.centerText}>
        {product.product.title}
      </Headline>
      <Subheading style={styles.centerText}>
        {product.product.is_available ? 'Available' : 'Sold'}
      </Subheading>

      <React.Fragment>
        <View style={styles.container}>
          <FormBuilder
            control={control}
            setFocus={setFocus}
            formConfigArray={[
              {
                name: 'title',
                type: 'text',
                textInputProps: {
                  label: 'Title',
                  left: (
                    <TextInput.Icon name={ICONS.PRODUCT_TITLE_ICON} />
                  ),
                  underlineColor: 'transparent',
                  mode: 'outlined',
                  textContentType: 'none',
                  returnKeyType: 'next',
                  keyboardType: 'default',
                  blurOnSubmit: false,
                  value: getTitle,
                  onChangeText: (title) => setTitle(title),
                  onSubmitEditing: () => setFocus('description'),
                },
                rules: {
                  required: {
                    value: true,
                    message: 'Title is required',
                  },
                  maxLength: {
                    value: 255,
                    message:
                      'Title should be less than 255 characters.',
                  },
                },
              },
              {
                name: 'description',
                type: 'text',
                textInputProps: {
                  label: 'Description',
                  left: (
                    <TextInput.Icon
                      name={ICONS.PRODUCT_DESCRIPTION_ICON}
                    />
                  ),
                  multiline: true,
                  underlineColor: 'transparent',
                  mode: 'outlined',
                  textContentType: 'none',
                  returnKeyType: 'next',
                  keyboardType: 'default',
                  blurOnSubmit: false,
                  value: getDescription,
                  onChangeText: (description) =>
                    setDescription(description),
                  onSubmitEditing: () => setFocus('price'),
                },
                rules: {
                  required: {
                    value: false,
                    message: 'Description is optional',
                  },
                },
              },
              {
                name: 'price',
                type: 'text',
                textInputProps: {
                  label: 'Price',
                  left: (
                    <TextInput.Icon name={ICONS.PRODUCT_PRICE_ICON} />
                  ),
                  underlineColor: 'transparent',
                  mode: 'outlined',
                  textContentType: 'none',
                  returnKeyType: 'next',
                  keyboardType: 'numeric',
                  blurOnSubmit: false,
                  value: getPrice,
                  onChangeText: (price) => setPrice(price),
                  onSubmitEditing: () => setFocus('condition'),
                },
                rules: {
                  required: {
                    value: true,
                    message: 'Price is required',
                  },
                  pattern: {
                    value: /^\-?[0-9]+(?:\.[0-9]{1,2})?/,
                    message: 'Price is invalid',
                  },
                  minLength: {
                    value: 3,
                    message:
                      'The price must be a valid decimal field.',
                  },
                  maxLength: {
                    value: 8,
                    message:
                      'The price must be between 0 and 999,999.99',
                  },
                },
              },
              {
                name: 'condition',
                type: 'autocomplete',
                textInputProps: {
                  label: 'Condition',
                  left: (
                    <TextInput.Icon
                      name={ICONS.PRODUCT_CONDITION_ICON}
                    />
                  ),
                  underlineColor: 'transparent',
                  mode: 'outlined',

                  returnKeyType: 'next',
                  keyboardType: 'default',
                  blurOnSubmit: false,
                  value: getCondition,
                  onChange: (condition) =>
                    setDescription(condition.toString()),
                  onSubmitEditing: () => setFocus('category'),
                },
                rules: {
                  required: {
                    value: true,
                    message: 'Condition is required',
                  },
                },

                options: CONDITION_OPTIONS,
              },
              {
                name: 'category',
                type: 'select',
                textInputProps: {
                  label: 'Category',
                  left: (
                    <TextInput.Icon
                      color={theme.colors.primary}
                      name={ICONS.PRODUCT_CATEGORY_ICON}
                    />
                  ),
                  underlineColor: 'transparent',
                  mode: 'outlined',
                  returnKeyType: 'next',
                  keyboardType: 'default',
                  blurOnSubmit: false,
                  value: getCategory,
                  onChange: (category) =>
                    setCategory(category.toString()),

                  onSubmitEditing: () =>
                    handleSubmit(onSubmit, onError),
                },
                rules: {
                  required: {
                    value: true,
                    message: 'Category is required',
                  },
                },
                onDismiss: () => setFocus('price'),
                options: categoryOptions,
              },
            ]}
          />
        </View>
        <Button
          mode="contained"
          labelStyle={styles.text}
          style={[styles.button, { marginTop: 24 }]}
          onPress={handleSubmit(onSubmit, onError)}
        >
          Update
        </Button>
      </React.Fragment>
      <Button
        mode="outlined"
        labelStyle={styles.text}
        style={[
          styles.button,
          { backgroundColor: theme.colors.surface },
        ]}
        onPress={() => navigation && navigation.goBack()}
      >
        Cancel
      </Button>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollViewContent: {
    flex: 1,
    paddingHorizontal: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerText: {
    textAlign: 'center',
  },
  button: {
    width: '100%',
    marginVertical: 10,
    paddingVertical: 2,
  },
  text: {
    fontWeight: 'bold',
    fontSize: 15,
    lineHeight: 26,
  },
  container: {
    width: '100%',
    marginVertical: 12,
  },
});
