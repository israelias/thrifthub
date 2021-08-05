import React, { ComponentProps } from 'react';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';

import {
  Image,
  View,
  Platform,
  ScrollView,
  StyleSheet,
} from 'react-native';

import { FormBuilder } from 'react-native-paper-form-builder';

import {
  ControllerRenderProps,
  FieldValues,
  UseFormStateReturn,
  useForm,
  useFieldArray,
  useWatch,
  Controller,
  SubmitHandler,
  SubmitErrorHandler,
} from 'react-hook-form';

import { MaterialBottomTabNavigationProp } from '@react-navigation/material-bottom-tabs';
import {
  Headline,
  Caption,
  useTheme,
  Button,
  TextInput,
  Text,
} from 'react-native-paper';

import Background from '../../components/common/background';
import Logo from '../../components/common/logo';
import Header from '../../components/common/header';

import { StackNavigationProp } from '@react-navigation/stack';
import { ProductStackNavigatorParamList } from '../../types';

import * as ICONS from '../../constants/icons.constants';
import { CONDITION_OPTIONS } from '../../constants/options.constants';

import { useVendorData } from '../../context/vendor.context';
import { useProductsData } from '../../context/products.context';
import { useAuth } from '../../context/authorization.context';

export type ImageInfo = {
  uri: string;
  width: number;
  height: number;
  type?: 'image' | 'video';
  exif?: {
    [key: string]: any;
  };
  base64?: string;
};

type ProductFormValues = {
  title: string;
  category: string;
  description: string;
  price: string;
  condition: string;
  fieldArray: { name: string; uri?: string }[];
};

export const AddProductScreen = ({
  navigation,
}: {
  navigation: StackNavigationProp<ProductStackNavigatorParamList>;
}) => {
  const theme = useTheme();
  const backgroundColor = theme.colors.surface;

  const { accessToken } = useAuth();

  const { createProduct } = useVendorData();

  const { categoryOptions } = useProductsData();

  const [getTitle, setTitle] = React.useState('');
  const [getCategory, setCategory] = React.useState('');
  const [getDescription, setDescription] = React.useState('');
  const [getPrice, setPrice] = React.useState('');
  const [getCondition, setCondition] = React.useState('');

  const [images, setImages] = React.useState<ImageInfo[] | null>([]);
  const [files, setFiles] =
    React.useState<DocumentPicker.DocumentResult>();

  const [fileList, setFileList] = React.useState<
    FileList | undefined
  >(undefined!);

  const {
    control,
    watch,
    register,
    setFocus,
    handleSubmit,
    formState: { errors, isSubmitting, isValidating },
  } = useForm<ProductFormValues>({
    defaultValues: {
      title: '',
      category: '',
      description: '',
      price: '',
      condition: '',
      fieldArray: [{ name: 'test', uri: '' }],
    },
    mode: 'onChange',
    criteriaMode: 'all',
  });

  const { fields, append } = useFieldArray({
    control,
    name: 'fieldArray',
  });

  const watchFieldArray = watch('fieldArray');
  const controlledFields = fields.map((field, index) => {
    return {
      ...field,
      ...watchFieldArray[index],
    };
  });

  React.useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const { status } =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          alert(
            'Sorry, we need camera roll permissions to make this work!'
          );
        }
      }
    })();
  }, []);

  const pickFiles = async () => {
    let results = await DocumentPicker.getDocumentAsync({
      copyToCacheDirectory: true,
      multiple: true,
      type: 'image/*',
    });

    console.log('picked files', results);
    if (results.type === 'success') {
      console.log(results);
      setFiles(results);
      append({ name: results.uri, uri: results.uri });
      if (results.output) {
        setFileList(results.output);
        console.log('results output', results.output);
      }
    }
  };

  const pickImage = async () => {
    let results = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      base64: false,
      exif: true,
      allowsMultipleSelection: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log('pickImage Results', results);

    if (!results.cancelled) {
      console.log(
        'selected results',
        results.selected.map((result) =>
          result.uri.replace('file://', '')
        )
      );
      setImages(results.selected.map((result) => result));
    }
  };

  const onError: SubmitErrorHandler<ProductFormValues> = (
    errors,
    e
  ) => {
    console.log('errors', errors, e);
    navigation.reset({
      index: 0,
      routes: [{ name: 'Products' }],
    });
  };

  const onSubmit: SubmitHandler<ProductFormValues> = async (
    validatedData,
    e
  ) => {
    console.log('submit handler', e);
    console.log('submit handler validatedData', validatedData);
    createProduct(
      validatedData.title,
      validatedData.category,
      validatedData.description,
      validatedData.price,
      validatedData.condition,
      accessToken ? accessToken : '',
      fileList
    );
  };

  return (
    <ScrollView
      style={{ backgroundColor }}
      contentContainerStyle={[
        styles.scrollViewContent,
        { backgroundColor },
      ]}
    >
      <Logo loading={isSubmitting || isValidating} />
      <Headline style={styles.centerText}>Sell a Product</Headline>
      <Caption style={styles.centerText}>Pick a Product</Caption>

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
                  underlineColor: 'transparent',
                  mode: 'outlined',
                  textContentType: 'none',
                  returnKeyType: 'next',
                  keyboardType: 'default',
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
                  value: getCondition,
                  onChange: (condition) =>
                    setCondition(condition.toString()),
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
                      name={ICONS.PRODUCT_CATEGORY_ICON}
                    />
                  ),
                  underlineColor: 'transparent',
                  mode: 'outlined',
                  returnKeyType: 'next',
                  keyboardType: 'default',
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
                options: categoryOptions,
              },
              {
                name: 'fieldArray',
                type: 'custom',
                JSX: () =>
                  controlledFields.map((field, index) => {
                    return (
                      <View>
                        <Image
                          source={{ uri: field.uri }}
                          style={{ width: 200, height: 200 }}
                        />
                        <TextInput
                          style={{ display: 'none' }}
                          underlineColor={'transparent'}
                          mode="outlined"
                          value={field.uri}
                          {...register(
                            `fieldArray.${index}.name` as const
                          )}
                        />
                      </View>
                    );
                  }),
              },
            ]}
          />
        </View>
        <Button
          mode={'outlined'}
          labelStyle={styles.text}
          style={[
            styles.button,
            { marginTop: 24, backgroundColor: theme.colors.surface },
          ]}
          onPress={() =>
            append({
              name: 'bill',
            })
          }
        >
          Append
        </Button>
        <Button
          mode={'outlined'}
          labelStyle={styles.text}
          style={[
            styles.button,
            { marginTop: 24, backgroundColor: theme.colors.surface },
          ]}
          onPress={Platform.OS === 'web' ? pickFiles : pickImage}
        >
          Upload Images
        </Button>
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {Platform.OS === 'web'
            ? files &&
              files.type === 'success' && (
                <Image
                  source={{ uri: files.uri }}
                  style={{ width: 200, height: 200 }}
                />
              )
            : images &&
              images.map((image) => (
                <Image
                  source={{ uri: image.uri }}
                  style={{ width: 200, height: 200 }}
                />
              ))}
        </View>
        <Button
          mode={'contained'}
          labelStyle={styles.text}
          style={[styles.button, { marginTop: 24 }]}
          onPress={handleSubmit(onSubmit, onError)}
        >
          Submit
        </Button>
        {errors.title && <Text>{errors.title.message}</Text>}
      </React.Fragment>
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
