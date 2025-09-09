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
                // 멀티브랜치 파이프라인이 현재 브랜치를 자동으로 체크아웃
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
                // 수동으로 생성한 AWS 인증서를 Agent Pod에 전달
                withCredentials([aws(credentialsId: 'aws-credentials-manual-test')]) {
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
}
