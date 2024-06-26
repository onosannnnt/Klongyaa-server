import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('pill_channel_data')
export class PillChannelDataEntity {
  @PrimaryGeneratedColumn('uuid')
  cid: string;

  @Column()
  lineUID: string;

  @Column()
  channelID: string;

  @Column()
  pillName: string;

  @Column()
  pillsPerTime: number;

  @Column({ default: 0 })
  total: number;

  @Column({ default: 0 })
  stock: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}

@Entity('take_time')
export class TakeTimeEntity {
  @PrimaryGeneratedColumn('uuid')
  tid: string;

  @Column()
  cid: string;

  @Column()
  time: string;
}

@Entity('cid_rid')
export class CidRidEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  cid: string;

  @Column()
  rid: string;
}

@Entity('real_pill')
export class RealPillEntity {
  @PrimaryGeneratedColumn('uuid')
  rid: string;

  @Column()
  pillName: string;

  @Column()
  property: string;

  @Column()
  effect: string;
}

@Entity('danger_pill')
export class DangerPillEntity {
  @PrimaryGeneratedColumn('uuid')
  did: string;

  @Column()
  rid: string;

  @Column()
  pillName: string;

  @Column()
  reason: string;
}

@Entity('log_history')
export class LogHistoryEntity {
  @PrimaryGeneratedColumn('uuid')
  hid: string;

  @Column()
  pillName: string;

  @Column()
  lineUID: string;

  @Column()
  task: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}
