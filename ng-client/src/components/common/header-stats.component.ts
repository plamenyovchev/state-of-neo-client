import { Component } from '@angular/core';
import { BlockService } from '../../core/services/data/block.service';
import { NodeService } from '../../core/services/data/node.service';
import { BlocksSignalRService } from '../../core/services/signal-r/blocks-signal-r.service';

import * as CONST from '../../core/common/constants';
import { HeaderInfoModel } from '../../models';

declare var $;

@Component({
    selector: `app-header-stats`,
    templateUrl: './header-stats.component.html',
    styleUrls: ['./header-stats.component.css']
})
export class HeaderStatsComponent {
    secondsSinceLastBlock = 0;
    bestBlock = 0;
    rpcEnabled = 0;
    headerInfo: HeaderInfoModel;

    constructor(
        private _blockService: BlockService,
        private _nodeService: NodeService,
        private _blockSignalRService: BlocksSignalRService) {
        this._blockSignalRService.init(`${CONST.BASE_URL}/hubs/block`);

        this.subscribeToEvents();

        setInterval(() => {
            if (this.headerInfo != null) {
                if (this.headerInfo.createdOn != null) {
                    const now = new Date().getTime();
                    const then = new Date(this.headerInfo.createdOn).getTime();
                    this.secondsSinceLastBlock = Math.floor((now - then) / 1000);
                }
            }
        }, 1000);
    }

    private subscribeToEvents(): void {
        this._blockService.bestBlockChanged.subscribe((block: number) => {
            this.bestBlock = block;
            this.updateBestBlock(this.bestBlock);
            this.secondsSinceLastBlock = 0;
        });

        this._nodeService.rpcEnabledNodes.subscribe((x: number) => {
            this.rpcEnabled = x;
        });

        this._blockSignalRService.messageReceived.subscribe((x: HeaderInfoModel) => {
            this.headerInfo = x;
        });
    }

    private updateBestBlock(height: number): void {
        $('#last-block-icon').addClass('fa-spin');
        $('#last-block-icon').css('animation-play-state', 'running');
        setTimeout(() => $('#last-block-icon').css('animation-play-state', 'paused'), 2080);
    }
}
