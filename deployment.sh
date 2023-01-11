echo "start"

kubectl delete -f ./kubernetes/deployment.yaml
kubectl delete -f ./kubernetes/service.yaml
kubectl delete -f ./kubernetes/autoscaler.yaml
kubectl delete -f ./kubernetes/ingress.yaml
docker-compose build
minikube image load companies-api:latest
sleep 10
kubectl apply -f ./kubernetes/deployment.yaml
kubectl apply -f ./kubernetes/service.yaml
kubectl apply -f ./kubernetes/autoscaler.yaml
kubectl apply -f ./kubernetes/ingress.yaml
sleep 10
kubectl get deployments
kubectl get services
kubectl get ingresses
minikube service companies-service --url
echo "end"