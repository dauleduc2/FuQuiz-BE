import { Subject } from './../core/models';
import { SubjectRepository } from './../core/repositories';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SubjectService {
    constructor(private readonly subjectRepository: SubjectRepository) {}

    async getSubjectByField(field: keyof Subject, value: any): Promise<Subject> {
        return await this.subjectRepository.findOneByField(field, value);
    }

    async saveSubject(subject: Subject): Promise<Subject> {
        return await this.subjectRepository.save(subject);
    }

    async filterSubjects(
        name: string,
        createdAt: string,
        currentPage: number,
        pageSize: number,
        isActive: boolean,
        isFeature: boolean,
        category: string,
        assignTo: string,
    ): Promise<{ data: Subject[]; count: number }> {
        try {
            const date = new Date(createdAt);
            const sliders = await this.subjectRepository
                .createQueryBuilder('subject')
                .where(`subject.name LIKE (:name)`, {
                    name: `%${name}%`,
                })
                .andWhere(`subject.createdAt >= (:createdAt)`, { createdAt: date })
                .andWhere(`subject.isActive = (:isActive)`, { isActive })
                .andWhere(`subject.isFeature = (:isFeature)`, { isFeature })
                .leftJoinAndSelect('subject.assignTo', 'assignTo')
                .leftJoinAndSelect('assignTo.user', 'user')
                .andWhere(`user.id LIKE (:id)`, { id: `%${assignTo}%` })
                .leftJoinAndSelect(`subject.category`, 'category')
                .andWhere(`category.id LIKE (:id)`, { id: `%${category}%` })
                .orderBy(`subject.createdAt`, 'DESC')
                .skip(currentPage * pageSize)
                .take(pageSize)
                .getMany();

            const count = await this.subjectRepository
                .createQueryBuilder('subject')
                .where(`subject.name LIKE (:name)`, {
                    name: `%${name}%`,
                })
                .andWhere(`subject.createdAt >= (:createdAt)`, { createdAt: date })
                .andWhere(`subject.isActive = (:isActive)`, { isActive })
                .andWhere(`subject.isFeature = (:isFeature)`, { isFeature })
                .leftJoinAndSelect('subject.assignTo', 'assignTo')
                .leftJoinAndSelect('assignTo.user', 'user')
                .andWhere(`user.id LIKE (:id)`, { id: `%${assignTo}%` })
                .leftJoinAndSelect(`subject.category`, 'category')
                .andWhere(`category.id LIKE (:id)`, { id: `%${category}%` })
                .getCount();

            return { data: sliders, count };
        } catch (err) {
            console.log(err);
            return { data: [], count: 0 };
        }
    }
}
