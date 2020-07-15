# API backend for alex's website

endpoint: ``HOST/api``

# Reference

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
Manager and are fetched at build time. When deploying directly to App Engine,
first run ``./scripts/buildenv.sh`` which runs the
``gcloud secrets versions`` command
internally and store the secrets in an ``./src/.env`` file that is used by the
source code. Then run ``gcloud app deploy``. When using cloud build, it is
configured to run the ``./buildenv.sh`` with the ``gcloud`` image, whose
authentication is set in the Cloud Build console. The ``.env`` file is deleted
after each deployment. In the case of cloud build, the entire workspace volume
is garbage collected afterwards. Within the source code, secrets variables are
provided a default for the local MySQL server, e.g.

```
let user = process.env.DB_USER || "value for local MySQL";
let password = process.env.DB_PASS || "pw for local MySQL";
```


# On Google Cloud

This repository is connected to google cloud and a new version of the backend
will be built (service name: "backend") and hosted when a tag matching
``^v[0-9]+$`` (e.g. ``v1``, ``v2``, ..., ``v12``) is pushed.
