// Jenkinsfile

pipeline {
    agent {
        kubernetes {
            cloud 'kubernetes'
            yamlFile 'pod-template.yaml' // Agent Pod의 설계도는 이 파일을 사용
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
                // UI 설정 대신 코드로 직접 Git Checkout을 수행
                checkout([
                    $class: 'GitSCM',
                    branches: [[name: '*/develop']],
                    userRemoteConfigs: [[
                        url: 'https://github.com/KOSA-CloudArchitect/web-backend.git',
                        // UI 목록 버그와 상관없이 ID로 직접 지정
                        credentialsId: 'github-pat'
                    ]]
                ])
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
            // 'main' 브랜치일 때만 이 단계를 실행
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
