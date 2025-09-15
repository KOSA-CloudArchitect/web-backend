// Jenkinsfile for web-backend CI/CD with branch-specific logic and Discord notifications

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
                    env.COMMIT_HASH = sh(script: "git rev-parse --short HEAD", returnStdout: true).trim()
                    env.GITHUB_COMMIT_URL = "${env.GITHUB_REPO}/commit/${env.COMMIT_HASH}"
                    env.FULL_IMAGE_NAME = "${env.ECR_REGISTRY}/${env.ECR_REPOSITORY}:${env.COMMIT_HASH}"

                    def ecrPassword = container('aws-cli') {
                        withCredentials([aws(credentialsId: 'aws-credentials-manual-test')]) {
                            return sh(
                                script: "aws ecr get-login-password --region ${env.AWS_REGION}",
                                returnStdout: true
                            ).trim()
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

        stage('Update Infra Repository') {
            when {
                branch 'main'
            }
            steps {
                withCredentials([sshUserPrivateKey(credentialsId: 'github-ssh-key', keyFileVariable: 'SSH_KEY')]) {
                    sh(script: '''
                        #!/bin/bash
                        set -e

                        # Configure Git to use the provided SSH key without host key checking
                        export GIT_SSH_COMMAND="ssh -i $SSH_KEY -o IdentitiesOnly=yes -o StrictHostKeyChecking=no"

                        # Clone the infra repository into a separate directory
                        git clone $INFRA_REPO_URL infra_repo
                        cd infra_repo

                        # Configure Git user for the commit
                        git config user.email "jenkins-ci@example.com"
                        git config user.name "Jenkins CI"

                        # 1. Write the new image tag to a text file for record-keeping
                        mkdir -p image
                        echo "$COMMIT_HASH" > image/web-backend.txt

                        # 2. Define the path to the kustomization file
                        KUSTOMIZE_FILE="kubernetes/namespaces/web-tier,cache-tier/04-applications/kustomization.yaml"

                        # 3. Use sed to update the newTag value
                        sed -i "s/newTag: .*/newTag: $COMMIT_HASH/" $KUSTOMIZE_FILE

                        echo "kustomization.yaml newTag updated to $COMMIT_HASH"

                        # 4. Add both the text file and kustomization.yaml to the commit
                        git add image/web-backend.txt $KUSTOMIZE_FILE

                        # 5. Commit the changes with a descriptive message
                        git commit -m "Update backend image tag to $COMMIT_HASH" || echo "No changes to commit"
                        git push origin main
                    ''', shell: '/bin/bash')
                }
            }
        }
    }

    post {
        success {
            discordSend(
                description: "✅ Backend CI/CD Pipeline Succeeded! [Branch: ${env.BRANCH_NAME}]",
                footer: "Build Number: ${env.BUILD_NUMBER} | Image: ${env.FULL_IMAGE_NAME}",
                link: env.BUILD_URL,
                result: currentBuild.currentResult,
                title: "Backend Jenkins Job",
                webhookURL: "https://discord.com/api/webhooks/1415897323028086804/4FgLSXOR5RU25KqJdK8MSgoAjxAabGzluiNpP44pBGWAWXcVBOfMjxyu0pmPpmqEO5sa"
            )
        }
        failure {
            discordSend(
                description: "❌ Backend CI/CD Pipeline Failed! [Branch: ${env.BRANCH_NAME}]",
                footer: "Build Number: ${env.BUILD_NUMBER}",
                link: env.BUILD_URL,
                result: currentBuild.currentResult,
                title: "Backend Jenkins Job",
                webhookURL: "https://discord.com/api/webhooks/1415897323028086804/4FgLSXOR5RU25KqJdK8MSgoAjxAabGzluiNpP44pBGWAWXcVBOfMjxyu0pmPpmqEO5sa"
            )
        }
    }
}

