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
        // [수정] Clone용과 Push용 Credential ID를 명확히 지정
        GIT_CLONE_CREDENTIAL_ID = 'github-pat'      // Username with password 타입
        GIT_PUSH_CREDENTIAL_ID = 'github-pat-text'  // Secret text 타입
    }

    stages {
        stage('Checkout Application Code') {
            steps {
                dir('web-server-src') {
                    git branch: 'main',
                        credentialsId: GIT_CLONE_CREDENTIAL_ID,
                        url: 'https://github.com/KOSA-CloudArchitect/web-server.git'
                }
            }
        }

        stage('Build & Push Backend') {
            steps {
                // 이 단계는 백엔드 전용이므로 프론트엔드 부분 제거
                script {
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
            }
        }

        // --- [수정] sshagent 대신 withCredentials 사용 및 HTTPS 방식으로 변경 ---
        stage('Update Manifest') {
            steps {
                withCredentials([string(credentialsId: GIT_PUSH_CREDENTIAL_ID, variable: 'GITHUB_TOKEN')]) {
                    sh """
                        # HTTPS와 토큰으로 인증하여 클론
                        git clone https://x-access-token:${GITHUB_TOKEN}@github.com/KOSA-CloudArchitect/CI-CD.git ci-cd-repo
                        cd ci-cd-repo
                        git checkout aws-test

                        git config --global user.email "jenkins@example.com"
                        git config --global user.name "Jenkins CI"

                        # 백엔드 Helm Chart만 수정
                        sed -i "s/tag: .*/tag: \\"${env.BACKEND_IMAGE_TAG}\\"/g" helm-chart/my-web-app/values.yaml
                        sed -i "s|repository:.*|repository: ${ECR_BACKEND_URI}|g" helm-chart/my-web-app/values.yaml

                        git add helm-chart/my-web-app/values.yaml
                        git commit -m "Deploy new backend image: ${env.BACKEND_IMAGE_TAG}"
                        
                        # 클론할 때 사용한 토큰으로 Push
                        git push
                    """
                }
            }
        }
    }
}
