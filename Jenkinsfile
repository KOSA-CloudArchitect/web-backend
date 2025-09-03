pipeline {
    agent {
        kubernetes {
            label 'podman-node-agent'
            yaml """
apiVersion: v1
kind: Pod
spec:
  serviceAccountName: default
  containers:
  - name: jnlp
    image: jenkins/inbound-agent:latest
    args:
    - "\$(JENKINS_SECRET)"
    - "\$(JENKINS_NAME)"
  - name: node
    image: node:18-slim
    command:
    - sleep
    args:
    - infinity
  - name: podman
    image: quay.io/podman/stable
    command:
    - sleep
    args:
    - infinity
    securityContext:
      privileged: true
  - name: aws-cli
    image: amazon/aws-cli:latest
    command:
    - sleep
    args:
    - infinity
"""
        }
    }

    environment {
        AWS_REGION = 'ap-northeast-2'
        ECR_BACKEND_URI = '890571109462.dkr.ecr.ap-northeast-2.amazonaws.com/web-server-backend'
        ECR_FRONTEND_URI = '890571109462.dkr.ecr.ap-northeast-2.amazonaws.com/web-server-frontend'
        GITHUB_CREDENTIAL_ID = 'github-pat'
    }

    stages {
        stage('Checkout Application Code') {
            steps {
                dir('web-server-src') {
                    git branch: 'main',
                        credentialsId: GITHUB_CREDENTIAL_ID,
                        url: 'https://github.com/KOSA-CloudArchitect/web-server.git'
                }
            }
        }

        stage('Build & Push All Services') {
            steps {
                parallel(
                    backend: {
                        script {
                            echo "--- Building & Pushing Backend ---"
                            def ecrLoginPassword
                            container('aws-cli') {
                                ecrLoginPassword = sh(script: "aws ecr get-login-password --region ${AWS_REGION}", returnStdout: true).trim()
                            }
                            dir('web-server-src/backend') {
                                container('node') {
                                    sh 'npm install'
                                    sh 'npm run build'
                                }
                                container('podman') {
                                    sh "echo '${ecrLoginPassword}' | podman login --username AWS --password-stdin ${ECR_BACKEND_URI}"
                                    def imageTag = "backend-build-${BUILD_NUMBER}"
                                    def fullImageName = "${ECR_BACKEND_URI}:${imageTag}"
                                    sh "podman build -t ${fullImageName} ."
                                    sh "podman push ${fullImageName}"
                                    env.BACKEND_IMAGE_TAG = imageTag
                                }
                            }
                        }
                    },
                    frontend: {
                        script {
                            echo "--- Building & Pushing Frontend ---"
                            def ecrLoginPassword
                            container('aws-cli') {
                                ecrLoginPassword = sh(script: "aws ecr get-login-password --region ${AWS_REGION}", returnStdout: true).trim()
                            }
                            dir('web-server-src/frontend') {
                                container('node') {
                                    sh 'npm install'
                                    sh 'npm run build'
                                }
                                container('podman') {
                                    sh "echo '${ecrLoginPassword}' | podman login --username AWS --password-stdin ${ECR_FRONTEND_URI}"
                                    def imageTag = "frontend-build-${BUILD_NUMBER}"
                                    def fullImageName = "${ECR_FRONTEND_URI}:${imageTag}"
                                    sh "podman build -t ${fullImageName} ."
                                    sh "podman push ${fullImageName}"
                                    env.FRONTEND_IMAGE_TAG = imageTag
                                }
                            }
                        }
                    }
                )
            }
        }

        stage('Update Manifests') {
            steps {
                withCredentials([string(credentialsId: GITHUB_CREDENTIAL_ID, variable: 'GITHUB_TOKEN')]) {
                    sh """
                        git clone https://x-access-token:${GITHUB_TOKEN}@github.com/KOSA-CloudArchitect/CI-CD.git ci-cd-repo
                        cd ci-cd-repo
                        git checkout aws-test

                        git config --global user.email "jenkins@example.com"
                        git config --global user.name "Jenkins CI"

                        # Backend Helm Chart 수정
                        sed -i "s/tag: .*/tag: \\"${env.BACKEND_IMAGE_TAG}\\"/g" helm-chart/my-web-app/values.yaml
                        sed -i "s|repository:.*|repository: ${ECR_BACKEND_URI}|g" helm-chart/my-web-app/values.yaml

                        # Frontend Helm Chart 수정 (경로 예시)
                        sed -i "s/tag: .*/tag: \\"${env.FRONTEND_IMAGE_TAG}\\"/g" helm-chart/my-frontend-app/values.yaml
                        sed -i "s|repository:.*|repository: ${ECR_FRONTEND_URI}|g" helm-chart/my-frontend-app/values.yaml

                        git add .
                        git commit -m "Deploy new images: backend ${env.BACKEND_IMAGE_TAG}, frontend ${env.FRONTEND_IMAGE_TAG}"
                        git push
                    """
                }
            }
        }
    }
}
