import { TriggerBase } from '@activepieces/pieces-framework'
import {
    ActivepiecesError,
    ErrorCode,
    isNil,
    PieceTrigger,
    ProjectId,
} from '@activepieces/shared'
import { pieceMetadataService } from '../../../pieces/piece-metadata-service'


export const triggerUtils = {
    async getPieceTriggerOrThrow({ trigger, projectId }: GetPieceTriggerOrThrowParams): Promise<TriggerBase> {

        const pieceTrigger = await triggerUtils.getPieceTrigger({
            trigger,
            projectId,

        })
        if (isNil(pieceTrigger)) {
            throw new ActivepiecesError({
                code: ErrorCode.PIECE_TRIGGER_NOT_FOUND,
                params: {
                    pieceName: trigger.settings.pieceName,
                    pieceVersion: trigger.settings.pieceVersion,
                    triggerName: trigger.settings.triggerName,
                },
            })
        }
        return pieceTrigger
    },
    async getPieceTrigger({ trigger, projectId }: GetPieceTriggerOrThrowParams): Promise<TriggerBase | null> {
        const piece = await pieceMetadataService.get({
            projectId,
            name: trigger.settings.pieceName,
            version: trigger.settings.pieceVersion,
        })
        if (isNil(piece)) {
            return null
        }
        const pieceTrigger = piece.triggers[trigger.settings.triggerName]
        return pieceTrigger
    },
}

type GetPieceTriggerOrThrowParams = {
    trigger: PieceTrigger
    projectId: ProjectId
}