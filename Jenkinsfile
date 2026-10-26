// ------------------------------------------------------------------
// User Management - FRONTEND app pipeline (Day 4, EKS)  job name: um-frontend
//   build image (Angular build inside Docker + nginx) -> push to ECR
//   -> deploy to EKS -> wait for the rolling update -> print the public URL
// Needs: the um-infra pipeline has run "apply".
// ------------------------------------------------------------------
pipeline {
    agent any

    parameters {
        string(name: 'AWS_REGION', defaultValue: 'ap-south-1', description: 'AWS region of the cluster')
    }

    options {
        disableConcurrentBuilds()
        timeout(time: 30, unit: 'MINUTES')
    }

    environment {
        APP                = 'frontend'
        CLUSTER_NAME       = 'um-eks'
        NAMESPACE          = 'user-management'
        AWS_DEFAULT_REGION = "${params.AWS_REGION}"
        IMAGE_TAG          = "${BUILD_NUMBER}"
        KUBECONFIG         = "${WORKSPACE}/.kubeconfig"
    }

    stages {

        stage('Check infra') {
            steps {
                script {
                    def account = sh(script: 'aws sts get-caller-identity --query Account --output text', returnStdout: true).trim()
                    env.REGISTRY = "${account}.dkr.ecr.${params.AWS_REGION}.amazonaws.com"
                    env.IMAGE    = "${env.REGISTRY}/um-${env.APP}:${env.IMAGE_TAG}"
                }
                sh '''
                    if ! aws eks describe-cluster --name "$CLUSTER_NAME" >/dev/null 2>&1; then
                        echo "EKS cluster $CLUSTER_NAME not found - run the um-infra pipeline (apply) first"
                        exit 1
                    fi
                    aws eks update-kubeconfig --name "$CLUSTER_NAME" --region "$AWS_DEFAULT_REGION"
                    kubectl get namespace "$NAMESPACE" >/dev/null || {
                        echo "Namespace $NAMESPACE missing - run the um-infra pipeline (apply) first"; exit 1; }
                    echo "Will build and deploy: $IMAGE"
                '''
            }
        }

        stage('Build image') {
            steps {
                // The Dockerfile runs npm ci + ng build, so Jenkins needs no Node.js
                sh 'docker build -t "$IMAGE" .'
            }
        }

        stage('Push to ECR') {
            steps {
                sh '''
                    aws ecr get-login-password | docker login --username AWS --password-stdin "$REGISTRY"
                    docker push "$IMAGE"
                '''
            }
        }

        stage('Deploy to EKS') {
            steps {
                sh 'sed "s#IMAGE_PLACEHOLDER#$IMAGE#" k8s/frontend.yaml | kubectl apply -f -'
            }
        }

        stage('Wait for rolling update') {
            steps {
                sh 'kubectl -n "$NAMESPACE" rollout status deployment/frontend --timeout=300s'
            }
        }

        stage('Verify') {
            steps {
                sh '''
                    # AWS needs 1-3 minutes to create the load balancer the first time
                    for i in $(seq 1 60); do
                        HOST=$(kubectl -n "$NAMESPACE" get svc frontend -o jsonpath='{.status.loadBalancer.ingress[0].hostname}')
                        [ -n "$HOST" ] && break
                        echo "Waiting for the load balancer..."; sleep 5
                    done
                    [ -n "$HOST" ] || { echo "Load balancer was not created"; exit 1; }
                    URL="http://$HOST"

                    # ...and a few more minutes until its DNS name works
                    echo "Checking $URL (can take a few minutes the first time)"
                    curl -fsS -o /dev/null --retry 30 --retry-delay 10 --retry-all-errors "$URL/"

                    if curl -fsS -o /dev/null --retry 3 --retry-delay 5 --retry-all-errors "$URL/api/users"; then
                        echo "API reachable through the frontend (nginx -> backend)"
                    else
                        echo "WARNING: page works but /api does not answer yet - has the um-backend pipeline run?"
                    fi

                    echo "=============================================================="
                    echo " APP IS RUNNING"
                    echo " Open in browser : $URL"
                    echo " Image           : $IMAGE"
                    echo "=============================================================="
                '''
            }
        }
    }

    post {
        always {
            sh 'docker image rm "$IMAGE" 2>/dev/null || true'
        }
        failure {
            echo 'Build failed: open the red stage above and read the last error lines.'
        }
    }
}
