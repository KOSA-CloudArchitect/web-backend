// Jenkinsfile

pipeline {
    agent {
        kubernetes {
            cloud 'kubernetes'
            yamlFile 'pod-template.yaml'
        }
    }

    environment {
        AWS_REGION      = 'ap-northeast-2'
        ECR_REGISTRY    = '890571109462.dkr.ecr.ap-northeast-2.amazonaws.com'
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

        stage('Build & Push Image') {
            when {
                branch 'main'
            }
            steps {
                script {
                    container('aws-cli') {
                        sh "aws ecr get-login-password --region ${AWS_REGION} | podman login --username AWS --password-stdin ${ECR_REGISTRY}"
                    }
                    
                    container('podman') {
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
