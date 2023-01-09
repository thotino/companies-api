echo "start"
kubectl delete -f ./kubernetes/deployment.yaml
kubectl delete -f ./kubernetes/service.yaml
docker-compose build
minikube image load companies-api:latest
sleep 10
kubectl apply -f ./kubernetes/deployment.yaml
kubectl apply -f ./kubernetes/service.yaml
sleep 10
kubectl get deployments
kubectl get services
echo "end"