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
        // =======================================================================
        // 이 단계에서 UI 설정 대신 코드로 직접 Git Checkout을 수행합니다.
        // =======================================================================
        stage('Checkout') {
            steps {
                // Git checkout을 직접 정의하고, 사용할 인증서 ID를 코드에 명시합니다.
                checkout([
                    $class: 'GitSCM',
                    branches: [[name: '*/develop']],
                    userRemoteConfigs: [[
                        url: 'https://github.com/KOSA-CloudArchitect/web-backend.git',
                        // UI 목록에 보이지 않더라도, ID로 직접 지정하면 정상 동작합니다.
                        credentialsId: 'github-pat'
                    ]]
                ])
            }
        }
        // =======================================================================

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
