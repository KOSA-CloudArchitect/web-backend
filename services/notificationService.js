const nodemailer = require('nodemailer');
const { PrismaClient } = require('@prisma/client');
const logger = require('../config/logger');

const prisma = new PrismaClient();

class NotificationService {
  constructor() {
    this.emailTransporter = this.createEmailTransporter();
  }

  createEmailTransporter() {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: process.env.SMTP_PORT || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  /**
   * 가격 하락 알림 전송
   */
  async sendPriceDropNotification(userId, productData, priceChange) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: { notificationSetting: true }
      });

      if (!user) {
        throw new Error('User not found');
      }

      const settings = user.notificationSetting || {};
      const priceDropPercentage = Math.abs((priceChange.oldPrice - priceChange.newPrice) / priceChange.oldPrice * 100);

      // 임계값 확인
      if (priceDropPercentage < (settings.priceDropThreshold || 10)) {
        logger.info(`Price drop ${priceDropPercentage}% is below threshold for user ${userId}`);
        return;
      }

      const title = `가격 하락 알림: ${productData.name}`;
      const message = `관심 상품의 가격이 ${priceDropPercentage.toFixed(1)}% 하락했습니다!\n` +
                     `이전 가격: ${priceChange.oldPrice.toLocaleString()}원\n` +
                     `현재 가격: ${priceChange.newPrice.toLocaleString()}원\n` +
                     `할인 금액: ${(priceChange.oldPrice - priceChange.newPrice).toLocaleString()}원`;

      const notificationData = {
        productId: productData.id,
        productName: productData.name,
        productUrl: productData.url,
        oldPrice: priceChange.oldPrice,
        newPrice: priceChange.newPrice,
        discountAmount: priceChange.oldPrice - priceChange.newPrice,
        discountPercentage: priceDropPercentage
      };

      // 이메일 알림
      if (settings.emailEnabled && settings.priceDropEnabled) {
        await this.sendEmailNotification(user.email, title, message, notificationData);
        await this.logNotification(userId, 'PRICE_DROP', 'EMAIL', title, message, notificationData);
      }

      // 웹 푸시 알림
      if (settings.pushEnabled && settings.priceDropEnabled) {
        await this.sendWebPushNotification(userId, title, message, notificationData);
        await this.logNotification(userId, 'PRICE_DROP', 'PUSH', title, message, notificationData);
      }

      // 웹 알림
      if (settings.webEnabled && settings.priceDropEnabled) {
        await this.sendWebNotification(userId, title, message, notificationData);
        await this.logNotification(userId, 'PRICE_DROP', 'WEB', title, message, notificationData);
      }

      logger.info(`Price drop notification sent to user ${userId} for product ${productData.id}`);
    } catch (error) {
      logger.error('Error sending price drop notification:', error);
      throw error;
    }
  }

  /**
   * 리뷰 변화 알림 전송
   */
  async sendReviewChangeNotification(userId, productData, reviewChange) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: { notificationSetting: true }
      });

      if (!user) {
        throw new Error('User not found');
      }

      const settings = user.notificationSetting || {};
      
      // 리뷰 변화율 계산
      const ratingChange = Math.abs(reviewChange.newRating - reviewChange.oldRating);
      const reviewCountChange = reviewChange.newReviewCount - reviewChange.oldReviewCount;

      // 임계값 확인
      if (ratingChange < (settings.reviewChangeThreshold || 0.5) && reviewCountChange < 10) {
        logger.info(`Review change is below threshold for user ${userId}`);
        return;
      }

      const title = `리뷰 변화 알림: ${productData.name}`;
      let message = `관심 상품의 리뷰가 변화했습니다!\n`;
      
      if (ratingChange >= 0.1) {
        const direction = reviewChange.newRating > reviewChange.oldRating ? '상승' : '하락';
        message += `평점 ${direction}: ${reviewChange.oldRating.toFixed(1)} → ${reviewChange.newRating.toFixed(1)}\n`;
      }
      
      if (reviewCountChange > 0) {
        message += `새로운 리뷰: ${reviewCountChange}개 추가\n`;
      }

      const notificationData = {
        productId: productData.id,
        productName: productData.name,
        productUrl: productData.url,
        oldRating: reviewChange.oldRating,
        newRating: reviewChange.newRating,
        oldReviewCount: reviewChange.oldReviewCount,
        newReviewCount: reviewChange.newReviewCount,
        ratingChange,
        reviewCountChange
      };

      // 이메일 알림
      if (settings.emailEnabled && settings.reviewChangeEnabled) {
        await this.sendEmailNotification(user.email, title, message, notificationData);
        await this.logNotification(userId, 'REVIEW_CHANGE', 'EMAIL', title, message, notificationData);
      }

      // 웹 푸시 알림
      if (settings.pushEnabled && settings.reviewChangeEnabled) {
        await this.sendWebPushNotification(userId, title, message, notificationData);
        await this.logNotification(userId, 'REVIEW_CHANGE', 'PUSH', title, message, notificationData);
      }

      // 웹 알림
      if (settings.webEnabled && settings.reviewChangeEnabled) {
        await this.sendWebNotification(userId, title, message, notificationData);
        await this.logNotification(userId, 'REVIEW_CHANGE', 'WEB', title, message, notificationData);
      }

      logger.info(`Review change notification sent to user ${userId} for product ${productData.id}`);
    } catch (error) {
      logger.error('Error sending review change notification:', error);
      throw error;
    }
  }

  /**
   * 분석 완료 알림 전송
   */
  async sendAnalysisCompleteNotification(userId, productData, analysisResult) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: { notificationSetting: true }
      });

      if (!user) {
        throw new Error('User not found');
      }

      const settings = user.notificationSetting || {};

      const title = `분석 완료: ${productData.name}`;
      const message = `관심 상품의 분석이 완료되었습니다!\n` +
                     `총 리뷰 수: ${analysisResult.totalReviews}개\n` +
                     `긍정: ${analysisResult.sentimentPositive}%, ` +
                     `부정: ${analysisResult.sentimentNegative}%, ` +
                     `중립: ${analysisResult.sentimentNeutral}%`;

      const notificationData = {
        productId: productData.id,
        productName: productData.name,
        productUrl: productData.url,
        analysisId: analysisResult.id,
        totalReviews: analysisResult.totalReviews,
        sentimentPositive: analysisResult.sentimentPositive,
        sentimentNegative: analysisResult.sentimentNegative,
        sentimentNeutral: analysisResult.sentimentNeutral
      };

      // 이메일 알림
      if (settings.emailEnabled && settings.analysisCompleteEnabled) {
        await this.sendEmailNotification(user.email, title, message, notificationData);
        await this.logNotification(userId, 'ANALYSIS_COMPLETE', 'EMAIL', title, message, notificationData);
      }

      // 웹 푸시 알림
      if (settings.pushEnabled && settings.analysisCompleteEnabled) {
        await this.sendWebPushNotification(userId, title, message, notificationData);
        await this.logNotification(userId, 'ANALYSIS_COMPLETE', 'PUSH', title, message, notificationData);
      }

      // 웹 알림
      if (settings.webEnabled && settings.analysisCompleteEnabled) {
        await this.sendWebNotification(userId, title, message, notificationData);
        await this.logNotification(userId, 'ANALYSIS_COMPLETE', 'WEB', title, message, notificationData);
      }

      logger.info(`Analysis complete notification sent to user ${userId} for product ${productData.id}`);
    } catch (error) {
      logger.error('Error sending analysis complete notification:', error);
      throw error;
    }
  }

  /**
   * 이메일 알림 전송
   */
  async sendEmailNotification(email, title, message, data) {
    try {
      const htmlContent = this.generateEmailHTML(title, message, data);
      
      const mailOptions = {
        from: process.env.SMTP_FROM || 'noreply@highpipe.com',
        to: email,
        subject: title,
        text: message,
        html: htmlContent
      };

      await this.emailTransporter.sendMail(mailOptions);
      logger.info(`Email notification sent to ${email}`);
    } catch (error) {
      logger.error('Error sending email notification:', error);
      throw error;
    }
  }

  /**
   * 웹 푸시 알림 전송 (FCM 사용)
   */
  async sendWebPushNotification(userId, title, message, data) {
    try {
      // FCM 구현 예정
      // 현재는 로그만 남김
      logger.info(`Web push notification would be sent to user ${userId}: ${title}`);
      
      // TODO: FCM 구현
      // const admin = require('firebase-admin');
      // const message = {
      //   notification: {
      //     title: title,
      //     body: message
      //   },
      //   data: data,
      //   token: userFCMToken
      // };
      // await admin.messaging().send(message);
    } catch (error) {
      logger.error('Error sending web push notification:', error);
      throw error;
    }
  }

  /**
   * 웹 알림 전송 (WebSocket 사용)
   */
  async sendWebNotification(userId, title, message, data) {
    try {
      // WebSocket을 통한 실시간 알림
      const io = require('../index').io;
      if (io) {
        io.to(`user_${userId}`).emit('notification', {
          type: 'notification',
          title,
          message,
          data,
          timestamp: new Date().toISOString()
        });
        logger.info(`Web notification sent to user ${userId}: ${title}`);
      }
    } catch (error) {
      logger.error('Error sending web notification:', error);
      throw error;
    }
  }

  /**
   * 알림 로그 저장
   */
  async logNotification(userId, type, channel, title, message, data) {
    try {
      await prisma.notificationLog.create({
        data: {
          userId,
          type,
          channel,
          title,
          message,
          data,
          status: 'SENT',
          sentAt: new Date()
        }
      });
    } catch (error) {
      logger.error('Error logging notification:', error);
      // 로그 저장 실패는 알림 전송을 막지 않음
    }
  }

  /**
   * 이메일 HTML 템플릿 생성
   */
  generateEmailHTML(title, message, data) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>${title}</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #3B82F6; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background-color: #f9f9f9; }
          .product-info { background-color: white; padding: 15px; margin: 10px 0; border-radius: 5px; }
          .button { display: inline-block; padding: 10px 20px; background-color: #3B82F6; color: white; text-decoration: none; border-radius: 5px; margin: 10px 0; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>HighPipe 알림</h1>
          </div>
          <div class="content">
            <h2>${title}</h2>
            <p>${message.replace(/\n/g, '<br>')}</p>
            
            ${data && data.productName ? `
            <div class="product-info">
              <h3>${data.productName}</h3>
              ${data.productUrl ? `<a href="${data.productUrl}" class="button">상품 보기</a>` : ''}
            </div>
            ` : ''}
          </div>
          <div class="footer">
            <p>이 메일은 HighPipe 알림 서비스에서 자동으로 발송되었습니다.</p>
            <p>알림 설정을 변경하려면 <a href="${process.env.FRONTEND_URL}/settings">여기</a>를 클릭하세요.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  /**
   * 사용자 알림 설정 조회
   */
  async getUserNotificationSettings(userId) {
    try {
      let settings = await prisma.notificationSetting.findUnique({
        where: { userId }
      });

      if (!settings) {
        // 기본 설정 생성
        settings = await prisma.notificationSetting.create({
          data: { userId }
        });
      }

      return settings;
    } catch (error) {
      logger.error('Error getting user notification settings:', error);
      throw error;
    }
  }

  /**
   * 사용자 알림 설정 업데이트
   */
  async updateUserNotificationSettings(userId, settingsData) {
    try {
      const settings = await prisma.notificationSetting.upsert({
        where: { userId },
        update: settingsData,
        create: {
          userId,
          ...settingsData
        }
      });

      return settings;
    } catch (error) {
      logger.error('Error updating user notification settings:', error);
      throw error;
    }
  }

  /**
   * 알림 기록 조회
   */
  async getNotificationLogs(userId, options = {}) {
    try {
      const { page = 1, limit = 20, type, channel } = options;
      const skip = (page - 1) * limit;

      const where = { userId };
      if (type) where.type = type;
      if (channel) where.channel = channel;

      const logs = await prisma.notificationLog.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      });

      const total = await prisma.notificationLog.count({ where });

      return {
        logs,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      logger.error('Error getting notification logs:', error);
      throw error;
    }
  }
}

module.exports = new NotificationService();