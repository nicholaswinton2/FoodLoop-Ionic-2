import { Component,ViewChild } from '@angular/core';
import { NavController, NavParams , App , Slides} from 'ionic-angular';
import { ReceiptPage } from '../receipt/receipt';
import { SignupPage } from '../signup/signup';
import { LoginPage } from '../login/login';
import { IndexPage } from '../index/index';
import { OverviewPage } from '../overview/overview';
import { GamePage } from '../game/game';
import { ShopPage } from '../shop/shop';
import { StatPage } from '../stat/stat';
import { Storage } from '@ionic/storage';
import { Chart } from 'chart.js';
import { PeopleService} from '../../providers/people-service';
import { UserData} from '../../providers/user-data';

/*
  this page is created for navigating user through differnet feature of the app
  as the development goes, more features can be added to this page
  quite similiar to a index page 
*/
@Component({
  selector: 'page-user',
  template: '<div>shit</div>',
  //  templateUrl: 'user.html',
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

  constructor(
    private  app : App,
    public navCtrl: NavController, 
    public navParams: NavParams,
    public peopleService: PeopleService,
    public userData : UserData
  ) {
    this.receiptPage = ReceiptPage;
    this.gamePage = GamePage;
    this.shopPage = ShopPage;
    this.statPage = StatPage;
    this.status = "Weekly"; // defualt chart is Daily
    // get the username from local stroage

  } 
  /* When the page is fully loaded */
  ionViewWillEnter(){
        this.userData.getUsername().then(value=>{
      this.username = value; 
      /* init dashboard variables */
      var myData;
      this.userData.getMyData(this.username).then(
        value => {
          myData = value;
          console.log(myData);
          this.name = this.username;  
          this.email =  myData.firstStart;
          this.myPearPoints =  myData.pearPoint;
          this.trends = 0;
          this.myRank =  myData.currentPos;  
          this.positionShift = myData.previousPos - myData.currentPos;
        }).catch( error=> { alert("Error code: 101")}
        ); 
    });
  }
  
 ionViewDidLoad() {
   this.initCharts();
 }

  addReceipt(){
    this.navCtrl.push(ReceiptPage);
  }

  overview(){
    this.navCtrl.push(OverviewPage);
  }



/*********************** --  Data representation part -- **************************/
  /* including calling provider whihc calls api to retrieve user data */
  /* navigation and respresentation of the retrieved data */

  initCharts(){
  
    this.lineChart = new Chart(this.lineCanvas.nativeElement,this.peopleService.getChartData("Daily"));
    this.barChart = new Chart(this.barCanvas.nativeElement,this.peopleService.getChartData("Weekly"));
    this.pieChart = new Chart(this.pieCanvas.nativeElement,this.peopleService.getChartData("Monthly"));
  }

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
