import { BrowserModule } from '@angular/platform-browser';
import {ReactiveFormsModule, FormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import { NgModule } from '@angular/core';

import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { MatListModule, MatButtonModule, MatIconModule, MatLineModule, MatInputModule,
  MatButtonToggleModule} from '@angular/material';
  import {MatSliderModule} from '@angular/material/slider';
  import {MatCardModule} from '@angular/material/card';
  import {MatGridListModule} from '@angular/material/grid-list';
import { AppComponent } from './app.component';
import { UserComponent } from './user/user.component';

import { ImageboxComponent } from '../comps/imagebox/imagebox.component';
import { GrouptogglerComponent } from '../comps/grouptoggler/grouptoggler.component';

@NgModule({
  declarations: [
    AppComponent,
    ImageboxComponent,
    UserComponent,
    GrouptogglerComponent
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatGridListModule,
    MatListModule,
    MatButtonModule,
    MatIconModule,
    MatLineModule,
    MatInputModule,
    MatSliderModule,
    MatButtonToggleModule
  ],

  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
