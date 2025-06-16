import {
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnInit,
  ViewChild,
} from "@angular/core";
import { Chart, ChartConfiguration, registerables } from "chart.js";

Chart.register(...registerables);

@Component({
  selector: "app-graph",
  template: ` <canvas #canvas></canvas> `,
  standalone: false,
})
export class GraphComponent implements OnChanges {
  @Input() config!: ChartConfiguration;
  @ViewChild("canvas") canvasRef!: ElementRef<HTMLCanvasElement>;

  chart!: Chart;

  ngOnChanges() {
    console.log("this.chart", this.chart);

    if (this.chart) this.chart.destroy();
    setTimeout(() => {
      if (this.config && this.canvasRef) {
        this.chart = new Chart(this.canvasRef.nativeElement, this.config);
      }
    }, 50);
  }

  ngOnDestroy() {
    if (this.chart) {
      this.chart.destroy();
    }
  }
}
