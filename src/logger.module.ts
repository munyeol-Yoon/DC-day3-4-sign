import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  WinstonModule,
  utilities as nestWinstonModuleUtilities,
} from 'nest-winston';
import * as winston from 'winston'; // 로그 생성 라이브러리
import winstonDaily from 'winston-daily-rotate-file'; // 로그 파일 생성 라이브러리

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    WinstonModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        transports: [
          // 로그를 어디에 출력할지
          new winston.transports.Console({
            // console 에 출력할 로그 설정
            level: configService.get<string>('NODE_ENV'),
            format: winston.format.combine(
              winston.format.timestamp(),
              nestWinstonModuleUtilities.format.nestLike(
                configService.get<string>('APP_NAME'),
                {
                  prettyPrint: true, // 읽기 쉽게 출력
                },
              ), // nest 처럼 로그 출력
            ),
          }),
          new winstonDaily({
            // 파일 기록 설정
            level: configService.get<string>('NODE_ENV'),
            format: winston.format.combine(
              winston.format.timestamp({
                format: 'YYYY-MM-DD HH:mm:ss',
              }),
              winston.format.printf(
                (info) =>
                  `[${info.timestamp}] ${configService.get<string>('APP_NAME')}.${info.level}: ${info.message}`,
              ),
            ),
            dirname: configService.get<string>('LOG_DIR'),
            filename: '%DATE%.log',
            datePattern: 'YYYY-MM-DD',
            zippedArchive: true,
            maxSize: '20m',
            maxFiles: '14d',
          }),
        ],
      }),
    }),
  ],
})
export class LoggerModule {}
