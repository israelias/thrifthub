


# TODO
- Factory Data
- Testing 
- User, UserProfile, Favorites, Cart, classes
- Vendor, VendorProfile, Favorites/Orders, Products/Cart classes



#### Stripe
Stripe makes it easy to be PCI compliant. With a proper integration, you will never have access to your customers' payment information.

A typical payment flow with Stripe can be divided in two steps:

Collect the customer's payment information, using the prebuilt [Checkout form](https://stripe.com/docs/payments/checkout), or a form of your own using [Stripe.js](https://stripe.com/docs/js).

In both cases, the card information is sent directly from the customer's browser to Stripe's servers, which return a [card token](https://stripe.com/docs/api/tokens/object). You then send this token to your backend.

On your backend, you use the token to [create a charge](https://stripe.com/docs/api/charges/create).

The token represents a card, but hides the PCI sensitive information (i.e. the whole card number and the CVC) from you.

You can find a simple tutorial for creating charges [here](https://stripe.com/docs/payments/charges-api).

If you don't plan on charging the same customer multiple times (or if you don't mind asking them to provide their card information every time), then you don't necessarily need to store anything in your own database. When you create the charge, you will be immediately informed of the result (success or failure) and can take the necessary actions.