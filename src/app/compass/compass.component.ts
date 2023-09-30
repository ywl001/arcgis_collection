import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { fromEvent } from 'rxjs';

@Component({
  selector: 'app-compass',
  templateUrl: './compass.component.html',
  styleUrls: ['./compass.component.scss']
})
export class CompassComponent {

  @ViewChild('znz', { static: false }) znz: ElementRef
  @ViewChild('root', { static: false }) root: ElementRef

  @Output() angle: EventEmitter<number> = new EventEmitter();

  initAngle = 180
  private _inputAngle=0;
  public get inputAngle() {
    return this._inputAngle;
  }
  public set inputAngle(value) {
    this._inputAngle = value;
  }

  private move$
  private up$;

  private isMobile: boolean;

  private moveEvent: string;
  private upEvent: string;
  private downEvent: string;

  rotation:string;

  constructor(){}

  ngOnInit() {
    if (/Mobi|Android|iPhone/i.test(navigator.userAgent)) {
      // 当前设备是移动设备
      console.log('is mobile');
      this.isMobile = true;
      this.moveEvent = 'touchmove'
      this.upEvent = 'touchend'
      this.downEvent = 'touchstart'
    } else {
      this.isMobile = false;
      this.downEvent = 'mousedown'
      this.moveEvent = 'mouseover'
      this.upEvent = 'mouseup'
    }

    console.log('init angle:',this.inputAngle + this.initAngle)
    const angle = this.initAngle + this.inputAngle;
    this.rotation = `rotate(${angle}deg)`
  }

  ngAfterViewInit() {
    // this.root.nativeElement.addEventListener(this.downEvent, this.onDown)
    fromEvent(this.root.nativeElement,this.downEvent).subscribe((e:MouseEvent | TouchEvent)=>{
      this.onDown(e,this.moveEvent,this.upEvent)
    })
  }

  private onDown(e: MouseEvent | TouchEvent, moveEvent: string, upEvent: string) {
    let deg;
    console.log('down', this.calcDeg(e, this.isMobile))
    deg = this.calcDeg(e, this.isMobile)
    this.znz.nativeElement.style.transform = `rotate(${deg}deg)`

    if (this.move$) this.move$.unsubscribe();
    if (this.up$) this.up$.unsubscribe();

    this.move$ = fromEvent(e.target, moveEvent).subscribe(
      (e: any) => {
        console.log('mouse move:', this.calcDeg(e, this.isMobile))
        deg = this.calcDeg(e, this.isMobile)
        this.znz.nativeElement.style.transform = `rotate(${deg}deg)`
      }
    )

    this.up$ = fromEvent(window, upEvent).subscribe(
      (e: any) => {
        let angle = parseInt(deg)-this.initAngle;
        if(angle < 0){
          angle = 360+angle;
        }
        console.log(angle)
        this.angle.emit(angle)
        if (this.move$) this.move$.unsubscribe()
        this.up$.unsubscribe()
      }
    )
  }

  private calcDeg(e: MouseEvent | TouchEvent, isMobile) {
    let offsetX: number;
    let offsetY: number;

    if (isMobile) {
      const bcr = (e.target as HTMLElement).getBoundingClientRect();
      offsetX = (e as TouchEvent).targetTouches[0].clientX - bcr.x;
      offsetY = (e as TouchEvent).targetTouches[0].clientY - bcr.y;
    } else {
      offsetX = (e as MouseEvent).offsetX;
      offsetY = (e as MouseEvent).offsetY;
    }
    const w = (<HTMLElement>(e.target)).offsetWidth;
    let x = offsetX - w / 2;
    let y = offsetY - w / 2;
    let rad = Math.atan2(y, x);
    return rad * 180 / Math.PI + 90;
  }
}
