import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup,FormControl,FormsModule, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FlatpickrOptions } from 'ng2-flatpickr';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { UserEditService } from 'app/main/apps/user/user-edit/user-edit.service';
import { isBuffer } from 'util';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class UserEditComponent implements OnInit {
  // Public
  public url = this.router.url;
  public urlLastValue;
  public rows;
  public selectedRole;
  public selectedStatus;
  public test;
  public loading = false;
  public message = '';
  public typealert = '';

  public messageUpload = '';
  public typeAlertUpload = '';

  currentDisabled : boolean = false;

  employee: any[]
  empSelected:Number;
  modifedtext: string;
  // public editUserForm: FormGroup;

  public birthDateOptions: FlatpickrOptions = {
    altInput: true
  };


  listRole = [
    // {role : 'Master'},
    {role : 'Mod'},
    {role : 'User'},
  ]

  listStatus = [
    {status : 'Active'},
    {status : 'Deactive'},
  ]


  // Private
  private _unsubscribeAll: Subject<any>;

  /**
   * Constructor
   *
   * @param {Router} router
   * @param {UserEditService} _userEditService
   */
  constructor(private router: Router, private _userEditService: UserEditService, private http: HttpClient) {
    this._unsubscribeAll = new Subject();
    this.urlLastValue = this.url.substr(this.url.lastIndexOf('/') + 1);
    // this.editUserForm = new FormGroup({
    //   role : new FormControl(null)
    // });
    // this.editUserForm.controls['role'].setValue('UK', {onlySelf: true});
  }

  editUserForm = new FormGroup({
    lastname : new FormControl('', Validators.required),
    firstname : new FormControl('', Validators.required),
    username : new FormControl('', Validators.required),
    phonenumber : new FormControl('', Validators.required),
    email : new FormControl('', Validators.required),
    status : new FormControl(''),
    role : new FormControl(''),
  })


  private updateUserCurrent;


  editUser(){
    this._userEditService.editUser(
      this.editUserForm.value.firstname,
      this.editUserForm.value.lastname,
      this.editUserForm.value.phonenumber,
      this.editUserForm.value.email,
      this.editUserForm.value.role,
      this.editUserForm.value.status,
      this.urlLastValue).subscribe((response)=>{
      console.log("response nts 1 : ",response.message);
      // this.router.navigate([this.router.url])

      if(response.isSuccessed == true)
      {
        this.typealert = "success";
      }
      else {
        this.typealert = "danger";
      }
      this.message = response.message;
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
          this.rows.avatar=event.target.result;
      }
      }
  }



//Upload image to cloudinary
  onUploadAvatar(){
    console.log('this.fileToUpload : ',this.fileToUpload);
    if(!this.fileToUpload)
    {
      this.typeAlertUpload = "danger";
      this.messageUpload = "Please choose file !!!";
    }
    else {
      console.log('upppp');

      let formData = new FormData();
    formData.append('formFile',this.fileToUpload);
    console.log('Form data : ',formData);

    this._userEditService.uploadImageToCloud(formData,this.urlLastValue).subscribe((response)=>{
      console.log(response);
        if(response.isSuccessed == true)
        {
          this.typeAlertUpload = "success";

          if(this.updateUserCurrent.user.id == this.urlLastValue)
          {
            this.updateUserCurrent.user.avatar = response.resultObj.avatar;
            localStorage.setItem("currentUser",JSON.stringify(this.updateUserCurrent));
          }

          setTimeout( () => {    window.location.reload();}, 1000 );


        }
        else {
          this.typeAlertUpload = "danger";
        }
        this.messageUpload = response.message;
    },(err) =>{
      console.log(err);
    });
    }

  }



  ngOnInit(): void {
 this._userEditService.getCurrentUser(this.urlLastValue).subscribe((response) =>{
      this.rows = response.resultObj;
      this.selectedRole =   this.rows.role
      this.selectedStatus =   this.rows.status
    })


    this.updateUserCurrent = JSON.parse(localStorage.getItem("currentUser"))

    if(this.updateUserCurrent.user.id == this.urlLastValue)
    {
          this.currentDisabled = true
    }



  }

  onChangeRole(value : any) {
    this.editUserForm.value.role = value;
  }

  onChangeStatus(value : any) {
    this.editUserForm.value.status = value;
  }

  onEmployeeSelected(val:any){
    // this.modifedtext = "the value" + val + "wass selected form dropdown";;
    console.log('val : ',val);

  }

  get lastName() {
    return this.editUserForm.get('lastname');
  }

  get firstName() {
    return this.editUserForm.get('firstname');
  }

  get email() {
    return this.editUserForm.get('email');
  }

  get phoneNumber() {
    return this.editUserForm.get('phonenumber');
  }


}
