import React, { useState, useEffect } from 'react';
import { Button, Image, View, Platform } from 'react-native';
import { List, Checkbox } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '../../context/authorization.context';
import { useVendorData } from '../../context/vendor.context';
import { useController, useForm } from 'react-hook-form';
import { LogicProps } from 'react-native-paper-form-builder/dist/Types/Types';
import {
  API,
  VENDOR_ENDPOINT,
  PRODUCT_ENDPONT,
} from '../../constants/backend.constants';
declare global {
  interface FormDataValue {
    uri: string;
    name: string;
    type: string;
  }

  interface FormData {
    append(
      name: string,
      value: FormDataValue,
      fileName?: string
    ): void;
    set(name: string, value: FormDataValue, fileName?: string): void;
  }
}

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

export function UploadImageField(productId: string) {
  const { accessToken } = useAuth();
  const [images, setImages] = React.useState<ImageInfo[] | null>(
    null
  );

  const formData = new FormData();

  const imagesData =
    images &&
    images.length > 0 &&
    images.forEach((image) =>
      formData.append(
        'images',
        {
          name: image.uri.replace(/^.*[\\\/]/, ''),
          type: 'image/jpg',
          uri:
            Platform.OS === 'android'
              ? image.uri
              : image.uri.replace('file://', ''),
        },
        image.uri.replace(/^.*[\\\/]/, '')
      )
    );

  console.log('UploadImageField(): filename = ' + imagesData);

  const onSubmit = fetch(`${API}/${PRODUCT_ENDPONT}/${productId}/`, {
    method: 'POST',
    body: formData,
    headers: {
      // 'Content-Type': 'multipart/form-data',
      Accept: 'application/json',
      Authorization: 'Bearer ' + accessToken,
    },
  });

  useEffect(() => {
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

  const pickImage = async () => {
    let results = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      allowsMultipleSelection: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(results);

    if (!results.cancelled) {
      // setImages(results.selected.map((result) => result.uri));
      setImages(results.selected.map((result) => result));
    }
  };

  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Button title="Upload images" onPress={pickImage} />
      {images &&
        images.map((image) => (
          <Image
            // source={{ uri: image }}
            source={{ uri: image.uri }}
            style={{ width: 200, height: 200 }}
          />
        ))}
    </View>
  );
}

export const uploadVendorImage = async (image: ImageInfo) => {
  const { accessToken } = useAuth();
  const { vendorId } = useVendorData();

  const data = new FormData();

  const filename = image.uri.replace(/^.*[\\\/]/, '');

  const photoURI =
    Platform.OS === 'android'
      ? image.uri
      : image.uri.replace('file://', '');

  console.log(
    'upoadVendorImage(): filename = ' +
      filename +
      ', URI = ' +
      photoURI
  );

  data.append(
    'images',
    {
      name: filename,
      type: 'image/jpg',
      uri: photoURI,
    },
    filename
  );

  console.log('Doing profile pic upload...');

  return fetch(`${API}/${VENDOR_ENDPOINT}/${vendorId}/`, {
    method: 'PUT',
    body: data,
    headers: {
      'Content-Type': 'multipart/form-data',
      Accept: 'application/json',
      Authorization: 'Bearer ' + accessToken,
    },
  });
};

function TermsCheckBox(props: LogicProps) {
  const { name, rules, shouldUnregister, defaultValue, control } =
    props;
  const { field } = useController({
    name,
    rules,
    shouldUnregister,
    defaultValue,
    control,
  });

  return (
    <List.Item
      title={'Remember me'}
      left={() => (
        <Checkbox.Android
          status={field.value}
          onPress={() => {
            field.onChange(
              field.value === 'checked' ? 'unchecked' : 'checked'
            );
          }}
        />
      )}
    />
  );
}
