import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { OrcamentosService } from './orcamentos.service';
import { CreateOrcamentoDto } from './dto/create-orcamento.dto';
import { UpdateOrcamentoStatusDto } from './dto/update-orcamento-status.dto';
import { SendEmailOrcamentoDto } from './dto/send-email-orcamento.dto';

@Controller('orcamentos')
export class OrcamentosController {
  constructor(private readonly orcamentosService: OrcamentosService) {}

  @Post()
  create(@Body() createOrcamentoDto: CreateOrcamentoDto) {
    return this.orcamentosService.create(createOrcamentoDto);
  }

  @Get()
  findAll(@Query('status') status?: string) {
    return this.orcamentosService.findAll(status);
  }

  @Get('stats')
  getStats() {
    return this.orcamentosService.getStats();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.orcamentosService.findOne(id);
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateStatusDto: UpdateOrcamentoStatusDto,
  ) {
    return this.orcamentosService.updateStatus(id, updateStatusDto);
  }

  @Post(':id/send-email')
  sendEmail(
    @Param('id', ParseIntPipe) id: number,
    @Body() sendEmailDto: SendEmailOrcamentoDto,
  ) {
    return this.orcamentosService.sendEmail(id, sendEmailDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.orcamentosService.remove(id);
  }
}
