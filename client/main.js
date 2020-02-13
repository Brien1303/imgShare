import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import 'meteor/jkuester:blaze-bs4'
import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.css' // this is the default BS theme as example
import popper from 'popper.js'
global.Popper = popper // fixes some issues with Popper and Meteor

import './main.html';
import '../lib/collection.js';

// Template.hello.onCreated(function helloOnCreated() {
//   // counter starts at 0
//   this.counter = new ReactiveVar(0);
// });

Template.myGallery.helpers({
  allImages(){
  	return imagesdb.find();
  },
});

Template.myGallery.events({
  'click .js-delete'(event, instance) {
  	console.log("delete");
    var myId = this._id;
    $("#"+this._id).fadeOut('slow', function(){
    	imagesdb.remove({_id:myId});
    	console.log(myId);
    });
  },
});

	Template.addImage.events({
	 'click .js-addImage'(event, instance) {
  	console.log("added image");
  },
  'click .js-close'(event, instance) {
  	console.log("closing image");
  },
  
  'click .js-saving'(event, instance) {
  	var theTitle = $ ("#imgTitle") .val()
  	console.log("Saving Image with title: "+theTitle );

  	var thePath = $ ("#imgPath") .val()
  	console.log("Saving Image with path: "+thePath );

  	var theDescription = $ ("#imgDecription") .val()
  	console.log("Saving Image with description: "+theDescription );
  	imagesdb.insert({
		"path": thePath,
		"title": theTitle,
		"description": theDescription


	});
  		console.log ("saving...");
				$("#js-addImageModal").modal("hide");
				$("#imgTitle").val("");
				$("#imgPath").val("");
				$("#imgDecription").val("");

		}

});
 

 