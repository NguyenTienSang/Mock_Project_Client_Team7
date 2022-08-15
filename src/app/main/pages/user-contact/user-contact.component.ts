import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup,FormControl,FormsModule, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FlatpickrOptions } from 'ng2-flatpickr';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { AccountSettingsService } from 'app/main/pages/account-settings/account-settings.service';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import Swal  from 'sweetalert2';

@Component({
  selector: 'app-user-contact',
  templateUrl: './user-contact.component.html',
  styleUrls: ['./user-contact.component.scss']
})
export class UserContactComponent implements OnInit {

  closeResult: string;
  // public
  public contentHeader: object;
  public data: any;
  public birthDateOptions: FlatpickrOptions = {
    altInput: true
  };
  public passwordTextTypeOld = false;
  public passwordTextTypeNew = false;
  public passwordTextTypeRetype = false;

  public showAlert = true;

  public message = '';
  public typealert = '';

  public messageContact = '';
  public typealertContact = '';

  public typeAction;

  public messageUploadSettings = '';
  public typeAlertUploadSettings = '';

  public contacts: any;


  //Param Contact
  public contactEdit : any;
  public NameContactEdit;
  public AddressContactEdit;
  public PhoneNumberContactEdit;


  // private
  private _unsubscribeAll: Subject<any>;

  /**
   * Constructor
   *
   * @param {AccountSettingsService} _accountSettingsService
   */
  constructor(private _accountSettingsService: AccountSettingsService, private modalService: NgbModal) {
    this._unsubscribeAll = new Subject();
  }



  // onSubmit(f: NgForm) {
  //   // const url = 'http://localhost:8888/friends/addnew';
  //   // this.HttpClient.post(url, f.value)
  //   //   .subscribe((result) => {
  //   //     this.ngOnInit(); //reload the table
  //   //   });
  //   // this.modalService.dismissAll(); //dismiss the modal
  // }


  //Open and close popup
  open(content,type) {

    this.showAlert = false;

    //If add contact then reset null data
    if(type == 'Add Contact' )
    {
      this.NameContactEdit = "";
      this.AddressContactEdit = "";
      this.PhoneNumberContactEdit = "";
    }
    // console.log('txt : ',type);
    this.typeAction = type
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  // Public Methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Toggle Password Text Type Old
   */
  togglePasswordTextTypeOld() {
    this.passwordTextTypeOld = !this.passwordTextTypeOld;
  }

  /**
   * Toggle Password Text Type New
   */
  togglePasswordTextTypeNew() {
    this.passwordTextTypeNew = !this.passwordTextTypeNew;
  }

  /**
   * Toggle Password Text Type Retype
   */
  togglePasswordTextTypeRetype() {
    this.passwordTextTypeRetype = !this.passwordTextTypeRetype;
  }


  updateProfile(){
    this._accountSettingsService.updateProfile(
      this.updateProfileForm.value.firstname,
      this.updateProfileForm.value.lastname,
      this.updateProfileForm.value.phonenumber,
      this.updateProfileForm.value.email,
      this.data.user.role,
      this.data.user.status,
      this.data.user.id,
    ).subscribe((response)=>{
      // console.log("response nts 1 : ",response.message);
      // this.router.navigate([this.router.url])

      if(response.isSuccessed == true)
      {
        this.typealert = "success";
        this.data.user.firstName = this.updateProfileForm.value.firstname;
        this.data.user.lastName = this.updateProfileForm.value.lastname;
        this.data.user.phoneNumber = this.updateProfileForm.value.phonenumber;
        this.data.user.email = this.updateProfileForm.value.email;
        localStorage.setItem("currentUser",JSON.stringify(this.data));
      }
      else {
        this.typealert = "danger";
      }
      this.message = response.message;
    },(err) =>{
      console.log(err);
      this.typealert = "danger";
      this.message = err.message;
    })


  }

  addContact(){
    if(!this.ContactForm.value.Name || !this.ContactForm.value.Address || !this.ContactForm.value.Phonenumber)
    {
      this.typealertContact = "danger";
      this.messageContact = "Please enter full field";
    }
    else {
      console.log(  this.ContactForm.value.Name,);
      console.log(  this.ContactForm.value.fullName,);

      this._accountSettingsService.addContact(
        this.ContactForm.value.Name,
        this.ContactForm.value.Address,
        this.ContactForm.value.Phonenumber,
      ).subscribe((response)=>{
        // this.router.navigate([this.router.url])

        if(response.isSuccessed == true)
        {
          this.typealertContact = "success";
          this.getUserContact(this.data.user.id);
        }
        else {
          this.typealertContact = "danger";
        }
        this.showAlert = true;
        this.messageContact = response.message;
      },(err) =>{
        console.log(err);
      })
    }
  }

  editContact(id : string){
    if(!this.ContactForm.value.Name || !this.ContactForm.value.Address || !this.ContactForm.value.Phonenumber)
    {
      this.typealertContact = "danger";
      this.messageContact = "Please enter full field";
    }
    else {
      this._accountSettingsService.editContact(
        id,
        this.ContactForm.value.Name,
        this.ContactForm.value.Address,
        this.ContactForm.value.Phonenumber,
      ).subscribe((response)=>{
        // this.router.navigate([this.router.url])

        if(response.isSuccessed == true)
        {
          this.typealertContact = "success";
          this.getUserContact(this.data.user.id);
        }
        else {
          this.typealertContact = "danger";
        }
        this.showAlert = true;
        this.messageContact = response.message;
      },(err) =>{
        console.log(err);
      })

    }
  }


  deleteContact(id : string){
    // alert('editcontact : '+id);
    console.log('this.ContactForm.value.Name : ',this.ContactForm.value.Name );
    console.log('this.ContactForm.value.Address : ',this.ContactForm.value.Address  );
    console.log('this.ContactForm.value.Phonenumber  : ',this.ContactForm.value.Phonenumber );

    this._accountSettingsService.deleteContact(
      id
    ).subscribe((response)=>{
      if(response.isSuccessed)
      {
        this.getUserContact(this.data.user.id);
        // getContact(content,type,id);
        Swal.fire("Success",response.message,"success")
      }
      else{
        Swal.fire("Error",response.message,"error")
      }
    },(err) =>{
      console.log(err);
    })


    // if(!this.ContactForm.value.Name || !this.ContactForm.value.Address || !this.ContactForm.value.Phonenumber)
    // {
    //   this.typealertContact = "danger";
    //   this.messageContact = "Please enter full field";
    // }
    // else {
    //   this._accountSettingsService.deleteContact(
    //     id
    //   ).subscribe((response)=>{
    //     console.log("response nts 1 : ",response.message);
    //     // this.router.navigate([this.router.url])

    //     if(response.isSuccessed == true)
    //     {
    //       this.typealertContact = "success";
    //     }
    //     else {
    //       this.typealertContact = "danger";
    //     }
    //     this.messageContact = response.message;
    //   },(err) =>{
    //     console.log(err);
    //   })

    // }
  }


  getContact(content : any,type : any,id : any){
    // contactEdit
    this.open(content,type);

    this._accountSettingsService.getUserDetailContact(
      id
    ).subscribe((response)=>{
      this.contactEdit = response.resultObj;
      this.NameContactEdit = response.resultObj.name;
      this.AddressContactEdit = response.resultObj.address;
      this.PhoneNumberContactEdit = response.resultObj.phoneNumber;
    },(err) =>{
      console.log(err);
    })



  }

  setDefaultContact(id : string){
    this._accountSettingsService.setDefaultContact(
      id
    ).subscribe((response)=>{
        console.log('response : ',response);

    },(err) =>{
      console.log(err);
    })
  }

  fileToUpload: any;
//Show image when select
  onSelectFileAvatar(e : any){
    this.fileToUpload = e.target.files[0]
      if(e){
        var reader=new FileReader();
        reader.readAsDataURL(e.target.files[0]);

        reader.onload=(event:any)=>{
          this.data.user.avatar=event.target.result;
      }
      }
  }

  updateProfileForm = new FormGroup({
    lastname : new FormControl('', [Validators.required]),
    firstname : new FormControl('', Validators.required),
    username : new FormControl('', Validators.required),
    phonenumber : new FormControl('', Validators.required),
    email : new FormControl('', Validators.required),
  })


  ContactForm = new FormGroup({
    Name : new FormControl('', [Validators.required]),
    Address : new FormControl('', Validators.required),
    Phonenumber : new FormControl('', Validators.required),
  })


  //Upload image to cloudinary
  onUploadAvatar(){
    console.log('this.fileToUpload : ',this.fileToUpload);
    if(!this.fileToUpload)
    {
      this.typeAlertUploadSettings = "danger";
      this.messageUploadSettings = "Please choose file !!!";
    }
    else {
      let formData = new FormData();
      console.log('Form data : ',formData);
      formData.append('formFile',this.fileToUpload);
      this._accountSettingsService.uploadImageToCloud(formData,this.data.user.id).subscribe((response)=>{
        if(response.isSuccessed == true)
        {
          this.typeAlertUploadSettings = "success";

          // if(this.updateUserCurrent.user.id == this.urlLastValue)
          // {
            this.data.user.avatar = response.resultObj.avatar;
            localStorage.setItem("currentUser",JSON.stringify(this.data));
            // localStorage.setItem("currentUser",JSON.stringify(

            //     // this.updateProfileForm.value.firstname,
            //     // this.updateProfileForm.value.lastname,
            //     // this.updateProfileForm.value.phonenumber,
            //     // this.updateProfileForm.value.email,
            //     // this.data.role,
            //     // this.data.status,
            //     this.data.id

            // ));
          // }

          setTimeout( () => {    window.location.reload();}, 1000 );
        }
        else {
          this.typeAlertUploadSettings = "danger";
        }
        this.messageUploadSettings = response.message;
    },(err) =>{
      console.log(err);
    });
    }

  }


  getUserContact(id : string)
  {
    this._accountSettingsService.getUserContact(id).subscribe(respone=>{
      this.contacts = respone.resultObj;
    })
  }

  ngOnInit(): void {

    this.data = (JSON.parse(localStorage.getItem("currentUser")));
    this.getUserContact(this.data.user.id);


 // content header
 this.contentHeader = {
  headerTitle: 'Contact',
  actionButton: true,
  breadcrumb: {
    type: '',
    links: [
      {
        name: 'Home',
        isLink: true,
        link: '/'
      },
      {
        name: 'Pages',
        isLink: true,
        link: '/'
      },
      {
        name: 'Contact',
        isLink: false
      }
    ]
  }
};

  }

}
