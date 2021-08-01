import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { MaterialBottomTabNavigationProp } from '@react-navigation/material-bottom-tabs';

import {
  useForm,
  SubmitHandler,
  SubmitErrorHandler,
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

import { useVendorData } from '../../context/vendor.context';
import { useAuth } from '../../context/authorization.context';

import {
  makePurchase,
  createOrderDetail,
} from '../../services/get.service';

type FormValues = {
  full_name: string;
  email: string;
  phone_number: string;
  country: string;
  zipcode?: string;
  town_or_city: string;
  street_address1: string;
  street_address2?: string;
  county?: string;
  stripe_pid?: string;
  order: string;
};

export const MakePurchase = ({
  product,
  navigation,
  route,
}: {
  product: ProductStackNavigatorParamList['MakePurchase'];
  navigation?: StackNavigationProp<ProductStackNavigatorParamList>;
  route?: RouteProp<ProductStackNavigatorParamList, 'MakePurchase'>;
}) => {
  const { vendorId, vendor, loadVendorData } = useVendorData();
  const { accessToken } = useAuth();
  const [confirmation, setConfirmation] =
    React.useState<boolean>(false);
  const [getAmount, setAmount] = React.useState<string>('');
  const [getOrderNumber, setOrderNumber] = React.useState<string>('');
  const [status, setStatus] = React.useState<string | undefined>(
    undefined
  );
  const theme = useTheme();
  const backgroundColor = overlay(2, theme.colors.surface) as string;

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
      full_name: '',
      email: '',
      phone_number: '',
      country: '',
      zipcode: '',
      town_or_city: '',
      street_address1: '',
      street_address2: '',
      county: '',
      stripe_pid: '',
      order: getOrderNumber,
    },
    mode: 'onChange',
    criteriaMode: 'all',
  });

  const onConfirm = async () => {
    await makePurchase(
      product.product.id.toString(),
      vendorId || '',
      accessToken
    ).then((response) => {
      if (response.ok) {
        response.json().then((data) => {
          setStatus(data.status);
          setOrderNumber(data.id);
          console.log('MakePurchase: Response order id', data.id);
        });
        console.log(
          'MakePurchase: dispatching response buyer id',
          vendorId
        );
        vendorId && loadVendorData(vendorId);
        setTimeout(() => {
          setConfirmation(true);
        }, 750);
      }
    });
  };

  const onSubmit: SubmitHandler<FormValues> = async (data, e) => {
    console.log('MakeOfferScreen: ValidSubmitData =>', data, e);
    await createOrderDetail(
      accessToken,
      data.order,
      data.full_name,
      data.email,
      data.phone_number,
      data.country,
      data.town_or_city,
      data.street_address1,
      data.street_address2,
      data.county,
      data.stripe_pid,
      data.zipcode
    ).then((response) => {
      if (response.ok) {
        response.json().then((data) => {
          console.log('MakePurchase: success', data);
        });
        console.log('MakePurchase: reloading vendor data');
        vendorId && loadVendorData(vendorId);
        // setTimeout(() => {
        //   navigation && navigation.replace('Products');
        // }, 1720);
      }
    });
  };
  const onError: SubmitErrorHandler<FormValues> = (errors, e) => {
    console.log('MakeOfferScreen: ErrorSubmitData =>', errors, e);
    setStatus('ERROR');
    // navigation &&
    //   navigation.reset({
    //     index: 0,
    //     routes: [{ name: 'Products' }],
    //   });
  };

  console.log(
    'MakePurchase: price from props',
    product.product.price
  );
  console.log('MakePurchase: buyer from context', vendorId);
  console.log('MakePurchase: buyer from context reducer', vendor?.id);

  console.log(
    'MakePurchase: seller from props param extracted',
    product.product.vendor.id
  );

  console.log(
    'MakePurchase: product id from props extracted',
    product.product.id
  );
  console.log('MakePurchase: the product object from props', product);
  console.log('MakePurchase: the route object from props', route);
  console.log(
    'MakePurchase: the navigation object from props',
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
      <Header>{confirmation ? 'Order Details' : 'Purchase'}</Header>
      {confirmation ? (
        <React.Fragment>
          <Caption style={styles.centerText}>
            Fill out your details to receive {product.product.title}.
          </Caption>
          <Headline style={styles.centerText}>Total Amount</Headline>
          <Subheading style={styles.centerText}>
            {product.product.price}
          </Subheading>
        </React.Fragment>
      ) : (
        <React.Fragment>
          <Caption style={styles.centerText}>
            You're about to purchase {product.product.title}. You will
            be led to the order detail form upon hitting confirm.
          </Caption>
          <Headline style={styles.centerText}>Total Amount</Headline>
          <Subheading style={styles.centerText}>
            {product.product.price}
          </Subheading>
        </React.Fragment>
      )}
      <Caption style={styles.centerText}>{status}</Caption>

      {confirmation ? (
        <React.Fragment>
          <FormBuilder
            control={control}
            setFocus={setFocus}
            formConfigArray={[
              {
                name: 'full_name',
                type: 'text',
                textInputProps: {
                  label: 'Full Name',
                  left: <TextInput.Icon name={'account'} />,
                  underlineColor: 'transparent',
                  mode: 'outlined',
                  textContentType: 'name',
                  returnKeyType: 'next',
                  keyboardType: 'default',
                },
                rules: {
                  required: {
                    value: true,
                    message: 'Full name is required',
                  },
                },
              },
              {
                name: 'email',
                type: 'text',
                textInputProps: {
                  label: 'Email',
                  left: <TextInput.Icon name={'lock'} />,
                  underlineColor: 'transparent',
                  mode: 'outlined',
                  textContentType: 'emailAddress',
                  returnKeyType: 'next',
                  keyboardType: 'email-address',
                },

                rules: {
                  required: {
                    value: true,
                    message: 'Email is required',
                  },
                  pattern: {
                    value: /\S+@\S+\.\S+/,
                    // value:
                    //   /[A-Za-z0-9._%+-]{3,}@[a-zA-Z]{3,}([.]{1}[a-zA-Z]{2,}|[.]{1}[a-zA-Z]{2,}[.]{1}[a-zA-Z]{2,})/,
                    message: 'Email is invalid',
                  },
                },
              },
              {
                name: 'phone_number',
                type: 'text',
                textInputProps: {
                  label: 'Phone Number',
                  left: <TextInput.Icon name={'account'} />,
                  underlineColor: 'transparent',
                  mode: 'outlined',
                  textContentType: 'telephoneNumber',
                  returnKeyType: 'next',
                  keyboardType: 'number-pad',
                },
                rules: {
                  required: {
                    value: true,
                    message: 'Phone number is required',
                  },
                },
              },
              {
                name: 'street_address1',
                type: 'text',
                textInputProps: {
                  label: 'Street Address 1',
                  left: <TextInput.Icon name={'account'} />,
                  underlineColor: 'transparent',
                  mode: 'outlined',
                  textContentType: 'streetAddressLine1',
                  returnKeyType: 'next',
                  keyboardType: 'default',
                },
                rules: {
                  required: {
                    value: true,
                    message: 'Street address is required',
                  },
                },
              },
              {
                name: 'street_address2',
                type: 'text',
                textInputProps: {
                  label: 'Street Address 2',
                  left: <TextInput.Icon name={'account'} />,
                  underlineColor: 'transparent',
                  mode: 'outlined',
                  textContentType: 'streetAddressLine2',
                  returnKeyType: 'next',
                  keyboardType: 'default',
                },
              },
              {
                name: 'county',
                type: 'text',
                textInputProps: {
                  label: 'County',
                  left: <TextInput.Icon name={'account'} />,
                  underlineColor: 'transparent',
                  mode: 'outlined',
                  textContentType: 'sublocality',
                  returnKeyType: 'next',
                  keyboardType: 'default',
                },
              },
              {
                name: 'town_or_city',
                type: 'text',
                textInputProps: {
                  label: 'Town or City',
                  left: <TextInput.Icon name={'account'} />,
                  underlineColor: 'transparent',
                  mode: 'outlined',
                  textContentType: 'addressCity',
                  returnKeyType: 'next',
                  keyboardType: 'default',
                },
                rules: {
                  required: {
                    value: true,
                    message: 'Town or City is required',
                  },
                },
              },
              {
                name: 'country',
                type: 'select',
                textInputProps: {
                  label: 'Town or City',
                  left: <TextInput.Icon name={'account'} />,
                  underlineColor: 'transparent',
                  mode: 'outlined',
                  textContentType: 'countryName',
                  returnKeyType: 'next',
                  keyboardType: 'default',
                },
                rules: {
                  required: {
                    value: true,
                    message: 'Country is Required',
                  },
                },
                options: [
                  {
                    label: 'Afganistan',
                    value: 'AF',
                  },
                  {
                    label: 'Denmark',
                    value: 'DM',
                  },
                  {
                    label: 'Philippines',
                    value: 'PH',
                  },
                ],
              },
            ]}
          />
          <Button
            mode="contained"
            labelStyle={styles.text}
            style={[styles.button, { marginTop: 24 }]}
            onPress={handleSubmit(onSubmit, onError)}
          >
            Submit Defails
          </Button>
        </React.Fragment>
      ) : (
        <Button
          mode="contained"
          labelStyle={styles.text}
          style={[styles.button, { marginTop: 24 }]}
          onPress={() => onConfirm}
        >
          Confirm Purchase
        </Button>
      )}

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
