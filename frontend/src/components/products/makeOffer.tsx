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
  Subheading,
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

import {
  useVendorData,
  VendorActionTypes,
} from '../../context/vendor.context';
import { useAuth } from '../../context/authorization.context';

import { makeOffer } from '../../services/get.service';

type FormValues = {
  product: string;
  amount: string;
  vendor: string;
  buyer: string;
};

export const MakeOffer = ({
  product,
  navigation,
  route,
  productId,
  sellerId,
}: {
  product: ProductStackNavigatorParamList['MakeOffer'];
  navigation?: StackNavigationProp<ProductStackNavigatorParamList>;
  route?: RouteProp<ProductStackNavigatorParamList, 'MakeOffer'>;
  productId?: string;
  sellerId?: string;
}) => {
  const { vendorId, vendor, loadVendorData } = useVendorData();
  const { accessToken } = useAuth();

  const [getAmount, setAmount] = React.useState<string>('');
  const [status, setStatus] = React.useState<string | undefined>(
    undefined
  );
  const theme = useTheme();
  const backgroundColor = overlay(2, theme.colors.surface) as string;

  const price = product.product.price;

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
      product: product.product.id.toString(),
      amount: getAmount,
      buyer: vendorId,
      vendor: product.product.vendor.id.toString(),
    },
    mode: 'onChange',
    criteriaMode: 'all',
  });

  const onSubmit: SubmitHandler<FormValues> = async (data, e) => {
    console.log('MakeOfferScreen: ValidSubmitData =>', data, e);
    await makeOffer(
      data.product,
      data.buyer,
      data.amount,
      accessToken
    ).then((response) => {
      if (response.ok) {
        response.json().then((data) => {
          setStatus(data.status);
        });
        console.log(
          'MakeOfferScreen: dispatching response buyer id',
          data.buyer
        );
        loadVendorData(data.buyer);
        setTimeout(() => {
          navigation && navigation.replace('Products');
        }, 1720);
      }
    });
  };
  const onError: SubmitErrorHandler<FormValues> = (errors, e) => {
    console.log('MakeOfferScreen: ErrorSubmitData =>', errors, e);
    navigation &&
      navigation.reset({
        index: 0,
        routes: [{ name: 'Products' }],
      });
  };

  console.log(
    'MakeOfferScreen: price from props',
    product.product.price
  );
  console.log('MakeOfferScreen: buyer from context', vendorId);
  console.log(
    'MakeOfferScreen: buyer from context reducer',
    vendor?.id
  );
  console.log(
    'MakeOfferScreen: seller from props declared',
    sellerId
  );
  console.log(
    'MakeOfferScreen: seller from props param extracted',
    product.product.vendor.id
  );
  console.log(
    'MakeOfferScreen: productid from props declared',
    productId
  );
  console.log(
    'MakeOfferScreen: product id from props extracted',
    product.product.id
  );
  console.log(
    'MakeOfferScreen: the product object from props',
    product
  );
  console.log('MakeOfferScreen: the route object from props', route);
  console.log(
    'MakeOfferScreen: the navigation object from props',
    navigation
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
      <Header>Offer</Header>
      <Caption style={styles.centerText}>
        You're about to make an offer for {product.product.title}. If
        the seller accepts, the item will be marked as sold.
      </Caption>
      <Headline style={styles.centerText}>Original Price</Headline>
      <Subheading style={styles.centerText}>
        {product.product.price}
      </Subheading>
      <Caption style={styles.centerText}>{status}</Caption>
      <ErrorMessage
        errors={errors}
        name="amount"
        render={({ messages }) => {
          console.log('messages', messages);
          return (
            messages &&
            _.entries(messages).map(([type, message]) => (
              <Caption
                style={[
                  styles.centerText,
                  { color: theme.colors.error },
                ]}
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
                placeholder: product.product.title,
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
                label: 'Your Offer Amount',
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

                value: getAmount,
                onChangeText: (amount) => setAmount(amount),
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
                    parseInt(v) <= price ||
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
            {
              name: 'buyer',
              type: 'text',
              textInputProps: {
                label: 'Buyer',
                left: <TextInput.Icon name={'account'} />,
                disabled: true,
                placeholder: vendor?.name,
              },
              rules: {
                required: {
                  value: true,
                  message: 'Buyer is required',
                },
              },
            },
            {
              name: 'vendor',
              type: 'text',
              textInputProps: {
                label: 'Vendor',
                left: <TextInput.Icon name={'account'} />,

                disabled: true,
                placeholder: product.product.vendor.name,
                value: product.product.vendor.id.toString(),
              },
              rules: {
                required: {
                  value: true,
                  message: 'Vendor is required',
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
          Offer
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
