import { Expose } from 'class-transformer';
import { IsDate, IsNumber, IsString } from 'class-validator';
import {
  IGetForgottenRateRes,
  IGetHistoryRes,
  IGetRealPillNameByKeywordRes,
  IHomeChannelDataRes,
  IPillChannelDataRes,
  IPillChannelDetail,
  IPillStocksRes,
  IRealPillData,
} from '../interfaces/pill-data.service.interfaces';

export class AddPillChannelDataBodyDto {
  @IsString()
  lineID: string;

  @IsString()
  channelID: string;

  @IsString()
  pillName: string;

  @IsNumber()
  pillsPerTime: number;

  // @IsNumber({allowNaN: true})
  total?: number;

  stock?: number;

  @IsString({ each: true })
  takeTimes: string[];
}

export class PillChannelDataResDto {
  constructor(pillChannelData: IPillChannelDataRes) {
    this.cid = pillChannelData.cid;
    this.channel_id = pillChannelData.channelID;
    this.pill_name = pillChannelData.pillName;
    this.total = pillChannelData.total;
    this.stock = pillChannelData.stock;
    this.take_times = pillChannelData.takeTimes;
    this.created_at = pillChannelData.createdAt;
    this.pillsPerTime = pillChannelData.pillsPerTime;
  }

  @IsString()
  @Expose({ name: 'cid' })
  cid: string;

  @IsString()
  @Expose({ name: 'channelID' })
  channel_id: string;

  @IsString()
  @Expose({ name: 'pillName' })
  pill_name: string;

  @IsString()
  @Expose({ name: 'pillsPerTime' })
  pillsPerTime: number;

  @IsString()
  @Expose({ name: 'total' })
  total?: number;

  @IsString()
  @Expose({ name: 'stock' })
  stock: number;

  @IsString({ each: true })
  @Expose({ name: 'takeTimes' })
  take_times: string[];

  @IsDate()
  @Expose({ name: 'createdAt' })
  created_at: Date;
}

export class RealPillBodyDto {
  @Expose({ name: 'pill_name' })
  pillName: string;

  @IsString()
  @Expose({ name: 'property' })
  property: string;

  @IsString()
  @Expose({ name: 'effect' })
  effect: string;

  @Expose({ name: 'danger_pills' })
  dangerPills?: DangerPillBodyDto[];
}

export class DangerPillBodyDto {
  constructor(obj) {
    this.pillName = obj['pill_name'];
    this.reason = obj['reason'];
  }
  @Expose({ name: 'pill_name' })
  pillName: string;

  @Expose({ name: 'reason' })
  reason: string;
}

export class RealPillResDto {
  constructor(obj: IRealPillData) {
    this.rid = obj.rid;
    this.pill_name = obj.pillName;
    this.property = obj.property;
    this.effect = obj.effect;
    this.danger_pills = obj.dangerPills.map((dp) => {
      return {
        pill_name: dp.pillName,
        reason: dp.reason,
      };
    });
  }
  @IsString()
  rid: string;

  @IsString()
  pill_name: string;

  @IsString()
  property: string;

  @IsString()
  effect: string;

  danger_pills: DangerPillResDto[];
}

export class DangerPillResDto {
  @IsString()
  pill_name: string;

  @IsString()
  reason: string;
}

export class AddRealNameToPillChannelDataReqDto {
  @IsString()
  @Expose({ name: 'cid' })
  cid: string;

  @IsString()
  @Expose({ name: 'rid' })
  rid: string;
}

export class PillChannelDetailResDto extends PillChannelDataResDto {
  constructor(obj: IPillChannelDetail) {
    super(obj);
    this.real_pill_data = obj.realPillData
      ? new RealPillResDto(obj.realPillData)
      : null;
  }
  @Expose({ name: 'realPillData' })
  real_pill_data: RealPillResDto;
}

export class AddLogHistoryBodyDto {
  @IsString()
  lineUID: string;

  @IsString()
  channelID: string;

  @IsString()
  task: string;
}

export class HomeChannelData {
  @IsString()
  @Expose({ name: 'channelID' })
  channel_id: string;

  @IsString()
  @Expose({ name: 'pillName' })
  pill_name: string;
}

export class HomeChannelDataResDto {
  constructor(obj: IHomeChannelDataRes) {
    this.pill_channel_datas = obj.pillChannelDatas.map((pill) => {
      return {
        channel_id: pill.channelID,
        pill_name: pill.pillName,
      };
    });
  }

  @Expose({ name: 'pillChannelDatas' })
  pill_channel_datas: HomeChannelData[];
}

export class GetPillChannelDetailReqDto {
  @IsString()
  @Expose({ name: 'line_uid' })
  lineUID: string;

  @IsString()
  @Expose({ name: 'channel_id' })
  channelID: string;
}

export class GetRealPillNameByKeywordResDto {
  constructor(obj: IGetRealPillNameByKeywordRes) {
    this.real_pill_datas = obj.realPillDatas.map((pill): RealPillResDto => {
      return {
        rid: pill.rid,
        danger_pills: pill.dangerPills.map((dp) => {
          return {
            pill_name: dp.pillName,
            reason: dp.reason,
          };
        }),
        effect: pill.effect,
        pill_name: pill.pillName,
        property: pill.property,
      };
    });
  }
  @Expose({ name: 'realPillDatas' })
  real_pill_datas: RealPillResDto[];
}

export class GetHistoryReqDto {
  @IsString()
  @Expose({ name: 'filter_by' })
  filterBy: string;

  @IsString()
  @Expose({ name: 'line_uid' })
  lineUID: string;
}

export class HistoryDto {
  @IsDate()
  @Expose({ name: 'dateTime' })
  date_time: Date;

  @IsString()
  @Expose({ name: 'task' })
  task: string;

  @IsString()
  @Expose({ name: 'pillName' })
  pill_name: string;
}

export class GetHistoryResDto {
  constructor(obj: IGetHistoryRes) {
    this.histories = obj.histories.map((log) => {
      return {
        date_time: log.dateTime,
        pill_name: log.pillName,
        task: log.task,
      };
    });

    this.start_date = obj.start_date;
    this.end_date = obj.end_date;
  }
  @Expose({ name: 'histories' })
  histories: HistoryDto[];

  @IsString()
  @Expose({ name: 'startDate' })
  start_date: string;

  @IsString()
  @Expose({ name: 'endDate' })
  end_date: string;
}

export class GetPillStockDto {
  constructor(obj: IPillStocksRes) {
    this.pillStock = obj.pillStocks.map((pill) => {
      return new PillChannelDataResDto(pill);
    });
  }
  pillStock: PillChannelDataResDto[];
}

export class GetHardwarePillChannelDatasResDto {
  constructor(pills: IPillChannelDetail[]) {
    this.pill_channel_datas = pills.map((pill) => {
      return new PillChannelDetailResDto(pill);
    });
  }

  pill_channel_datas: PillChannelDetailResDto[];
}

export class GetForgottenRateResDto {
  constructor(obj: IGetForgottenRateRes) {
    this.rates = obj.rates;
    this.start_date = obj.start_date;
    this.end_date = obj.end_date;
  }

  rates: number[];

  start_date: string;

  end_date: string;
}
