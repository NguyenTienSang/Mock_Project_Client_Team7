import { Component, OnInit , ViewEncapsulation} from '@angular/core';

@Component({
  selector: 'app-ecommerce-add',
  templateUrl: './ecommerce-add.component.html',
  styleUrls: ['./ecommerce-add.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class EcommerceAddComponent implements OnInit {
  public contentHeader: object;
  constructor() { }

  ngOnInit(): void {
    this.contentHeader = {
      headerTitle: 'Manager',
      actionButton: false,
      breadcrumb: {
        type: '',
        links: [
          {
            name: 'Home',
            isLink: true,
            link: '/'
          },
          {
            name: 'eCommerce',
            isLink: true,
            link: '/'
          },
          {
            name: 'Add',
            isLink: false
          }
        ]
      }
    };
  }

}
