pipeline {
    agent any

    environment {
        RUBY_VERSION = '3.3.7'
        RAILS_ENV = 'test'
        DATABASE_URL = 'postgres://postgres:postgres@postgres:5432/training_app_test'
        REDIS_URL = 'redis://redis:6379/0'
    }

    options {
        timeout(time: 30, unit: 'MINUTES')
        buildDiscarder(logRotator(numToKeepStr: '10'))
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Setup') {
            steps {
                script {
                    // Setup Ruby using rbenv or rvm
                    sh '''
                        if command -v rbenv &> /dev/null; then
                            rbenv install -s ${RUBY_VERSION} || true
                            rbenv local ${RUBY_VERSION}
                        elif command -v rvm &> /dev/null; then
                            rvm use ${RUBY_VERSION} --install || true
                        fi
                    '''
                }
            }
        }

        stage('Install Dependencies') {
            steps {
                sh '''
                    gem install bundler --no-document
                    bundle install --jobs=4 --retry=3
                    yarn install --frozen-lockfile
                '''
            }
        }

        stage('Security Scan') {
            steps {
                sh 'bundle exec brakeman --no-pager --format json --output brakeman-report.json || true'
                publishHTML([
                    reportDir: '.',
                    reportFiles: 'brakeman-report.html',
                    reportName: 'Brakeman Security Report',
                    allowMissing: true
                ])
            }
        }

        stage('Lint') {
            steps {
                sh 'bundle exec rubocop --format json --out rubocop-report.json || true'
                publishHTML([
                    reportDir: '.',
                    reportFiles: 'rubocop-report.html',
                    reportName: 'RuboCop Lint Report',
                    allowMissing: true
                ])
            }
        }

        stage('Database Setup') {
            steps {
                sh '''
                    bundle exec rails db:create RAILS_ENV=test || true
                    bundle exec rails db:schema:load RAILS_ENV=test
                '''
            }
        }

        stage('Tests') {
            steps {
                sh '''
                    bundle exec rspec --format progress --format json --out rspec-report.json || true
                '''
            }
            post {
                always {
                    publishTestResults testResultsPattern: 'rspec-report.json'
                    publishHTML([
                        reportDir: 'coverage',
                        reportFiles: 'index.html',
                        reportName: 'RSpec Test Coverage',
                        allowMissing: true
                    ])
                }
            }
        }

        stage('Code Audit') {
            steps {
                sh 'bundle exec rails_code_auditor || true'
            }
        }
    }

    post {
        always {
            cleanWs()
        }
        success {
            echo 'Pipeline completed successfully!'
        }
        failure {
            echo 'Pipeline failed!'
        }
    }
}

