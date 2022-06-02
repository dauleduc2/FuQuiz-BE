import { AdminGuard } from './../auth/guard';
import { SubjectCategory } from './../core/models';
import { JoiValidatorPipe } from './../core/pipe';
import { Body, Controller, Post, Put, Res, UseGuards, UsePipes, Param } from '@nestjs/common';
import { Response } from 'express';
import { SubjectCategoryDTO, vSubjectCategoryDTO } from './dto';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import { SubjectCategoryService } from './subject-category.service';

@ApiTags('subject-category')
@ApiBearerAuth()
@UseGuards(AdminGuard)
@Controller('subject-category')
export class SubjectCategoryController {
    constructor(private readonly subjectCategoryService: SubjectCategoryService) {}

    @Post('')
    @UsePipes(new JoiValidatorPipe(vSubjectCategoryDTO))
    async cCreateSubjectCategory(@Res() res: Response, @Body() body: SubjectCategoryDTO) {
        const subjectCategory = new SubjectCategory();
        subjectCategory.name = body.name;

        await this.subjectCategoryService.saveSubjectCategory(subjectCategory);

        return res.send(subjectCategory);
    }

    @Put('/:id')
    @ApiParam({ name: 'id', example: 'TVgJIjsRFmIvyjUeBOLv4gOD3eQZY' })
    @UsePipes(new JoiValidatorPipe(vSubjectCategoryDTO))
    async cUpdateSubjectCategory(@Res() res: Response, @Body() body: SubjectCategoryDTO, @Param('id') id: string) {
        const subjectCategory = await this.subjectCategoryService.getSubjectCategoryByField('id', id);
        subjectCategory.name = body.name;

        await this.subjectCategoryService.saveSubjectCategory(subjectCategory);

        return res.send(subjectCategory);
    }
}
