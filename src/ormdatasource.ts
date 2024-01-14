import { DataSource } from 'typeorm';
import ormconfig from 'src/ormconfig';

export default new DataSource(ormconfig);
