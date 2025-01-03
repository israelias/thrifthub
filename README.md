[![runs with Expo Go](https://img.shields.io/badge/Runs%20with%20Expo%20Go-000.svg?style=flat-square&logo=EXPO&labelColor=f3f3f3&logoColor=000)](https://expo.io/client)

[![runs with Expo Go](https://img.shields.io/badge/Runs%20with%20Expo%20Go-4630EB.svg?style=flat-square&logo=EXPO&labelColor=f3f3f3&logoColor=000)](https://expo.io/client)
# ThriftHub
An Online Marketplace Application


An app that allows users to post second-hand goods and connect with vendors interested in such goods.


[TOC levels=3]: # "## Contents"

## Contents
- [UX](#ux)
  - [User Stories](#user-stories)
  - [Wireframes](#wireframes)
- [Features](#features)
  - [Existing Features](#existing-features)
  - [Features Left to Implement](#features-left-to-implement)
- [Technologies](#technologies)
  - [Frameworks and Libraries](#frameworks-and-libraries)
  - [Programs and Software](#programs-and-software)
- [Testing](#testing)
- [Deployment](#deployment)
- [Cloning This Repository](#cloning-this-repository)
- [Credits](#credits)
  - [Acknowledgements](#acknowledgements)
  - [License](#license)

## UX
### User Stories
#### New Visitor Goals
- As a new visitor, I want to have a clear understanding of what the platform offers.
- As a new visitor, I want to be able to register for an account easily.

#### Returning Visitor Goals
- As a returning visitor, I want to log in securely.
- As a returning visitor, I want to create a listing for my second-hand goods.
- As a returning visitor, I want to view my active and inactive listings.
- As a returning visitor, I want to edit the details of my listings.
- As a returning visitor, I want to delete listings that are no longer available.
- As a returning visitor, I want to mark a listing as sold.
- As a returning visitor, I want to connect with the buyer of my listing to coordinate the sale.
- As a returning visitor, I want to process payments securely with buyers.
- As a returning visitor, I want the option to cancel a purchase agreement.

#### Frequent Visitor Goals
- As a frequent visitor, I want to search for listings I have created.
- As a frequent visitor, I want to explore listings created by other users.
- As a frequent visitor, I want to save listings that interest me for future reference.
- As a frequent visitor, I want to view my saved listings easily.
- As a frequent visitor, I want to remove saved listings that are no longer relevant.
- As a frequent visitor, I want to delete my account if I no longer need it.

### Wireframes
#### Concept

The project can be understood as a social network with <em><b>collections</b></em> or <em><b>arrangements</b></em> with the ability to broadcast <em><b>items for sale</b></em> or <em><b>guage prices</b></em> for second-hand goods.

<hr>

<details><summary><em><b>Store </b></em> (items)    </summary>
<br>

[<div style="text-align:center"><img src="https://github.com/israelias/cheathub/blob/master/public/MS3_Wireframes_01.jpg?raw=true" width="600px"></div>](https://github.com/israelias/cheathub/blob/master/public/MS3_Wireframes_01.jpg?raw=true)
<br>
</details>
<hr>


<details><summary><em><b>Categories</b></em> (playlist)   </summary>
<br>

[<div style="text-align:center"><img src="https://github.com/israelias/cheathub/blob/master/public/MS3_Wireframes_02.jpg?raw=true" width="600px"></div>](https://github.com/israelias/cheathub/blob/master/public/MS3_Wireframes_02.jpg?raw=true)

<br>
</details>
<hr>


<details><summary><em><b>Search</b></em> (filter)    </summary>
<br>

[<div style="text-align:center"><img src="https://github.com/israelias/cheathub/blob/master/public/MS3_Wireframes_03.jpg?raw=true" width="600px"></div>](https://github.com/israelias/cheathub/blob/master/public/MS3_Wireframes_03.jpg?raw=true)

<br>
</details>
<hr>

<details><summary><em><b>Membership/payments</b></em> (e-commerce)   </summary>
<br>

[<div style="text-align:center"><img src="https://github.com/israelias/cheathub/blob/master/public/MS3_Wireframes_02.jpg?raw=true" width="600px"></div>](https://github.com/israelias/cheathub/blob/master/public/MS3_Wireframes_02.jpg?raw=true)

<br>
</details>
<hr>

<br>
<p align="right"><a href="#readme-top">back to top</a></p>

## Features
### Existing Features

#### Store
- The `Store` features all product-related capabilities for vendors. This includes managing product listings, categorizing products, and uploading product images. Vendors can organize their store to showcase their items in an easy-to-navigate way.
  
  ##### Capabilities:
  - **Product Management**: Vendors can add, edit, and delete products from their store.
  - **Category Organization**: Products can be grouped into categories for better browsing.
  - **Image Upload**: Vendors can upload and manage product images for each listing.
  
  ##### Actions:
  - Ability to add, edit, and delete products. *(Registered Vendor)*
  - Ability to categorize products and create subcategories. *(Registered Vendor)*
  - Ability to upload and manage product images. *(Registered Vendor)*
  - Ability to `save` and `un-save` a product listing. *(Registered User)*


#### Vendor Registration
- A `Vendor` is attached to each user in order to manage and track their sales. Vendors can also interact with their buyers, including managing product listings and fulfilling orders. The website features the ability to `sign up`, `sign in` and `sign out` in order to conditionally access existing features. A user is based on the `user` model, which requires `username`, `email` and `password` for new users and only the latter two for existing users. For security, only usernames are stored in `local storage` while `tokens` are stored in memory. To ensure `sign out` across multiple open windows, a logout event triggers a `storage event listener` which clears tokens and usernames in the memory of the current window. 
  ##### Capabilities:
  - **Vendor Registration**: Users can register as vendors to sell their products.
  - **Account Management**: Vendors can update their profiles, manage their contact information, and track their sales.
  - **Order Fulfillment**: Vendors can manage their orders, including processing and shipping.
  - **Friendship**: Vendors can add and manage connections with other vendors for networking and collaboration.
  
  ##### Actions:
  - Ability to register as a vendor. *(New User)*
  - Ability to sign in to an account. *(Registered Vendor)*
  - Ability to sign out of an account. *(Registered Vendor)*
  - Ability to edit and update vendor account information. *(Registered Vendor)*
  - Ability to connect with other vendors by adding them as friends. *(Registered Vendor)*
  - Ability to view and manage orders. *(Registered Vendor)*
  - Ability to track and manage sales history. *(Registered Vendor)*

#### Order
- The `Order` section is responsible for handling the purchasing process. Customers can view their orders, check out, and monitor the status of their orders. Vendors are notified when orders are placed and can update the status of these orders.
  
  ##### Capabilities:
  - **Order Creation**: Customers can place orders for products listed by vendors.
  - **Order Status**: Vendors can update the status of the orders (e.g., processing, shipped, completed).
  - **Order History**: Customers and vendors can view past orders.
  
  ##### Actions:
  - Ability to place orders for products. *(Registered User)*
  - Ability to update the status of orders. *(Registered Vendor)*
  - Ability to view order history. *(Registered User, Registered Vendor)*


### Features Left to Implement
#### Collections
- The website should feature the ability to group any and all existing products into named collections aka `bulk deals`. A collection is based on the `collection` model, which is a name and a list of product listings. Each field is represented as either a `form` field or a `header` followed by a `ul` depending on whether a collection is in edit or display mode. 
- ##### Actions:
-  Ability to create, edit and delete a named collection. *(Registered Owner)*
-  Ability to add and remove listings to/from a collection. *(Registered Owner)*

#### Search
- `search_text` indices are attached to the title and description fields of the `product` cluster. The frontend UI of the search feature is designed to return product listings that match a query. Additionally, the ability to query by `tags` and `product_type` is enabled by filtering these existing fields in the database.
- ##### Actions:
 -  Ability to search product listings created by others. *(any User)*
 - Ability to filter product listings by type. *(any User)*
 - Ability to filter product listings by tags. *(any User)*
 -  Ability to `save` or `un-save` product listings from search. *(Registered User)*
 -  Ability to perform `crud` operations on product listings from search. *(Registered Owner)*

## Technologies
### Frameworks and Libraries
  - ### [`cd frontend`](https://github.com/israelias/thrifthub/tree/master/frontend)
    Please visit the [frontend](https://github.com/israelias/thrifthub/tree/master/frontend) sub directory for details on ReactNative Typescript frameworks and libraries.

[Go to frontend](https://github.com/israelias/thrifthub/tree/master/frontend)

  - ### [`cd backend`](https://github.com/israelias/thrifthub/tree/master/backend)
    Please visit the [backend](https://github.com/israelias/thrifthub/tree/master/backend) root directory for details on Python-Django frameworks and libraries.

[Go to backend](https://github.com/israelias/thrifthub/tree/master/backend)

### Programs and Software
- [VSCode:](https://www.vscode.com/) Visual Studiio Code 2020.3.2 by [Microsoft](https://www.microsoft.com/) is the IDE used to locally construct the project
- [Git:](https://git-scm.com/) Git is used as the version control system and is utilized via the WebStorm terminal to `commit` to Git and `push` to GitHub.
- [GitHub:](https://github.com/) GitHub is used to store the project's code and directory upon concurrent `push`es via Git.
- [Adobe InDesign:](https://www.adobe.com/sea/products/xd.html) Adobe InDesign is used to mock wireframes.

<p align="right"><a href="#readme-top">back to top</a></p>

## Testing
### User Testing
- **As a new visitor, I want to have a good understanding of what the website does**
    - User arrives at home page.
      - The screen for `Marketplace` appears with a description of its functionality.
      - User reads description.
    - User continues.
  
- **As a new visitor, I want to be able to register for an account**
    - User clicks `Sign up`.
      - The sign-up form appears.
        - The username field is in focus.
        - User types a username, email, and password.
          - If the username is taken, an error toast alert appears.
        - User modifies the username.
      - User is redirected to their `profile` page.
    - User continues.
    - Review:
    - A user is able to securely create an account.

- **As a Returning Visitor, I want to be able to log in securely**
    - User clicks `Sign in`.
      - The sign-in form appears.
        - The email field is in focus.
        - User enters email and password.
        - User presses enter.
        - A success toast alert appears.
      - User is redirected to their `profile` page.
    - User continues.
  
- **As a Returning Visitor, I want to be able to create a product listing**
    - User clicks `Add New Product`.
      - A form appears.
        - The title field is in focus.
        - User enters title, description, tags, and uploads images.
        - User clicks `Submit`.
          - A success toast alert appears.
      - User is redirected to their `profile` page.
    - User continues.
    - Review:
    - A user is able to successfully create a product listing.

- **As a Returning Visitor, I want to be able to see my product listing**
    - User arrives at `Profile` page.
      - A product listing appears in the user's collection.
    - User continues.
    - Review:
    - A user is able to view their own product listings.

- **As a Returning Visitor, I want to be able to edit my product listing**
    - User clicks `Edit this product`.
      - A form appears.
        - The title field is in focus.
        - User modifies the description, updates the image, and adds a source URL.
        - User adds additional tags.
        - User clicks `Submit`.
          - A success toast alert appears.
      - User is redirected to their `profile` page.
    - User continues.
    - Review:
    - A user is able to successfully edit their product listing.

- **As a Returning Visitor, I want to be able to delete my product listing(s)**
    - User clicks `Edit this product`.
      - A form appears.
        - The title field is in focus.
        - User clicks `Delete`.
          - A confirmation modal appears.
          - The cancel button is in focus.
          - User confirms deletion.
          - The modal closes, and a success toast alert appears.
      - User is redirected to their `profile` page.
    - User continues.

- **As a Returning Visitor, I want to be able to create a collection of my product listings**
    - User clicks `Add New Collection`.
      - A form appears.
        - The `name` field is in focus.
        - User enters a collection name and selects product listings to add.
        - User clicks `Submit`.
          - A success toast alert appears.
      - User is redirected to their `profile` page.
    - User continues.

- **As a Returning Visitor, I want to be able to see collections of my product listings**
    - User arrives at `Profile` page.
      - A `Collections` card appears with product listings inside.
    - User continues.

- **As a Returning Visitor, I want to be able to edit collections of my product listings**
    - User clicks `Edit this Collection`.
      - A form appears.
        - The `name` field is in focus.
        - User renames the collection and adds/removes products using `select` inputs.
        - User clicks `Submit`.
          - A success toast alert appears.
      - User is redirected to their `profile` page.
      - The updated collection appears.
    - User continues.

- **As a Returning Visitor, I want to be able to delete a collection of my product listing(s)**
    - User clicks `Edit this Collection`.
      - A form appears.
        - The name field is in focus.
        - User clicks `Delete`.
          - A confirmation modal appears.
          - The cancel button is in focus.
          - User confirms deletion.
          - The modal closes, and a success toast alert appears.
      - User is redirected to their `profile` page.
    - User continues.

- **As a Returning Visitor, I want to be able to connect with someone interested in my product listing**
    - User clicks `Interested Buyer`.
      - A chat or message option appears with the buyer.
        - User communicates with the interested buyer.
    - User continues.

- **As a Returning Visitor, I want to be able to collect payment from someone purchasing my product**
    - User clicks `View Transaction`.
      - A payment gateway appears.
        - User processes the payment.
    - User continues.

- **As a Returning Visitor, I want to be able to cancel a transaction**
    - User clicks `Cancel Transaction`.
      - A confirmation modal appears.
      - User confirms the cancellation.
    - User continues.

- **As a Returning Visitor, I want to be able to connect with someone with a product I am interested in purchasing**
    - User clicks `Contact Seller`.
      - A chat or message option appears with the seller.
    - User continues.

- **As a Returning Visitor, I want to be able to make payment to someone I am purchasing a product from**
    - User clicks `Proceed to Payment`.
      - A payment gateway appears.
        - User processes the payment.
    - User continues.

- **As a Frequent Visitor, I want to be able to search product listings I have created**
    - User clicks `Search Products`.
      - A feed of all product listings appears.
      - A `Product Search` input field appears.
        - User types search text.
        - Listings return products matching the search text.
        - User filters by `product_type` or `tags`.
        - User clicks `Show All` to see most recent products.
        - Pagination buttons appear, and the user clicks `Next` for additional pages.
    - User continues.

- **As a Frequent Visitor, I want to be able to save product listings created by others**
    - User clicks `Save Product`.
      - A success toast appears.
    - User continues.

- **As a Frequent Visitor, I want to be able to see my saved product listings created by others**
    - User clicks `Saved Listings`.
      - A collection named `Saves` appears.
        - User sees all saved products.
    - User continues.

- **As a Frequent Visitor, I want to be able to un-save product listings created by others I have previously saved**
    - User clicks `Unsave Product`.
      - A success toast appears.
    - User continues.

- **As a Frequent Visitor, I want to be able to delete my account**
    - User clicks `Delete My Account`.
      - A confirmation modal appears.
      - User confirms the deletion.
      - The modal closes, and the user is redirected to the homepage.
      - The user is no longer able to log in with their credentials.
    - User continues.
    - Review:
    - A user is able to securely remove their account from the database.

<p align="right"><a href="#readme-top">back to top</a></p>

### Code Testing
#### Frontend
##### Performance, Accessibility, Best Practices, SEO, PWA
[View Latest Results]()
- Lighthouse via Vercel is used to test performace, which produces unique results on every `git push`. [lighthouse-badges](https://github.com/emazzotta/lighthouse-badges) is used to generate new badges for every deployment by installing ```npm i -g lighthouse-badges``` and pushing the new hashed url to the array of urls:
    ```
    lighthouse-badges 
    -o docs/badges -r 
    -u https://thrifthub.vercel.app/ [... all other urls]
                       
   # Output to docs/badges
   # Badges will contain the respective
      average score(s) of all the urls 
      supplied, combined
    ```
- Lighthouse's metrics, namely Accessibility and Performance generate specific flags on each audit. Adjustments are made on each push that specifically address any issues. 

##### Accessibility Testing
- [ChromeVox Extension](https://chrome.google.com/webstore/detail/chromevox-classic-extensi/kgejglhpjiefppelpmljglcjbhoiplfn?hl=en) was used to ensure that screen-reader accessibility standards are met. This was done by walking through the entire project with the screen-reader plugin enabled. Various adjustments were made following these tests. Notably, the tab-index order of nav elements, and changing refining HTML5 semantic elements for `role` clarity.

##### Browser Testing

- Throughout the development of the project, in-browser dev tools were used to test for consistency across browsers. The browsers themselves were equally used for general use-case testing. The following browsers' per-device applications were accessed with an iPhone 11 Pro, MacBook Pro 15" and iPad Pro 12.9":
- Chrome Version: 83
- Firefox 82
- Opera 72
- Safari 14

<p align="right"><a href="#readme-top">back to top</a></p>

## Deployment

- The project frontend is written in [Typescript]() [ReactNative](), bootstrapped with [Expo]() and deployed with [Snack](). The backend is written in [Python](), developed with [Django Rest Framework]() to serve a restful database via [PostGres](). 
  ### [`cd frontend`](https://github.com/israelias/thrifthub/tree/master/frontend)
  Please visit the [frontend](https://github.com/israelias/thrifthub/tree/master/frontend) root directory for details on deployment steps.
  ### [`cd backend`](https://github.com/israelias/thrifthub/tree/master/backend)
  Please visit the [backend](https://github.com/israelias/thrifthub/tree/master/backend) root directory for details on deployment steps.

## Cloning This Repo
- Clone this repo by running 
  ```bash
  git clone git@github.com:israelias/thrifthub.git
  ```
- at the jump, `cd` to the dir:
  ```bash
  cd thrifthub
  ```
  ### [`cd frontend`](https://github.com/israelias/thrifthub/tree/master/frontend)
  Please visit the [frontend](https://github.com/israelias/thrifthub/tree/master/frontend) root directory for details on required modules via `yarn install` and to start the frontend development server on `localhost:3000`.
  ### [`cd backend`](https://github.com/israelias/thrifthub/tree/master/backend)
  Please visit the [backend](https://github.com/israelias/thrifthub/tree/master/backend) root directory for details on required modules via `requirements.txt` and to start the backend development server on `localhost:8000`.


<p align="right"><a href="#readme-top">back to top</a></p>

## Credits

### Content and Media
- Product listings used to fill the database are random items gathered throughout the development of the project include url references in the product sources. 

### Acknowledgments
#### ESLint and Typescript Configuration
- [ESlint Typescript with Prettier](https://dev.to/benweiser/how-to-set-up-eslint-typescript-prettier-with-create-react-app-3675) 
- [Typescript, ESLint & Prettier with Airbnb style guides on VSCode](https://medium.com/react-courses/react-create-react-app-v3-4-1-a55f3e7a8d6d)
- [Airbnb Javascript style guide — Key takeaway](https://medium.com/docon/airbnb-javascript-style-guide-key-takeaways-ffd0370c053)
-[Config ESLint, Prettier in Typescript React App](https://rajduraisamy.medium.com/config-eslint-prettier-in-typescript-react-app-c92ebf14a896)
#### ReactJS and Typescript References
- [ReactJS Typescript components](https://medium.com/react-courses/instant-write-reactjs-typescript-components-complete-beginners-guide-with-a-cheatsheet-e32a76022a44)

#### DRF with React/NextJS frontend References
- [Next JS | Django Rest Framework - Build an ecommerce store](https://www.youtube.com/watch?v=AuRmc9OTC1s)


### Mentoring
- Aaron Sinnot
- Code Institute tutors
- Fellow Code Institute students

## License
[MIT License](/LICENSE) Copyright (c) 2021 Joem Elias Sanez

<p align="right"><a href="#readme-top">back to top</a></p>