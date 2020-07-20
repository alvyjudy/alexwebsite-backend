# API backend for alex's website


# Note on database

A MySQL database server is used for local development and Google Cloud SQL is
used for deployment. The scripts to configure and start them are stored
in ``scripts`` folder

``initMySQL.js`` will establish a connection to the local server, create
a database "backend" and a few tables. This script should be run just once.
Error is thrown if either the database or any of the table exists already.
To empty the server, use ``mysql`` shell.


# On secrets

The backend is deployed on Google App Engine and requires secrets files
to access the database resource. These secrets are stored on Google Secret
Manager and are fetched at build time, storing into a ``.env`` file, which
is used by the source code. Within the source code, secrets variables are
provided a default for the local MySQL server, e.g.

```
let user = process.env.DB_USER || "value for local MySQL";
let password = process.env.DB_PASS || "pw for local MySQL";
```

# On Google Cloud

This repository is connected to google cloud and a new version of the backend
will be built (service name: "backend") and hosted when a tag matching
``^v[0-9]+$`` (e.g. ``v1``, ``v2``, ..., ``v12``) is pushed.

# HTTP Api references

>Note: `Content-type` must be set to `Application/json` for all request body

## API end point

Local development endpoint: `http://localhost:3002/`

Deployment endpoint: `https://`

## `POST /api/login`

Authenticate the user and create a cookie-based session

**request body**: A JSON object with `email` and `passphrase` key and
corresponding string value:
```
{"email':"example@example.com", "passphrase":"123456"}`
```

## `POST /api/register`

Register a user. Abort if the email already exists.

**Request body**: A JSON object with `email` and `passphrase` key and
corresponding string value:

```
{"email':"example@example.com", "passphrase":"123456"}`
```

## `POST /api/logout`

Delete the cookies and log out the current user

## `GET /api/cart`

Get all the items the current authenticated user has added to the cart

**Response**: An array of `JSON` object

```
[
  {"itemFilename":"...", "itemCount":"..."},
  {"itemFilename":"...", "itemCount":"..."},
  ...
]
```

## `POST /api/cart`

Add or remove items from the shopping cart for the current authenticated user

**Request body**: A `JSON` object with two keys (`toAdd` and `toRemove`),
each corresponding to
an array of object to be either added or removed. The array contains the
object representing individual item, each with a `itemFilename` key. In the
case of `toAdd`, it also contains the `itemCount` key. Note that the backend
does not handle duplication and inserting the same item twice will not result
in its count being incremented. To adjust the count, first remove the item and
then add the item with desired count. The sql database processes `toRemove`
first then `toAdd`.

```
{
	"toAdd":[
		{"itemFilename":"file1.png", "itemCount":3},
		{"itemFilename":"file2.png", "itemCount":1}
	],
  "toRemove":[
    {"itemFilename":"..."},
    {"itemFilename":"..."}
  ]
}
```

## `GET /api/orders`

Obtain a list of order ID for the currently authenticated user

**Response**: a array of int

## `POST /api/orders`

Create a new order for the currently authenticated user

**Response**: an string specifying the newly created order number

## `GET /api/order`

Get a list of items that is associated with a specific order ID

**Request body**: a JSON object with a key `orderID` that correspond to
a string value
```
{"orderID":"12"}
```

## `POST /api/order`

Add a list of items to an order

**Request body**: a JSON object with two keys. `orderID` specifies the
order, and `items` corresponds to a JSON array of objects, each representing
an item, with two keys: `itemFilename` and `itemCount`

```
{
    "orderID": 1,
    "items": [
        {
            "itemFilename": "file1.png",
            "itemCount": 2
        },
        {
            "itemFilename": "file2.png",
            "itemCount": 3
        }
    ]
}
```
