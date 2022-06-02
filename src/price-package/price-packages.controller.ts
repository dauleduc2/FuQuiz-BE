import { StatusCodes } from 'http-status-codes';
import { ResponseMessage } from './../core/interface';
import { Controller, Res, HttpException, Get, Param } from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import { PricePackageService } from './price-package.service';
import { Response } from 'express';

@ApiTags('price packages')
@ApiBearerAuth()
@Controller('price-packages')
export class PricePackagesController {
    constructor(private readonly pricePackageService: PricePackageService) {}

    @Get('/:id')
    @ApiParam({ name: 'id', example: 'TVgJIjsRFmIvyjUeBOLv4gOD3eQZY', description: 'subject id' })
    async cGetPricePackagesBySubjectId(@Param('id') id: string, @Res() res: Response) {
        const pricePackage = await this.pricePackageService.getPricePackageByField('id', id);
        if (!pricePackage) throw new HttpException({ errorMessage: ResponseMessage.NOT_FOUND }, StatusCodes.NOT_FOUND);
        return res.send(pricePackage);
    }
}
