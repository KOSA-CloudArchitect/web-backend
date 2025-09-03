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
        ECR_REPOSITORY_URI = '890571109462.dkr.ecr.ap-northeast-2.amazonaws.com/web-server-backend'
        GITHUB_CREDENTIAL_ID = 'github-pat'
    }

    stages {
        stage('Checkout') {
            steps {
                // 파이프라인 SCM 설정에 따라 web-backend 코드를 자동으로 체크아웃
                checkout scm
            }
        }

        stage('Build Application') {
            steps {
                // 'node' 컨테이너 안에서 빌드 명령어 실행
                container('node') {
                    sh 'npm install'
                    sh 'npx prisma generate' // Dockerfile에 있던 명령어 추가
                    sh 'npm run build'      // TypeScript 컴파일
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
                    container('podman') {
                        sh "echo '${ecrLoginPassword}' | podman login --username AWS --password-stdin ${ECR_REPOSITORY_URI}"
                        
                        def imageTag = "build-${BUILD_NUMBER}"
                        def fullImageName = "${ECR_REPOSITORY_URI}:${imageTag}"
                        
                        // 현재 작업 폴더에 있는 Dockerfile을 사용
                        sh "podman build -t ${fullImageName} ."
                        sh "podman push ${fullImageName}"

                        echo "Successfully pushed image: ${fullImageName}"
                    }
                }
            }
        }
    }
}
