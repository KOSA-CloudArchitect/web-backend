// Jenkinsfile (Final Version for Backend Multibranch Pipeline)

pipeline {
    agent {
        kubernetes {
            cloud 'kubernetes'
            yamlFile 'pod-template.yaml'
        }
    }

    environment {
        AWS_ACCOUNT_ID    = '914215749228' // 👈 새로운 AWS 계정 ID 반영
        AWS_REGION        = 'ap-northeast-2'
        ECR_REGISTRY      = "${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com"
        ECR_REPOSITORY    = 'web-server-backend'
        INFRA_REPO_URL    = 'git@github.com:KOSA-CloudArchitect/infra.git'
        GITHUB_REPO       = 'https://github.com/KOSA-CloudArchitect/web-backend'
    }

    stages {
        // Stage 1: 모든 브랜치에서 공통으로 변수 초기화
        stage('⚙️ Initialize') {
            steps {
                script {
                    env.COMMIT_HASH        = sh(script: "git rev-parse --short HEAD", returnStdout: true).trim()
                    env.GITHUB_COMMIT_URL  = "${env.GITHUB_REPO}/commit/${env.COMMIT_HASH}"
                }
            }
        }

        // Stage 2: develop 브랜치 및 PR에서 코드 및 빌드 검증
        stage('✅ Verification & Build Check') {
            when {
                anyOf {
                    branch 'develop'
                    changeRequest()
                }
            }
            steps {
                container('node') {
                    echo "Running npm install, prisma generate, and build..."
                    sh 'npm install'
                    sh 'npx prisma generate'
                    sh 'npm run build'
                }
                container('podman') {
                    echo "Verifying Docker build..."
                    // 이미지가 정상적으로 빌드되는지만 확인 (푸시 X)
                    sh "podman build -t backend-build-test ."
                    echo "Docker build check completed successfully."
                }
            }
        }

        // Stage 3 & 4: main 브랜치에서만 실제 빌드, 푸시, 배포
        stage('🚀 Build & Push to ECR') {
            when { branch 'main' }
            steps {
                script {
                    env.FULL_IMAGE_NAME    = "${env.ECR_REGISTRY}/${env.ECR_REPOSITORY}:${env.COMMIT_HASH}"

                    // Node.js 빌드는 main 브랜치에서도 필요
                    container('node') {
                        sh 'npm install'
                        sh 'npx prisma generate'
                        sh 'npm run build'
                    }
                    
                    def ecrPassword = container('aws-cli') {
                        withCredentials([aws(credentialsId: 'aws-credentials-manual-test')]) {
                            return sh(script: "aws ecr get-login-password --region ${env.AWS_REGION}", returnStdout: true).trim()
                        }
                    }

                    container('podman') {
                        sh "echo '${ecrPassword}' | podman login --username AWS --password-stdin ${env.ECR_REGISTRY}"
                        sh "podman build -t ${env.FULL_IMAGE_NAME} ."
                        sh "podman push ${env.FULL_IMAGE_NAME}"
                    }
                    echo "Successfully pushed image: ${env.FULL_IMAGE_NAME}"
                }
            }
        }

        stage('🌐 Update Infra Repository') {
            when { branch 'main' }
            steps {
                withCredentials([sshUserPrivateKey(credentialsId: 'github-ssh-key', keyFileVariable: 'SSH_KEY')]) {
                    sh '''
                        set -e
                        export GIT_SSH_COMMAND="ssh -i $SSH_KEY -o IdentitiesOnly=yes -o StrictHostKeyChecking=no"
                        
                        git clone $INFRA_REPO_URL infra_repo
                        cd infra_repo
                        
                        git config user.email "jenkins-ci@example.com"
                        git config user.name "Jenkins CI"
                        
                        mkdir -p image
                        echo "$COMMIT_HASH" > image/web-backend.txt
                        
                        KUSTOMIZE_FILE="kubernetes/namespaces/web-tier,cache-tier/04-applications/kustomization.yaml"
                        sed -i "s/newTag: .*/newTag: $COMMIT_HASH/" $KUSTOMIZE_FILE
                        
                        git add image/web-backend.txt $KUSTOMIZE_FILE
                        git commit -m "Update backend image tag to $COMMIT_HASH" || echo "No changes to commit"
                        git push origin main
                    '''
                }
            }
        }
    }

    // 빌드 후 작업: 수정된 Discord 알림 로직 적용
    post {
        always {
            cleanWs()
        }
        success {
            script {
                if (env.BRANCH_NAME == 'main') {
                    discordSend(
                        description: "✅ main 브랜치에서 빌드 푸시가 성공했습니다.\n\n📌 이미지: `${env.FULL_IMAGE_NAME}`\n🔗 GitHub Commit: [${env.COMMIT_HASH}](${env.GITHUB_COMMIT_URL})",
                        footer: "빌드 번호: ${env.BUILD_NUMBER}",
                        link: env.BUILD_URL,
                        result: currentBuild.currentResult,
                        title: "백엔드 Jenkins Job [MAIN]",
                        webhookURL: "https://discord.com/api/webhooks/1415897323028086804/4FgLSXOR5RU25KqJdK8MSgoAjxAabGzluiNpP44pBGWAWXcVBOfMjxyu0pmPpmqEO5sa"
                    )
                } else if (env.BRANCH_NAME == 'develop') {
                    discordSend(
                        description: "✅ develop 브랜치에서 빌드가 성공했습니다.",
                        footer: "빌드 번호: ${env.BUILD_NUMBER}",
                        link: env.BUILD_URL,
                        result: currentBuild.currentResult,
                        title: "백엔드 Jenkins Job [DEVELOP]",
                        webhookURL: "https://discord.com/api/webhooks/1415897323028086804/4FgLSXOR5RU25KqJdK8MSgoAjxAabGzluiNpP44pBGWAWXcVBOfMjxyu0pmPpmqEO5sa"
                    )
                }
            }
        }
        failure {
            discordSend(
                description: "❌ 백엔드 CI/CD 파이프라인 실패\n\n- 브랜치: `${env.BRANCH_NAME}`\n🔗 GitHub Commit: [${env.COMMIT_HASH}](${env.GITHUB_COMMIT_URL})",
                footer: "빌드 번호: ${env.BUILD_NUMBER}",
                link: env.BUILD_URL,
                result: currentBuild.currentResult,
                title: "백엔드 Jenkins Job",
                webhookURL: "https://discord.com/api/webhooks/1415897323028086804/4FgLSXOR5RU25KqJdK8MSgoAjxAabGzluiNpP44pBGWAWXcVBOfMjxyu0pmPpmqEO5sa"
            )
        }
    }
}
