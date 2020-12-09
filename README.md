A temperature logger receiving weather information from ESP8266-based sensors.

Work in progress!

Now using meteor, simply use the `meteor` command to start the project.

# Deploy process for Raspberry Pi 4 cluster

Not a very good setup, exposes both a MongoDB pod and a single pod with the Meteor application using fixed IP addresses, but it stays on my internal network with at most two users.

The cluster uses a Raspberry Pi 4 with command-line only Ubuntu Server 64 bits. Recent versions of Mongo DB requires 64 bits.

-  Execute `meteor build ../temp-logger-build --architecture os.linux.x86_64` in the source folder to get the NodeJS meteor build.
-  Copy build from host computer a node in the cluster with `scp /home/cindyp/temperature-logger.tar.gz ubuntu@10.0.1.42:/home/ubuntu/temp-build` to build a Docker image using the right architecture.
-  Extract with `-xf temperature-logger.tar.gz`.
-  Create a docker image from the NodeJS application with `docker build -t cindyptn/temperature-logger .` and the Dockerfile in this folder.
-  Push to the docker repository with `docker push cindyptn/temperature-logger`.
-  See the kubernetes folder for the Kubernetes objects to use.
-  The application is available on port 30000 of the cluster.
