import { Component, OnInit } from '@angular/core';
import { BlockService } from '../../core/services/data/block.service';
import { BlockListModel } from '../../models/block.models';
import { PageResultModel } from '../../models';

@Component({
    templateUrl: `./block-list.component.html`
})
export class BlockListComponent implements OnInit {
    pageResults: PageResultModel<BlockListModel>;
    isLoading = true;

    constructor(private _blockService: BlockService) { }

    ngOnInit(): void {
        this.getPage(1);
    }

    getPage(page: number): void {
        this.isLoading = true;
        this._blockService.getBlocksPage(page, 32)
            .subscribe(x => {
                this.pageResults = x.json() as PageResultModel<BlockListModel>;
                this.isLoading = false;
            }, err => {
                console.log(err);
            });
    }
}
