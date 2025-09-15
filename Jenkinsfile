// Jenkinsfile for web-backend CI/CD 디스코드 알림추가

pipeline {
    agent {
        kubernetes {
            cloud 'kubernetes'
            yamlFile 'pod-template.yaml'
        }
    }

    environment {
        AWS_REGION = 'ap-northeast-2'
        ECR_REGISTRY = '150297826798.dkr.ecr.ap-northeast-2.amazonaws.com'
        ECR_REPOSITORY = 'web-server-backend'
        INFRA_REPO_URL = 'git@github.com:KOSA-CloudArchitect/infra.git'
        GITHUB_REPO = 'https://github.com/KOSA-CloudArchitect/web-backend'
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
                    // Git 커밋 해시를 이미지 태그로 사용하고 환경 변수 설정
                    env.COMMIT_HASH = sh(script: "git rev-parse --short HEAD", returnStdout: true).trim()
                    env.GITHUB_COMMIT_URL = "${env.GITHUB_REPO}/commit/${env.COMMIT_HASH}"
                    env.FULL_IMAGE_NAME = "${env.ECR_REGISTRY}/${env.ECR_REPOSITORY}:${env.COMMIT_HASH}"

                    // ECR 로그인
                    def ecrPassword = container('aws-cli') {
                        withCredentials([aws(credentialsId: 'aws-credentials-manual-test')]) {
                            return sh(
                                script: "aws ecr get-login-password --region ${env.AWS_REGION}",
                                returnStdout: true
                            ).trim()
                        }
                    }

                    // 이미지 빌드 및 푸시
                    container('podman') {
                        sh "echo '${ecrPassword}' | podman login --username AWS --password-stdin ${env.ECR_REGISTRY}"
                        sh "podman build -t ${env.FULL_IMAGE_NAME} ."
                        sh "podman push ${env.FULL_IMAGE_NAME}"
                    }

                    echo "Successfully pushed image: ${env.FULL_IMAGE_NAME}"
                }
            }
        }

        stage('Update Infra Repository') {
            when {
                branch 'main'
            }
            steps {
                withCredentials([sshUserPrivateKey(credentialsId: 'github-ssh-key', keyFileVariable: 'SSH_KEY')]) {
                    // ✅ Groovy/Shell 변수 충돌을 막기 위해 작은따옴표 세 개로 변경
                    sh '''
                        # --- 기본 Git 설정 ---
                        export GIT_SSH_COMMAND="ssh -i ${SSH_KEY} -o IdentitiesOnly=yes"
                        mkdir -p ~/.ssh
                        echo "Host github.com\n  StrictHostKeyChecking no" > ~/.ssh/config

                        # --- infra 리포지토리 클론 ---
                        git clone ${env.INFRA_REPO_URL} infra_repo
                        cd infra_repo

                        # --- Git 사용자 정보 설정 ---
                        git config user.email "jenkins@your-domain.com"
                        git config user.name "Jenkins CI"

                        # 1. 참조용으로 web-backend.txt 파일에 새 이미지 태그 기록
                        mkdir -p image
                        echo "${env.COMMIT_HASH}" > image/web-backend.txt
                        
                        # 2. Kustomization 파일 경로 변수 지정
                        KUSTOMIZE_FILE="kubernetes/namespaces/web-tier,cache-tier/04-applications/kustomization.yaml"
                        
                        # 3. sed 명령어로 kustomization.yaml의 newTag 값을 새 태그로 교체
                        sed -i "s/newTag: .*/newTag: "${env.COMMIT_HASH}"/' ${KUSTOMIZE_FILE}
                        
                        echo "kustomization.yaml newTag updated to ${env.COMMIT_HASH}"

                        # 4. 변경된 두 파일(txt, yaml)을 모두 Git에 추가
                        git add image/web-backend.txt ${KUSTOMIZE_FILE}
                        
                        # 5. 커밋 메시지를 새 태그 기준으로 작성
                        git commit -m "Update backend image tag to ${env.COMMIT_HASH}"
                        git push origin main
                    '''
                }
            }
        }
    }

    post {
        success {
            discordSend(
                description: "✅ Backend CI/CD 파이프라인 성공!",
                footer: "빌드 번호: ${env.BUILD_NUMBER} | 이미지: ${env.FULL_IMAGE_NAME}",
                link: env.BUILD_URL,
                result: currentBuild.currentResult,
                title: "백엔드 Jenkins Job",
                webhookURL: "https://discord.com/api/webhooks/1415897323028086804/4FgLSXOR5RU25KqJdK8MSgoAjxAabGzluiNpP44pBGWAWXcVBOfMjxyu0pmPpmqEO5sa"
            )
        }
        failure {
            discordSend(
                description: "❌ Backend CI/CD 파이프라인 실패!",
                footer: "빌드 번호: ${env.BUILD_NUMBER}",
                link: env.BUILD_URL,
                result: currentBuild.currentResult,
                title: "백엔드 Jenkins Job",
                webhookURL: "https://discord.com/api/webhooks/1415897323028086804/4FgLSXOR5RU25KqJdK8MSgoAjxAabGzluiNpP44pBGWAWXcVBOfMjxyu0pmPpmqEO5sa"
            )
        }
    }
}
