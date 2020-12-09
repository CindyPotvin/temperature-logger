# Objects for the K3S (Lightweight Kubernetes) cluster on Raspberry Pi 4

kubectl apply -f mongo-pod.yaml
kubectl apply -f mongo-persistent-volume-claim.yaml
kubectl apply -f mongo-persistent-volume.yaml
kubectl apply -f mongo-service.yaml

kubectl apply -f meteor-pod.yaml
kubectl apply -f meteor-service.yaml

# Create persistent folder on the node hosting the MongoDB persistent volume

mkdir /tmp/data/db-temp-logger -p
