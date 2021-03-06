import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BlockService } from '../../core/services/data';
import { BlockDetailsModel } from '../../models/block.models';
import { PageResultModel, BaseTxModel } from '../../models';
import { TxService } from '../../core/services/data';

@Component({
    templateUrl: `./block-details.component.html`
})
export class BlockDetailsComponent implements OnInit {
    index: string | number;
    block: BlockDetailsModel = new BlockDetailsModel();
    isLoading = true;
    transactions: PageResultModel<BaseTxModel>;

    constructor(private route: ActivatedRoute,
        private blockService: BlockService,
        private txService: TxService) { }

    ngOnInit(): void {
        this.isLoading = true;
        this.route.params.subscribe(params => {
            this.index = +params['index'];
            this.blockService.getBlock(this.index)
                .subscribe(x => {
                    this.block = x.json() as BlockDetailsModel;
                    this.getTransactionsPage(1);
                    this.isLoading = false;
                });
        });
    }

    getTransactionsPage(page: number): void {
        this.txService.getPage(page, 16, this.block.hash)
            .subscribe(x => {
                this.transactions = x.json() as PageResultModel<BaseTxModel>;
            }, err => {
                console.log(err);
            });
    }
}
