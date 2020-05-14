import * as mailer from 'nodemailer';

export const DATABASE_CONNECTION = 'DATABASE_CONNECTION';
export const USERS_MODEL = 'USERS_MODEL';
export const NOTES_MODEL = 'NOTES_MODEL';
export const HUNTS_MODEL = 'HUNTS_MODEL';

export function responseSuccess<T = any>(data: T) {
  return {
    code: 0,
    success: true,
    timestamp: new Date().toLocaleString(),
    data: data,
  };
}

export function responseFailure(error: string, code = 1000) {
  return {
    code: code,
    success: false,
    timestamp: new Date().toLocaleString(),
    error: error,
  };
}

export function random(n: number = 6) {
  let str = '';
  for (let i = 0; i < n; i++) {
    str += Math.floor(Math.random() * 10);
  }
  return str;
}

export function sendEmail(email: string): Promise<{ code: string }> {
  return new Promise((resolve, reject) => {
    const code = random();
    const transporter = mailer.createTransport({
      host: 'smtp.163.com',
      port: 465,
      secure: true,
      auth: {
        user: 'youmozg@163.com',
        pass: 'abc123456',
      },
    });
    transporter.sendMail(
      {
        from: '某某笔记验证码 <youmozg@163.com>',
        subject: new Date().toLocaleString(),
        to: email,
        html: `验证码<h1>${code}</h1>，尊敬的用户，该验证码用于用户注册，5分钟内有效，请勿告诉其他人员。`,
      },
      (err, info) => {
        err ? reject() : resolve({ code });
      },
    );
  });
}

/**
 * 删除笔记通知
 */
export const WS_NOTES_ROMOVE = 'WS_NOTES_ROMOVE';
/**
 * 更新笔记通知
 */
export const WS_NOTES_UPDATE = 'WS_NOTES_UPDATE';
/**
 * 添加成员通知
 */
export const WS_NOTES_MEMBER_ADD = 'WS_NOTES_MEMBER_ADD';
/**
 * 移除成员通知
 */
export const WS_NOTES_MEMBER_DELETE = 'WS_NOTES_MEMBER_DELETE';
export const WS_UPDATE_NICKNAME = 'WS_UPDATE_NICKNAME';
