import React, { ComponentProps } from "react";
import * as ImagePicker from "expo-image-picker";
// import { ImagePickerTypes } from 'expo-image-picker'
import {
  Image,
  View,
  Platform,
  ScrollView,
  StyleSheet,
  TextInputChangeEventData,
  NativeSyntheticEvent,
} from "react-native";

import { FormBuilder } from "react-native-paper-form-builder";
import { InputSelect } from "react-native-paper-form-builder";

import {
  ControllerRenderProps,
  FieldValues,
  RegisterOptions,
  UseFormStateReturn,
  useController,
  useForm,
  SubmitHandler,
} from "react-hook-form";

import { MaterialBottomTabNavigationProp } from "@react-navigation/material-bottom-tabs";
import {
  Headline,
  Caption,
  useTheme,
  Button,
  TextInput,
  Text,
  Menu,
  TouchableRipple,
  Divider,
  HelperText,
} from "react-native-paper";
import { API, PRODUCT_ENDPONT } from "../../constants/backend.constants";
import { useVendorData } from "../../context/vendor.context";
import { useAuth } from "../../context/auth.context";
import { AuthContext } from "../../context/authUtils";
import { getCategories } from "../../services/get.service";

import { UploadImageField } from "./uploadImageField";

type Props = {
  navigation: MaterialBottomTabNavigationProp<{}>;
};

export declare type OPTIONS = Array<{
  label: string;
  value: string | number;
}>;

export declare type InputSelectProps = {
  field: ControllerRenderProps<FieldValues, string>;
  formState: UseFormStateReturn<FieldValues>;
  textInputProps?: ComponentProps<typeof TextInput>;
  options: OPTIONS;
  CustomTextInput?: any;
  onDismiss?: () => void;
};

export type ImageInfo = {
  uri: string;
  width: number;
  height: number;
  type?: "image" | "video";
  exif?: {
    [key: string]: any;
  };
  base64?: string;
};

const TextFormKeys = ["title", "category", "description", "price", "condition"];

export type FileFormData = {
  images: ImageInfo[] | [];
};

type ProductFormValues = {
  title: string;
  category: string;
  description: string;
  price: string;
  condition: string;
  images: ImageInfo[] | [];
};

export const AddProductScreen = () => {
  const theme = useTheme();
  const backgroundColor = theme.colors.surface;

  const { state } = React.useContext(AuthContext);

  const { vendorId } = useVendorData();

  const [categories, setCategories] = React.useState<Category[]>([]);
  const [categoryOptions, setCategoryOptions] = React.useState<OPTIONS>([
    { label: "Category", value: 0 },
  ]);
  const [images, setImages] = React.useState<ImageInfo[] | []>([]);

  const {
    control,
    setFocus,
    setError,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<ProductFormValues>({
    defaultValues: {
      title: "",
      category: "",
      description: "",
      price: "",
      condition: "",
      images: [],
    },
    mode: "onChange",
  });

  const onChangeText = (
    event: NativeSyntheticEvent<TextInputChangeEventData>
  ) => {
    return {
      value: event.nativeEvent.text,
    };
  };

  const loadCategories = async () => {
    const data = await getCategories();
    if (data) {
      setCategories(data);
    }
  };

  React.useEffect(() => {
    categories &&
      setCategoryOptions(
        categories.map((category) => ({
          label: category.name,
          value: category.id,
        }))
      );
  }, [categories]);

  React.useEffect(() => {
    loadCategories();
  }, []);

  React.useEffect(() => {
    (async () => {
      if (Platform.OS !== "web") {
        const { status } =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          alert("Sorry, we need camera roll permissions to make this work!");
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
      setImages(results.selected.map((result) => result));
    }
  };

  const onSubmit: SubmitHandler<ProductFormValues> = (validatedData) => {
    const imagesForm = new FormData();
    for (const img of images) {
      imagesForm.append("image", img.uri, img + "-");
    }
    const imageData =
      images &&
      images.length > 0 &&
      images.map((image) => ({
        type: image.type ? image.type : "image",
        uri:
          Platform.OS === "android"
            ? image.uri
            : image.uri.replace("file://", ""),
        name: image.uri,
      }));
    const data = new FormData();
    data.append("title", validatedData.title);
    data.append("description", validatedData.description);
    data.append("price", validatedData.price);
    data.append("condition", validatedData.condition);
    data.append("category", validatedData.category);
    // @ts-ignore
    data.append("images", imagesForm, {
      type: "file",
    });

    const request = new Request(`${API}/${PRODUCT_ENDPONT}/`, {
      method: "POST",
      headers: {
        // "Content-Type": "multipart/form-data",
        Authorization: state.userToken ? `Bearer ${state.userToken}` : "",
      },
      credentials: "include",
      body: JSON.stringify(data),
    });

    const res = fetch(request).then((res) => res.json());
    alert(JSON.stringify(res));
  };

  // const formData = new FormData();

  // formData.append("title", getValue("title"));

  // formData.append("detectImg", {
  //   uri: image.uri,
  //   name: "image",
  //   type: "image/jpg",
  // });

  // const response = await fetch("BACKEND_URL", {
  //   method: "POST",
  //   headers: {
  //     "Content-Type": "multipart/form-data",
  //   },
  //   body: formData,
  // });

  return (
    <ScrollView
      style={{ backgroundColor }}
      contentContainerStyle={[styles.scrollViewContent, { backgroundColor }]}
    >
      <Headline style={styles.centerText}>Sell a Product</Headline>
      <Caption style={styles.centerText}>Pick a Product</Caption>
      <Button
        onPress={() => {}}
        style={styles.button}
        mode="contained"
        labelStyle={{ color: "white" }}
      >
        Write a message
      </Button>
      <React.Fragment>
        <React.Fragment>
          <FormBuilder
            control={control}
            setFocus={setFocus}
            formConfigArray={[
              {
                name: "title",
                type: "text",
                textInputProps: {
                  label: "Title",
                  left: <TextInput.Icon name={"account"} />,
                  // value: title,
                  onChange: () => {
                    setError("title", {
                      type: "manual",
                      message: "Don't forget...",
                    });
                  },
                },
                rules: {
                  required: {
                    value: true,
                    message: "Title is required",
                  },
                  maxLength: {
                    value: 255,
                    message: "Title should be less than 255 characters.",
                  },
                },
              },
              {
                name: "description",
                type: "text",
                textInputProps: {
                  label: "Description",
                  left: <TextInput.Icon name={"email"} />,
                  onChange: async (e) => {
                    const value = e.nativeEvent.text;
                    if (value === "") {
                      setValue("description", value);
                    }
                    setValue("description", value);
                  },
                },
                rules: {
                  required: {
                    value: false,
                    message: "Description is optional",
                  },
                },
              },
              {
                name: "price",
                type: "text",
                textInputProps: {
                  label: "Price",
                  left: <TextInput.Icon name={"lock"} />,
                  onChange: (event) => {
                    onChangeText(event);
                  },
                },
                rules: {
                  required: {
                    value: true,
                    message: "Price is required",
                  },
                  pattern: {
                    value: /^(\d*([.,](?=\d{3}))?\d+)+((?!\2)[.,]\d\d)?$/gm,
                    message: "Price is invalid",
                  },
                  minLength: {
                    value: 3,
                    message: "The price must be a valid decimal field.",
                  },
                  maxLength: {
                    value: 8,
                    message: "The price must be between 0 and 999,999.99",
                  },
                },
              },
              {
                name: "condition",
                type: "autocomplete",
                textInputProps: {
                  label: "Condition",
                  left: <TextInput.Icon name={"office-building"} />,
                  // onChange
                },
                rules: {
                  required: {
                    value: true,
                    message: "Condition is required",
                  },
                },
                options: [
                  {
                    label: "Mint",
                    value: 5,
                  },
                  {
                    label: "New",
                    value: 4,
                  },
                  {
                    label: "Good",
                    value: 3,
                  },
                  {
                    label: "Fair",
                    value: 2,
                  },
                  {
                    label: "Damaged",
                    value: 1,
                  },
                ],
              },
              {
                name: "category",
                type: "select",
                textInputProps: {
                  label: "Category",
                  left: <TextInput.Icon name={"account"} />,
                },
                rules: {
                  required: {
                    value: true,
                    message: "Category is required",
                  },
                },
                options: categoryOptions,
              },
            ]}
          />
          <Button mode={"contained"} onPress={pickImage}>
            Upload Images{" "}
          </Button>
          <View
            style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
          >
            {images &&
              images.map((image) => (
                <Image
                  source={{ uri: image.uri }}
                  style={{ width: 200, height: 200 }}
                />
              ))}
          </View>
          <Button mode={"contained"} onPress={handleSubmit(onSubmit)}>
            Submit
          </Button>
        </React.Fragment>
        {errors.title && <Text>{errors.title.message}</Text>}
      </React.Fragment>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollViewContent: {
    flex: 1,
    paddingHorizontal: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  centerText: {
    textAlign: "center",
  },
  button: {
    marginTop: 20,
  },
});

// function ImageUpload() {
//   const { register, handleSubmit } = useForm();

//   const onSubmit = async (data) => {
//     const formData = new FormData();
//     formData.append("picture", data.picture[0]);

//     const res = await fetch("http://localhost:4000/picture", {
//       method: "POST",
//       body: formData,
//     }).then((res) => res.json());
//     alert(JSON.stringify(res));
//   };

//   return (
//     <form onSubmit={handleSubmit(onSubmit)}>
//       <input ref={register} type="file" name="picture" />
//       <button>Submit</button>
//     </form>
//   );
// }

// const CategoriesSelect = (props: InputSelectProps) => {
//   const {
//     formState,
//     field,
//     textInputProps,
//     options,
//     CustomTextInput,
//     onDismiss = () => {},
//   } = props;
//   const theme = useTheme();
//   const errorMessage = formState.errors?.[field.name]?.message;
//   const textColor = errorMessage ? theme.colors.error : theme.colors.text;
//   const [visible, setVisible] = useState(false);
//   const [width, setWidth] = useState(0);
//   const [height, setHeight] = useState(0);
//   const INPUT = CustomTextInput ?? TextInput;

//   const styles = useMemo(
//     () =>
//       StyleSheet.create({
//         textInputStyle: {
//           color: textColor,
//         },
//         menuStyle: {
//           minWidth: width,
//           width: width,
//           marginTop: height,
//         },
//       }),
//     [height, textColor, theme.colors.onSurface, theme.colors.surface, width]
//   );

//   const onLayout = useCallback((event: LayoutChangeEvent) => {
//     const { width: _width, height: _height } = event.nativeEvent.layout;
//     setWidth(_width);
//     setHeight(_height);
//   }, []);
//   return (
//     <React.Fragment>
//       <Menu
//         visible={visible}
//         onDismiss={() => setVisible(false)}
//         style={styles.menuStyle}
//         anchor={
//           <TouchableRipple
//             onPress={() => {
//               Keyboard.dismiss();
//               setVisible(true);
//             }}
//           >
//             <View pointerEvents={"none"} onLayout={onLayout}>
//               <INPUT
//                 ref={field.ref}
//                 mode={"outlined"}
//                 error={errorMessage ? true : false}
//                 {...textInputProps}
//                 value={
//                   options.find(({ value }) => `${value}` === `${field.value}`)
//                     ?.label
//                 }
//                 onFocus={() => {
//                   Keyboard.dismiss();
//                   setVisible(true);
//                 }}
//                 style={[styles.textInputStyle, textInputProps?.style]}
//               />
//             </View>
//           </TouchableRipple>
//         }
//       >
//         {options.map(({ label: _label, value: _value }, _index) => {
//           return (
//             <Fragment key={_value}>
//               <Menu.Item
//                 title={_label}
//                 style={{ width, minWidth: width, maxWidth: width }}
//                 onPress={() => {
//                   field.onChange(`${_value}`);
//                   setVisible(false);
//                   !!onDismiss && onDismiss();
//                 }}
//                 titleStyle={{
//                   color:
//                     `${_value}` === `${field.value}`
//                       ? theme.colors.primary
//                       : theme.colors.text,
//                 }}
//               />
//               {_index < options.length - 1 && <Divider />}
//             </Fragment>
//           );
//         })}
//       </Menu>
//       {errorMessage && <HelperText type={"error"}>{errorMessage}</HelperText>}
//     </React.Fragment>
//   );
// };
