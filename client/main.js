import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Session } from 'meteor/session';
import 'meteor/jkuester:blaze-bs4';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.css'; // this is the default BS theme as example
import popper from 'popper.js';
global.Popper = popper // fixes some issues with Popper and Meteor

import './main.html';
import '../lib/collection.js';

Meteor.subscribe('imgGallery');



Session.set("imageLimit", 9);
lastScrollTop = 0;
$(window).scroll(function(event){
  //check if we are near the bottom of the page
  if ($(window).scrollTop() + $(window).height() > $(document).height() - 100){
    //where are we on the page?
    var scrollTop = $(this).scrollTop();
    //test if we are going down
    if (scrollTop > lastScrollTop){
      //yes we scrolling down
      Session.set("imageLimit",Session.get("imageLimit") + 3);
    }//end of if (new scrollTop)
    lastScrollTop = scrollTop;
  }// end of if (height check)
});

Template.myGallery.helpers({
  allImages(){
    //get time 15 seconds ago
    var prevTime = new Date().getTime() - 15000;
    //count how many records are younger than fifteen seconds
    var results = imagesdb.find({createdOn: {$gte: prevTime}}).count();
    if (results > 0){
      return imagesdb.find({}, {sort:{createdOn: -1, ratings: -1}, limit: Session.get("imageLimit")});
    }
    else {
      return imagesdb.find({}, {sort:{ratings: -1, createdOn: -1}, limit: Session.get("imageLimit")});
    }
  },
  userField(){//check to see if image has a saved user
    if (!(this.createdBy == undefined)){
      return true;
    }
    else {
      return false;
    }
  }
});

Template.myGallery.events({
  'click .js-delete'(event, instance) {
    // console.log("deleting...");
    var myId = this._id;
    $("#deleteId").val(myId);
    $("#confirmModal").modal("show");
  },
  'click .js-edit'(event, instance){
    $("#editImageModal").modal("show");
    var myId = this._id;
    // console.log("let's edit "+myId);
    var eTitle = imagesdb.findOne({_id: myId}).title;
    var ePath = imagesdb.findOne({_id: myId}).path;
    var eDesc = imagesdb.findOne({_id: myId}).desc;
    $("#editId").val(myId);
    $("#editTitle").val(eTitle);
    $("#editPath").val(ePath);
    $("#editDesc").val(eDesc);
    $(".editHolder").attr("src", ePath);
  },
  'click .js-confirm'(event, instance){
    var myId = $("#deleteId").val();
    $("#"+myId).fadeOut('slow',function(){
      imagesdb.remove({_id:myId});
      console.log(myId);
    });
  },
  'click .rating'(event, instance) {
    // if (Meteor.userId()){
      var myId = this.picId;
      const value = $(event.target).val();
      // console.log(myId+" : "+value);
      imagesdb.update({_id: myId},
        {$set:{
          "ratings": value
        }}
      );
    }
  // }
});

Template.addImage.events({
  'click .js-addImage'(event, instance){
    console.log("Open modal");
  },
  'click .js-exitAdd'(event, instance){
    console.log("closing modal");
    $("#imgTitle").val("");
    $("#imgPath").val("");
    $("#imgDesc").val("");
    $(".placeHolder").attr("src","imgPlaceHolder.png");
  },
  'click .js-saveImage'(event, instance){
    var theTitle = $("#imgTitle").val();
    var thePath = $("#imgPath").val();
    var theDesc = $("#imgDesc").val();
    // console.log("Saving Image with title: "+theTitle+" and its path is "+thePath+" and its description "+theDesc);
    imagesdb.insert({
      "title": theTitle,
      "path": thePath,
      "desc": theDesc,
      "createdOn": new Date().getTime(),
      "createdBy": Meteor.users.findOne({_id:Meteor.userId()}).emails[0].address,
      "createdById": Meteor.userId()
    });
    // imagesdb.insert({"title": theTitle, "path": thePath, "desc": theDesc});
    // console.log("saving...");
    $("#addImageModal").modal("hide");
    $("#imgTitle").val("");
    $("#imgPath").val("");
    $("#imgDesc").val("");
  },
  'input #imgPath'(event, instance){
    $(".placeHolder").attr("src",$("#imgPath").val());
  }
});

Template.editImage.events({
  'click .js-updateImage'(event, instance){
    var newTitle = $("#editTitle").val();
    var newPath = $("#editPath").val();
    var newDesc = $("#editDesc").val();
    var updateId = $("#editId").val();
    console.log("updating "+updateId+" Image with title: "+newTitle+" and its path is "+newPath+" and its description "+newDesc);
    imagesdb.update({_id: updateId},
      {$set:{
        "title": newTitle,
        "path": newPath,
        "desc": newDesc
      }}
    );
  },
  'input #editPath'(event, instance){
    $(".placeHolder").attr("src",$("#editPath").val());
  }
});