import { Component, OnInit } from '@angular/core';
import { SettingsService } from '../../../core/settings/settings.service';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { CustomValidators } from 'ng2-validation';
import { UserService } from '../../../shared/services/user.service';
import { User } from '../../../shared/models/user.model';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

    valForm: FormGroup;
    passwordForm: FormGroup;

    constructor(
      public settings: SettingsService,
      private userService: UserService,
      private router: Router,
      fb: FormBuilder) {

        const password = new FormControl('', Validators.compose([Validators.required, Validators.pattern('^[a-zA-Z0-9]{6,10}$')]));
        const certainPassword = new FormControl('', [Validators.required, CustomValidators.equalTo(password)]);

        this.passwordForm = fb.group({
            'password': password,
            'confirmPassword': certainPassword
        });

        this.valForm = fb.group({
            'email': [null, Validators.compose([Validators.required, CustomValidators.email])],
            'passwordGroup': this.passwordForm
        });
    }

    submitForm($ev, value: any) {
        $ev.preventDefault();
        for (const c of Object.keys(this.valForm.controls)) {
            this.valForm.controls[c].markAsTouched();
        }
        for (const c of Object.keys(this.passwordForm.controls)) {
            this.passwordForm.controls[c].markAsTouched();
        }

        if (this.valForm.valid) {
          const user = new User().deserialize({
            email: value.email,
            username: value.email,
            password: value.passwordGroup.password
          });
          this.userService.registerUser(user)
            .subscribe(
              success => {
                console.log('User registered!');
                this.router.navigateByUrl('/login');
              },
              error => {
                console.log('Registration failed!');
              }
            );
        }
    }

    ngOnInit() {
    }

}
