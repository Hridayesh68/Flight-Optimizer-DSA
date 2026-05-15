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
                        parallel(
                            "Backend": {
                                dir('server') {
                                    sh "docker build -t ${BACKEND_IMAGE}:latest ."
                                }
                            },
                            "Frontend": {
                                dir('client') {
                                    // Cleaner and safer way to copy the .env file
                                    writeFile file: '.env', text: readFile(ENV_FILE)
                                    sh "docker build -t ${FRONTEND_IMAGE}:latest ."
                                }
                            }
                        )
                    }
                }
            }
        }

        stage('Push to Docker Hub') {
            steps {
                script {
                    docker.withRegistry('', REGISTRY_CREDS) {
                        parallel(
                            "Push Backend": { sh "docker push ${BACKEND_IMAGE}:latest" },
                            "Push Frontend": { sh "docker push ${FRONTEND_IMAGE}:latest" }
                        )
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
                        '''
                    }
                }
            }
        }

        stage('Verify Deployment') {
            steps {
                script {
                    withCredentials([file(credentialsId: 'k8s-config', variable: 'KUBECONFIG')]) {
                        sh '''
                        echo "Waiting for rollout to complete..."
                        kubectl --kubeconfig=$KUBECONFIG rollout status deployment/flight-optimizer-backend --timeout=120s
                        kubectl --kubeconfig=$KUBECONFIG rollout status deployment/flight-optimizer-frontend --timeout=120s
                        
                        echo "Verifying service availability..."
                        kubectl --kubeconfig=$KUBECONFIG get pods -l app=flight-optimizer-backend
                        kubectl --kubeconfig=$KUBECONFIG get pods -l app=flight-optimizer-frontend
                        kubectl --kubeconfig=$KUBECONFIG get svc backend-service
                        kubectl --kubeconfig=$KUBECONFIG get svc frontend-service
                        
                        # Check if ingress exists and is healthy
                        kubectl --kubeconfig=$KUBECONFIG get ingress --all-namespaces || echo "No ingress found or insufficient permissions"
                        '''
                    }
                }
            }
        }
    }

    post {
        success {
            echo 'Deployment successful! 🚀'
            echo 'Verify: frontend deployment updated, ingress still works, /api requests succeed'
        }
        failure {
            echo 'Deployment failed. Check logs. ❌'
        }
        always {
            cleanWs()
        }
    }
}
