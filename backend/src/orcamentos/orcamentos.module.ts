import { Module } from '@nestjs/common';
import { OrcamentosService } from './orcamentos.service';
import { OrcamentosController } from './orcamentos.controller';
import { EmailModule } from '../email/email.module';

@Module({
  imports: [EmailModule],
  controllers: [OrcamentosController],
  providers: [OrcamentosService],
})
export class OrcamentosModule {}
