import { formatDate } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-date-range-selector',
  templateUrl: './date-range-selector.component.html',
  styleUrls: ['./date-range-selector.component.scss']
})
export class DateRangeSelectorComponent implements OnInit {

  fromDate: string;
  toDate: string;
  selectedRange: any;

  @Output() dateRangeChanged = new EventEmitter<{ fromDate: string, toDate: string }>();

  dateRanges = [
    { label: 'Today', subLabel: this.getDateRangeLabel('today') },
    { label: 'Last 7 Days', subLabel: this.getDateRangeLabel('last7') },
    { label: 'Last 30 Days', subLabel: this.getDateRangeLabel('last30') },
    { label: 'This Month', subLabel: this.getDateRangeLabel('thisMonth') },
    { label: 'Last Month', subLabel: this.getDateRangeLabel('lastMonth') },
    { label: 'This Year', subLabel: this.getDateRangeLabel('thisYear') },
    { label: 'Last Year', subLabel: this.getDateRangeLabel('lastYear') },
    // { label: 'All Time', subLabel: 'Up to Today' }
  ];

  constructor() {}

  ngOnInit(): void {
    //this.setDateRange(this.dateRanges[0]); // Default to 'Today'
  }

  setDateRange(range: any): void {
    const today = new Date();
    this.selectedRange = range;

    switch (range.label) {
      case 'Today':
        this.fromDate = formatDate(today, 'yyyy-MM-dd', 'en');
        this.toDate = formatDate(today, 'yyyy-MM-dd', 'en');
        break;
      case 'Last 7 Days':
        this.fromDate = formatDate(new Date(today.setDate(today.getDate() - 7)), 'yyyy-MM-dd', 'en');
        this.toDate = formatDate(new Date(), 'yyyy-MM-dd', 'en');
        break;
      case 'Last 30 Days':
        this.fromDate = formatDate(new Date(today.setDate(today.getDate() - 30)), 'yyyy-MM-dd', 'en');
        this.toDate = formatDate(new Date(), 'yyyy-MM-dd', 'en');
        break;
      case 'This Month':
        this.fromDate = formatDate(new Date(today.getFullYear(), today.getMonth(), 1), 'yyyy-MM-dd', 'en');
        this.toDate = formatDate(new Date(), 'yyyy-MM-dd', 'en');
        break;
      case 'Last Month':
        this.fromDate = formatDate(new Date(today.getFullYear(), today.getMonth() - 1, 1), 'yyyy-MM-dd', 'en');
        this.toDate = formatDate(new Date(today.getFullYear(), today.getMonth(), 0), 'yyyy-MM-dd', 'en');
        break;
      case 'This Year':
        this.fromDate = formatDate(new Date(today.getFullYear(), 0, 1), 'yyyy-MM-dd', 'en');
        this.toDate = formatDate(new Date(), 'yyyy-MM-dd', 'en');
        break;
      case 'Last Year':
        this.fromDate = formatDate(new Date(today.getFullYear() - 1, 0, 1), 'yyyy-MM-dd', 'en');
        this.toDate = formatDate(new Date(today.getFullYear() - 1, 11, 31), 'yyyy-MM-dd', 'en');
        break;
      case 'All Time':
        this.fromDate = null;
        this.toDate = formatDate(new Date(), 'yyyy-MM-dd', 'en');
        break;
      default:
        break;
    }

    this.dateRangeChanged.emit({ fromDate: this.fromDate, toDate: this.toDate });
  }

  getDateRangeLabel(range: string): string {
    const today = new Date();
    let fromDate, toDate;

    switch (range) {
      case 'today':
        fromDate = today;
        toDate = today;
        break;
      case 'last7':
        fromDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7);
        toDate = today;
        break;
      case 'last30':
        fromDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 30);
        toDate = today;
        break;
      case 'thisMonth':
        fromDate = new Date(today.getFullYear(), today.getMonth(), 1);
        toDate = today;
        break;
      case 'lastMonth':
        fromDate = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        toDate = new Date(today.getFullYear(), today.getMonth(), 0);
        break;
      case 'thisYear':
        fromDate = new Date(today.getFullYear(), 0, 1);
        toDate = today;
        break;
      case 'lastYear':
        fromDate = new Date(today.getFullYear() - 1, 0, 1);
        toDate = new Date(today.getFullYear() - 1, 11, 31);
        break;
      default:
        return '';
    }

    return `${formatDate(fromDate, 'MMM d, yyyy', 'en')} - ${formatDate(toDate, 'MMM d, yyyy', 'en')}`;
  }
}
