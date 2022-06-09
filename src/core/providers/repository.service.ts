import { Repository } from 'typeorm';

export class RepositoryService<T> extends Repository<T> {
    public async findOneByField(field: keyof T, value: any): Promise<T> {
        return await this.createQueryBuilder().where(`${field.toString()} = :value`, { value }).getOne();
    }

    public async findManyByField(field: keyof T, value: any): Promise<T[]> {
        return await this.createQueryBuilder().where(`${field.toString()} = :value`, { value }).getMany();
    }
}
