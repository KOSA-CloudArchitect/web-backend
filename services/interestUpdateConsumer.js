const { Kafka } = require('kafkajs');
const { PrismaClient } = require('@prisma/client');
const notificationService = require('./notificationService');
const logger = require('../config/logger');

const prisma = new PrismaClient();

class InterestUpdateConsumer {
  constructor() {
    this.kafka = new Kafka({
      clientId: 'interest-update-consumer',
      brokers: [process.env.KAFKA_BROKER || 'localhost:9092'],
      ssl: process.env.KAFKA_SSL === 'true',
      sasl: process.env.KAFKA_USERNAME ? {
        mechanism: 'plain',
        username: process.env.KAFKA_USERNAME,
        password: process.env.KAFKA_PASSWORD,
      } : undefined,
    });

    this.consumer = this.kafka.consumer({ 
      groupId: 'interest-update-group',
      sessionTimeout: 30000,
      heartbeatInterval: 3000,
    });

    this.isRunning = false;
  }

  async start() {
    try {
      await this.consumer.connect();
      await this.consumer.subscribe({ 
        topics: ['interest-update-events', 'price-change-events', 'review-change-events'],
        fromBeginning: false 
      });

      await this.consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
          try {
            const data = JSON.parse(message.value.toString());
            logger.info(`Received message from topic ${topic}:`, data);

            switch (topic) {
              case 'price-change-events':
                await this.handlePriceChangeEvent(data);
                break;
              case 'review-change-events':
                await this.handleReviewChangeEvent(data);
                break;
              case 'interest-update-events':
                await this.handleInterestUpdateEvent(data);
                break;
              default:
                logger.warn(`Unknown topic: ${topic}`);
            }
          } catch (error) {
            logger.error(`Error processing message from topic ${topic}:`, error);
          }
        },
      });

      this.isRunning = true;
      logger.info('Interest update consumer started successfully');
    } catch (error) {
      logger.error('Error starting interest update consumer:', error);
      throw error;
    }
  }

  async stop() {
    try {
      await this.consumer.disconnect();
      this.isRunning = false;
      logger.info('Interest update consumer stopped');
    } catch (error) {
      logger.error('Error stopping interest update consumer:', error);
      throw error;
    }
  }

  /**
   * 가격 변동 이벤트 처리
   */
  async handlePriceChangeEvent(data) {
    try {
      const { productId, productUrl, oldPrice, newPrice, changePercentage } = data;

      // 가격이 하락한 경우만 알림 전송
      if (newPrice >= oldPrice) {
        logger.info(`Price increased or unchanged for product ${productId}, skipping notification`);
        return;
      }

      // 해당 상품을 관심 상품으로 등록한 사용자들 조회
      const interestProducts = await prisma.interestProduct.findMany({
        where: {
          OR: [
            { productId },
            { productUrl }
          ],
          isActive: true
        },
        include: {
          user: {
            include: {
              notificationSetting: true
            }
          }
        }
      });

      if (interestProducts.length === 0) {
        logger.info(`No users interested in product ${productId}`);
        return;
      }

      // 상품 정보 조회
      const product = await prisma.product.findFirst({
        where: {
          OR: [
            { id: productId },
            { url: productUrl }
          ]
        }
      });

      const productData = product || {
        id: productId,
        name: data.productName || '상품',
        url: productUrl
      };

      // 각 사용자에게 알림 전송
      for (const interestProduct of interestProducts) {
        try {
          await notificationService.sendPriceDropNotification(
            interestProduct.userId,
            productData,
            {
              oldPrice: parseFloat(oldPrice),
              newPrice: parseFloat(newPrice),
              changePercentage: parseFloat(changePercentage)
            }
          );

          // 관심 상품 정보 업데이트
          await prisma.interestProduct.update({
            where: { id: interestProduct.id },
            data: {
              currentPrice: parseFloat(newPrice),
              updatedAt: new Date()
            }
          });
        } catch (error) {
          logger.error(`Error sending price drop notification to user ${interestProduct.userId}:`, error);
        }
      }

      logger.info(`Price drop notifications sent for product ${productId} to ${interestProducts.length} users`);
    } catch (error) {
      logger.error('Error handling price change event:', error);
    }
  }

  /**
   * 리뷰 변화 이벤트 처리
   */
  async handleReviewChangeEvent(data) {
    try {
      const { productId, productUrl, oldRating, newRating, oldReviewCount, newReviewCount } = data;

      // 해당 상품을 관심 상품으로 등록한 사용자들 조회
      const interestProducts = await prisma.interestProduct.findMany({
        where: {
          OR: [
            { productId },
            { productUrl }
          ],
          isActive: true
        },
        include: {
          user: {
            include: {
              notificationSetting: true
            }
          }
        }
      });

      if (interestProducts.length === 0) {
        logger.info(`No users interested in product ${productId}`);
        return;
      }

      // 상품 정보 조회
      const product = await prisma.product.findFirst({
        where: {
          OR: [
            { id: productId },
            { url: productUrl }
          ]
        }
      });

      const productData = product || {
        id: productId,
        name: data.productName || '상품',
        url: productUrl
      };

      // 각 사용자에게 알림 전송
      for (const interestProduct of interestProducts) {
        try {
          await notificationService.sendReviewChangeNotification(
            interestProduct.userId,
            productData,
            {
              oldRating: parseFloat(oldRating),
              newRating: parseFloat(newRating),
              oldReviewCount: parseInt(oldReviewCount),
              newReviewCount: parseInt(newReviewCount)
            }
          );

          // 관심 상품 정보 업데이트
          await prisma.interestProduct.update({
            where: { id: interestProduct.id },
            data: {
              rating: parseFloat(newRating),
              reviewCount: parseInt(newReviewCount),
              updatedAt: new Date()
            }
          });
        } catch (error) {
          logger.error(`Error sending review change notification to user ${interestProduct.userId}:`, error);
        }
      }

      logger.info(`Review change notifications sent for product ${productId} to ${interestProducts.length} users`);
    } catch (error) {
      logger.error('Error handling review change event:', error);
    }
  }

  /**
   * 관심 상품 업데이트 이벤트 처리
   */
  async handleInterestUpdateEvent(data) {
    try {
      const { type, userId, productId, analysisResult } = data;

      switch (type) {
        case 'ANALYSIS_COMPLETE':
          await this.handleAnalysisCompleteEvent(userId, productId, analysisResult);
          break;
        default:
          logger.warn(`Unknown interest update event type: ${type}`);
      }
    } catch (error) {
      logger.error('Error handling interest update event:', error);
    }
  }

  /**
   * 분석 완료 이벤트 처리
   */
  async handleAnalysisCompleteEvent(userId, productId, analysisResult) {
    try {
      // 상품 정보 조회
      const product = await prisma.product.findUnique({
        where: { id: productId }
      });

      if (!product) {
        logger.warn(`Product ${productId} not found`);
        return;
      }

      // 분석 완료 알림 전송
      await notificationService.sendAnalysisCompleteNotification(
        userId,
        product,
        analysisResult
      );

      logger.info(`Analysis complete notification sent to user ${userId} for product ${productId}`);
    } catch (error) {
      logger.error('Error handling analysis complete event:', error);
    }
  }

  /**
   * 헬스 체크
   */
  isHealthy() {
    return this.isRunning;
  }
}

module.exports = new InterestUpdateConsumer();