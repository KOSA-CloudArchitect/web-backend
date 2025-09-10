// Jenkinsfile (최종 버전)

pipeline {
    // 에이전트는 쿠버네티스 파드를 사용하며, 상세 정의는 pod-template.yaml 참조
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
                // 멀티브랜치 파이프라인이 현재 브랜치를 자동으로 체크아웃하도록 단순화
                checkout scm
            }
        }

        stage('Build & Test') {
            steps {
                // 'node' 컨테이너에서 빌드 및 테스트 실행
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
                    // withCredentials 블록을 제거하고, Agent Pod가 가진 IRSA 권한을 직접 사용
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
