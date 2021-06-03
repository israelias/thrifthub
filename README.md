# MS4 Thrift-Hub
An online thriftstore.

An app that allows users to post second-hand goods and connect with members interested in such goods.


[TOC levels=3]: # "## Contents"
## Contents
- [UX](#ux)
  - [User Stories](#user-stories)
  - [Wireframes](#wireframes)
  - [Design](#design)
- [Features](#features)
  - [Existing Features](#existing-features)
  - [Features Left to Implement](#features-left-to-implement)
- [Technologies](#technologies)
  - [Frameworks and Libraries](#frameworks-and-libraries)
  - [Programs and Software](#programs-and-software)
- [Notes](#notes)
- [Testing](#testing)
- [Deployment](#deployment)
- [Cloning This Repository](#cloning-this-repository)
- [Credits](#credits)
  - [Code](#code)
  - [Content and Media](#content-and-media)
  - [Acknowledgements](#acknowledgements)

## UX
### User Stories
#### New Visitor Goals
- As a new vistor, I want to have a good understanding of what the website does.
- As a new visitor, I want to be able to register for an account.
#### Returning Visitor Goals
- As a Returning Visitor, I want to be able to log in securely.
- As a Returning Visitor, I want to be able to create a listing.
- As a Returning Visitor, I want to be able to see my listing.
- As a Returning Visitor, I want to be able to edit my listing.
- As a Returning Visitor, I want to be able to delete my listing.
- As a Returning Visitor, I want to be able to sell my listing.
- As a Returning Visitor, I want to be able to connect with who is purchasing my listing.
- As a Returning Visitor, I want to be able to collect payment from who is purchasing my listing.
- As a Returning Visitor, I want to be able to cancel the purchase of my listing.
#### Frequent Visitor Goals
- As a Frequent Visitor, I want to be able to search listings I have created.
- As a Frequent Visitor, I want to be able to search listings created by others.
- As a Frequent Visitor, I want to be able to save listings created by others.
- As a Frequent Visitor, I want to be able to see my saved listings created by others.
- As a Frequent Visitor, I want to be able to remove listings created by others I have previously saved.
- As a Frequent Visitor, I want to  able to delete my account.

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

### Design

#### Theme


#### Colors


## Features
### Existing Features

#### User Registration
- The website features the ability to `sign up`, `sign in` and `sign out` in order to conditionally access existing features. A user is based on the `user` model, which requires `username`, `email` and `password` for new users and only the latter two for existing users. For security, only usernames are stored in `local storage` while `tokens` are stored in memory. To ensure `sign out` across multiple open windows, a logout event triggers a `storage event listener` which clears tokens and usernames in the memory of the current window. 
- ##### Actions:
-  Ability to create an account. *(any User)*
-  Ability to sign in to an account. *(Registered Owner)*
-  Ability to sign out of an account. *(Registed Owner)*
#### Products
- The website features the ability to create, update and delete a product listing. A product listing is based on the `Product` model and each field is represented as either a `form` field or a `section` in an `article` depending on whether a product is being edited or being featured. 
- ##### Actions:
-  Ability to create, edit and delete a product listing. *(Registered Owner)*
- Ability to `save` and `un-save` a product listing. *(Registered User)*

#### Collections
- The website features the ability to group any and all existing products into named collections aka `bulk deals`. A collection is based on the `collection` model, which is a name and a list of product listings. Each field is represented as either a `form` field or a `header` followed by a `ul` depending on whether a collection is in edit or display mode. 
- ##### Actions:
-  Ability to create, edit and delete a named collection. *(Registered Owner)*
-  Ability to add and remove snippets to/from a collection. *(Registered Owner)*

#### Search
- `search_text` indices are attached to the title and description fields of the `product` cluster. The frontend UI of the search feature is designed to return product listings that match a query. Additionally, the ability to query by `tags` and `product_type` is enabled by filtering these existing fields in the database.
- ##### Actions:
 -  Ability to search product listings created by others. *(any User)*
 - Ability to filter product listings by type. *(any User)*
 - Ability to filter product listings by tags. *(any User)*
 -  Ability to `save` or `un-save` product listings from search. *(Registered User)*
 -  Ability to perform `crud` operations on product listings from search. *(Registered Owner)*

### Features Left to Implement
- Add query params to all resources
- User profile page
- Ability to add friends

## Technologies
### Frameworks and Libraries
  - ### [`cd frontend`](https://github.com/israelias/django-react-ecommerce/tree/master/frontend)
    Please visit the [frontend](https://github.com/israelias/django-react-ecommerce/tree/master/frontend) sub directory for details on ReactJS Typescript frameworks and libraries.\

[Go to frontend](https://github.com/israelias/django-react-ecommerce/tree/master/frontend)

  - ### [`cd backend`](https://github.com/israelias/django-react-ecommerce/tree/master/backend)
    Please visit the [backend](https://github.com/israelias/django-react-ecommerce/tree/master/backend) root directory for details on Python-Django frameworks and libraries.

[Go to backend](https://github.com/israelias/django-react-ecommerce/tree/master/backend)

### Programs and Software
- [VSCode:](https://www.vscode.com/) Visual Studiio Code 2020.3.2 by [Microsoft](https://www.microsoft.com/) is the IDE used to locally construct the project
- [Git:](https://git-scm.com/) Git is used as the version control system and is utilized via the WebStorm terminal to `commit` to Git and `push` to GitHub.
- [GitHub:](https://github.com/) GitHub is used to store the project's code and directory upon concurrent `push`es via Git.
- [Adobe InDesign:](https://www.adobe.com/sea/products/xd.html) Adobe InDesign is used to mock wireframes.

## Notes
- ....

## Testing
### User Testing
-  As a new vistor, I want to have a good understanding of what the website does
    - User arrives at home page.
      - The screen for `Cheathub` appears with a description of its functionality.
      - User reads description.
    - User continues.
 
- As a new visitor, I want to be able to register for an account.
    - User is clicks `Switch to sign up `
        - The sign up form appears
            - The username field is in focus
            - User types types a username, email and password.
              - The username is taken.
              - An error toast alert appears.
            - User modifies username
        - User is redirected to his/her `collections` profile.
    - User continues
    - Review:
    - A user is able to securely create an account.
- As a Returning Visitor, I want to be able to log in securely.
    - User clicks `Switch to sign in`
      - The sign in form appears
            - The email field is in focus
            - User types types email and password.
            - User hits enter.
            - A success toast alert appears.
        - User is redirected to his/her `collections` profile.
    - User continues
  
- As a Returning Visitor, I want to be able to create a product listing
    - User clicks `Add new product`
      - A form appears.
        - The title field is in focus.
          - User inputs `title`, `description`, `tags`
          - User uploads images.
        - User clicks submit.
          - A success toast alert appears.
      - User is redirected to his/her `collections` profile.
    - User continues
    - Review:
    - ... 
- As a Returning Visitor, I want to be able to see my product listing.
    - User arrives at `Collections` profile.
      - A product listing appears.
        - User sees product listing interface with his/her 
    - User continues
    - Review:
    - ... 
- As a Returning Visitor, I want to be able to edit my product listing.
    - User clicks `Edit this product`
      - A form appears.
        - The title field is in focus.
          - User modifies `description`
          - User updates image.
          - User adds optional `source` url.
          - User adds additional optional `tags`
        - User clicks submit.
          - A success toast alert appears.
      - User is redirected to his/her `collections` profile.
    - User continues
 
- As a Returning Visitor, I want to be able to delete my product listing(s).
    - User clicks `Edit this product`
      - A form appears.
        - The title field is in focus.
          - User clicks `Delete`
            - Modal appears
            - The cancel button is in focus
            - User confirms
          - The modal is closed
          - A success toast alert appears.
      - User is redirected to his/her `collections` profile.
    - User continues

- As a Returning Visitor, I want to be able to create a collection of my product listings.
    - User clicks `Add New Collection`
      - A form appears.
        - The `name` field is in focus.
          - User inputs names collection
          - User selects existing listings to add.
        - User clicks submit.
          - A success toast alert appears.
      - User is redirected to his/her `collections` profile.
    - User continues
- As a Returning Visitor, I want to be able to see collections of my product listings.
    - User arrives at `Collections` profile.
      - A `collections` card appears.
        - User sees `collection` interface that includes product listings added.
    - User continues

- As a Returning Visitor, I want to be able to edit collections of my product listings.
    - User clicks `Edit this Collection`
      - A form appears.
        - The `name` field is in focus.
          - User renames collection.
          - User uses `select` input add more products.
          - User uses `select` input to remove previous products.
        - User clicks submit.
          - A success toast alert appears.
      - User is redirected to his/her `collections` profile.
      - An updated `collection` appears.
    - User continues

- As a Returning Visitor, I want to be able to delete a collection of my product listing(s).
    - User clicks `Edit this Collection`
      - A form appears.
        - The name field is in focus.
          - User clicks `Delete`
            - Modal appears
            - The cancel button is in focus
            - User confirms
          - The modal is closed
          - A success toast alert appears.
      - User is redirected to his/her `collections` profile.
    - User continues

- As A Returning Visitor, I want to be able to connect with someone interested in my product listing.
    - ...
      - ...
        - ....
        - ...
          - ...
          - ...
    - User continues

- As A Returning Visitor, I want to be able to collect payment from someone purchasing my product.
    - ...
      - ...
        - ....
        - ...
          - ...
          - ...
    - User continues

- As A Returning Visitor, I want to be able to cancel a transaction.
    - ...
      - ...
        - ....
        - ...
          - ...
          - ...
    - User continues

- As A Returning Visitor, I want to be able to connect with someone with a product I am interested in purchasing.
    - ...
      - ...
        - ....
        - ...
          - ...
          - ...
    - User continues

- As A Returning Visitor, I want to be able to make payment to someone I am purchasing a product from.
    - ...
      - ...
        - ....
        - ...
          - ...
          - ...
    - User continues

- As a Frequent Visitor, I want to be able to search product listings I have created.
    - User clicks `Products`
      - User is rerouted to `Products` page.
      - A feed of all product listings appear.
      - The `Product Search` input appears.   
      - The `search` field is in focus.
        - User types a `search text`
          - The listings return products that match `search text`
        - User uses `select` input to query by `product_type`
          - The listings return products of `product_type`
        - User uses `select` input to query by `tags`
          - The listings return products that include input `tag`
        - User clickes `Show All`
          - The listings return most recent products posted.
        - User scrolls to end of page 
          - The `pagination` buttons appear
          - User clicks `Next`
            - Listings for next page appear.
      - User continues

- As a Frequent Visitor,  I want to be able to save product listings created by others.
    - User is in `Products` page.
      - A feed of all product listings appear.
        - User finds a product listing.
        - User clicks `Save`  
          - A success toast appears 
    - User continues

- I want to be able to see my saved product listings created by others.
    - User is in `Collections` page.
      - A collection named `Saves` appears.
        - User finds all saved products as a collection.
    - User continues
- As a Frequent Visitor, I want to be able to un-save product listings created by others I have previously saved.
    - User is in `Products` page.
      - A feed of all product lustings appear.
        - User finds a product listing.
        - User clicks `UnSave`  
          - A success toast appears 
        - User clicks `Collections`
        - The faves collection appears.
        - User sees updated Saves.
    - User continues

- As a Frequent Visitor, I want to be able to delete my account.
    - User is clicks `Delete my account`
      - Modal appears
          - The cancel button is in focus
            - User confirms
          - The modal is closed
        - Page is redirected to `/`
        - User is no longer able to log in with credentials
    - User continues
    - Review:
    - A user is able to securely remove his/her history from the database.


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

## Deployment

- The project frontend is written in [Typescript]() developed with [React](https://reactjs.org/), bootstrapped with [Create React App](https://github.com/facebook/create-react-app) and deployed with [Vercel](https://nextjs.org/docs/deployment). The backend is written in [Python](), developed with [Django Rest Framework]() to serve a restful database via [PostGres](). 
  ### [`cd frontend`](https://github.com/israelias/django-react-ecommerce/tree/master/frontend)
  Please visit the [frontend](https://github.com/israelias/django-react-ecommerce/tree/master/frontend) root directory for details on deployment steps.
  ### [`cd backend`](https://github.com/israelias/django-react-ecommerce/tree/master/backend)
  Please visit the [backend](https://github.com/israelias/django-react-ecommerce/tree/master/backend) root directory for details on deployment steps.

## Cloning This Repo
- Clone this repo by running `git clone httpsL//github.com/israelias/django-react-ecommerce`
- at the jump, `cd` to the name of this repo:
`cd django-react-ecommerce`
  ### [`cd frontend`](https://github.com/israelias/cheathub/tree/master/frontend)
  Please visit the [frontend](https://github.com/israelias/cheathub/tree/master/frontend) root directory for details on required modules via `yarn install` and to start the frontend development server on `localhost:3000`.
  ### [`cd backend`](https://github.com/israelias/cheathub/tree/master/backend)
  Please visit the [backend](https://github.com/israelias/cheathub/tree/master/backend) root directory for details on required modules via `requirements.txt` and to start the backend development server on `localhost:8000`.

[Go to frontend](https://github.com/israelias/django-react-ecommerce/tree/master/frontend)\
[Go to backend](https://github.com/israelias/django-react-ecommerce/tree/master/backend)

## Credits

### Content and Media
- Product listings used to fill the database are random items gathered throughout the development of the project include url references in the product sources. 

### Acknowledgments
#### ESLint and Typescript Configuration
- [ESlint Typescript with Prettier](https://dev.to/benweiser/how-to-set-up-eslint-typescript-prettier-with-create-react-app-3675) 
- [Create-React-App: Typescript, ESLint & Prettier with Airbnb style guides on VSCode](https://medium.com/react-courses/react-create-react-app-v3-4-1-a55f3e7a8d6d)
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