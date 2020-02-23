# Invoice Verifying Application (for insurer)

This application provides a simple app that illustrates how a possible digital ID scheme might function.

Specifically, it delivers the capability to verify the validity of an invoice submitted for claims.

It integrates with the proposed identity registry to obtain a third party source of truth regarding the identity of the issuer of the invoice (i.e. the hospital in this demonstration)

# About the application

This application is written with a node backend and uses Mongodb as a basic keystore.

The application is containerized using docker.

# How to run (using docker-compose without replication but with mongodb replicasets)

The application can be started using the following command using docker-compose:

```bash
docker-compose up --build
```

This should launch the app at http://localhost:8081.

# How to run (using docker swarm with full replication including mongodb replicasets)

The application can be deployed using docker swarm to deliver full high-availability containers and resilience:

Build the image first by running

```bash
docker-compose build
```
To deploy the application to the swarm, run:

```bash
docker stack deploy --compose-file docker-swarm.yaml insurer
```

This should launch the app at http://localhost:8081.


