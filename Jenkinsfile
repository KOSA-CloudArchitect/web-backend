// Jenkinsfile (최종 버전)

pipeline {
    agent {
        kubernetes {
            cloud 'kubernetes'
            yamlFile 'pod-template.yaml'
        }
    }

    environment {
        AWS_REGION      = 'ap-northeast-2'
        ECR_REGISTRY    = '150297826798.dkr.ecr.ap-northeast-2.amazonaws.com'
        ECR_REPOSITORY  = 'web-server-backend'
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
                }
            }
        }


        stage('Debug Information') {
            steps {
                container('aws-cli') {
                    sh '''
                        echo "--- Checking AWS Identity INSIDE THE POD ---"
                        aws sts get-caller-identity
                    '''
                }
            }
        }


        stage('Build & Push Image') {
            when {
                branch 'main'
            }
            steps {
                script {
                    // 1. aws-cli 컨테이너에서 ECR 비밀번호를 가져와 변수에 저장
                    def ecrPassword = container('aws-cli') {
                        sh(script: "aws ecr get-login-password --region ${AWS_REGION}", returnStdout: true).trim()
                    }

                    // 2. podman 컨테이너에서 위 비밀번호를 사용하여 로그인하고 이미지를 푸시
                    container('podman') {
                        sh "echo '${ecrPassword}' | podman login --username AWS --password-stdin ${ECR_REGISTRY}"

                        def imageTag = "build-${BUILD_NUMBER}"
                        def fullImageName = "${ECR_REGISTRY}/${ECR_REPOSITORY}:${imageTag}"
                        
                        sh "podman build -t ${fullImageName} ."
                        sh "podman push ${fullImageName}"

                        echo "Successfully pushed image: ${fullImageName}"
                    }
                }
            }
        }
    }
}
