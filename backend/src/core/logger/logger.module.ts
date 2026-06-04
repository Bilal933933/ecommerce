import { mkdirSync, createWriteStream, WriteStream } from 'fs';
import { IncomingMessage } from 'http';
import { join, dirname } from 'path';

import { Module } from '@nestjs/common';
import { LoggerModule } from 'nestjs-pino';
import pino from 'pino';

interface PinoRequest extends IncomingMessage {
  id: string | number;
}

const isDev = process.env.NODE_ENV !== 'production';

function createLogFileStream(): WriteStream | NodeJS.WriteStream {
  const logFilePath = join(process.cwd(), 'logs', 'app.log.json');
  const logDir = dirname(logFilePath);

  try {
    mkdirSync(logDir, { recursive: true });
  } catch (err: unknown) {
    const isExistError =
      typeof err === 'object' &&
      err !== null &&
      (err as NodeJS.ErrnoException).code === 'EEXIST';

    if (!isExistError) {
      console.error('Failed to create logs directory:', err);
    }
  }

  try {
    const stream = createWriteStream(logFilePath, { flags: 'a' });
    stream.on('error', (err: Error) => {
      console.error('Error writing to log file:', err.message);
    });
    return stream;
  } catch (err: unknown) {
    console.error('Failed to create log file stream:', err);
    // fallback إلى stdout إذا فشل إنشاء الملف
    return process.stdout;
  }
}

function buildStreams(): pino.MultiStreamRes {
  return pino.multistream([
    {
      level: 'debug',
      stream: isDev
        ? pino.transport({
            target: 'pino-pretty',
            options: {
              colorize: true,
              translateTime: 'HH:MM:ss',
              ignore: 'pid,hostname',
            },
          })
        : process.stdout,
    },
    {
      level: 'info',
      stream: createLogFileStream(),
    },
  ]);
}

@Module({
  imports: [
    LoggerModule.forRoot({
      pinoHttp: {
        stream: buildStreams(),
        genReqId: (req: IncomingMessage): string =>
          (req.headers['x-request-id'] as string | undefined) ??
          crypto.randomUUID(),
        level: isDev ? 'debug' : 'info',
        serializers: {
          req: (req: PinoRequest) => ({
            id: req.id,
            method: req.method,
            url: req.url,
          }),
          res: (res: { statusCode: number }) => ({
            statusCode: res.statusCode,
          }),
        },
        // إخفاء البيانات الحساسة فقط — وليس كل الـ headers
        redact: {
          paths: ['req.headers.authorization', 'req.headers.cookie'],
          remove: true,
        },
        timestamp: pino.stdTimeFunctions.isoTime,
        // pino-http يسجل كل request/response تلقائياً — لا حاجة لـ LoggingInterceptor
        autoLogging: true,
      },
    }),
  ],
  exports: [LoggerModule],
})
export class AppLoggerModule {}
