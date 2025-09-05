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
        GITHUB_CREDENTIAL_ID = 'github-pat'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build & Test') {
            steps {
                container('node') {
                    sh 'npm install'
                    sh 'npx prisma generate'
                    sh 'npm run build'
                    // 테스트 코드가 있다면 아래와 같이 추가
                    // sh 'npm run test'
                }
            }
        }

        stage('Build & Push Image') {
            when {
                // main 브랜치에 변경사항이 있을 때만 이 스테이지를 실행
                branch 'main'
            }
            steps {
                script {
                    def ecrLoginPassword
                    container('aws-cli') {
                        ecrLoginPassword = sh(script: "aws ecr get-login-password --region ${AWS_REGION}", returnStdout: true).trim()
                    }
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
