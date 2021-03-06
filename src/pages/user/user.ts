import { Component,ViewChild } from '@angular/core';
import {
  NavController,
  NavParams,
  App,
  Slides,
  ToastController,
  AlertController,
} from 'ionic-angular';
import { ReceiptPage } from '../receipt/receipt';
import { OverviewPage } from '../overview/overview';
import { AboutPage } from '../about/about';
import { GamePage } from '../game/game';
import { ShopPage } from '../shop/shop';
import { StatPage } from '../stat/stat';
import { PeopleService} from '../../providers/people-service';
import { UserData} from '../../providers/user-data';

/*
  this page is created for navigating user through differnet feature of the app
  as the development goes, more features can be added to this page
  quite similiar to a index page
*/
@Component({
  selector: 'page-user',
  templateUrl: 'user.html',
  providers: [PeopleService,UserData]
})
export class UserPage {
  // get element by id -> barCanvas
  @ViewChild('barCanvas') barCanvas;
  @ViewChild('pieCanvas') pieCanvas;
  @ViewChild('lineCanvas') lineCanvas;
  @ViewChild(Slides) slides: Slides;

  //  varibels for displaying welcome message board
  public status: any;
  lineChart: any;
  barChart: any;
  pieChart: any;

  public receiptPage;
  public gamePage;
  public shopPage;
  public statPage;

  /* Setting up dashboard's main variables*/
  name: any;
  email:any;
  myPearPoints: any;
  trends: any;
  myRank: any;
  username: any;
  positionShift: any;   // display different icon based on the current pos and previous pos

  basicStats = {
    today_sum: 0,
    today_count: 0,
    week_sum: 0,
    week_count: 0,
    month_sum: 0,
    month_count: 0,
    user_sum: 0,
    user_count: 0,
    global_sum: 0,
    global_count: 0,
    user_position: 0,
  };

  constructor(
    private  app : App,
    public navCtrl: NavController,
    public navParams: NavParams,
    public peopleService: PeopleService,
    public userData : UserData,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController,
  ) {
    this.receiptPage = ReceiptPage;
    this.gamePage = GamePage;
    this.shopPage = ShopPage;
    this.statPage = StatPage;
    this.status = "Weekly"; // defualt chart is Daily

  }
  /* When the page is fully loaded */
  public ionViewWillEnter() {
    this.getUserDisplayName();
    this.peopleService.basicStats().subscribe(
      result => {
        this.basicStats = result;
      },
      err => {
        let toast = this.toastCtrl.create({
          message: 'Unable to retrieve stats - are you connected to a network?',
          duration: 6000,
          position: 'top'
        });
        toast.present();
      }
    );
    this.userData.getReturningLogin().subscribe(
      result => {
        if (result == true) {
          console.log('Returning User, do not show guide');
        } else {
          console.log('First time user, prompt the guide');
          this.readGuidePrompt();
          this.userData.setReturningLogin();
        }
      },
      err => {
        console.log('Error checking if returning user');
      }
    );
  }

 ionViewDidLoad() {
   //  this.initCharts();
 }

  addReceipt(){
    this.navCtrl.setRoot(ReceiptPage);
  }

  overview(){
    this.navCtrl.setRoot(OverviewPage);
  }

  getUserDisplayName() {
    this.userData.getDisplayName().subscribe(
      result => {
        if (result) {
          console.log('Display Name has been received');
          this.name = result;
        } else {
          console.log('Display Name is not available');
        }
      },
      err => {
        console.log('Display Name could not be received');
      }
    );
  }

  readGuidePrompt() {
  let alert = this.alertCtrl.create({
    title: 'Welcome new user!',
    message: 'As this may be your first time here, do you want to read the intro guide?',
    buttons: [
      {
        text: 'No Thanks',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      },
      {
        text: 'Show Me!',
        handler: () => {
          console.log('Redirect clicked');
          this.navCtrl.setRoot(AboutPage);
        }
      }
    ]
  });
  alert.present();
}


/*********************** --  Data representation part -- **************************/
  /* including calling provider whihc calls api to retrieve user data */
  /* navigation and respresentation of the retrieved data */

//  initCharts(){
//
//    this.lineChart = new Chart(this.lineCanvas.nativeElement,this.peopleService.getChartData("Daily"));
//    this.barChart = new Chart(this.barCanvas.nativeElement,this.peopleService.getChartData("Weekly"));
//    this.pieChart = new Chart(this.pieCanvas.nativeElement,this.peopleService.getChartData("Monthly"));
//  }

  slideChanged(){
    let currentIndex = this.slides.getActiveIndex();
    switch(currentIndex){
      case 0:
        this.status = "Weekly";
        break;
      case 1:
        this.status = "Daily";
        break;
      case 2:
        this.status = "Monthly";
        break;
    }
  }

  goToSlide(index) {
    this.slides.slideTo(index, 500);
  }

  getIcon(){
    if (this.positionShift > 0)
      return "md-trending-up";
    else if(this.positionShift < 0)
      return "md-trending-down";
    else
      return "md-remove";
  }

  getColor(){
    if(this.positionShift > 0)
      return "secondary";
    else if(this.positionShift < 0)
      return "danger";
    else
      return "light";
  }
}
