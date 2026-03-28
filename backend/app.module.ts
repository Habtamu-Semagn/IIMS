import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma.service';
import { AuthModule } from './auth/auth.module';
import { SchoolModule } from './school/school.module';
import { AssetModule } from './asset/asset.module';
import { TicketModule } from './ticket/ticket.module';
import { CurriculumModule } from './curriculum/curriculum.module';
import { TrainingModule } from './training/training.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    SchoolModule,
    AssetModule,
    TicketModule,
    CurriculumModule,
    TrainingModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
