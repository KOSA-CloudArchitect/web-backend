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
                // checkout scm을 사용하여 젠킨스가 현재 빌드 중인 브랜치(main 또는 develop)를
                // 자동으로 인식하게 합니다.
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
            // 'main' 브랜치일 때만 이 단계를 실행
            when {
                branch 'main'
            }
            steps {
                // =======================================================================
                // AWS Credentials를 Agent Pod에 전달하는 블록 추가
                // =======================================================================
                withCredentials([aws(credentials: 'aws-credentials-manual-test')]) {
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
                // =======================================================================
            }
        }
    }
}
