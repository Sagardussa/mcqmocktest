import { Component, ElementRef, HostListener, Input, OnInit } from '@angular/core';
//import { Clipboard } from '@angular/cdk/clipboard';

@Component({
  selector: 'app-result-list-context',
  templateUrl: './result-list-context.component.html',
  styleUrls: ['./result-list-context.component.scss']
})
export class ResultListContextComponent implements OnInit {

  @Input() menuEvent: any;
  @Input() menuSelector: any;
  @Input() menuItems: any;
  @Input() gridApi: any;

  isDisplayMenu = false;
  currentMenu: any = null;


  constructor(private elementRef: ElementRef) {
    this.isDisplayMenu = false;
  }

  ngOnInit() {
    this.createMenu(this.menuEvent.clientX, this.menuEvent.clientY);
    this.menuSelector!.addEventListener('click', () => {
      if (this.currentMenu !== null) {
        this.currentMenu = null;
      }
    });
  }

  createMenu(x: number, y: number) {
    this.isDisplayMenu = true;
    if (this.elementRef.nativeElement) {
      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight;

      // Calculate percentage-based positions
      const leftPercentage = (x / screenWidth) * 100;
      const topPercentage = (y / screenHeight) * 100;

      this.currentMenu = this.elementRef.nativeElement.querySelector('.context-menu');

      // Set the left and top styles using percentage values
      this.currentMenu!.style.left = `calc(${leftPercentage}% - 100px)`;
      this.currentMenu!.style.top = `calc(${topPercentage}% + 50px)`;
    }
  }


  closeMenu() {
    this.currentMenu = null;
  }

  @HostListener('document:click')
  documentClick(): void {
    this.isDisplayMenu = false;
  }

  @HostListener('window:onkeyup')
  escKeyClick(): void {
    this.isDisplayMenu = false;
  }

  onMenuClick(menuItem: any) {
    menuItem.callbackFn(menuItem);
  }
}
