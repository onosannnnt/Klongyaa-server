import { BadGatewayException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IAddLogHistoryReq, IAddPillChannelDataReq, IAddRealNameToPillCahnnelDataReq, IGetForgottenRateReq, IGetForgottenRateRes, IGetHistoryReq, IGetHistoryRes, IGetPillChannelDetailReq, IGetRealPillNameByKeywordRes, IHomeChannelDataRes, IPillChannelDataRes, IPillChannelDetail, IPillDataService, IPillStocksRes, IRealPillData } from './interfaces/pill-data.service.interfaces';
import { CidRidEntity, DangerPillEntity, ISaveDangerPill, ISavePillChannelData, ISaveRealPill, ISaveTakeTime, LogHistoryEntity, PillChannelDataEntity, RealPillEntity, TakeTimeEntity } from './models';

@Injectable()
export class PillDataService implements IPillDataService {
    constructor(
        @InjectRepository(PillChannelDataEntity)
        private readonly pillChannelDataRepository: Repository<PillChannelDataEntity>,

        @InjectRepository(TakeTimeEntity)
        private readonly takeTimeRepository: Repository<TakeTimeEntity>,

        @InjectRepository(RealPillEntity)
        private readonly realPillRepository: Repository<RealPillEntity>,

        @InjectRepository(DangerPillEntity)
        private readonly dangerPillRepository: Repository<DangerPillEntity>,

        @InjectRepository(CidRidEntity)
        private readonly cidRidRepository: Repository<CidRidEntity>,

        @InjectRepository(LogHistoryEntity)
        private readonly logHistoryRepository: Repository<LogHistoryEntity>,
    ){}

    async addPillChannelData(req: IAddPillChannelDataReq): Promise<IPillChannelDataRes> {

        try {
            const savePillChannelData: ISavePillChannelData = {
                channelID: req.channelID,
                pillName: req.pillName,
                stock: req.stock,
                total: req.total,
                lineUID: req.lineUID,
            }

            const pillChannelData = await this.pillChannelDataRepository.save(savePillChannelData)

            const timesToTakePill = await Promise.all(
                req.takeTimes.map(async (time) => {
                    const saveTakeTime: ISaveTakeTime = {
                        cid: pillChannelData.cid,
                        time
                    }

                    const takeTimeData = await this.takeTimeRepository.save(saveTakeTime)

                    return takeTimeData.time
                })
            )

            return {
                channelID: pillChannelData.channelID,
                cid: pillChannelData.cid,
                createdAt: pillChannelData.createdAt,
                pillName: pillChannelData.pillName,
                stock: pillChannelData.stock,
                takeTimes: timesToTakePill,
                total: pillChannelData.total
            }
            
        } catch (error) {
            throw new BadGatewayException(error)
        }
    }
    
    async addRealPillData(req: IRealPillData): Promise<IRealPillData> {
        try {
            const saveRealPillData: ISaveRealPill = {
                pillName: req.pillName,
                property: req.property,
                effect: req.effect
            }
            const realPillData = await this.realPillRepository.save(saveRealPillData)

            const dangerPillData = await Promise.all(
                req.dangerPills.map(async (pill) => {
                    const saveDangerPillData: ISaveDangerPill = {
                        pillName: pill.pillName,
                        reason: pill.reason,
                        rid: realPillData.rid
                    }
                    return await this.dangerPillRepository.save(saveDangerPillData)
                })
            )

            const resRealPillData: IRealPillData = {
                pillName: realPillData.pillName,
                property: realPillData.property,
                effect: realPillData.effect,
                dangerPills: dangerPillData
                
            }

            return resRealPillData
        } catch (error) {
            
        }
    }

    addRealNameToPillChannelData(req: IAddRealNameToPillCahnnelDataReq): Promise<IPillChannelDetail> {
        throw new Error('Method not implemented.');
    }

    addLogHistory(req: IAddLogHistoryReq): Promise<void> {
        throw new Error('Method not implemented.');
    }

    getHomeChannelData({ lineUID: string }: { lineUID: any; }): Promise<IHomeChannelDataRes> {
        throw new Error('Method not implemented.');
    }

    getPillChannelDetail(req: IGetPillChannelDetailReq): Promise<IPillChannelDetail> {
        throw new Error('Method not implemented.');
    }

    getRealPillNameByKeyword({ keyword: string }: { keyword: any; }): Promise<IGetRealPillNameByKeywordRes> {
        throw new Error('Method not implemented.');
    }

    getHistory(req: IGetHistoryReq): Promise<IGetHistoryRes> {
        throw new Error('Method not implemented.');
    }

    getForgottenRate(req: IGetForgottenRateReq): Promise<IGetForgottenRateRes> {
        throw new Error('Method not implemented.');
    }

    getPillStock({ lineUID: string }: { lineUID: any; }): Promise<IPillStocksRes> {
        throw new Error('Method not implemented.');
    }

    
    
}
