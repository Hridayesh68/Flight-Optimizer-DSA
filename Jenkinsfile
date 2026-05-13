pipeline {
    agent any
    
    triggers {
        githubPush()
    }


    environment {
        DOCKER_HUB_USER = 'hridayesh68'
        BACKEND_IMAGE = "hridayesh68/flight-optimizer-dsa-backend"
        FRONTEND_IMAGE = "hridayesh68/flight-optimizer-dsa-frontend"
        REGISTRY_CREDS = 'docker-hub-creds'
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/Hridayesh68/Flight-Optimizer-DSA.git'
            }
        }

        stage('Build Images') {
            steps {
                script {
                    withCredentials([file(credentialsId: 'backend-env', variable: 'ENV_FILE')]) {
                        // Copy the environment file into the client directory so Vite can find it
                        sh "cp $ENV_FILE ./client/.env"
                        
                        sh "docker build -t ${BACKEND_IMAGE}:latest ./server"
                        sh "docker build -t ${FRONTEND_IMAGE}:latest ./client"
                    }
                }
            }
        }


        stage('Push to Docker Hub') {
            steps {
                script {
                    docker.withRegistry('', REGISTRY_CREDS) {
                        sh "docker push ${BACKEND_IMAGE}:latest"
                        sh "docker push ${FRONTEND_IMAGE}:latest"
                    }
                }
            }
        }

        stage('Create Kubernetes Secret') {
            steps {
                script {
                    withCredentials([
                        file(credentialsId: 'backend-env', variable: 'ENV_FILE'),
                        file(credentialsId: 'k8s-config', variable: 'KUBECONFIG')
                    ]) {
                        sh '''
                        kubectl --kubeconfig=$KUBECONFIG delete secret backend-secret --ignore-not-found
                        kubectl --kubeconfig=$KUBECONFIG create secret generic backend-secret --from-env-file=$ENV_FILE
                        '''
                    }
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                script {
                    withCredentials([file(credentialsId: 'k8s-config', variable: 'KUBECONFIG')]) {
                        sh '''
                        kubectl --kubeconfig=$KUBECONFIG apply -f k8s/backend-deployment.yaml
                        kubectl --kubeconfig=$KUBECONFIG apply -f k8s/frontend-deployment.yaml
                        kubectl --kubeconfig=$KUBECONFIG rollout restart deployment/flight-optimizer-backend
                        kubectl --kubeconfig=$KUBECONFIG rollout restart deployment/flight-optimizer-frontend
                        '''
                    }
                }
            }
        }
    }

    post {
        success {
            echo 'Deployment successful! 🚀'
        }
        failure {
            echo 'Deployment failed. Check logs. ❌'
        }
    }
}
