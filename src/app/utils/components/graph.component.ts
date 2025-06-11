import {
  Component,
  ElementRef,
  Input,
  OnChanges,
  ViewChild,
} from "@angular/core";
import { Chart, ChartConfiguration, registerables } from "chart.js";

Chart.register(...registerables);

@Component({
  selector: "app-graph",
  template: `
    <!-- <canvas *ngIf="config; else noResult" #canvas></canvas>
    <ng-template #noResult>
      <app-no-result-found></app-no-result-found>
    </ng-template> --><canvas #canvas></canvas>
  `,
  standalone: false,
})
export class GraphComponent implements OnChanges {
  @Input() config!: ChartConfiguration;
  @ViewChild("canvas") canvasRef!: ElementRef<HTMLCanvasElement>;

  chart!: Chart;

  ngOnChanges() {
    if (this.config) {
      if (this.chart) {
        this.chart.destroy();
      }
      this.chart = new Chart(this.canvasRef.nativeElement, this.config);
    }
  }
  ngOnDestroy() {
    if (this.chart) {
      this.chart.destroy();
    }
  }
}
