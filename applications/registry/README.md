# Invoice Verifying Application (for insurer)

This application provides a simple app that illustrates how a possible digital ID scheme might function.

Specifically, it delvers an API service delivering third party assurance on an identity. It acts like a trusted third witness to allow transacting parties to submit their public identities for lookup by other parties.

# About the application

This application is written with a node backend and uses Mongodb as a basic keystore.

The application is containerized using docker.

# How to run (using docker-compose without replication but with mongodb replicasets)

The application can be started using the following command using docker-compose:

```bash
docker-compose up --build
```

This should launch the app at http://localhost:8082.

# How to run (using docker swarm with full replication including mongodb replicasets)

The application can be deployed using docker swarm to deliver full high-availability containers and resilience:

Build the image first by running

```bash
docker-compose build
```
To deploy the application to the swarm, run:

```bash
docker stack deploy --compose-file docker-swarm.yaml registry
```

This should launch the app at http://localhost:8082.


