import { Component, OnInit, ViewChild, OnDestroy, AfterViewInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup, NgForm } from '@angular/forms';
import { ContactService } from 'src/app/services/Contact.service';
import { EmailService } from 'src/app/services/Email.service';
import { Subscription } from 'rxjs';
import { ResponseModalComponent } from '../modals/response-modal/response-modal.component';
import { MatDialog } from '@angular/material/dialog';
import 'jarallax';
declare var jarallax: any;

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('formDirective', {static: true}) private formDirective: NgForm;
  contactForm: FormGroup;

  emailPattern = '^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$';
  phonePattern = '/^\(\d{3}\)\s\d{3}-\d{4}$/';

  contact: any;

  private emailSubscription: Subscription;
  private contactformSubscription: Subscription;
  public modalSubscription: Subscription;

  ngOnInit() {
    this.contactForm = this.creatForm();
  }

  ngAfterViewInit() {
    jarallax(document.querySelectorAll('.jarallax'), {
      speed: .2
    });
  }

  constructor(
    private fb: FormBuilder,
    private cs: ContactService,
    private es: EmailService,
    public dialog: MatDialog
  ) { }

  creatForm() {
    return this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', Validators.required],
      phone: ['', Validators.required],
      message: [''],
    });
  }

  onSubmit() {
    const ob = {
      'firstName': this.contactForm.controls.firstName.value,
      'lastName': this.contactForm.controls.lastName.value,
      'email': this.contactForm.controls.email.value,
      'phone': this.contactForm.controls.phone.value,
      'message': this.contactForm.controls.message.value
    };
    this.contactformSubscription = this.cs.createContact(ob).subscribe(contact => {
      console.log(contact);
      if (contact) {
        this.contact = contact;
      }
    });
    // this.emailSubscription = this.es.sendEmail(ob).subscribe(data => {
    //   console.log('email was sent');
    // }, err => {
    //   console.log('err');
    // });
    this.responseModal();
    this.clearFunction();
  }

  private clearFunction(): void {
    this.formDirective.resetForm();
    this.contactForm.reset();
  }

  responseModal() {
    const dialogRef = this.dialog.open(ResponseModalComponent, {
      panelClass: 'custom-dialog-container',
      data: {

      },
      disableClose: true,
      width: '600px',
      height: '520px'
    });
    dialogRef.afterClosed().subscribe(res => {

    });
  }

  ngOnDestroy() {
    if (this.contactformSubscription) {
      this.contactformSubscription.unsubscribe();
    }
    if (this.emailSubscription) {
      this.emailSubscription.unsubscribe();
    }
    if (this.modalSubscription) {
      this.modalSubscription.unsubscribe();
    }
  }

}
