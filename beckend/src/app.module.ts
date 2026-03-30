import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { join } from 'path';

import { Collection } from './models/collection.entity';
import { GiftItem } from './models/giftitem.entity';
import { User } from './models/user.entity';
import { Tag } from './models/tag.entity';

import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { CollectionModule } from './modules/collection/collection.module';
import { GiftItemModule } from './modules/gift-item/gift-item.module';
import { TagModule } from './modules/tag/tag.module';

import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { CacheInterceptor } from './common/interceptors/cache.interceptor';
import { CacheInvalidationInterceptor } from './common/interceptors/cache-invalidation.interceptor';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        url: config.get<string>('DATABASE_URL') || undefined,
        host: config.get<string>('DATABASE_URL') ? undefined : config.getOrThrow<string>('POSTGRES_HOST'),
        port: config.get<string>('DATABASE_URL') ? undefined : config.getOrThrow<number>('POSTGRES_PORT'),
        username: config.get<string>('DATABASE_URL') ? undefined : config.getOrThrow<string>('POSTGRES_USER'),
        password: config.get<string>('DATABASE_URL') ? undefined : config.getOrThrow<string>('POSTGRES_PASSWORD'),
        database: config.get<string>('DATABASE_URL') ? undefined : config.getOrThrow<string>('POSTGRES_NAME'),
        entities: [Collection, GiftItem, User, Tag],
        synchronize: true,
      }),
    }),

    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      playground: true,
      context: ({ req }) => ({ req }),
    }),

    AuthModule,
    UserModule,
    CollectionModule,
    GiftItemModule,
    TagModule,
  ],
  providers: [
    CacheInterceptor,
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useExisting: CacheInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useFactory: (cache: CacheInterceptor) => new CacheInvalidationInterceptor(cache),
      inject: [CacheInterceptor],
    },
  ],
})
export class AppModule {}
