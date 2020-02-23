# Invoice Verifying Application (for insurer)

This application provides a simple app that illustrates how a possible digital ID scheme might function.

Specifically, it delivers the capability to issue a non-disputable certificate for an invoice.

It can register it's own DID (i.e it is integrated) with the proposed identity registry to provide a third party source of truth.

# About the application

This application is written with a node backend and uses Mongodb as a basic keystore.

The application is containerized using docker.

# How to run (using docker-compose without replication but with mongodb replicasets)

The application can be started using the following command using docker-compose:

```bash
docker-compose up --build
```

This should launch the app at http://localhost:8080.

# How to run (using docker swarm with full replication including mongodb replicasets)

The application can be deployed using docker swarm to deliver full high-availability containers and resilience:

Build the image first by running

```bash
docker-compose build
```
To deploy the application to the swarm, run:

```bash
docker stack deploy --compose-file docker-swarm.yaml hospital
```

This should launch the app at http://localhost:8080.


