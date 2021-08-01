import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { MaterialBottomTabNavigationProp } from '@react-navigation/material-bottom-tabs';
import {
  NativeSyntheticEvent,
  TextInputChangeEventData,
} from 'react-native';

import {
  useController,
  useForm,
  SubmitHandler,
  SubmitErrorHandler,
  useFormState,
} from 'react-hook-form';

import _ from 'lodash/fp';

import { FormBuilder } from 'react-native-paper-form-builder';
import { ErrorMessage } from '@hookform/error-message';
import {
  Headline,
  Caption,
  useTheme,
  Button,
  TextInput,
  List,
  Checkbox,
} from 'react-native-paper';

import Background from '../../components/common/background';
import Logo from '../../components/common/logo';
import Header from '../../components/common/header';

import overlay from '../../utils/overlay';

import { RouteProp } from '@react-navigation/native';
import { ProductStackNavigatorParamList } from '../../types';
import { ProductDetail } from '../../components/products/productDetail';

import { useVendorData } from '../../context/vendor.context';
import { useAuth } from '../../context/authorization.context';

import { makeOffer } from '../../services/get.service';

type Props = {} & ProductStackNavigatorParamList['ProductDetails'];

type FormValues = {
  product: string;
  amount: string;
  vendor: string;
  buyer: string;
};

export const MakeOfferScreen = ({
  product,
  navigation,
  route,
  productId,
  sellerId,
}: {
  product: ProductStackNavigatorParamList['ProductDetails'];
  navigation?: StackNavigationProp<ProductStackNavigatorParamList>;
  route: RouteProp<ProductStackNavigatorParamList, 'MakeOffer'>;
  productId?: string;
  sellerId?: string;
}) => {
  const { vendorId } = useVendorData();
  const { accessToken } = useAuth();

  const [currentProduct, setCurrentProduct] = React.useState<
    ProductStackNavigatorParamList['ProductDetails'] | undefined
  >(undefined!);
  const [submitting, setSubmitting] = React.useState<boolean>(false);
  const [getTitle, setTitle] = React.useState('');
  const [getCategory, setCategory] = React.useState('');
  const [getDescription, setDescription] = React.useState('');
  const [getAmount, setAmount] = React.useState('');

  const theme = useTheme();
  const backgroundColor = overlay(2, theme.colors.surface) as string;

  const {
    control,
    setFocus,
    register,
    setError,
    formState: { errors, isDirty, isSubmitted, isSubmitting },
    handleSubmit,
  } = useForm<FormValues>({
    defaultValues: {
      // product: product.id
      //   ? product.id.toString()
      //   : productId
      //   ? productId
      //   : '',
      product: currentProduct && currentProduct.id.toString(),
      amount: '',
      buyer: vendorId,
      vendor: currentProduct && currentProduct.vendor.id.toString(),
      // vendor: product.vendor.id
      //   ? product.vendor.id.toString()
      //   : product.vendor
      //   ? product.vendor.toString()
      //   : sellerId
      //   ? sellerId
      //   : '',
    },
    mode: 'onChange',
    criteriaMode: 'all',
  });

  // const amount = register('amount', {
  //   validate: {
  //     positive: (v) => parseInt(v) > 0 || 'should be greater than 0',

  //     lessThanPrice: (v) =>
  //       parseInt(v) <= product.price ||
  //       'should not be more than product price',
  //   },
  // });

  const onSubmit: SubmitHandler<FormValues> = async (data, e) => {
    console.log(data, e);
    await makeOffer(
      data.product,
      data.buyer,
      data.amount,
      accessToken
    ).then((response) => {
      if (response.ok) {
        setTimeout(() => {
          navigation && navigation.replace('Products');
        });
      }
    });
  };
  const onError: SubmitErrorHandler<FormValues> = (errors, e) => {
    console.log(errors, e);
    navigation &&
      navigation.reset({
        index: 0,
        routes: [{ name: 'Products' }],
      });
  };

  // console.log('product', product.id);
  console.log('buyer', vendorId);
  // console.log('vendor via product.vendor.id', product.vendor.id);
  // console.log('vendor via product.vendor', product.vendor);

  console.log('currentProduct', currentProduct);
  console.log('product passed', product);

  React.useEffect(() => {
    if (product) {
      setCurrentProduct(product);
      console.log('parent gives', product);
    }
    console.log('child passed', currentProduct && currentProduct.id);
  }, [product]);
  console.log('currentProduct', currentProduct);
  console.log('product passed', product);
  console.log(currentProduct && currentProduct.id);
  return (
    <ScrollView
      style={{ backgroundColor }}
      contentContainerStyle={[
        styles.scrollViewContent,
        { backgroundColor },
      ]}
    >
      <Headline style={styles.centerText}>
        Send a message, get a message
      </Headline>
      <Caption style={styles.centerText}>
        Private Messages are private conversations between you and
        other people on Twitter. Share Tweets, media, and more!
      </Caption>
      <ErrorMessage
        errors={errors}
        name="amount"
        render={({ messages }) => {
          console.log('messages', messages);
          return (
            messages &&
            _.entries(messages).map(([type, message]) => (
              <Caption
                style={{ color: theme.colors.error }}
                key={type}
              >
                {message}
              </Caption>
            ))
          );
        }}
      />
      <React.Fragment>
        <FormBuilder
          control={control}
          setFocus={setFocus}
          formConfigArray={[
            {
              name: 'product',
              type: 'text',
              textInputProps: {
                label: 'Product',
                left: <TextInput.Icon name={'account'} />,
                disabled: true,
              },
              rules: {
                required: {
                  value: true,
                  message: 'Product is required',
                },
              },
            },
            {
              name: 'amount',
              type: 'text',
              textInputProps: {
                label: 'Amount',
                left: <TextInput.Icon name={'lock'} />,
                underlineColor: 'transparent',
                mode: 'outlined',
                textContentType: 'none',
                returnKeyType: 'next',
                keyboardType: 'numeric',

                // onChange: (e) => {
                //   amount.onChange(e);
                //   setError('amount', {
                //     type: 'manual',
                //     message:
                //       'price should be less than product price',
                //   });
                // },

                // value: getAmount,
                // onChangeText: (amount) => setAmount(amount),
              },

              rules: {
                required: {
                  value: true,
                  message: 'Amount is required',
                },
                validate: {
                  positive: (v) =>
                    parseInt(v) > 0 || 'should be greater than 0',

                  lessThanPrice: (v) =>
                    parseInt(v) <= product.price ||
                    'should not be more than product price',
                },
                pattern: {
                  value: /^\-?[0-9]+(?:\.[0-9]{1,2})?/,
                  message: 'Amount is invalid',
                },
                minLength: {
                  value: 3,
                  message:
                    'The Amount must be a valid decimal field.',
                },
                maxLength: {
                  value: 8,
                  message:
                    'The Amount must be between 0 and 999,999.99',
                },
              },
            },
          ]}
        />
        <Button
          mode="contained"
          labelStyle={styles.text}
          style={[styles.button, { marginTop: 24 }]}
          onPress={handleSubmit(onSubmit, onError)}
        >
          Sign Up
        </Button>
      </React.Fragment>
      <Button
        onPress={() => {}}
        style={styles.button}
        mode="contained"
        labelStyle={{ color: 'white' }}
      >
        Write a message
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
