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
    args: ["\$(JENKINS_SECRET)", "\$(JENKINS_NAME)"]
  - name: node
    image: node:18-slim
    command: ["sleep"], args: ["infinity"]
  - name: podman
    image: quay.io/podman/stable
    command: ["sleep"], args: ["infinity"]
    securityContext:
      privileged: true
  - name: aws-cli
    image: amazon/aws-cli:latest
    command: ["sleep"], args: ["infinity"]
"""
        }
    }

    environment {
        AWS_REGION = 'ap-northeast-2'
        ECR_BACKEND_URI = '890571109462.dkr.ecr.ap-northeast-2.amazonaws.com/web-server-backend'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build Application') {
            steps {
                // [수정] dir('backend') 제거
                container('node') {
                    sh 'npm install'
                    sh 'npx prisma generate'
                    sh 'npm run build'
                }
            }
        }

        stage('Build & Push Image') {
            steps {
                script {
                    def ecrLoginPassword
                    container('aws-cli') {
                        ecrLoginPassword = sh(script: "aws ecr get-login-password --region ${AWS_REGION}", returnStdout: true).trim()
                    }
                    // [수정] dir('backend') 제거
                    container('podman') {
                        sh "echo '${ecrLoginPassword}' | podman login --username AWS --password-stdin ${ECR_BACKEND_URI}"
                        
                        def imageTag = "build-${BUILD_NUMBER}"
                        def fullImageName = "${ECR_BACKEND_URI}:${imageTag}"
                        
                        sh "podman build -t ${fullImageName} ."
                        sh "podman push ${fullImageName}"

                        echo "Successfully pushed image: ${fullImageName}"
                    }
                }
            }
        }
    }
}
